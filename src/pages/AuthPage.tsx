import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  Github, 
  Chrome, 
  Check, 
  Sparkles, 
  Zap, 
  Shield, 
  Globe 
} from 'lucide-react';
import { LucidLogo } from '../components/LucidLogo';
import { GlowCard } from '../components/GlowCard';

const AuthStatChip = ({ label, value, className }: any) => (
  <motion.div 
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className={`glass-card p-6 rounded-3xl absolute z-30 ${className}`}
  >
    <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
    <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">{label}</div>
  </motion.div>
);

const FeatureChip = ({ text, className }: any) => (
  <div className={`glass-pill px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-white/50 border border-white/5 absolute z-30 ${className}`}>
    {text}
  </div>
);

export const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePlan, setActivePlan] = useState<'starter' | 'pro'>('starter');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(
    location.pathname === '/login' ? 'login' : 'signup'
  );

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth success
    navigate('/studio');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-black p-2 lg:p-4 gap-2 lg:overflow-hidden font-sans">
      {/* Left Cinematic Hero */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex w-[54%] relative flex-col items-center justify-between rounded-[2.5rem] overflow-hidden p-12 bg-zinc-900"
      >
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4" type="video/mp4" />
        </video>

        {/* Hero Nav */}
        <div className="relative z-20 flex items-center justify-between w-full">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <LucidLogo />
          </div>
          <div className="flex items-center gap-2">
            {['Features', 'Pricing', 'Docs'].map((item) => (
              <button 
                key={item} 
                onClick={() => navigate('/')}
                className="glass-pill px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex-1 flex flex-col justify-center w-full max-w-xl text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
              <Sparkles className="w-3 h-3 text-white" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">New Operating System</span>
            </div>
            <h1 className="text-6xl xl:text-7xl font-heading italic text-white leading-[1.1]">
              The future of <br />
              <span className="text-white/40">software is here.</span>
            </h1>
            <p className="text-lg text-white/40 max-w-md font-light leading-relaxed">
              Join 12,000+ developers building the next generation of AI-native applications in record time.
            </p>
          </motion.div>
        </div>

        {/* Hero Stats */}
        <div className="relative z-20 w-full flex items-center justify-between">
           <div className="flex gap-12">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white tracking-tight">12.4k</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Active Users</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white tracking-tight">850k</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Lines Generated</span>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800" />
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Join the waitlist</span>
           </div>
        </div>
      </motion.div>

      {/* Right Auth Form */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 min-h-[600px] bg-[#0A0A0A] rounded-[2.5rem] relative flex flex-col items-center justify-center p-6 lg:p-12 overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10 space-y-10">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-heading italic text-white">
              {authMode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-sm text-white/40 font-light">
              {authMode === 'signup' ? 'Start building your legacy with Lucid today.' : 'Enter your credentials to access your workspace.'}
            </p>
          </div>

          <div className="space-y-4">
             <button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 transition-all group">
                <Chrome className="w-5 h-5 text-white/60 group-hover:text-white" />
                <span className="text-sm font-medium text-white/80">Continue with Google</span>
             </button>
             <button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 transition-all group">
                <Github className="w-5 h-5 text-white/60 group-hover:text-white" />
                <span className="text-sm font-medium text-white/80">Continue with GitHub</span>
             </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#0A0A0A] px-4 text-white/20">Or continue with</span></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
             <div className="space-y-2">
               <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                 <input 
                   type="email" 
                   placeholder="Email Address"
                   className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all font-light"
                 />
               </div>
               <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                 <input 
                   type="password" 
                   placeholder="Password"
                   className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all font-light"
                 />
               </div>
             </div>
             
             <button type="submit" className="w-full h-16 rounded-2xl bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 mt-6">
                <span>{authMode === 'signup' ? 'Initialize Workspace' : 'Launch Studio'}</span>
                <ArrowRight className="w-4 h-4" strokeWidth={3} />
             </button>
          </form>

          <p className="text-center text-xs text-white/20">
            {authMode === 'signup' ? 'Already have an account?' : 'Don\'t have an account?'}
            <button 
              onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
              className="ml-2 text-white/60 hover:text-white font-medium"
            >
              {authMode === 'signup' ? 'Log in' : 'Create one'}
            </button>
          </p>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-8 text-[9px] font-bold uppercase tracking-[0.3em] text-white/10">
          SECURE ENCRYPTED ENVIRONMENT
        </div>
      </motion.div>
    </div>
  );
};
