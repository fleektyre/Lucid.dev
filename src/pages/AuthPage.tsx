import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles,
  Mail,
  ArrowRight,
  ArrowLeft,
  X,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase/client';
import { useAuth, mapUserToFirestore } from '../lib/auth-service';
import { useStudioStore } from '../studio/store/useStudioStore';

// Custom high-fidelity brand SVGs for pixel-perfect aesthetics
const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.1.08.2.12.3.12.95 0 2.06-.56 2.51-1.45z"/>
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  loading?: boolean;
}

const SocialButton = ({ icon, label, onClick, loading }: SocialButtonProps) => (
  <button 
    type="button"
    onClick={onClick}
    disabled={loading}
    className={`w-full h-13 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer text-left px-6 group ${loading ? 'opacity-50 cursor-wait' : ''}`}
  >
    <div className="flex items-center justify-center w-6">
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon}
    </div>
    <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors flex-1">{label}</span>
    {!loading && <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />}
  </button>
);

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
}

const InputGroup = ({ icon, ...props }: InputGroupProps) => (
  <div className="relative w-full text-left">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 z-10">
      {icon}
    </span>
    <input
      className="bg-white/[0.02] border border-white/10 rounded-2xl h-13 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all text-sm w-full relative z-0"
      {...props}
    />
  </div>
);

interface PasswordInputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
}

const PasswordInputGroup = ({ icon, ...props }: PasswordInputGroupProps) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative w-full text-left">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 z-10">
        {icon}
      </span>
      <input
        type={show ? 'text' : 'password'}
        className="bg-white/[0.02] border border-white/10 rounded-2xl h-13 pl-12 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all text-sm w-full relative z-0"
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition-colors z-10"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

export const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useStudioStore();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(
    location.pathname === '/login' ? 'login' : 'signup'
  );
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  const { signInWithGoogle, isSandboxEnv, user, loading, error: authError } = useAuth();
  
  React.useEffect(() => {
    // Only auto-redirect if the user exists and is NOT anonymous
    if (user && !user.isAnonymous && !loading) {
      setUser({
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Lucid User',
        email: user.email || '',
        credits: 100,
        maxCredits: 100,
        avatarUrl: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email || 'user')}`,
        plan: 'Free'
      });
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate, setUser]);
  
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.warn('Google Sign-In error:', err);
    } finally {
      setIsGoogleLoading(false);
    }
  };
  
  React.useEffect(() => {
    if (authError) {
      setErrorMsg('Sign-In Error: ' + (authError.message || authError));
    }
  }, [authError]);

  const handleGithubSignIn = async () => {
    setErrorMsg(null);
    setIsGithubLoading(true);
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      await mapUserToFirestore(result.user, token || null, result.user.email);
    } catch (error: any) {
      console.warn('GitHub Sign-In status:', error.message || error);
      setErrorMsg('GitHub Sign-In Error: ' + (error.message || error));
    } finally {
      setIsGithubLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg(null);
    try {
      let result;
      if (authMode === 'signup') {
        result = await createUserWithEmailAndPassword(auth, email, password);
        // Write user details to Firestore
        try {
          const userRef = doc(db, 'users', result.user.uid);
          await setDoc(userRef, {
            email: email,
            fullName: email.split('@')[0],
            createdAt: new Date(),
            updatedAt: new Date(),
          }, { merge: true });
        } catch (dbErr) {
          console.error('Failed to store email user in Firestore:', dbErr);
        }
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }

      setUser({
        id: result.user.uid,
        name: result.user.email?.split('@')[0] || 'Lucid User',
        email: result.user.email || email,
        credits: 100,
        maxCredits: 100,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(result.user.email || email)}`,
        plan: 'Free'
      });

      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.warn('Firebase email auth error:', error);
      let cleanMessage = error.message || error;
      if (error.code === 'auth/email-already-in-use') {
        cleanMessage = 'This email address is already in use. Please log in instead!';
      } else if (error.code === 'auth/weak-password') {
        cleanMessage = 'The password must be at least 6 characters long.';
      } else if (error.code === 'auth/invalid-email') {
        cleanMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        cleanMessage = 'Invalid email or password. Please check your credentials and try again.';
      }
      setErrorMsg(cleanMessage);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <main className="flex min-h-screen w-full bg-[#030304] selection:bg-white/30 p-2 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4 font-sans">
      
      {/* Left Column (Hero with Backdrop Video) - Unchanged "The future of software is here" layout */}
      <div className="hidden lg:flex w-[52%] relative flex-col items-start justify-between pb-24 pt-12 px-16 rounded-3xl overflow-hidden shadow-2xl h-full">
        {/* Pure Ambient Background Video */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4" type="video/mp4" />
        </video>

        {/* Top Header Navigation - matches screenshot perfectly */}
        <div className="relative z-10 flex items-center justify-between w-full">
          {/* Logo Element */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center font-heading text-base italic">
              l
            </div>
            <span className="font-heading text-2xl italic text-white tracking-[0.1em]">lucid.dev</span>
          </div>
          
          {/* Menu Actions */}
          <div className="flex items-center gap-2">
            {[
              { label: 'FEATURES', path: '/' },
              { label: 'PRICING', path: '/pricing' },
              { label: 'DOCS', path: '/' }
            ].map((item) => (
              <button 
                key={item.label} 
                onClick={() => navigate(item.path)}
                className="px-4 py-2 text-[9px] font-mono tracking-widest text-white/50 hover:text-white transition-all border border-white/10 rounded hover:bg-white/5 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Content Block - matches screenshot layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-xl space-y-6 text-left"
        >
          {/* Operating System Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono tracking-widest text-white/60 backdrop-blur-md"
          >
            <span>✦</span> NEW OPERATING SYSTEM
          </motion.div>

          {/* Heading Block */}
          <motion.h1 
            variants={itemVariants}
            className="text-[4.6rem] font-heading italic font-light text-white leading-[1.02] tracking-normal"
          >
            The future of <br />
            software is here.
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p 
            variants={itemVariants}
            className="text-white/40 text-base font-light max-w-sm leading-relaxed"
          >
            Join 12,000+ developers building the next generation of AI-native applications in record time.
          </motion.p>
        </motion.div>
      </div>

      {/* Right Column (Hercules-inspired Clean Sign Up/Log In options) */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden relative">
        
        {/* Close Button for mobile layout */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 right-6 p-2.5 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300 lg:hidden cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.025, y: -6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md relative group my-auto cursor-default"
        >
          {/* Glowing Pro Card Style Aura Effect behind card */}
          <div 
            className="absolute inset-0 w-full h-full rounded-[1.5rem] opacity-30 pointer-events-none filter blur-[60px] transition-all duration-700 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 group-hover:opacity-55 group-hover:scale-105"
          />
          
          {/* Pop-out Badge - Styled after AI Studio Pro Card Popular Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-[0_4px_24px_rgba(255,255,255,0.35)] z-20 flex items-center gap-1.5 font-sans border border-white/20">
            <Sparkles className="w-3 h-3 fill-black text-black" /> {authMode === 'signup' ? 'SIGN UP' : 'LOGIN'}
          </div>

          {/* Elegant Pro-style Glass Card */}
          <div 
            className="relative z-10 w-full rounded-[1.5rem] p-8 sm:p-10 flex flex-col justify-between bg-black/55 border border-white/5 backdrop-blur-md transition-all duration-500"
            style={{
              background: `linear-gradient(#050506, #020203) padding-box, linear-gradient(137deg, #3B82F6 0%, #8B5CF6 50%, #D946EF 100%) border-box`,
              border: '1.5px solid transparent'
            }}
          >
            <div className="space-y-8 w-full relative">
              
              {/* Header Info - Clean Hercules / lucid.dev typography branding */}
              <div className="space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-white/95 text-base font-heading italic tracking-[0.1em] font-semibold">
                  <div className="w-5 h-5 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center font-heading text-[10px] italic">
                    l
                  </div>
                  <span>lucid.dev</span>
                </div>
                <h2 className="text-3xl font-heading italic text-white tracking-normal font-light">
                  {authMode === 'signup' ? 'Create your account' : 'Welcome back'}
                </h2>
                <p className="text-white/40 text-[11px] font-light max-w-xs mx-auto">
                  {showEmailInput 
                    ? (authMode === 'signup' ? 'Create a secure email and password to register your account.' : 'Enter your email address and password to access your studio.')
                    : 'Choose your preferred authentication method.'
                  }
                </p>
              </div>

              {/* Sleek error display without the large yellow warning sign */}
              {errorMsg ? (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center relative z-10 font-body">
                  <span>{errorMsg}</span>
                </div>
              ) : isInIframe ? (
                <div className="text-[11px] text-blue-400 bg-blue-500/5 border border-blue-500/15 rounded-xl p-3 flex flex-col gap-2 font-body text-left relative z-10">
                  <span className="leading-relaxed font-light">
                    Running inside the AI Studio preview? Browser sandbox security rules block popups. Click below to sign in with GitHub or Google seamlessly!
                  </span>
                  <a 
                    href={window.location.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-xs text-black font-semibold bg-white hover:bg-zinc-200 transition-all px-4 py-2 rounded-full mt-1 shadow-md text-center cursor-pointer"
                  >
                    Open App in New Tab
                  </a>
                </div>
              ) : null}

              {/* Main Content Area */}
              <AnimatePresence mode="wait">
                {!showEmailInput ? (
                  <motion.div 
                    key="social-list"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-3 pt-2"
                  >
                    <SocialButton 
                      icon={<GoogleIcon />} 
                      label="Continue with Google" 
                      onClick={handleGoogleSignIn}
                      loading={isGoogleLoading}
                    />
                    <SocialButton 
                      icon={<AppleIcon />} 
                      label="Continue with Apple" 
                      onClick={() => navigate('/dashboard', { replace: true })}
                    />
                    <SocialButton 
                      icon={<GithubIcon />} 
                      label="Continue with GitHub" 
                      onClick={handleGithubSignIn}
                      loading={isGithubLoading}
                    />
                    <SocialButton 
                      icon={<Mail className="w-5 h-5 text-white/70" />} 
                      label="Continue with email" 
                      onClick={() => setShowEmailInput(true)}
                    />
                    
                    <div className="pt-2 text-center">
                      <button 
                        type="button"
                        onClick={() => navigate('/dashboard', { replace: true })}
                        className="text-xs text-white/40 hover:text-white transition-colors underline cursor-pointer"
                      >
                        Continue with SSO
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="email-form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4 pt-2"
                  >
                    {/* Back navigation */}
                    <button 
                      type="button"
                      onClick={() => setShowEmailInput(false)}
                      className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to options
                    </button>

                    <form onSubmit={handleAuth} className="space-y-3 pt-1">
                      <InputGroup 
                        icon={<Mail className="w-4 h-4" />} 
                        placeholder="email@example.com" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        autoFocus
                      />

                      <PasswordInputGroup 
                        icon={<Lock className="w-4 h-4" />} 
                        placeholder={authMode === 'signup' ? "Create a secure password" : "Enter your password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />

                      <button 
                        type="submit" 
                        className="w-full h-13 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs font-mono uppercase tracking-widest mt-2"
                      >
                        <span>{authMode === 'signup' ? 'Create Account' : 'Access Studio'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Legal Terms Footer - matches Hercules page footer */}
              <div className="pt-4 border-t border-white/5 text-center space-y-3">
                <p className="text-[11px] text-white/30 leading-relaxed max-w-[280px] mx-auto">
                  By clicking continue, you agree to our{' '}
                  <span className="text-white/50 hover:text-white hover:underline cursor-pointer transition-colors">Terms of Service</span> and{' '}
                  <span className="text-white/50 hover:text-white hover:underline cursor-pointer transition-colors">Privacy Policy</span>.
                </p>

                {/* Footer Auth mode switcher (Sign up vs Login toggle) */}
                <p className="text-xs text-white/30">
                  {authMode === 'signup' ? 'Already have an account?' : 'New to lucid.dev?'}
                  <button 
                    type="button"
                    onClick={() => {
                      setAuthMode(authMode === 'signup' ? 'login' : 'signup');
                    }}
                    className="ml-1.5 text-white hover:underline font-medium cursor-pointer"
                  >
                    {authMode === 'signup' ? 'Log in' : 'Create an account'}
                  </button>
                </p>
              </div>

            </div>
          </div>
        </motion.div>
      </div>

    </main>
  );
};
