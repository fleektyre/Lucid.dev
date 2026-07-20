import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DropdownOption {
  credits: string;
  pricePro: number;
  priceBus: number;
  desc: string;
}

const creditOptions: DropdownOption[] = [
  { credits: '100 Sparks / month', pricePro: 25, priceBus: 50, desc: '100 monthly Sparks' },
  { credits: '500 Sparks / month', pricePro: 65, priceBus: 90, desc: '500 monthly Sparks' },
  { credits: '1200 Sparks / month', pricePro: 130, priceBus: 160, desc: '1200 monthly Sparks' },
  { credits: '2000 Sparks / month', pricePro: 195, priceBus: 230, desc: '2000 monthly Sparks' }
];

// Reusable Custom Styled Glow Card following the "Pills & Glass" design system
const GlowCard = ({ children, gradient, popular, className = "" }: any) => (
  <motion.div
    whileHover={{ scale: 1.015 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={`relative group cursor-default h-full flex flex-col justify-between ${className}`}
  >
    {/* Glowing Aura Effect */}
    <div 
      className="absolute inset-0 w-full h-full rounded-[1.5rem] opacity-25 pointer-events-none filter blur-[35px] transition-all duration-700 group-hover:opacity-60 group-hover:scale-[1.03]"
      style={{ background: gradient }}
    />
    
    {/* Foreground Card with Gradient Border (No overflow-hidden to prevent clipping of badges & dropdowns) */}
    <div 
      className="relative z-10 w-full h-full rounded-[1.5rem] p-6 flex flex-col justify-between bg-zinc-950/45 border border-zinc-800/80 backdrop-blur-md hover:border-zinc-700/85 transition-all duration-500"
      style={{
        background: `linear-gradient(#08080a, #040405) padding-box, ${gradient} border-box`,
        border: '1.2px solid transparent'
      }}
    >
      {/* Popular Tag rendered outside of clipping bounds for top-level elegance */}
      {popular && (
        <div className="absolute -top-3.5 right-6 bg-white text-black text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-[0_4px_24px_rgba(255,255,255,0.35)] z-20 flex items-center gap-1 font-sans">
          <Star className="w-3 h-3 fill-black text-black" /> Popular
        </div>
      )}
      {children}
    </div>
  </motion.div>
);

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const { setPackageCredits, setPlan, addNotification } = useStudioStore();

  // Local card state for Annual billing toggling (as seen in Lovable screenshot)
  const [proAnnual, setProAnnual] = useState(false);
  const [busAnnual, setBusAnnual] = useState(false);
  
  // Dropdown states for interactive credit volume selections - initialized to typical Pro Spark (100 credits = $25) / Business High (2000)
  const [selectedProOpt, setSelectedProOpt] = useState<DropdownOption>(creditOptions[0]);
  const [selectedBusOpt, setSelectedBusOpt] = useState<DropdownOption>(creditOptions[3]);
  
  // Open/Close states for the custom themed list dropdowns
  const [proDropdownOpen, setProDropdownOpen] = useState(false);
  const [busDropdownOpen, setBusDropdownOpen] = useState(false);

  // Calculate pricing based on options & annual switches
  const proMonthlyValue = selectedProOpt.pricePro;
  const proCalculated = proAnnual ? Math.floor(proMonthlyValue * 0.8) : proMonthlyValue;

  const busMonthlyValue = selectedBusOpt.priceBus;
  const busCalculated = busAnnual ? Math.floor(busMonthlyValue * 0.8) : busMonthlyValue;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-body">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-6xl bg-[#070709]/95 border border-zinc-800/80 rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col gap-6 z-50"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-900 w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white border border-zinc-850 hover:border-zinc-800 bg-zinc-950/40 transition-all cursor-pointer focus:outline-none z-55 font-sans"
              aria-label="Close pricing and upgrade options"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Dialog info */}
            <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-2 mt-4">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.25em] font-sans">Flexible Computation Packages</span>
              <h2 className="text-3xl font-heading italic text-white mt-1 leading-tight">
                Choose your compilation bandwidth
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-light italic">
                Scale computation cycles, dedicated compilation threads, and developer intelligence models dynamically as you build.
              </p>
            </div>

            {/* Grid layout inside Pricing overlay */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 items-stretch select-none">
              
              {/* Card 1: FREE */}
              <GlowCard 
                gradient="linear-gradient(137deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.08) 100%)"
              >
                <div className="space-y-4 flex-grow">
                  <div>
                    <h3 className="text-2xl font-heading italic text-white tracking-wide">Free</h3>
                    <p className="text-xs text-zinc-400 mt-1 h-10 leading-relaxed font-light">
                      Ideal for solo creators experimenting with software vibe.
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 py-2 border-y border-zinc-900 my-1">
                    <span className="text-3xl font-heading italic text-white">$0</span>
                    <span className="text-xs text-zinc-500 font-sans pl-1">/month</span>
                  </div>

                  <div className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest font-sans">
                    General tier access
                  </div>

                  <ul className="space-y-3 pt-1">
                    {[
                      "10 Sparks per month max (hard limit, zero rollover)",
                      "Standard compilation speed",
                      "Single sandbox instances",
                      "Access to community models",
                      "Standard forum support"
                    ].map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="font-light">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled
                  className="w-full mt-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-850 text-zinc-500 cursor-not-allowed font-sans"
                >
                  Current Plan
                </button>
              </GlowCard>

              {/* Card 2: PRO */}
              <GlowCard 
                popular
                gradient="linear-gradient(137deg, #3B82F6 0%, #8B5CF6 50%, #D946EF 100%)"
              >
                <div className="space-y-4 relative flex-grow">
                  <div>
                    <h3 className="text-2xl font-heading italic text-white tracking-wide">Pro</h3>
                    <p className="text-xs text-zinc-400 mt-1 h-10 leading-relaxed font-light">
                      Supercharged power for modern developers and rapid build cycles.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 py-2 border-y border-zinc-900 my-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-heading italic text-white">${proCalculated}</span>
                      <span className="text-xs text-zinc-500 font-sans pl-1">/month</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-zinc-500 tracking-wider">shared with unlimited users</span>
                      
                      {/* Local Toggle */}
                      <button 
                        onClick={() => setProAnnual(!proAnnual)}
                        className="flex items-center gap-1.5 focus:outline-none"
                      >
                        <div 
                          className="relative inline-flex h-4 w-7 cursor-pointer rounded-full transition-colors duration-200 bg-zinc-800"
                          style={{ backgroundColor: proAnnual ? '#0ea5e9' : 'rgba(255,255,255,0.08)' }}
                        >
                          <span className="inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 mt-0.5 ml-0.5" style={{ transform: proAnnual ? 'translateX(10px)' : 'translateX(0)' }} />
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400 font-sans">Annual</span>
                      </button>
                    </div>
                  </div>

                  {/* CUSTOM TACTILE DROPDOWN */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setProDropdownOpen(!proDropdownOpen);
                        setBusDropdownOpen(false);
                      }}
                      className="w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 rounded-full px-4 py-2 flex items-center justify-between transition-all cursor-pointer text-left focus:outline-none text-xs font-bold text-white uppercase tracking-wider font-sans"
                    >
                      <span>{selectedProOpt.credits}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                    </button>

                    <AnimatePresence>
                      {proDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 3 }}
                          className="absolute left-0 right-0 mt-1 z-30 bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-1 font-sans"
                        >
                          {creditOptions.map((opt) => (
                            <button
                              key={opt.credits}
                              onClick={() => {
                                setSelectedProOpt(opt);
                                setProDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all border border-transparent ${
                                selectedProOpt.credits === opt.credits
                                  ? 'bg-sky-500/10 text-sky-400'
                                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              {opt.credits}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest font-sans">
                    All features in Free, plus:
                  </div>

                  <ul className="space-y-3 pt-1">
                    {[
                      `${selectedProOpt.credits.replace(" Sparks / month", " computation Sparks")}`,
                      "Lucid Spark Compilation Engine",
                      "Vibe Sandbox Live Rendering Core",
                      "Dynamic code-to-theme templates",
                      "Hardware-accelerated pixel extraction",
                      "Unlimited active sandboxes",
                      "Advance custom models & prompts",
                      "24/7 dedicated support priority",
                      "Isolated private deployment targets"
                    ].map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 font-light">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    const amount = parseInt(selectedProOpt.credits.replace(/[^0-9]/g, ''), 10) || 500;
                    setPackageCredits(amount);
                    setPlan('Pro');
                    addNotification(
                      'billing',
                      'Subscription Refill Confirmed',
                      `Successfully upgraded sandbox to Pro features. Allowance is set to ${amount} standard Sparks.`
                    );
                    onClose();
                  }}
                  className="w-full mt-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500 hover:bg-sky-450 text-black shadow-lg shadow-sky-500/10 font-sans"
                >
                  Upgrade to Pro
                </button>
              </GlowCard>

              {/* Card 3: BUSINESS */}
              <GlowCard 
                gradient="linear-gradient(137deg, #059669 0%, #3B82F6 50%, #8B5CF6 100%)"
              >
                <div className="space-y-4 flex-grow">
                  <div>
                    <h3 className="text-2xl font-heading italic text-white tracking-wide">Business</h3>
                    <p className="text-xs text-zinc-450 mt-1 h-10 leading-relaxed font-light">
                      Advanced controls and power features for growing departments.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 py-2 border-y border-zinc-900 my-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-heading italic text-white">${busCalculated}</span>
                      <span className="text-xs text-zinc-500 font-sans pl-1">/month</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-zinc-500 tracking-wider">shared with unlimited users</span>
                      
                      {/* Local Toggle */}
                      <button 
                        onClick={() => setBusAnnual(!busAnnual)}
                        className="flex items-center gap-1.5 focus:outline-none"
                      >
                        <div 
                          className="relative inline-flex h-4 w-7 cursor-pointer rounded-full transition-colors duration-200 bg-zinc-800"
                          style={{ backgroundColor: busAnnual ? '#0ea5e9' : 'rgba(255,255,255,0.08)' }}
                        >
                          <span className="inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 mt-0.5 ml-0.5" style={{ transform: busAnnual ? 'translateX(10px)' : 'translateX(0)' }} />
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400 font-sans">Annual</span>
                      </button>
                    </div>
                  </div>

                  {/* CUSTOM DROP SELECT */}
                  <div className="relative font-sans">
                    <button
                      type="button"
                      onClick={() => {
                        setBusDropdownOpen(!busDropdownOpen);
                        setProDropdownOpen(false);
                      }}
                      className="w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 rounded-full px-4 py-2 flex items-center justify-between transition-all cursor-pointer text-left focus:outline-none text-xs font-bold text-white uppercase tracking-wider"
                    >
                      <span>{selectedBusOpt.credits}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                    </button>

                    <AnimatePresence>
                      {busDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 3 }}
                          className="absolute left-0 right-0 mt-1 z-30 bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-1"
                        >
                          {creditOptions.map((opt) => (
                            <button
                              key={opt.credits}
                              onClick={() => {
                                setSelectedBusOpt(opt);
                                setBusDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all border border-transparent ${
                                selectedBusOpt.credits === opt.credits
                                  ? 'bg-sky-500/10 text-sky-400'
                                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              {opt.credits}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest font-sans">
                    All features in Pro, plus:
                  </div>

                  <ul className="space-y-3 pt-1">
                    {[
                      `${selectedBusOpt.credits.replace(" Sparks / month", " computation Sparks")}`,
                      "Internal application publishing",
                      "Single Sign-On (SSO) integration",
                      "Team workspace pipelines",
                      "Dedicated server-isolated compilation nodes",
                      "Personal projects customized"
                    ].map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 font-light">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    const amount = parseInt(selectedBusOpt.credits.replace(/[^0-9]/g, ''), 10) || 2000;
                    setPackageCredits(amount);
                    setPlan('Business');
                    addNotification(
                      'billing',
                      'Subscription Refill Confirmed',
                      `Successfully upgraded sandbox to Business features. Allowance is set to ${amount} standard Sparks.`
                    );
                    onClose();
                  }}
                  className="w-full mt-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-850 text-white font-sans"
                >
                  Upgrade to Business
                </button>
              </GlowCard>

            </div>

            {/* Bottom Enterprise scale overview */}
            <div className="border-t border-zinc-900 pt-5 mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
              <span className="flex items-center gap-1.5 align-middle text-[10px] font-sans tracking-wide uppercase">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                <span>Enterprise options or compliance requirements? <a href="#" className="text-sky-400 hover:underline inline">Talk with our architect</a></span>
              </span>
              <button 
                onClick={onClose}
                className="px-5 py-2 border border-zinc-800 hover:border-zinc-700 text-[10px] font-bold uppercase tracking-widest hover:text-white rounded-full font-sans transition-all"
              >
                Book Enterprise Demo
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
