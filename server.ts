import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// --- ENV VALIDATION ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

// Lazy initialize Supabase to prevent crash on startup if keys are missing
let supabaseClient: any = null;
function getSupabase() {
  if (!supabaseClient) {
    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase credentials missing. Database features will be disabled.");
      return null;
    }
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
}

const genAI = geminiApiKey ? new GoogleGenAI(geminiApiKey) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Health check: Query minimal data for keep-alive
  app.get("/api/health", async (req, res) => {
    try {
      const client = getSupabase();
      if (!client) {
        return res.json({ status: "ok", db: "not_configured", timestamp: new Date().toISOString() });
      }
      const { data, error } = await client.from('profiles').select('id').limit(1);
      if (error) throw error;
      res.json({ status: "ok", db: "connected", timestamp: new Date().toISOString() });
    } catch (err) {
      res.status(500).json({ status: "error", message: (err as Error).message });
    }
  });

  // AI Router Placeholder
  app.post("/api/ai/generate", async (req, res) => {
    const { userId, prompt, taskType } = req.body;

    if (!userId || !prompt) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const client = getSupabase();
      if (!client) throw new Error("Supabase not configured");

      // 1. Credit Check (Atomic)
      const { data: canProceed, error: rpcError } = await client.rpc('deduct_credits', {
        p_user_id: userId,
        p_amount: 6, // Standard UI cost
        p_task_type: taskType || 'STANDARD_UI'
      });

      if (rpcError || !canProceed) {
        return res.status(402).json({ error: "Insufficient credits or database error" });
      }

      // 2. AI Execution (Gemini Pro placeholder)
      if (!genAI) throw new Error("Gemini API not configured");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`Generate a cinematic React UI code for: ${prompt}. Return ONLY clean code.`);
      const response = await result.response;
      const text = response.text();

      res.json({ code: text });
    } catch (err) {
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
          const client = getSupabase();
          if (client) {
            const { error: updateError } = await client.rpc('add_credits', {
              p_user_id: userId,
              p_amount: credits
            });
            if (updateError) console.error("Database update failed:", updateError);
          }
        }
        
        return res.json({ status: "success", data: data.data });
      }

      res.status(400).json({ status: "failed", message: data.message || "Verification failed" });
    } catch (err) {
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
