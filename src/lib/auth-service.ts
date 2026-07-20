import { useState, useEffect } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase/client';

// 1. Environment Detection
export const isSandboxEnv = typeof window !== 'undefined' && window.self !== window.top;

const googleProvider = new GoogleAuthProvider();
// Explicitly force the Google Account Picker selection panel to display
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 3. Lifecycle tracking hook for Redirect Result
  // (Removed getRedirectResult as it causes 'Pending promise was never set' in strict mode)
  useEffect(() => {
    // No-op or we can just remove this effect
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Attempting signInWithPopup.");
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      console.log("Successfully logged in via popup:", { 
        displayName: result.user.displayName, 
        token 
      });
      
      // Map to Firestore
      await mapUserToFirestore(result.user, token || null, result.user.email);
    } catch (popupErr: any) {
      console.warn("Popup error caught:", popupErr);
      setError(popupErr);
      // If popup is blocked by the browser, we can inform the user to open in a new tab
      if (
        popupErr.code === 'auth/popup-blocked' || 
        popupErr.message?.toLowerCase().includes('sandbox') || 
        popupErr.message?.toLowerCase().includes('cross-origin')
      ) {
        console.log("Popup blocked. Please open the app in a new tab to authenticate.");
      }
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      await auth.signOut();
    } catch (err: any) {
      console.error("Error signing out:", err);
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    logOut,
    isSandboxEnv
  };
}

// 4. Bootstrap Security Guard implementation
export const mapUserToFirestore = async (
  user: FirebaseUser, 
  accessToken: string | null,
  googleEmail: string | null
) => {
  if (!user) return;
  
  try {
    const userRef = doc(db, 'users', user.uid);
    
    // Conforms strictly to the User schema in firebase-blueprint.json
    const userData = {
      email: user.email || '',
      fullName: user.displayName || 'Anonymous User',
      updatedAt: serverTimestamp(),
      google_access_token: accessToken || '',
      google_user_email: googleEmail || user.email || ''
    };

    await setDoc(userRef, userData, { merge: true });
    console.log("User successfully mapped to Firestore:", userData);
  } catch (error) {
    console.error("Failed to map user profile to Firestore:", error);
    throw error;
  }
};
