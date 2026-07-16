import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles,
  Mail,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';

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

const MicrosoftIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f35022" d="M1 1h10v10H1z"/>
    <path fill="#80bb0a" d="M12 1h10v10H12z"/>
    <path fill="#00a1f1" d="M1 12h10v10H1z"/>
    <path fill="#ffb900" d="M12 12h10v10H12z"/>
  </svg>
);

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const SocialButton = ({ icon, label, onClick }: SocialButtonProps) => (
  <button 
    type="button"
    onClick={onClick}
    className="w-full h-13 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer text-left px-6 group"
  >
    <div className="flex items-center justify-center w-6">
      {icon}
    </div>
    <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors flex-1">{label}</span>
    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
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

export const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(
    location.pathname === '/login' ? 'login' : 'signup'
  );
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful authentication and navigate to the dashboard
    navigate('/dashboard');
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
                  Log in or Sign up
                </h2>
                <p className="text-white/40 text-[11px] font-light max-w-xs mx-auto">
                  {showEmailInput 
                    ? 'Enter your email address to access your studio.'
                    : 'Choose your preferred authentication method.'
                  }
                </p>
              </div>

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
                      onClick={() => navigate('/dashboard')}
                    />
                    <SocialButton 
                      icon={<AppleIcon />} 
                      label="Continue with Apple" 
                      onClick={() => navigate('/dashboard')}
                    />
                    <SocialButton 
                      icon={<MicrosoftIcon />} 
                      label="Continue with Microsoft" 
                      onClick={() => navigate('/dashboard')}
                    />
                    <SocialButton 
                      icon={<Mail className="w-5 h-5 text-white/70" />} 
                      label="Continue with email" 
                      onClick={() => setShowEmailInput(true)}
                    />
                    
                    <div className="pt-2 text-center">
                      <button 
                        type="button"
                        onClick={() => navigate('/dashboard')}
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

                      <button 
                        type="submit" 
                        className="w-full h-13 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs font-mono uppercase tracking-widest"
                      >
                        <span>Access Studio</span>
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
                      setShowEmailInput(false);
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
