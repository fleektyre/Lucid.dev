import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  Check, 
  Zap, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Cpu, 
  ChevronDown, 
  ChevronUp, 
  ArrowUp,
  Plus, 
  Star,
  Play,
  Download,
  Infinity as InfinityIcon,
  Monitor,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Image as ImageIcon,
  History,
  Layout,
  Code,
  Code2,
  Terminal,
  Eye,
  EyeOff,
  Github,
  Palette,
  Chrome,
  ArrowRight,
  Paperclip,
  Mic,
  Search
} from 'lucide-react';

// --- FadingVideo Component (rAF Driven per Spec) ---

const FadingVideo: React.FC<{ src: string; className?: string; opacity?: number }> = ({ src, className, opacity = 1 }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafId = useRef<number | null>(null);
  const fadingOutRef = useRef(false);
  const [hasError, setHasError] = useState(false);
  const FADE_MS = 1000;
  const FADE_OUT_LEAD = 0.8;

  const fadeTo = (target: number, duration: number) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    const video = videoRef.current;
    if (!video) return;

    const startOpacity = parseFloat(video.style.opacity || opacity.toString());
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = progress; 
      const currentOpacity = startOpacity + (target - startOpacity) * easedProgress;
      video.style.opacity = currentOpacity.toString();

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    rafId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    setHasError(false);
    const video = videoRef.current;
    if (!video) return;

    const playOnStart = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name !== 'AbortError') {
            // Silently handle - we rely on onError for the "no source" error
          }
        });
      }
    };

    playOnStart();

    const handleTimeUpdate = () => {
      if (!fadingOutRef.current && video.duration - video.currentTime <= FADE_OUT_LEAD && video.duration > 0) {
        fadingOutRef.current = true;
        fadeTo(0, FADE_MS);
      }
    };

    const handleEnded = () => {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
      fadingOutRef.current = false;
      fadeTo(opacity, FADE_MS);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src, opacity]);

  if (hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-indigo-950 via-black to-blue-900 overflow-hidden relative`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] animate-pulse" />
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      key={src}
      src={src}
      className={className}
      muted
      playsInline
      autoPlay
      loop={false}
      preload="auto"
      onError={(e) => {
        console.warn("Video failed to load, switching to fallback vibe:", src);
        setHasError(true);
      }}
      style={{ opacity: opacity }}
    />
  );
};

// --- GlowCard Base System ---

const GlowCard = ({ children, gradient, delay = 0, className = "" }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut", delay }}
    whileHover={{ scale: 1.02 }}
    className={`relative group cursor-default ${className}`}
  >
    {/* Glowing Aura Effect */}
    <div 
      className="absolute inset-0 w-full h-full rounded-[40px] opacity-60 pointer-events-none filter blur-[45px] transition-opacity duration-500 group-hover:opacity-80"
      style={{ background: gradient }}
    />
    
    {/* Foreground Card with Gradient Border */}
    <div 
      className="relative z-10 h-full rounded-[40px] overflow-hidden"
      style={{
        background: `linear-gradient(#1A1A1C, #1A1A1C) padding-box, ${gradient} border-box`,
        border: '1.5px solid transparent'
      }}
    >
      {children}
    </div>
  </motion.div>
);

// --- Lucid Live Builder System ---

const ChatSimulator = ({ activeStep }: { activeStep: number }) => {
  const messages = [
    { type: 'user', text: "I want to build a car marketplace website", delay: 0 },
    { type: 'ai', text: "Analyzing requirements...", delay: 1000 },
    { type: 'ai', text: "Detected opportunity: Mobility Commerce Platform", delay: 2000 },
    { type: 'ai', text: "Generating architecture...", delay: 3000 },
    { type: 'ai', text: "Re-evaluating intent...", delay: 5000, override: true },
    { type: 'ai', text: "Actually this is better as a multi-vendor transportation ecosystem", delay: 6000 },
    { type: 'user', text: "I want to build a house listing website", delay: 9000 },
    { type: 'ai', text: "Switching domain model...", delay: 10000 },
    { type: 'ai', text: "Rebuilding as Real Estate Intelligence Platform", delay: 11500 }
  ];

  const visibleMessages = messages.filter((m, i) => i <= activeStep);

  return (
    <div className="space-y-4 p-6 font-sans text-[13px]">
      <AnimatePresence mode="popLayout">
        {visibleMessages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5 }}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl border ${
              msg.type === 'user' 
                ? 'bg-white/10 border-white/10 text-white' 
                : 'bg-black/60 border-white/5 text-white/70'
            } ${msg.override ? 'border-amber-500/20 text-amber-200/80' : ''}`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {activeStep < messages.length - 1 && (
        <div className="flex justify-start gap-1 p-2">
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
      )}
    </div>
  );
};

const PreviewPanel = ({ activeStep }: { activeStep: number }) => {
  let uiState = 'cars';
  if (activeStep >= 4 && activeStep < 6) uiState = 'mobility';
  if (activeStep >= 6) uiState = 'realestate';

  return (
    <div className="relative w-full h-full p-8 flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={uiState}
          initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
          transition={{ duration: 0.8 }}
          className="w-full h-full flex flex-col gap-6"
        >
          {uiState === 'cars' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="h-4 w-32 bg-white/10 rounded-full" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-white/5" />
                  <div className="h-8 w-8 rounded-full bg-white/5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-40 rounded-3xl bg-white/5 border border-white/5" />
                <div className="h-40 rounded-3xl bg-white/5 border border-white/5" />
              </div>
              <div className="h-24 rounded-3xl bg-white/10 border border-white/10" />
            </div>
          )}

          {uiState === 'mobility' && (
            <div className="space-y-6">
               <div className="h-10 w-full bg-white/5 rounded-2xl flex items-center px-4 gap-4">
                  <div className="h-4 w-4 rounded bg-white/10" />
                  <div className="h-2 w-32 bg-white/10" />
               </div>
               <div className="flex gap-4 h-full">
                  <div className="w-16 h-full rounded-2xl bg-white/5 flex flex-col items-center py-4 gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-white/10" />)}
                  </div>
                  <div className="flex-1 space-y-4">
                     <div className="h-48 rounded-3xl border border-white/20 bg-emerald-500/[0.02]" />
                     <div className="grid grid-cols-3 gap-2">
                        <div className="h-20 rounded-2xl bg-white/5" />
                        <div className="h-20 rounded-2xl bg-white/5" />
                        <div className="h-20 rounded-2xl bg-white/5" />
                     </div>
                  </div>
               </div>
            </div>
          )}

          {uiState === 'realestate' && (
            <div className="space-y-6">
               <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="h-4 w-40 bg-white/20 rounded-full" />
               </div>
               <div className="grid grid-cols-4 gap-4 h-full">
                  <div className="col-span-3 h-full rounded-[2.5rem] bg-white/5 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                     <div className="absolute bottom-6 left-6 space-y-2">
                        <div className="h-4 w-32 bg-white/30 rounded-full" />
                        <div className="h-2 w-24 bg-white/10 rounded-full" />
                     </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="h-1/3 rounded-3xl bg-white/5" />
                     <div className="h-1/3 rounded-3xl bg-white/5" />
                     <div className="h-1/3 rounded-3xl bg-white/5" />
                  </div>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const LucidLiveBuilder = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 9); // Loop through steps
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="live-builder" className="py-40 px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
      <div className="text-center mb-24">
        <div className="glass-pill px-4 py-1.5 border-white/10 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-8 inline-block">
          Lucid Live Builder
        </div>
        <h2 className="text-6xl md:text-7xl font-medium tracking-tight text-white mb-6 leading-tight">Manifestation Engine.</h2>
        <p className="text-white/40 text-xl font-light italic">Watch the AI architect your vision in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch min-h-[600px]">
        {/* Left Side: Chat */}
        <GlowCard gradient="linear-gradient(137deg, #3B82F6 0%, #8B5CF6 50%, #D946EF 100%)">
          <div className="w-full h-full flex flex-col bg-black/40 backdrop-blur-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Builder Context</span>
              </div>
              <Terminal className="w-4 h-4 text-white/20" />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <ChatSimulator activeStep={activeStep} />
            </div>
            <div className="p-6 border-t border-white/5 flex gap-4">
              <div className="flex-1 h-10 glass-pill border-white/10 flex items-center px-4">
                 <div className="h-2 w-2 rounded-full bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Right Side: Preview */}
        <GlowCard gradient="linear-gradient(137deg, #10B981 0%, #3B82F6 100%)">
          <div className="w-full h-full bg-black/40 backdrop-blur-2xl relative">
             <PreviewPanel activeStep={activeStep} />
             <div className="absolute top-6 right-6 glass-pill px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-white/40 border-white/20">
               Live Render
             </div>
          </div>
        </GlowCard>
      </div>
    </section>
  );
};

// --- Shared Components ---


const Navbar = ({ onViewChange, currentView }: { onViewChange: (v: any) => void; currentView: string }) => {
  const navigate = useNavigate();
  const scrollToSection = (id: string) => {
    if (currentView !== 'landing') {
      onViewChange('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-6 md:px-12 py-10 flex items-center justify-center">
      {/* Main Nav Pill */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto"
      >
        <div className="glass-pill flex items-center gap-2 p-1.5 px-3 shadow-2xl backdrop-blur-3xl border border-white/5">
          <button 
            onClick={() => {
              onViewChange('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-heading text-2xl italic hover:scale-110 transition-transform flex-shrink-0"
          >
            l
          </button>
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Home', id: 'hero' },
              { label: 'Features', id: 'features-section' },
              { label: 'Pricing', id: 'pricing-section' }
            ].map((item: any) => (
              <button 
                key={item.label} 
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-white text-black px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full transition-all hover:bg-white/90 active:scale-95 whitespace-nowrap"
            >
              Launch App
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Separate Login section to the right edge */}
      <div className="absolute right-6 md:right-12 pointer-events-auto">
        <button 
          onClick={() => navigate('/login')}
          className="glass-pill px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all border border-white/5 hover:border-white/10 hover:bg-white/5 shadow-2xl backdrop-blur-2xl"
        >
          Login
        </button>
      </div>
    </div>
  );
};

// --- Landing / Feature Sections (Merged) ---

const ChatBox = ({ className = "", onExecute }: { className?: string, onExecute?: (prompt: string) => void }) => {
  const [inputValue, setInputValue] = useState("");
  const [ghostIndex, setGhostIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const ghostPrompts = [
    "Build a SaaS landing page for a coffee startup...",
    "Design a data dashboard for financial analytics...",
    "Create a mobile app UI for a travel agency...",
    "Generate a CRM system with contact management...",
    "Build a developer portfolio with dark mode..."
  ];

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onExecute?.(inputValue);
    }
  };

  const suggestedPrompts = [
    "SAAS Template",
    "Admin Dashboard",
    "Booking App",
    "AI Chat UI"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!inputValue && !isFocused) {
        setGhostIndex(prev => (prev + 1) % ghostPrompts.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [inputValue, isFocused]);

  return (
    <div className={`relative z-20 w-full h-full glass-card-strong rounded-[2.5rem] border border-white/10 p-6 md:p-12 flex flex-col justify-between overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)] backdrop-blur-3xl group/chatbox ${className}`}>
      {/* Dynamic Glow Effect */}
      <div className="absolute -inset-20 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-[100px] opacity-0 group-hover/chatbox:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      
      {/* Header Info */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#5AE14C] animate-pulse shadow-[0_0_10px_#5AE14C]" />
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">60/450 Credits Available</span>
        </div>
        <div className="flex items-center gap-2 text-white/30">
          <Sparkles className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Sonnet 3.5</span>
        </div>
      </div>

      {/* Main Input Area */}
      <div className="relative z-10 flex-1 flex flex-col gap-6 my-6">
        <div className="relative group/input flex-1 flex flex-col">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full h-full flex-1 bg-white/5 border border-white/10 rounded-[1.5rem] p-6 pr-16 min-h-[160px] text-lg text-white placeholder:text-white/20 outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all resize-none font-light shadow-inner"
          />
          
          <AnimatePresence mode="wait">
            {!inputValue && !isFocused && (
              <motion.div
                key={ghostIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.2, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 left-6 text-lg text-white font-light pointer-events-none select-none italic pr-12"
              >
                {ghostPrompts[ghostIndex]}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={handleSubmit}
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-xl shadow-white/10"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        </div>

        {/* Suggested Chips */}
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt) => (
            <button 
              key={prompt}
              onClick={() => setInputValue(prompt)}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Meta */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex gap-4">
          <button className="group/tool hover:scale-110 transition-transform">
            <Paperclip className="w-4 h-4 text-white/20 group-hover/tool:text-white transition-colors" />
          </button>
          <button className="group/tool hover:scale-110 transition-transform">
            <Mic className="w-4 h-4 text-white/20 group-hover/tool:text-white transition-colors" />
          </button>
          <button className="group/tool hover:scale-110 transition-transform">
            <Search className="w-4 h-4 text-white/20 group-hover/tool:text-white transition-colors" />
          </button>
        </div>
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
          {inputValue.length.toLocaleString()} / 3,000 Characters
        </span>
      </div>

      {/* Glow Border Effect */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
};

const PremiumCanvasPreview = ({ onExecute }: { onExecute?: (p: string) => void }) => (
  <div className="relative w-full h-full min-h-[460px] bg-[#030303] flex items-center justify-center p-2 md:p-8 overflow-hidden rounded-[3.5rem] group/premium">
    {/* Cinematic Background Video Layer */}
    <FadingVideo 
      src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094723_095696f9-03b5-4f45-bb60-141bb7c73fa7.mp4"
      className="absolute inset-0 w-full h-full object-cover z-0 select-none grayscale-[0.4]"
      opacity={0.3}
    />
    
    <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] z-10" />
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent opacity-60 z-10" />
    
    {/* Large ChatBox Integration */}
    <div className="relative z-20 w-full h-full">
      <ChatBox className="!rounded-[2.5rem]" onExecute={onExecute} />
    </div>

    {/* Floating Particles */}
    {[...Array(6)].map((_, i) => (
      <motion.div
         key={i}
         animate={{ 
           y: [0, -100, 0],
           opacity: [0, 0.4, 0],
           scale: [0.3, 0.6, 0.3]
         }}
         transition={{ 
           duration: 8 + i, 
           repeat: Infinity, 
           delay: i * 2,
           ease: "easeInOut"
         }}
         className="absolute w-1 h-1 bg-white/30 rounded-full z-10"
         style={{ 
           left: `${15 + i * 15}%`,
           bottom: '-10%'
         }}
      />
    ))}
  </div>
);

const VisualFlow = () => (
  <div className="relative w-full aspect-video glass-card rounded-[3rem] p-12 flex items-center justify-center overflow-hidden bg-black/60 group">
    <FadingVideo 
      src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_095015_90d8108c-6623-4414-9f4a-875f569a304e.mp4"
      className="absolute inset-0 w-full h-full object-cover transition-opacity group-hover:opacity-30 z-0 select-none"
      opacity={0.2}
    />
    <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] bg-[size:32px_32px] z-10" />
    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 opacity-40 transition-opacity group-hover:opacity-60 z-10" />
    
    <div className="relative z-20 flex items-center justify-between w-full max-w-4xl px-8 mt-10">
      {/* Input Node: Anthropic Claude 3.5 Sonnet */}
      <div className="flex flex-col items-center gap-6 group/node">
        <motion.div 
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 shadow-[0_0_50px_rgba(59,130,246,0.1)] backdrop-blur-xl group-hover/node:border-orange-500/50 transition-all duration-500 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover/node:opacity-100 transition-opacity" />
          <Sparkles className="w-10 h-10 group-hover/node:text-orange-400 transition-colors relative z-10" />
        </motion.div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 group-hover/node:text-orange-400 transition-colors">Claude 3.5 Sonnet</span>
          <span className="text-[7px] font-bold uppercase tracking-[0.4em] text-orange-500/50">Anthropic Engine</span>
        </div>
      </div>
      
      {/* Synthesis Core: Lucid (l) */}
      <div className="flex-1 relative flex items-center justify-center h-48 mx-4">
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
          <defs>
            <linearGradient id="flow-grad-premium" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FB923C" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <motion.path 
            d="M 10,96 C 100,20 200,20 290,96" 
            stroke="url(#flow-grad-premium)" 
            strokeWidth="2" 
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        <div className="relative group/core z-20">
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -inset-10 bg-indigo-500/30 rounded-full blur-[60px]"
          />
          <div className="w-28 h-28 rounded-full bg-white text-black flex items-center justify-center relative z-10 shadow-2xl border-[10px] border-black/10 overflow-hidden">
             <div className="text-5xl font-heading italic">l</div>
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border-t-2 border-transparent border-indigo-500/60 rounded-full" />
          </div>
        </div>
      </div>

      {/* Output Node: Google Gemini 1.5 */}
      <div className="flex flex-col items-center gap-6 group/node">
        <motion.div 
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 shadow-[0_0_50px_rgba(59,130,246,0.15)] backdrop-blur-xl group-hover/node:border-blue-500/50 transition-all duration-500 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover/node:opacity-100 transition-opacity" />
          <Cpu className="w-10 h-10 group-hover/node:text-blue-400 transition-colors relative z-10" />
        </motion.div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 group-hover/node:text-blue-400 transition-colors">Gemini 1.5 Pro</span>
          <span className="text-[7px] font-bold uppercase tracking-[0.4em] text-blue-500/50">Google Research</span>
        </div>
      </div>
    </div>
  </div>
);

// --- Feature Grid / Card System (Glow Cards) ---

const FeatureCard = ({ title, description, icon: Icon, gradient, delay }: any) => (
  <GlowCard gradient={gradient} delay={delay}>
    <div className="w-full h-full p-7 flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <Icon className="w-8 h-8 text-white/90" strokeWidth={2.5} />
        <h3 className="text-white text-xl font-medium tracking-tight">{title}</h3>
      </div>
      <p className="text-gray-400 text-sm leading-[1.6]">
        {description}
      </p>
    </div>
  </GlowCard>
);

const FeatureGrid = ({ className, delayOffset = 0 }: { className?: string, delayOffset?: number }) => {
  const features = [
    {
      title: "HARDWARE",
      icon: Monitor,
      delay: 0.1,
      gradient: "linear-gradient(137deg, #FF3D77 0%, #FFB1CE 45%, #FF9D3C 100%)",
      description: "My entire desktop setup is built for power. It is silent, durable, and holds my focus."
    },
    {
      title: "STUDIO",
      icon: Palette,
      delay: 0.2,
      gradient: "linear-gradient(137deg, #FFFFFF 0%, #7DD3FC 45%, #06B6D4 100%)",
      description: "Studio is where I define every single pixel. It is the hub for each canvas I deliver."
    },
    {
      title: "MOTION",
      icon: Zap,
      delay: 0.3,
      gradient: "linear-gradient(137deg, #4361EE 0%, #E0AEFF 45%, #F72585 100%)",
      description: "I use Motion to build lively prototypes, bridging the gap between views and code."
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 w-full max-w-[1000px] mx-auto ${className}`}>
      {features.map((f, i) => (
        <FeatureCard 
          key={i}
          {...f}
          delay={f.delay + delayOffset}
        />
      ))}
    </div>
  );
};

// --- CTA + FAQ + Footer Section (Upgraded) ---

const GlowButton = ({ children, onClick, className = "", variant = "primary" }: any) => {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative group px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] transition-all overflow-hidden ${
        isPrimary 
          ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.2)]' 
          : isSecondary
          ? 'glass-pill text-white/80 border-white/10 hover:bg-white/5 hover:text-white'
          : 'glass-pill text-white border-white/10 hover:bg-white/5'
      } ${className}`}
    >
      <span className="relative z-10">{children}</span>
      {isPrimary && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
      )}
    </motion.button>
  );
};

const VideoDemoCard = ({ onViewChange }: { onViewChange: (v: any) => void }) => {
  const navigate = useNavigate();
  return (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    className="relative group w-full"
  >
    <GlowCard 
      gradient="linear-gradient(137deg, #3B82F6 0%, #10B981 50%, #8B5CF6 100%)"
      className="aspect-video lg:aspect-[16/7] overflow-hidden"
    >
      <div className="relative w-full h-full rounded-[28px] overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors bg-black">
        <video 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094943_9796e95c-7d9a-4c28-9366-51be678fdb12.mp4"
          className="w-full h-full object-cover opacity-60 transition-transform duration-[10s] group-hover:scale-105"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-20 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl lg:max-w-4xl"
          >
            <div className="glass-pill px-4 py-1.5 border-white/10 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.4em] text-white/40 mb-3 md:mb-6 inline-block">
              Proprietary Synthesis Engine
            </div>
            <h2 className="text-2xl md:text-5xl lg:text-7xl font-heading leading-[0.95] mb-4 md:mb-8 text-white select-none italic tracking-tight drop-shadow-2xl">
               Ready to Build<br />
               Production Apps<br />
               <span className="opacity-40">With AI?</span>
            </h2>
            <p className="text-white/40 text-xs md:text-lg font-body font-light mb-6 md:mb-10 leading-relaxed max-w-lg md:max-w-xl italic drop-shadow-xl">
               Generate full-stack apps, UI systems, and dashboards instantly using <span className="text-white/80 font-medium not-italic">Lucid AI Builder</span>. <br className="hidden md:block" />The bridge between prompt and production.
            </p>
            
            <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
              <button 
                onClick={() => navigate('/signup')}
                className="bg-white text-black px-8 md:px-12 py-4 md:py-5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.15)] flex items-center justify-center min-w-[180px] md:min-w-[280px]"
              >
                Assemble Your App
              </button>
              
              <div className="flex flex-wrap gap-3 md:gap-8 justify-center sm:justify-start">
                {[
                  "No credit card",
                  "Free credits"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 group shrink-0">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-400 group-hover:animate-pulse shadow-[0_0_10px_#34d399]" />
                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] text-white/30 group-hover:text-white/50 transition-colors">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* UI Overlay Indicators */}
        <div className="absolute top-8 right-8 flex items-center gap-2 glass-pill px-4 py-2 border-white/20 z-20">
          <div className="flex gap-1.5">
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Synthesis Active</span>
        </div>
      </div>
    </GlowCard>
  </motion.div>
  );
};

const CTAProductShowcase = ({ onViewChange }: { onViewChange: (v: any) => void }) => {
  return (
    <div className="w-full">
      <VideoDemoCard onViewChange={onViewChange} />
    </div>
  );
};

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail("");
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/20">Stay Updated</h4>
      <p className="text-sm text-white/30 font-light">Get updates on new AI features and model improvements.</p>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex gap-2 p-1.5 rounded-full border transition-all duration-300 ${status === 'error' ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/[0.02]'}`}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@lucid.dev"
            className="bg-transparent border-none outline-none text-xs text-white px-4 flex-1 placeholder:text-white/10"
            disabled={status === 'loading' || status === 'success'}
          />
          <button 
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="bg-white text-black px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest flex-shrink-0 transition-all active:scale-95 disabled:opacity-50"
          >
            {status === 'loading' ? '...' : status === 'success' ? 'Joined' : 'Subscribe'}
          </button>
        </div>
        <AnimatePresence>
          {status === 'success' && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-6 left-2 text-[10px] text-emerald-400 font-medium"
            >
              Subscribed successfully! Welcome to the loop.
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-6 left-2 text-[10px] text-red-400 font-medium"
            >
              Please enter a valid email address.
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

const FooterLink = ({ label, onClick, isExternal }: any) => (
  <button 
    onClick={onClick}
    className="text-sm text-white/30 hover:text-white transition-all duration-300 text-left font-light group flex items-center gap-1.5 active:scale-[0.98]"
  >
    <span className="relative">
      {label}
      <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full opacity-50" />
    </span>
    {isExternal && <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-40 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />}
  </button>
);

const FAQItem = ({ question, answer, isOpen, onClick }: any) => (
  <div className={`bg-[#111] border rounded-[10px] p-[18px_20px] transition-all duration-300 ${isOpen ? 'border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'border-[#1f1f1f]'}`}>
    <button onClick={onClick} className="w-full flex items-center justify-between text-left group">
      <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">{question}</span>
      {isOpen ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="pt-4 text-xs text-white/40 leading-relaxed font-light">
            {answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const CTAWithVideoSection = () => null; // Replaced by CTAProductShowcase

const FinalCTAFAQSection = ({ onViewChange }: { onViewChange: (v: any) => void }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [isHovered, setIsHovered] = useState(false);

  const faqs = [
    { 
      q: "What is the maximum app complexity I can build?", 
      a: "Lucid supports everything from simple landing pages to multi-tenant SaaS ecosystems with complex relational data models and custom business logic." 
    },
    { 
      q: "Does my project need a manual deployment?", 
      a: "No, Lucid handles all deployment infrastructure automatically. Your apps are live on global edge networks the moment you manifest them." 
    },
    { 
      q: "Is there a desktop app available for focus mode?", 
      a: "Yes, our native desktop launcher is available for both macOS and Windows, optimized for high-performance visual coding sessions." 
    },
    { 
      q: "Can I export my code to GitHub?", 
      a: "Absolutely. Lucid creates standard React + Tailwind + Vite projects that you can eject and export to any repository at any time." 
    },
    { 
      q: "What AI models power the architecture?", 
      a: "We use a hybrid synthesis of Claude 3.5 Sonnet, Gemini 1.5 Pro, and our proprietary Lucid Reasoning layer to ensure architectural integrity." 
    }
  ];

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-[30px] items-stretch">
        
        {/* Left Column - Animated CTA */}
        <div 
          className="c5-animated-gradient rounded-[3rem] py-20 px-10 text-white flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group"
          style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)' }}
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-0" />
          
          <div className="relative z-10">
            <h2 
              className="font-heading italic leading-[1.1] mb-[20px] text-white"
              style={{ fontSize: 'clamp(3rem, 8vw, 4.5rem)', letterSpacing: '-0.03em' }}
            >
              Ready to Ship<br/>Without Limits?
            </h2>
            <p className="text-[1rem] md:text-[1.1rem] mb-[40px] font-light opacity-90 italic max-w-md mx-auto">
              Manifest your software vision at the speed of thought.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="bg-black text-white font-bold cursor-pointer border-none text-[10px] uppercase tracking-[0.4em] transition-all duration-300 hover:scale-105 active:scale-95 px-12 py-5 rounded-full"
              style={{ 
                boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.5)' : '0 12px 30px rgba(0,0,0,0.4)'
              }}
            >
              Get Started Today
            </button>
          </div>
        </div>

        {/* Right Column - FAQ Accordion */}
        <div className="flex flex-col justify-center gap-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-2 ml-2">Common Inquiries</h3>
          {faqs.map((faq, i) => (
            <div 
              key={i}
              onClick={() => setActiveIndex(activeIndex === i ? null : i)}
              className={`glass-card rounded-3xl py-6 px-6 cursor-pointer transition-all duration-300 border ${
                activeIndex === i ? 'border-white/20 bg-white/[0.03] shadow-[0_10px_30px_rgba(0,0,0,0.2)]' : 'border-white/5 bg-transparent hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-center text-white/80">
                <span className="text-[14px] font-medium tracking-tight pr-4">{faq.q}</span>
                {activeIndex === i ? <ChevronUp className="w-4 h-4 opacity-40 shrink-0" /> : <ChevronDown className="w-4 h-4 opacity-40 shrink-0" />}
              </div>
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pt-4 text-[13px] text-white/40 leading-relaxed font-light italic">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onViewChange }: { onViewChange: (v: any) => void }) => {
  const navigate = useNavigate();
  return (
    <footer className="bg-black pt-32 pb-10 border-t border-white/5" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_2fr] gap-20 mb-20">
          
          {/* Logo Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-heading text-3xl italic text-white shadow-lg">l</div>
              <span className="font-heading text-2xl italic text-white tracking-[0.1em]">lucid.dev</span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed max-w-[240px] font-light italic">
              Reliable software architecture that always reaches production on time.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold mb-8 text-[11px] uppercase tracking-[0.3em] text-white/20">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Features', 'Vibe Builder', 'Pricing'].map(item => (
                <li key={item}>
                  <button 
                    onClick={() => {
                      const id = item.toLowerCase().replace(' ', '-');
                      document.getElementById(id === 'home' ? 'hero' : `${id}-section`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-white/40 hover:text-white transition-colors text-sm font-light italic"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-bold mb-8 text-[11px] uppercase tracking-[0.3em] text-white/20">Pages</h4>
            <ul className="space-y-4">
              {['Manifesto', 'Research', 'Dashboard'].map(item => (
                <li key={item}>
                  <button 
                    onClick={() => item === 'Dashboard' && navigate('/login')}
                    className="text-white/40 hover:text-white transition-colors text-sm font-light italic"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h4 className="font-bold text-[11px] uppercase tracking-[0.3em] text-white/20">Newsletter</h4>
            <p className="text-sm text-white/30 font-light italic">Join our bulletin and get notified on new engine stable builds.</p>
            <div className="flex gap-3">
              <input 
                type="email" 
                placeholder="Enter your email..." 
                className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none transition-all focus:border-indigo-500/50 text-white placeholder:text-white/10"
              />
              <button className="bg-white text-black px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all active:scale-95 shadow-2xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
            All rights reserved. © 2026 LUCID ARCHITECTURE
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 italic">
            Designed by <span className="text-white/40">Peter Design</span> — Built by <span className="text-white/40">Lucid AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Dedicated Pricing Page System ---

const CreditTopUpCalculator = ({ user }: { user: any }) => {
  const [pages, setPages] = useState(5);
  const [taskType, setTaskType] = useState<'design' | 'development' | 'both'>('both');

  const calculateCredits = () => {
    let base = 80;
    if (taskType === 'design') base = 30;
    if (taskType === 'development') base = 50;
    return Math.ceil(base * pages);
  };

  const handleBuyCredits = async (pkg: any) => {
    try {
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email || 'test@lucid.dev',
          amount: pkg.price,
          metadata: {
            user_id: user?.id || 'anonymous',
            credits: pkg.credits,
            package: pkg.id
          }
        })
      });
      const data = await response.json();
      if (data.authorization_url) window.location.href = data.authorization_url;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20">
      <div className="glass-card p-10 rounded-[2.5rem] border-white/5 space-y-8">
        <h3 className="text-2xl font-heading italic text-white">Refill Credits</h3>
        <div className="space-y-6">
          <div className="flex gap-2">
            {(['design', 'development', 'both'] as const).map(t => (
              <button 
                key={t}
                onClick={() => setTaskType(t)}
                className={`flex-1 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${taskType === t ? 'bg-white text-black border-white' : 'border-white/10 text-white/40'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
              <span>Estimated Scope</span>
              <span className="text-white">{pages} Pages</span>
            </div>
            <input 
              type="range" min="1" max="50" value={pages} onChange={(e) => setPages(parseInt(e.target.value))}
              className="w-full accent-white h-1 bg-white/5 rounded-full"
            />
          </div>
        </div>
        <div className="pt-6 border-t border-white/5 flex justify-between items-center">
          <span className="text-white/20 text-xs font-bold uppercase tracking-widest">Est. Credits Needed</span>
          <div className="text-3xl font-heading italic text-white">{calculateCredits()} pts</div>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { id: 'small', credits: 500, price: 10, desc: "Quick fixes" },
          { id: 'pro', credits: 1500, price: 29, desc: "Full SPA deployment", highlight: true },
          { id: 'max', credits: 4000, price: 79, desc: "Scale architecture" }
        ].map(pkg => (
          <div key={pkg.id} className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between ${pkg.highlight ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/5'}`}>
            <div>
              <div className="text-lg font-heading italic">{pkg.credits} Credits</div>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${pkg.highlight ? 'text-black/40' : 'text-white/20'}`}>{pkg.desc}</p>
            </div>
            <button 
              onClick={() => handleBuyCredits(pkg)}
              className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${pkg.highlight ? 'bg-black text-white hover:scale-105' : 'bg-white text-black'}`}
            >
              ${pkg.price}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const PaymentSuccessPage = ({ onViewChange }: { onViewChange: (v: any) => void }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference');
    if (ref) {
      fetch(`/api/paystack/verify/${ref}`)
        .then(r => r.json())
        .then(data => setStatus(data.status === 'success' ? 'success' : 'error'))
        .catch(() => setStatus('error'));
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
      {status === 'verifying' && <div className="text-white/40 animate-pulse">Syncing transactions...</div>}
      {status === 'success' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <Check className="w-12 h-12 text-emerald-400" strokeWidth={3} />
          </div>
          <h2 className="text-5xl font-heading italic text-white">Payment Verified</h2>
          <button onClick={() => navigate('/login')} className="bg-white text-black px-12 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest">Return to Dashboard</button>
        </motion.div>
      )}
    </div>
  );
};

const SectionDivider = () => (
  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
);

const LandingView = ({ onViewChange, onStartBuilding }: { onViewChange: (v: any) => void; onStartBuilding: (p: string) => void }) => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-black scroll-smooth">
      {/* Section 1: Hero */}
      <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden py-32 bg-black">
        <div className="absolute inset-0 pointer-events-none">
          <FadingVideo 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
            className="w-full h-full object-cover"
            opacity={0.4}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mb-20 w-full max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-pill px-6 py-2 mb-10 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 block border border-white/5 mx-auto w-fit"
          >
            Universal Application Engine
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-medium leading-[0.8] tracking-tight text-white mb-10">
            Turn Imagination<br />Into <span className="font-heading italic">Production Software.</span>
          </h1>
          
          <p className="text-white/40 max-w-2xl mx-auto text-xl font-light mb-14 leading-relaxed">
            Build full-stack applications, generate UI from prompts, and convert screenshots into working code with AI.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-white text-black px-12 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              Start Free
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-10">
            {[
              { text: "No credit card", icon: "shield" },
              { text: "Free credits", icon: "sparkles" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] group-hover:scale-125 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 group-hover:text-white/60 transition-colors">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Brand Feature Grid System Integration */}
        <div className="relative z-10 w-full py-20">
            <FeatureGrid delayOffset={0.4} />
        </div>
      </section>

      {/* Section 2: LIVE BUILDER */}
      <div id="features-section">
        <FeatureSection
          title="Intuitive Canvas"
          description="Design with a native feeling. Our canvas is built for speed and precision."
          tags={["Direct Manipulation", "Auto-Layout", "Real-time Sync"]}
          icon={<Palette className="w-6 h-6" />}
          preview={<PremiumCanvasPreview onExecute={onStartBuilding} />}
        />
      </div>
      <LucidLiveBuilder />

      {/* Section 3: SCREENSHOT TO CODE */}

      <section id="screenshot-to-code" className="py-40 px-6 bg-black relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: "-100px" }}
            className="lg:order-last glass-card rounded-[3.5rem] h-[560px] bg-white/[0.01] border-white/10 flex flex-col items-center justify-center p-12 relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
               <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center mb-8 relative">
                 <Plus className="w-8 h-8 text-white/20 group-hover:text-white group-hover:scale-110 transition-all" />
                 <motion.div 
                   animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                   transition={{ duration: 3, repeat: Infinity }}
                   className="absolute inset-0 rounded-full border border-white/20" 
                 />
               </div>
               <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/20">Drop reference screenshot</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-10 shadow-xl border border-white/5">
              <ImageIcon className="w-7 h-7" />
            </div>
            <h2 className="text-6xl font-medium tracking-tight text-white mb-8 leading-[0.95]">Turn Any Screenshot<br />Into Real Code.</h2>
            <p className="text-white/40 text-xl font-light leading-relaxed mb-12 max-w-lg">
              Upload designs, wireframes, or inspiration images and instantly reconstruct them into editable applications using our Vision Engine.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-white/50 font-light italic">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>Pixel-perfect layout extraction</span>
              </div>
              <div className="flex items-center gap-4 text-white/50 font-light italic">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>Automated typography detection</span>
              </div>
              <div className="flex items-center gap-4 text-white/50 font-light italic">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>One-click React conversion</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4: FULL APP GENERATION */}
      <section className="py-40 px-6 bg-black relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-10 shadow-xl border border-white/5">
              <ArrowUpRight className="w-7 h-7" />
            </div>
            <h2 className="text-6xl font-medium tracking-tight text-white mb-8 leading-[0.95]">Build Entire<br />Applications Instantly.</h2>
            <p className="text-white/40 text-xl font-light leading-relaxed mb-12 max-w-lg">
              Generate complete full-stack applications including routing, components, and deployment-ready architecture from a single prompt.
            </p>
            <div className="glass-pill p-6 border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3 text-xs font-mono text-white/40 italic">
                <Terminal className="w-4 h-4" />
                <span>lucid deploy build-next-auth-stripe</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: "-100px" }}
            className="glass-card rounded-[3.5rem] h-[560px] bg-black/60 border-white/10 flex flex-col p-8 overflow-hidden font-mono shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-8 opacity-40">
              <div className="w-3 h-3 rounded-full bg-red-500/30" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
            </div>
            <div className="space-y-4">
               {['app/', '  layout.tsx', '  (auth)/', '    login/page.tsx', '    signup/page.tsx', '  (dashboard)/', '    overview/page.tsx', '  api/', '    webhooks/stripe/'].map((line, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -10 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.05 }}
                   className={`text-xs ${line.includes('/') ? 'text-white/50' : 'text-white/30'} flex items-center gap-3`}
                 >
                   <span className="text-white/10 font-sans">{i + 1}</span>
                   {line}
                 </motion.div>
               ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 5: AI ROUTING ENGINE */}
      <section id="api-section" className="py-64 px-6 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="max-w-4xl mx-auto text-center mb-32 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-10 mx-auto shadow-2xl border border-white/10 backdrop-blur-xl"
          >
            <Cpu className="w-8 h-8" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-heading italic tracking-tighter text-white mb-10"
          >
            Smart Multi-Model <span className="opacity-30">Engine.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-xl md:text-2xl font-body font-light leading-relaxed max-w-2xl mx-auto"
          >
            Lucid automatically routes complex requests across <span className="text-white/80">Anthropic</span>, <span className="text-white/80">Google</span>, and <span className="text-white/80">OpenAI</span> for optimal latency and synthesis.
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto relative group">
           <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <VisualFlow />
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 relative z-10">
              {[
                { 
                  title: 'Speed Optimization', 
                  desc: 'Instant response routing for micro-tasks and UI tweaks using Gemini Flash.',
                  icon: Zap,
                  color: 'text-blue-400'
                },
                { 
                  title: 'Logic Synthesis', 
                  desc: 'Deep reasoning and full-stack architecture handled by Claude 3.5 Sonnet.',
                  icon: Code2,
                  color: 'text-purple-400'
                },
                { 
                  title: 'Vision Intelligence', 
                  desc: 'Hardware-accelerated pixel extraction using GPT-4o Vision models.',
                  icon: Eye,
                  color: 'text-emerald-400'
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-12 rounded-[3.5rem] border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                >
                   <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-8 ${item.color} group-hover:scale-110 transition-transform`}>
                     <item.icon className="w-6 h-6" />
                   </div>
                   <h3 className="text-xl text-white font-medium mb-4 italic font-heading tracking-tight">{item.title}</h3>
                   <p className="text-sm text-white/30 leading-relaxed font-light">{item.desc}</p>
                   
                   <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent scale-x-0 group-hover:scale-100 transition-transform duration-500" />
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      <SectionDivider />

      {/* Section 6: PRICING SECTION */}
      <section id="pricing-section" className="py-48 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="text-left">
               <h2 className="text-6xl font-medium tracking-tight text-white mb-6 italic font-heading">Simple, Scalable <span className="opacity-30">Pricing.</span></h2>
               <p className="text-white/40 text-xl font-light max-w-xl italic">Architectural freedom for creators and teams alike.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
            <PriceCard 
              onViewChange={onViewChange}
              title="Free"
              price={0}
              credits="10"
              description="Good for exploring the power of Lucid."
              features={["10 Monthly Credits", "AI UI Generation", "Prompt → UI Access", "Watermark exports", "Public projects"]}
              cta="Get Started"
            />
            <PriceCard 
              onViewChange={onViewChange}
              popular
              title="Pro"
              price={20}
              credits="500"
              description="The standard for professional creators."
              features={["500 Monthly Credits", "Full stack development", "Visual Editing Tool", "React & Tailwind Export", "Private projects", "Priority queue"]}
              cta="Upgrade to Pro"
            />
            <PriceCard 
              onViewChange={onViewChange}
              title="Studio"
              price={49}
              credits="2000"
              description="Power tools for agencies and teams."
              features={["2000 Monthly Credits", "Full stack development", "Shared projects", "Advanced exports", "Premium AI models", "Animation gen"]}
              cta="Go Studio"
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Unified CTA + FAQ + Footer Section */}
      <FinalCTAFAQSection onViewChange={onViewChange} />
      <Footer onViewChange={onViewChange} />
    </div>
  );
};

// --- Price Card Component ---

const PriceCard = ({ title, price, description, features, cta, popular, credits, onViewChange, delay = 0 }: any) => {
  const gradient = popular 
    ? "linear-gradient(137deg, #3B82F6 0%, #8B5CF6 45%, #D946EF 100%)" 
    : "linear-gradient(137deg, #333 0%, #555 100%)";

  return (
    <GlowCard gradient={gradient} delay={delay} className="min-h-[580px]">
      <div className="w-full h-full p-8 flex flex-col relative transition-all duration-500">
        {popular && (
          <div className="absolute top-6 right-6 bg-white text-black px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.3)] z-20">
            <Star className="w-3 h-3 fill-black" /> Most Popular
          </div>
        )}
        <div className="mb-8">
          <h3 className="text-2xl font-heading italic text-white mb-2">{title}</h3>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-heading italic text-white">{price === 0 ? 'Free' : `$${price}`}</span>
            {price > 0 && <span className="text-white/30 text-xs font-bold uppercase tracking-widest">/ month</span>}
          </div>
          <p className="text-sm text-white/40 leading-relaxed font-light">{description}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Generation Fuel</span>
            <Zap className="h-3.5 w-3.5 text-yellow-500" />
          </div>
          <div className="text-xl font-heading italic text-white">{credits} Credits</div>
        </div>

        <div className="space-y-4 flex-1">
          {features.map((feature: string, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1 w-4 h-4 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-sm text-white/60 font-light">{feature}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => onViewChange('auth')}
          className={`mt-8 w-full py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95 ${popular ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02]' : 'glass-pill text-white hover:bg-white/5'}`}
        >
          {cta}
        </button>
      </div>
    </GlowCard>
  );
};


const FeatureSection = ({ title, description, tags, icon, preview, reversed }: any) => (
  <section className={`py-40 px-6 max-w-[1440px] xl:max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[40%_60%] gap-20 lg:gap-32 items-stretch ${reversed ? 'lg:flex-row-reverse' : ''}`}>
    <motion.div 
      initial={{ opacity: 0, x: reversed ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`flex flex-col justify-center ${reversed ? 'lg:order-last' : ''}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-8">
        {icon}
      </div>
      <h2 className="text-5xl font-heading italic text-white mb-6 leading-tight tracking-tight">{title}</h2>
      <p className="text-white/40 text-lg font-light leading-relaxed mb-8 max-w-lg">{description}</p>
      {tags && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string) => (
            <span key={tag} className="glass-pill px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white/30 border border-white/5">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative rounded-[3rem] overflow-hidden h-[400px] border border-white/5 bg-white/[0.01]"
    >
      {preview}
    </motion.div>
  </section>
);



// --- Auth View Components ---

const SocialButton = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <button className="glass-card flex items-center justify-center gap-3 py-4 rounded-2xl hover:bg-white/5 transition-all group active:scale-[0.98]">
    <div className="text-white/40 group-hover:text-white transition-colors">
      {icon}
    </div>
    <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">{text}</span>
  </button>
);

const InputGroup = ({ label, type = "text", placeholder, helperText, icon }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">{label}</label>
      <div className="relative group">
        <input 
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/20 focus:bg-white/5 transition-all"
        />
        {isPassword && (
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {helperText && <p className="text-[10px] text-white/20 ml-1">{helperText}</p>}
    </div>
  );
};

const FloatingStatCard = ({ value, label, className }: any) => (
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

const AuthPage = ({ onViewChange }: { onViewChange: (v: any) => void }) => {
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState<'starter' | 'pro'>('starter');

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
          <div className="glass-pill px-4 py-2 flex items-center gap-2 border border-white/10">
            <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center font-heading text-xs italic">l</div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">lucid.dev</span>
          </div>
          <div className="flex items-center gap-2">
            {[
              { label: 'Features', id: 'features-section' },
              { label: 'Pricing', view: 'pricing' },
              { label: 'Docs', id: 'hero' }
            ].map((item: any) => (
              <button 
                key={item.label} 
                onClick={() => item.view ? onViewChange(item.view) : onViewChange('landing')}
                className="glass-pill px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => onViewChange('generator')}
              className="bg-white text-black px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest hover:scale-105 transition-all"
            >
              Launch App
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex-1 flex flex-col justify-center w-full max-w-xl text-left">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.div 
               variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
               className="glass-pill px-4 py-2 rounded-full border border-white/10 text-[9px] font-bold uppercase tracking-[0.3em] inline-block mb-8 text-white/60"
            >
              AI-Powered Application Builder
            </motion.div>
            <motion.h1 
               variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
               className="text-[5rem] font-medium leading-[0.85] tracking-tight text-white mb-8"
            >
              Turn Imagination<br />Into <span className="font-heading italic">Production<br />Software.</span>
            </motion.h1>
            <motion.p 
               variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
               className="text-white/50 text-xl font-light max-w-md leading-relaxed"
            >
              Generate interfaces, convert screenshots into code, and build full-stack applications with AI.
            </motion.p>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <FloatingStatCard value="2.8M+" label="Projects Generated" className="top-[20%] right-[-5%] rotate-[5deg]" />
        <FloatingStatCard value="94%" label="Faster Development" className="bottom-[15%] right-[5%] rotate-[-3deg]" />
        
        <FeatureChip text="Screenshot-to-Code" className="top-[35%] right-[10%] rotate-[-2deg]" />
        <FeatureChip text="AI UI Generation" className="bottom-[40%] right-[15%] rotate-[3deg]" />
        <FeatureChip text="Full App Export" className="bottom-[25%] left-[10%] rotate-[-4deg]" />
        <FeatureChip text="GPT-4 Quality" className="top-[15%] left-[5%] rotate-[4deg]" />
        <FeatureChip text="Team Workspaces" className="top-[45%] left-[0%] rotate-[-6deg]" />
      </motion.div>

      {/* Right Auth Section */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 overflow-y-auto bg-black"
      >
        <div className="w-full max-w-lg space-y-10">
          <header className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 block">Get Started</span>
            <h2 className="text-4xl font-medium tracking-tight text-white">Create Your Lucid Workspace</h2>
            <p className="text-white/50 text-base font-light">
              Access AI-powered app generation, visual editing, and production-ready exports.
            </p>
          </header>

          <div className="grid grid-cols-2 gap-4">
            <SocialButton icon={<Chrome className="w-4 h-4" />} text="Continue with Google" />
            <SocialButton icon={<Github className="w-4 h-4" />} text="Continue with GitHub" />
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <span className="relative z-10 bg-black px-4 text-[10px] uppercase font-bold tracking-[0.4em] text-white/20">Or continue with email</span>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="First Name" placeholder="Lara" />
              <InputGroup label="Last Name" placeholder="Croft" />
            </div>
            <InputGroup label="Email Address" type="email" placeholder="lara@lucid.dev" />
            <InputGroup 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              helperText="Must contain at least 8 characters."
            />

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Select Workspace Plan</label>
              <div className="glass-pill p-1 flex items-center bg-white/[0.03] border border-white/5">
                <button 
                  onClick={() => setActivePlan('starter')}
                  type="button"
                  className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activePlan === 'starter' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                >
                  Starter
                </button>
                <button 
                  onClick={() => setActivePlan('pro')}
                  type="button"
                  className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activePlan === 'pro' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                >
                  Pro
                </button>
              </div>
            </div>

            <button 
              onClick={() => navigate('/signup')}
              className="h-16 w-full rounded-2xl bg-white text-black font-semibold text-sm uppercase tracking-widest transition-all hover:bg-white/90 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Launch Workspace
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <footer className="text-center pt-8 border-t border-white/5">
            <p className="text-sm text-white/30">
              Already building with lucid.dev?{' '}
              <button className="text-white hover:underline transition-all">Log In</button>
            </p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

// --- Generator View ---

const GeneratorPage = ({ initialPrompt, onViewChange }: { initialPrompt?: string; onViewChange: (v: any) => void }) => {
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const [projectName, setProjectName] = useState("Untitled Project");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [viewMode, setViewMode] = useState<"preview" | "canvas" | "code">("preview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);

  const generationFlow = [
    "Analyzing intent & semantic structure...",
    "Architecting full-stack backbone (React + Express)...",
    "Synthesizing high-fidelity UI Material (Liquid Glass)...",
    "Wiring up reactive logic & state management...",
    "Finalizing production-grade manifest..."
  ];

  useEffect(() => {
    if (initialPrompt) {
      handleGenerate(initialPrompt);
    }
  }, [initialPrompt]);

  const handleGenerate = (p: string = prompt) => {
    if (!p) return;
    setIsGenerating(true);
    setGenerationStep(0);
    setMessages([{ type: 'user', text: p }]);
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step <= generationFlow.length) {
        setGenerationStep(step);
        setMessages(prev => [...prev, { type: 'ai', text: generationFlow[step - 1] }]);
      } else {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 2000);
  };

  return (
    <div className="flex h-screen w-full bg-black text-white font-body pt-20 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
         <FadingVideo 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_095015_90d8108c-6623-4414-9f4a-875f569a304e.mp4"
            className="w-full h-full object-cover grayscale"
         />
      </div>

      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="relative z-10 flex flex-col bg-black/40 backdrop-blur-3xl border-r border-white/5 overflow-hidden"
          >
    <div className="flex items-center justify-between p-6 border-b border-white/5">
      <button 
        onClick={() => onViewChange('landing')}
        className="flex items-center gap-3 group"
      >
        <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-heading italic text-lg group-hover:scale-110 transition-transform">l</div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">Lucid Studio</span>
          <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/30">Claude 3.5 Sonnet</span>
        </div>
      </button>
      <button 
        onClick={() => setIsSidebarOpen(false)}
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
      >
        <PanelLeftClose className="h-4 w-4 text-white/30" />
      </button>
    </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar space-y-6">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] p-4 rounded-2xl text-[13px] leading-relaxed ${
                    msg.type === 'user' 
                      ? 'bg-white/10 border border-white/10 text-white' 
                      : 'bg-black/60 border border-white/5 text-white/60 font-light'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isGenerating && (
                 <div className="flex justify-start gap-1 p-2">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  </div>
              )}
            </div>

            <div className="p-6 border-t border-white/5">
              <div className="relative group">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Iterate on the architecture..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 min-h-[100px] text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all resize-none font-light"
                />
                <button 
                  onClick={() => handleGenerate()}
                  disabled={isGenerating || !prompt}
                  className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col relative z-10">
        {/* Workspace Nav */}
        <div className="flex items-center justify-between px-8 h-16 border-b border-white/5 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-6">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg p-2 border border-white/10 hover:bg-white/5 transition-colors"
              >
                <PanelLeftOpen className="h-4 w-4 text-white/60" />
              </button>
            )}
            <div className="flex items-center gap-4 mr-4">
              <input 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-[0.2em] text-white/80 focus:text-white w-40"
              />
              <div className="h-4 w-px bg-white/10" />
            </div>
            <div className="flex rounded-xl border border-white/10 bg-white/[0.02] p-1">
              {[
                { id: 'preview', label: 'Preview', icon: Eye },
                { id: 'canvas', label: 'Canvas', icon: Layout },
                { id: 'code', label: 'Logic', icon: Code }
              ].map((mode: any) => (
                <button 
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`px-5 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-[10px] transition-all flex items-center gap-2 ${viewMode === mode.id ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                >
                  <mode.icon className="w-3 h-3" /> {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5AE14C] animate-pulse" />
                <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Live Sync</span>
             </div>
             <button className="bg-white/5 border border-white/10 text-white/60 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Export
             </button>
             <button className="bg-white text-black px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5">
                Publish
             </button>
          </div>
        </div>

        {/* Dynamic Workspace Area */}
        <div className="flex-1 p-8 overflow-hidden bg-[radial-gradient(#ffffff04_1px,transparent_1px)] bg-[size:40px_40px]">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div 
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-12"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="w-48 h-48 rounded-full border-t border-white/20 border-dash absolute -top-8 -left-8"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-32 h-32 rounded-full bg-white/10 blur-3xl absolute top-0 left-0"
                  />
                  <div className="w-32 h-32 rounded-full bg-white text-black flex items-center justify-center relative z-10 shadow-2xl">
                     <Sparkles className="w-12 h-12 animate-pulse" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-3xl font-heading italic text-white tracking-widest">{generationFlow[generationStep - 1] || "Initializing Synthesis..."}</h3>
                  <div className="flex items-center justify-center gap-1.5">
                    {generationFlow.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 rounded-full transition-all duration-500 ${i < generationStep ? 'w-8 bg-white' : 'w-2 bg-white/10'}`} 
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full w-full"
              >
                {viewMode === 'preview' && (
                   <div className="h-full w-full rounded-[2.5rem] bg-zinc-900 border border-white/5 overflow-hidden shadow-2xl relative">
                      <div className="absolute top-0 inset-x-0 h-10 bg-black/40 border-b border-white/5 flex items-center px-6 justify-between">
                         <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                         </div>
                         <div className="px-4 py-1 rounded-full bg-white/5 text-[9px] font-bold text-white/30 uppercase tracking-widest border border-white/5">
                            preview.lucid.app
                         </div>
                         <div className="w-20" />
                      </div>
                      <div className="pt-10 h-full flex items-center justify-center bg-black/80">
                         {prompt ? <PreviewPanel activeStep={8} /> : (
                           <div className="text-center">
                              <History className="w-16 h-16 text-white/5 mx-auto mb-6" />
                              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 italic">Architect Waiting For Prompt</p>
                           </div>
                         )}
                      </div>
                   </div>
                )}
                {viewMode === 'canvas' && (
                   <div className="h-full w-full rounded-[2.5rem] bg-[#0A0A0B] border border-white/5 p-8 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_2px,transparent_2px)] bg-[size:32px_32px]" />
                      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                         <Layout className="w-12 h-12 text-white/10 mb-6" />
                         <h4 className="text-2xl font-heading italic text-white/40 mb-2">Visual Canvas Mode</h4>
                         <p className="text-white/20 text-xs font-light tracking-wide max-w-xs">Direct manipulation of elements within the liquid-glass design system.</p>
                      </div>
                      {/* Floating controls in canvas */}
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                         <button className="px-6 py-2 rounded-full glass-pill border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all">Inspect</button>
                         <button className="px-6 py-2 rounded-full glass-pill border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all">Edit Vibe</button>
                      </div>
                   </div>
                )}
                {viewMode === 'code' && (
                   <div className="h-full w-full rounded-[2.5rem] bg-zinc-950 border border-white/5 p-0 overflow-hidden font-mono shadow-2xl">
                      <div className="h-10 bg-black/60 border-b border-white/5 flex items-center px-6 gap-6">
                         <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">src / structures / manifest.ts</span>
                      </div>
                      <div className="p-8 text-xs text-indigo-300/40 leading-loose">
                         <pre>
{`// Lucid Synthesis Architecture
export const Structure = {
  vibe: "Liquid Glass",
  engine: "Claude-Sonnet-3.5",
  components: [
    { type: "CinematicHero", props: { video: true, blur: 40 } },
    { type: "FeatureGrid", props: { layout: "Bento" } },
    { type: "PaymentFlow", props: { gateway: "Paystack" } }
  ],
  styles: {
    fontFamily: ["Instrument Serif", "Barlow"],
    borderRadius: "rounded-full"
  }
};`}
                         </pre>
                      </div>
                   </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function LandingPage() {
  const [initialPrompt, setInitialPrompt] = useState("");

  const startBuilding = (prompt: string) => {
    setInitialPrompt(prompt);
    // Navigation to /auth or /studio is handled by the sub-components via useNavigate
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden font-sans">
      <Navbar onViewChange={() => {}} currentView="landing" />
      
      <main>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LandingView onViewChange={() => {}} onStartBuilding={startBuilding} />
        </motion.div>
      </main>

      <style>{`
        :root {
          --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
          --font-heading: "Instrument Serif", serif;
          --font-body: "Barlow", sans-serif;
          --color-brand-gray: #141414;
          --color-glass-border: rgba(255,255,255,0.08);
        }

        .font-sans { font-family: var(--font-sans); }
        .font-heading { font-family: var(--font-heading); }
        .font-body { font-family: var(--font-body); }

        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 0 32px rgba(255, 255, 255, 0.01);
        }

        .glass-heavy {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: inset 0 0 64px rgba(255, 255, 255, 0.02);
        }

        .glass-pill {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 9999px;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}


