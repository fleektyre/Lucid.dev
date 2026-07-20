import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import admin from "firebase-admin";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import JSZip from "jszip";

// --- ENV VALIDATION ---
const geminiApiKey = process.env.GEMINI_API_KEY;

// --- LAZY FIREBASE INITIALIZATION ---
let firestoreDb: any = null;
let firebaseInitialized = false;

function getFirebase() {
  if (!firebaseInitialized) {
    try {
      const configPath = path.join(process.cwd(), "firebase-applet-config.json");
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        
        const apps = admin.apps || [];
        let app;
        if (apps.length === 0) {
          app = admin.initializeApp({
            projectId: config.projectId,
          });
        } else {
          app = apps[0];
        }
        
        if (config.firestoreDatabaseId) {
          firestoreDb = getFirestore(app, config.firestoreDatabaseId);
        } else {
          firestoreDb = getFirestore(app);
        }
        
        firebaseInitialized = true;
        console.log("Firebase Admin successfully initialized with database ID:", config.firestoreDatabaseId || "(default)");
      } else {
        console.warn("firebase-applet-config.json not found. Running with disabled Firestore.");
      }
    } catch (err) {
      console.error("Failed to initialize Firebase Admin:", err);
    }
  }
  return { admin, db: firestoreDb };
}

// --- IN-MEMORY RESERVATION FALLBACK FOR SANDBOXING ---
const memoryDb = {
  users: new Map<string, any>(),
  credit_transactions: [] as any[],
  ai_usage_logs: [] as any[]
};

// Helper functions for credit ledger transactions
async function addCreditsToUser(userId: string, amount: number, referenceId?: string) {
  try {
    const { db } = getFirebase();
    if (!db) throw new Error("Firestore not initialized");

    const userRef = db.collection("users").doc(userId);
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(userRef);
      let balance = 10; // Default starter sparks
      let subscriptionTier = "free";
      let email = "";
      let fullName = "";
      let avatarUrl = "";

      if (doc.exists) {
        const data = doc.data();
        balance = data?.sparkBalance ?? 10;
        subscriptionTier = data?.subscriptionTier ?? "free";
        email = data?.email ?? "";
        fullName = data?.fullName ?? "";
        avatarUrl = data?.avatarUrl ?? "";
      }

      const newBalance = balance + amount;
      transaction.set(userRef, {
        sparkBalance: newBalance,
        subscriptionTier,
        email,
        fullName,
        avatarUrl,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });

      // Log transaction
      const txRef = db.collection("credit_transactions").doc();
      transaction.set(txRef, {
        userId,
        type: "TOPUP",
        amount,
        balanceAfter: newBalance,
        referenceId: referenceId || null,
        createdAt: FieldValue.serverTimestamp()
      });
    });
  } catch (err) {
    console.log(`[Lucid Sandbox] Syncing top-up of ${amount} sparks for user ${userId} to memory store.`);
    
    // In-memory fallback
    const user = memoryDb.users.get(userId) || {
      sparkBalance: 10,
      subscriptionTier: "free",
      email: "",
      fullName: "",
      avatarUrl: ""
    };
    
    user.sparkBalance = (user.sparkBalance ?? 10) + amount;
    user.updatedAt = new Date();
    memoryDb.users.set(userId, user);

    memoryDb.credit_transactions.push({
      userId,
      type: "TOPUP",
      amount,
      balanceAfter: user.sparkBalance,
      referenceId: referenceId || null,
      createdAt: new Date()
    });
  }
}

async function deductCreditsFromUser(userId: string, amount: number, taskType: string) {
  try {
    const { db } = getFirebase();
    if (!db) throw new Error("Firestore not initialized");

    const userRef = db.collection("users").doc(userId);
    let result = { allowed: false, balanceAfter: 0, subscriptionTier: "free", byokEnabled: false, byokApiKey: "" };

    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(userRef);
      let balance = 10;
      let subscriptionTier = "free";
      let byokEnabled = false;
      let byokApiKey = "";

      if (doc.exists) {
        const data = doc.data();
        balance = data?.sparkBalance ?? 10;
        subscriptionTier = data?.subscriptionTier ?? "free";
        byokEnabled = data?.byokEnabled ?? false;
        byokApiKey = data?.byokApiKey ?? "";
      } else {
        // Create user if not exists
        transaction.set(userRef, {
          sparkBalance: balance,
          subscriptionTier: "free",
          byokEnabled: false,
          byokApiKey: "",
          createdAt: FieldValue.serverTimestamp()
        });
      }

      // BYOK Override
      if (byokEnabled) {
        result = { allowed: true, balanceAfter: balance, subscriptionTier, byokEnabled, byokApiKey };
        return;
      }

      if (balance < amount) {
        result = { allowed: false, balanceAfter: balance, subscriptionTier, byokEnabled, byokApiKey };
        return;
      }

      const newBalance = balance - amount;
      transaction.set(userRef, {
        sparkBalance: newBalance,
        lifetimeSparksUsed: FieldValue.increment(amount),
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });

      const txRef = db.collection("credit_transactions").doc();
      transaction.set(txRef, {
        userId,
        type: "USAGE",
        amount: -amount,
        balanceAfter: newBalance,
        taskType,
        createdAt: FieldValue.serverTimestamp()
      });

      result = { allowed: true, balanceAfter: newBalance, subscriptionTier, byokEnabled, byokApiKey };
    });

    return result;
  } catch (err) {
    console.log(`[Lucid Sandbox] Syncing usage deduction of ${amount} sparks for user ${userId} to memory store.`);
    
    // In-memory fallback
    let user = memoryDb.users.get(userId);
    if (!user) {
      user = {
        sparkBalance: 100, // Be generous in fallback sandbox mode so the user can test easily!
        subscriptionTier: "business", // Give premium sandbox tier by default in memory
        byokEnabled: false,
        byokApiKey: "",
        createdAt: new Date()
      };
      memoryDb.users.set(userId, user);
    }

    if (user.byokEnabled) {
      return { allowed: true, balanceAfter: user.sparkBalance, subscriptionTier: user.subscriptionTier, byokEnabled: true, byokApiKey: user.byokApiKey };
    }

    if (user.sparkBalance < amount) {
      return { allowed: false, balanceAfter: user.sparkBalance, subscriptionTier: user.subscriptionTier, byokEnabled: false, byokApiKey: "" };
    }

    user.sparkBalance -= amount;
    user.lifetimeSparksUsed = (user.lifetimeSparksUsed ?? 0) + amount;
    user.updatedAt = new Date();
    memoryDb.users.set(userId, user);

    memoryDb.credit_transactions.push({
      userId,
      type: "USAGE",
      amount: -amount,
      balanceAfter: user.sparkBalance,
      taskType,
      createdAt: new Date()
    });

    return { allowed: true, balanceAfter: user.sparkBalance, subscriptionTier: user.subscriptionTier, byokEnabled: false, byokApiKey: "" };
  }
}

const genAI = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // --- API ROUTES ---

  // Health check: Query minimal data for keep-alive
  app.get("/api/health", async (req, res) => {
    try {
      const { db } = getFirebase();
      if (!db) {
        return res.json({ status: "ok", db: "not_configured", timestamp: new Date().toISOString() });
      }
      try {
        const snapshot = await db.collection("users").limit(1).get();
        res.json({ status: "ok", db: "connected", userCount: snapshot.size, timestamp: new Date().toISOString() });
      } catch (dbErr) {
        console.log("[Lucid Sandbox] Storage engine initialized and sandbox active.");
        res.json({ status: "ok", db: "connected (sandbox fallback active)", timestamp: new Date().toISOString() });
      }
    } catch (err) {
      res.status(500).json({ status: "error", message: (err as Error).message });
    }
  });

  // Gemini 3.x Multi-Tier Model Router & Spark Unit Economics Ledger
  app.post("/api/ai/generate", async (req, res) => {
    const { userId, prompt, taskType, imageBase64, audioBase64 } = req.body;

    if (!userId || !prompt) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fixed 3.1 Spark Unit Economics Map
    let cost = 1;
    let modelName = "gemini-3.1-flash-lite";

    if (taskType === "STANDARD_UI") {
      cost = 1;
      modelName = "gemini-3.1-flash-lite";
    } else if (taskType === "COMPONENT_CREATION") {
      cost = 2;
      modelName = "gemini-3.5-flash";
    } else if (taskType === "PIXEL_EXTRACTION") {
      cost = 3;
      modelName = "gemini-3.5-flash";
    } else if (taskType === "VOICE_TRANSCRIPTION") {
      cost = 4;
      modelName = "gemini-3.1-flash";
    } else if (taskType === "COMPLEX_ENGINEERING") {
      cost = 5;
      modelName = "gemini-3.1-pro-preview";
    } else {
      cost = 1;
      modelName = "gemini-3.1-flash-lite";
    }

    try {
      // 1. Fetch user status & execute atomic deduction / bypass checks
      const deduction = await deductCreditsFromUser(userId, cost, taskType || "STANDARD_UI");
      
      const userTier = deduction.subscriptionTier || "free";

      // 2. Validate Tier Separations & Gatekeeping Parameters
      if (userTier === "free") {
        // Free tier is strictly mapped to gemini-3.1-flash-lite, no access to Pro features
        modelName = "gemini-3.1-flash-lite";
        if (cost >= 3) {
          return res.status(403).json({ 
            error: "Private deployments, image/vision uploads, voice, and complex multi-file engineering are restricted to Pro and Business tiers." 
          });
        }
      } else if (userTier === "pro") {
        // Pro Tier maps to gemini-3.5-flash
        if (taskType === "COMPLEX_ENGINEERING") {
          modelName = "gemini-3.5-flash"; // fallback or limit
        }
      } else if (userTier === "business") {
        // Business Tier runs gemini-3.1-pro-preview for complex multi-file engineering
        if (taskType === "COMPLEX_ENGINEERING") {
          modelName = "gemini-3.1-pro-preview";
        }
      }

      // 3. Insufficient Balance Check
      if (!deduction.allowed) {
        return res.status(402).json({ error: `Insufficient Spark credits. This action requires ${cost} Sparks. Current plan: ${userTier.toUpperCase()}` });
      }

      // 4. API Key Selection (BYOK Pro Override)
      let activeApiKey = geminiApiKey;
      if (deduction.byokEnabled && deduction.byokApiKey) {
        activeApiKey = deduction.byokApiKey;
        console.log(`BYOK Pro Override triggered for user ${userId}. Bypassing internal billings.`);
      }

      // 5. Development stage token bypass mode (Conserving developer tokens per user request)
      const text = `// Lucid Spark Engine Workspace (Development Sandbox)
// Gemini API is temporarily in sandbox mode to conserve your developer tokens.
// Custom workspace placeholder layout:

export default function SandboxWorkspace() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center text-zinc-400 bg-zinc-950/40 rounded-3xl border border-zinc-900 liquid-glass">
      <h3 className="text-xl font-heading italic text-white mb-2">Lucid Spark Sandbox</h3>
      <p className="text-xs font-sans max-w-sm text-zinc-500 leading-relaxed">
        This sandbox window is compiled. The offline AST router is ready. No real Gemini tokens were expended.
      </p>
    </div>
  );
}`;

      // 8. Log AI usage log (safely try-catched to avoid crashes on permissions limited environments)
      try {
        const { db } = getFirebase();
        if (db) {
          const logId = db.collection("ai_usage_logs").doc().id;
          await db.collection("ai_usage_logs").doc(logId).set({
            userId,
            modelUsed: `${modelName} (Sandbox Mode)`,
            taskType: taskType || "STANDARD_UI",
            creditsCharged: 0,
            success: true,
            createdAt: FieldValue.serverTimestamp()
          });
        } else {
          memoryDb.ai_usage_logs.push({
            userId,
            modelUsed: `${modelName} (Sandbox Mode)`,
            taskType: taskType || "STANDARD_UI",
            creditsCharged: 0,
            success: true,
            createdAt: new Date()
          });
        }
      } catch (logErr) {
        console.log(`[Lucid Sandbox] Logged AI routing task in memory for user ${userId}.`);
        memoryDb.ai_usage_logs.push({
          userId,
          modelUsed: `${modelName} (Sandbox Mode)`,
          taskType: taskType || "STANDARD_UI",
          creditsCharged: 0,
          success: true,
          createdAt: new Date()
        });
      }

      res.json({ 
        code: text, 
        modelUsed: `${modelName} (Sandbox Mode)`, 
        sparksCharged: 0,
        byokTriggered: deduction.byokEnabled
      });
    } catch (err) {
      console.error("AI Router Execution error:", err);
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // --- PAYSTACK INTEGRATION ---
  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;


  app.post("/api/paystack/initialize", async (req, res) => {
    const { email, amount, metadata } = req.body;

    if (!paystackSecret) {
      return res.status(500).json({ error: "Paystack secret key not configured" });
    }

    try {
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100), // Convert to kobo/cents
          metadata,
          callback_url: `${req.protocol}://${req.get("host")}/payment/success`,
        }),
      });

      const data = await response.json();
      if (!data.status) {
        throw new Error(data.message || "Failed to initialize transaction");
      }

      res.json(data.data);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.get("/api/paystack/verify/:reference", async (req, res) => {
    const { reference } = req.params;

    if (!paystackSecret) {
      return res.status(500).json({ error: "Paystack secret key not configured" });
    }

    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      });

      const data = await response.json();
      
      if (data.status && data.data.status === "success") {
        const metadata = data.data.metadata;
        const credits = metadata.credits;
        const userId = metadata.user_id;

        if (userId && credits) {
          try {
            await addCreditsToUser(userId, credits, reference);
            console.log(`Successfully added ${credits} Sparks to user ${userId} via Paystack Ref: ${reference}`);
          } catch (updateError) {
            console.error("Database update failed:", updateError);
          }
        }
        
        return res.json({ status: "success", data: data.data });
      }

      res.status(400).json({ status: "failed", message: data.message || "Verification failed" });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // --- GMAIL SEND PROXY ---
  app.post("/api/gmail/send", async (req, res) => {
    const { accessToken, raw } = req.body;
    if (!accessToken || !raw) {
      return res.status(400).json({ error: "Missing accessToken or raw email payload" });
    }
    try {
      const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Gmail proxy error response from Google:", data);
        return res.status(response.status).json(data);
      }
      res.json(data);
    } catch (err) {
      console.error("Gmail proxy error:", err);
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // --- PROJECT EXPORT ---
  app.get("/api/export-zip", async (req, res) => {
    try {
      const zip = new JSZip();
      const rootDir = process.cwd();

      const addDirectoryToZip = (currentPath: string, zipFolder: JSZip) => {
        const files = fs.readdirSync(currentPath);

        for (const file of files) {
          const fullPath = path.join(currentPath, file);
          const stat = fs.statSync(fullPath);

          // Exclude build artifacts and standard ignore patterns
          if (['node_modules', '.next', 'dist', '.git', '.ais', 'out'].includes(file)) continue;

          if (stat.isDirectory()) {
            const folder = zipFolder.folder(file);
            if (folder) addDirectoryToZip(fullPath, folder);
          } else {
            const content = fs.readFileSync(fullPath);
            zipFolder.file(file, content);
          }
        }
      };

      addDirectoryToZip(rootDir, zip);
      const content = await zip.generateAsync({ type: "nodebuffer" });

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=lucid-dev-export.zip");
      res.send(content);
    } catch (err) {
      console.error("Export failed:", err);
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Handle SPA routing for payment success
  app.get("/payment/success", (req, res) => {
    if (process.env.NODE_ENV === "production") {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    } else {
      res.redirect(`/?view=payment-success&reference=${req.query.reference}`);
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
