import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, Sparkles, Database, Lock, CreditCard, 
  Globe, Shield, BarChart3, Mail, Puzzle, Cloud, 
  Terminal, Layers, ArrowRight, ArrowLeft, ArrowUpRight,
  User, Building, Landmark, Flame, Compass, Palette, Sliders
} from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { setPackageCredits, addNotification } = useStudioStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  // Checkout form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [country, setCountry] = useState('United States');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Rephrased elegant premium features for Lucid Pro
  const proFeatures = [
    'Create unlimited high-fidelity draft rooms',
    'Enable deep compilation cycles and visual tools',
    'Export structured production-ready code templates',
    'Unlock advanced custom styling presets and schemes',
    'Remove all workspace watermarks from layout views',
    'Access advanced typography palettes and displays',
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStartSubscription = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Set premium package credits
      setPackageCredits(2500);
      addNotification(
        'billing',
        'Lucid Pro Activated',
        'Thank you! Your workspace has been upgraded to Lucid Pro. Advanced compiling, unlimited drafts, and styling layouts are now active.'
      );
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      
      {/* Outer wrapper panel with identical glowing gradient design from pricing blocks */}
      <div className="relative w-full max-w-4xl p-[1.2px] rounded-[24px] overflow-hidden">
        
        {/* Glowing Aura Effect Behind Modal */}
        <div 
          className="absolute inset-0 w-full h-full opacity-30 pointer-events-none filter blur-[40px]"
          style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(168, 85, 247, 0.4) 100%)' }}
        />

        {/* Foreground Card with Gradient Border */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative z-10 w-full bg-[#070709] rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
          style={{
            background: 'linear-gradient(#08080a, #040405) padding-box, linear-gradient(135deg, #3b82f6 0%, #a855f7 100%) border-box',
            border: '1.2px solid transparent'
          }}
        >
          {/* Header Close Button (Only on steps 1-4, or small on step 5) */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-[60] p-2 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-850 bg-zinc-950/40 transition-all cursor-pointer focus:outline-none"
            aria-label="Skip onboarding"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Dynamic content area */}
          <div className="flex-1 flex flex-col md:flex-row min-h-[520px]">
            
            {/* LEFT SIDE PANEL (Varying visuals based on current step) */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-zinc-900 bg-[#060608]/50 backdrop-blur-sm relative overflow-hidden select-none">
              
              {/* Dynamic Step Accent Glow */}
              <div className="absolute inset-0 pointer-events-none opacity-25">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-500/10 blur-[90px]" />
              </div>

              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="w-full flex flex-col items-center justify-center"
                  >
                    {/* Grid of built-in features matching our rephrased custom design capabilities */}
                    <div className="grid grid-cols-3 gap-3 w-full max-w-[320px] p-4 bg-zinc-950/80 border border-white/[0.02] rounded-2xl relative">
                      {/* Grid lines */}
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-10">
                        <div className="border-r border-b border-white" />
                        <div className="border-r border-b border-white" />
                        <div className="border-b border-white" />
                        <div className="border-r border-b border-white" />
                        <div className="border-r border-b border-white" />
                        <div className="border-b border-white" />
                      </div>

                      {/* AI Layouts */}
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 aspect-square">
                        <Sparkles className="w-5 h-5 mb-1.5" />
                        <span className="text-[10px] font-bold tracking-wider font-sans">AI design</span>
                      </div>

                      {/* State Engine */}
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 aspect-square">
                        <Sliders className="w-5 h-5 mb-1.5" />
                        <span className="text-[10px] font-bold tracking-wider font-sans">Sandbox</span>
                      </div>

                      {/* Clean Grid */}
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 aspect-square">
                        <Layers className="w-5 h-5 mb-1.5" />
                        <span className="text-[10px] font-bold tracking-wider font-sans">Layouts</span>
                      </div>

                      {/* Interactive Cards */}
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 aspect-square">
                        <CreditCard className="w-5 h-5 mb-1.5" />
                        <span className="text-[10px] font-bold tracking-wider font-sans">Pills</span>
                      </div>

                      {/* Themes */}
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 aspect-square">
                        <Palette className="w-5 h-5 mb-1.5" />
                        <span className="text-[10px] font-bold tracking-wider font-sans">Themes</span>
                      </div>

                      {/* Analytics */}
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/20 text-[#a855f7] aspect-square">
                        <BarChart3 className="w-5 h-5 mb-1.5" />
                        <span className="text-[10px] font-bold tracking-wider font-sans">Charts</span>
                      </div>

                      {/* Security */}
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 aspect-square">
                        <Shield className="w-5 h-5 mb-1.5" />
                        <span className="text-[10px] font-bold tracking-wider font-sans">Security</span>
                      </div>

                      {/* System Presets */}
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 aspect-square">
                        <Compass className="w-5 h-5 mb-1.5" />
                        <span className="text-[10px] font-bold tracking-wider font-sans">Explore</span>
                      </div>

                      {/* Core APIs */}
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 aspect-square">
                        <Puzzle className="w-5 h-5 mb-1.5" />
                        <span className="text-[9px] font-bold tracking-tight text-center font-sans">Customizer</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="w-full flex flex-col items-center justify-center"
                  >
                    {/* State Customization panel representing local sandbox controls perfectly */}
                    <div className="w-full max-w-[320px] p-6 bg-zinc-950/90 border border-zinc-850 rounded-2xl relative overflow-hidden flex flex-col gap-4 shadow-xl">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
                          <Sliders className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-white tracking-wide">Interactive Canvas Controls</span>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Client Sandbox State</span>
                        </div>
                      </div>
                      
                      {/* Visual customizer inputs */}
                      <div className="bg-[#0b0b0d] border border-zinc-900 rounded-xl p-3.5 flex flex-col gap-3 font-sans text-left">
                        {/* Theme selection mockup */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] text-zinc-400 font-semibold uppercase tracking-wider">
                            <span>Sandbox Theme</span>
                            <span className="text-blue-400 font-mono">Slate Glow</span>
                          </div>
                          <div className="flex gap-1.5 pt-1">
                            <span className="w-4 h-4 rounded-full bg-blue-500 border border-white/20 ring-2 ring-blue-500/30" />
                            <span className="w-4 h-4 rounded-full bg-amber-500 border border-white/10" />
                            <span className="w-4 h-4 rounded-full bg-emerald-500 border border-white/10" />
                            <span className="w-4 h-4 rounded-full bg-rose-500 border border-white/10" />
                          </div>
                        </div>

                        {/* Slider Control mockup */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] text-zinc-400 font-semibold uppercase tracking-wider">
                            <span>Glass Blur Pillar</span>
                            <span className="text-zinc-500">24px</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden relative">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }} />
                            <span className="absolute top-1/2 left-[65%] -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border border-blue-600 shadow-sm" />
                          </div>
                        </div>

                        {/* Toggle Control mockup */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wider">Glassmorphic Borders</span>
                          <div className="w-7 h-4 bg-blue-500/20 border border-blue-500/40 rounded-full p-0.5 flex items-center justify-end transition-all">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                          </div>
                        </div>
                      </div>

                      {/* Simple live preview widget */}
                      <div className="lucid-glass p-3 rounded-xl border border-zinc-850/60 bg-white/[0.01] backdrop-blur-sm text-center">
                        <p className="text-[10px] text-zinc-350 font-semibold font-heading italic tracking-wide">
                          "Elegance is achieved when there is nothing left to subtract."
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="w-full flex flex-col items-center justify-center"
                  >
                    {/* Visual representing AI prompt-to-design rendering */}
                    <div className="w-full max-w-[320px] bg-zinc-950/80 border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4 relative">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Lucid Compiler Status</span>
                      </div>

                      {/* AI Prompt card */}
                      <div className="bg-[#0e0e11] border border-zinc-850 p-3 rounded-xl text-xs text-zinc-300 italic font-light relative text-left">
                        "Synthesize a dark high-contrast dashboard with glassmorphism tabs..."
                        <span className="absolute -bottom-1.5 right-4 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[8px] text-blue-400 font-bold uppercase font-sans">Prompt Input</span>
                      </div>

                      {/* Live Streaming terminal simulation */}
                      <div className="bg-black border border-zinc-900 rounded-xl p-3.5 h-28 font-mono text-[9px] text-zinc-500 overflow-hidden flex flex-col gap-1.5 text-left">
                        <div className="text-zinc-400 flex items-center gap-1.5">
                          <Terminal className="w-3 h-3 text-sky-400" />
                          <span>npm run compile:applet</span>
                        </div>
                        <div className="text-zinc-600">&gt; Parsing Astro components... OK</div>
                        <div className="text-sky-400">&gt; Building tailwind utilities ... [358 classes]</div>
                        <div className="text-[#a855f7]">&gt; Injecting premium glass pillars (blur: 50px)</div>
                        <div className="text-emerald-400 animate-pulse">&gt; Compilation finished successfully in 428ms!</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="w-full flex flex-col items-center justify-center"
                  >
                    {/* Canvas stacks visual */}
                    <div className="w-full max-w-[320px] bg-zinc-950/80 border border-zinc-900 rounded-2xl p-6 relative flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-violet-400" />
                          <span className="text-xs font-bold text-white">Visual Layer Stack</span>
                        </div>
                        <span className="text-[9px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded">Figma Sync</span>
                      </div>

                      {/* Layer representations */}
                      <div className="flex flex-col gap-2 relative text-left">
                        {/* Top layer */}
                        <div className="bg-violet-500/10 border border-violet-500/30 p-2.5 rounded-xl flex items-center justify-between text-[10px] text-white/90 relative z-20 hover:border-violet-400/50 transition-all">
                          <span className="font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                            Interactive Glass Header
                          </span>
                          <span className="text-[8px] text-zinc-500 font-mono">#glass-hdr</span>
                        </div>

                        {/* Middle layer */}
                        <div className="bg-sky-500/10 border border-sky-500/30 p-2.5 rounded-xl flex items-center justify-between text-[10px] text-white/90 relative z-10 hover:border-sky-400/50 transition-all">
                          <span className="font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                            Computation Charts Canvas
                          </span>
                          <span className="text-[8px] text-zinc-500 font-mono">#d3-recharts</span>
                        </div>

                        {/* Base layer */}
                        <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl flex items-center justify-between text-[10px] text-white/90 relative z-0 hover:border-emerald-400/50 transition-all">
                          <span className="font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Atmospheric Particle Plane
                          </span>
                          <span className="text-[8px] text-zinc-500 font-mono">#video-background</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div 
                    key="step5"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="w-full h-full flex flex-col justify-between py-2 text-left"
                  >
                    {/* Glowing Accent Side Card with beautiful premium lists */}
                    <div className="bg-gradient-to-b from-[#080b11] to-[#040509] border border-blue-500/15 rounded-[1.5rem] p-6 text-white w-full h-full flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.6)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full" />
                      
                      <div className="space-y-4">
                        {/* Logo header with clean Sparkles icon - absolutely NO emoji */}
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
                          <h3 className="text-lg font-black tracking-wider uppercase font-sans text-blue-400">Lucid Pro</h3>
                        </div>

                        {/* Bullets rephrased for original premium vibe */}
                        <ul className="space-y-3 pt-2">
                          {proFeatures.slice(0, 5).map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-xs text-white/90">
                              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="font-medium tracking-wide">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>


                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT SIDE PANEL (Text information or checkout form) */}
            <div className="w-full md:w-1/2 p-10 flex flex-col justify-between bg-[#08080a]">
              <AnimatePresence mode="wait">
                {currentStep < 5 ? (
                  <motion.div
                    key={`text-step-${currentStep}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col justify-center text-left py-6"
                  >
                    {/* Step indicators */}
                    <div className="flex items-center gap-1.5 mb-6">
                      {[1, 2, 3, 4, 5].map((idx) => (
                        <div 
                          key={idx} 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === currentStep 
                              ? 'w-6 bg-blue-500' 
                              : idx < currentStep 
                                ? 'w-2 bg-blue-500/40' 
                                : 'w-2 bg-zinc-800'
                          }`} 
                        />
                      ))}
                    </div>

                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-heading text-white tracking-tight leading-tight">
                          Craft <span className="bg-rose-500/10 text-rose-400 px-2.5 py-0.5 rounded-lg border border-rose-500/20 font-sans font-medium text-2xl not-italic">fluid</span> designs
                        </h2>
                        <p className="text-sm text-zinc-400 leading-relaxed font-light">
                          Experience design layout tools built directly inside your browser. No complex setup or installation is required. Design highly responsive custom components, select modern themes, and inspect live sandbox rendering instantly.
                        </p>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-heading text-white tracking-tight leading-tight">
                          State & <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 font-sans font-medium text-2xl not-italic">Interaction</span> controls
                        </h2>
                        <p className="text-sm text-zinc-400 leading-relaxed font-light">
                          Toggle container dimensions, blur percentages, and padding rules dynamically. Customize local states on the fly and verify interface behavior in real-time under a fully sandboxed preview mode.
                        </p>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-heading text-white tracking-tight leading-tight">
                          Intelligent <span className="bg-sky-500/10 text-sky-400 px-2.5 py-0.5 rounded-lg border border-sky-500/20 font-sans font-medium text-2xl not-italic">Layout</span> compiler
                        </h2>
                        <p className="text-sm text-zinc-400 leading-relaxed font-light">
                          Leverage conversational prompts to synthesize glassmorphism card panels, interactive sidebars, and styled data visualizations. Watch the sandbox engine structure your layout in a fraction of a second.
                        </p>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-heading text-white tracking-tight leading-tight">
                          Modular <span className="bg-violet-500/10 text-violet-400 px-2.5 py-0.5 rounded-lg border border-violet-500/20 font-sans font-medium text-2xl not-italic">Code</span> exporter
                        </h2>
                        <p className="text-sm text-zinc-400 leading-relaxed font-light">
                          Review standard React source files cleanly structured in real-time. Sync components smoothly with visual mockups, test responsiveness across different aspect ratios, or export full workspaces instantly.
                        </p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="step5-checkout"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col justify-between text-left"
                  >
                    <div>
                      {/* Premium Header - absolutely no emojis */}
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-white tracking-wide">Unlock Lucid Pro</h2>
                        <span className="text-[9px] bg-blue-500/10 text-blue-400 font-extrabold uppercase px-2 py-0.5 rounded border border-blue-500/20">SANDBOX TESTWAY</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                        Add your card to continue. Cancel anytime.
                      </p>

                      {/* Checkout form elements with premium input styling */}
                      <div className="space-y-3.5 mt-5">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Card number</label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="1234 5678 1234 5678"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full bg-[#0c0c0e] border border-zinc-850 hover:border-zinc-800 focus:border-blue-500 text-white placeholder-zinc-650 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none transition-all"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-80 scale-90 pointer-events-none">
                              <span className="text-[8px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold">VISA</span>
                              <span className="text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">MC</span>
                              <span className="text-[8px] bg-zinc-700 text-white px-1.5 py-0.5 rounded font-bold">AMEX</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Expiration date</label>
                            <input
                              type="text"
                              placeholder="MM / YY"
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value)}
                              className="w-full bg-[#0c0c0e] border border-zinc-850 hover:border-zinc-800 focus:border-blue-500 text-white placeholder-zinc-650 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Security code</label>
                            <div className="relative">
                              <input
                                type="password"
                                placeholder="CVC"
                                maxLength={4}
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value)}
                                className="w-full bg-[#0c0c0e] border border-zinc-850 hover:border-zinc-800 focus:border-blue-500 text-white placeholder-zinc-650 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none transition-all"
                              />
                              <CreditCard className="w-4 h-4 text-zinc-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Country</label>
                          <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-[#0c0c0e] border border-zinc-850 hover:border-zinc-800 focus:border-blue-500 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all cursor-pointer font-sans font-medium"
                          >
                            <option value="United States">United States</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Germany">Germany</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Price breakdown and checkout buttons */}
                    <div className="pt-6 border-t border-zinc-900 mt-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-white">
                            {billingPeriod === 'yearly' ? '$17.00' : '$21.25'}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-sans">/month</span>
                        </div>

                        {/* Period switcher */}
                        <div className="flex items-center gap-2 bg-[#0c0c0e] border border-zinc-850 rounded-full p-1 shrink-0">
                          <button
                            onClick={() => setBillingPeriod('monthly')}
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${
                              billingPeriod === 'monthly'
                                ? 'bg-zinc-800 text-white shadow'
                                : 'text-zinc-500 hover:text-zinc-350'
                            }`}
                          >
                            Monthly
                          </button>
                          <button
                            onClick={() => setBillingPeriod('yearly')}
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all relative ${
                              billingPeriod === 'yearly'
                                ? 'bg-blue-500 text-white shadow'
                                : 'text-zinc-500 hover:text-zinc-350'
                            }`}
                          >
                            Annual
                            <span className="absolute -top-1.5 -right-1 px-1 py-0.5 bg-rose-500 text-[6px] font-black text-white rounded-full uppercase leading-none scale-90">20% Off</span>
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-[9px] text-zinc-500 font-mono tracking-wide">
                        {billingPeriod === 'yearly' ? '$204.00 billed annually. Sandbox payment gateway simulated.' : '$21.25 due today in sandbox trial mode.'}
                      </p>

                      <div className="flex items-center justify-between gap-4 pt-1">
                        <button
                          onClick={onClose}
                          className="text-xs text-zinc-500 hover:text-zinc-300 font-bold transition-all focus:outline-none underline"
                        >
                          Skip for now
                        </button>
                        
                        <button
                          onClick={handleStartSubscription}
                          disabled={isSubmitting}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-500/10"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <span>Start Subscription</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Nav Bar (Steps 1-4) */}
              {currentStep < 5 && (
                <div className="flex items-center justify-between pt-6 border-t border-zinc-900 mt-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={onClose}
                      className="text-xs text-zinc-500 hover:text-zinc-300 font-bold transition-all focus:outline-none underline"
                    >
                      Skip for now
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {currentStep > 1 && (
                      <button
                        onClick={handleBack}
                        className="px-4 py-2 border border-zinc-850 hover:border-zinc-750 bg-zinc-950/40 hover:bg-zinc-900/40 rounded-full text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>
                    )}
                    
                    <button
                      onClick={handleNext}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};
