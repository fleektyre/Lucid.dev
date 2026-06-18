import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Star, HelpCircle, ChevronDown, Sparkles, ArrowLeft } from 'lucide-react';

interface DropdownOption {
  credits: string;
  pricePro: number;
  priceBus: number;
  desc: string;
}

const creditOptions: DropdownOption[] = [
  { credits: '100 credits / month', pricePro: 25, priceBus: 50, desc: '100 monthly credits' },
  { credits: '500 credits / month', pricePro: 45, priceBus: 85, desc: '500 monthly credits' },
  { credits: '1200 credits / month', pricePro: 79, priceBus: 140, desc: '1200 monthly credits' },
  { credits: '2000 credits / month', pricePro: 109, priceBus: 199, desc: '2000 monthly credits' }
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
      className="absolute inset-0 w-full h-full rounded-[1.5rem] opacity-30 pointer-events-none filter blur-[40px] transition-all duration-700 group-hover:opacity-70 group-hover:scale-[1.05]"
      style={{ background: gradient }}
    />
    
    {/* Foreground Card with Gradient Border (No overflow-hidden to prevent clipping of badges & dropdowns) */}
    <div 
      className="relative z-10 w-full h-full rounded-[1.5rem] p-8 flex flex-col justify-between bg-black/45 border border-white/5 backdrop-blur-md hover:border-white/10 transition-all duration-500"
      style={{
        background: `linear-gradient(#050506, #020203) padding-box, ${gradient} border-box`,
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

export default function PricingPage() {
  const navigate = useNavigate();
  
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
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-body relative overflow-x-hidden pt-36 pb-24">
      {/* Background cinematic visuals & gradients */}
      <div className="absolute inset-0 bg-[#030304]" />
      <div className="absolute inset-x-0 top-0 h-[800px] bg-gradient-to-b from-sky-950/20 via-purple-950/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Ambient halos */}
      <div className="absolute top-[12%] left-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[160px] pointer-events-none" />
      <div className="absolute top-[35%] right-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[160px] pointer-events-none" />

      {/* Floating navigation and brand indicators */}
      <div className="absolute top-10 left-6 md:left-12 z-50">
        <button 
          onClick={() => navigate('/')}
          className="glass-pill rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-all border border-white/5 hover:border-white/10 hover:bg-white/5 flex items-center gap-2 pointer-events-auto cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" /> Back Home
        </button>
      </div>

      <div className="absolute top-10 right-6 md:right-12 z-50">
        <button 
          onClick={() => navigate('/auth')}
          className="glass-pill rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-all border border-white/5 hover:border-white/10 hover:bg-white/5 pointer-events-auto cursor-pointer"
        >
          Login
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* Header content section */}
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-3 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-pill rounded-full px-5 py-1.5 text-[9px] font-bold uppercase tracking-[0.3em] text-sky-400 border border-white/5 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse animate-duration-1000" /> 
            Flexible Computation Packages
          </motion.div>
          <h1 className="text-5xl sm:text-7xl font-light tracking-tight text-white mt-4 font-body focus:outline-none">
            Simple, Scalable <span className="font-heading italic font-light opacity-80">Pricing</span>
          </h1>
          <p className="text-white/40 text-lg sm:text-xl font-light leading-relaxed mt-2 italic">
            Choose your compilation bandwidth. Scale computation cycles, sandbox threads, and developer intelligence models dynamically.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch mb-24">
          
          {/* Card 1: FREE CLIENT-ONLY */}
          <GlowCard 
            gradient="linear-gradient(137deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.12) 100%)"
          >
            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-3xl font-heading italic text-white tracking-wide">Free</h3>
                <p className="text-sm text-white/45 leading-relaxed font-light mt-2 h-12">
                  Ideal for solo creators experimenting with software vibe.
                </p>
              </div>

              <div className="py-4 border-y border-white/5 flex items-baseline gap-1 my-2">
                <span className="text-5xl font-heading italic text-white font-light">$0</span>
                <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest pl-1.5">per month</span>
              </div>

              <div className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                General tier access
              </div>

              <ul className="space-y-4 pt-2">
                {[
                  "428 monthly computation credits",
                  "Standard compilation speed",
                  "Single sandbox instances",
                  "Access to community models",
                  "Standard forum support"
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-4 h-4 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 bg-white/[0.02]">
                      <Check className="w-2.5 h-2.5 text-white/60" />
                    </div>
                    <span className="text-sm text-white/60 font-light">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => navigate('/auth')}
              className="mt-10 w-full py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 cursor-pointer font-sans"
            >
              Get Started
            </button>
          </GlowCard>

          {/* Card 2: PRO PLAN */}
          <GlowCard 
            popular
            gradient="linear-gradient(137deg, #3B82F6 0%, #8B5CF6 50%, #D946EF 100%)"
          >
            <div className="space-y-6 relative flex-1">
              <div>
                <h3 className="text-3xl font-heading italic text-white tracking-wide">Pro</h3>
                <p className="text-sm text-white/45 leading-relaxed font-light mt-2 h-12">
                  Supercharged power for modern developers and rapid build cycles.
                </p>
              </div>

              {/* Individual pricing & toggle switches */}
              <div className="py-4 border-y border-white/5 flex flex-col gap-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-heading italic text-white font-light">${proCalculated}</span>
                  <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest pl-1.5">per month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/40 tracking-wider">shared across unlimited users</span>

                  {/* Local Toggle */}
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setProAnnual(!proAnnual)}
                      aria-label="Toggle annual billing for pro"
                      className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-zinc-800"
                      style={{ backgroundColor: proAnnual ? '#0ea5e9' : 'rgba(255,255,255,0.08)' }}
                    >
                      <span
                        className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        style={{ transform: proAnnual ? 'translateX(16px)' : 'translateX(0)' }}
                      />
                    </button>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">Annual</span>
                  </div>
                </div>
              </div>

              {/* CUSTOM TACTILE DROPDOWN SELECTION */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setProDropdownOpen(!proDropdownOpen);
                    setBusDropdownOpen(false);
                  }}
                  className="w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 rounded-full px-5 py-3 flex items-center justify-between transition-all group/select cursor-pointer text-left focus:outline-none font-sans"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                    {selectedProOpt.credits}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${proDropdownOpen ? 'rotate-180 text-white' : ''}`} />
                </button>

                <AnimatePresence>
                  {proDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1.5 z-30 bg-[#0A0A0C] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-1 font-sans"
                    >
                      {creditOptions.map((opt) => (
                        <button
                          key={opt.credits}
                          onClick={() => {
                            setSelectedProOpt(opt);
                            setProDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all border border-transparent ${
                            selectedProOpt.credits === opt.credits
                              ? 'bg-sky-500/10 text-sky-400 border-sky-500/15'
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {opt.credits}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                All features in Free, plus:
              </div>

              <ul className="space-y-4 pt-1">
                {[
                  `${selectedProOpt.credits.replace(" / month", " computation credits")}`,
                  "Lucid Spark Compilation Engine",
                  "Vibe Sandbox Live Rendering Core",
                  "Dynamic code-to-theme templates",
                  "Hardware-accelerated pixel extraction",
                  "Unlimited active sandboxes",
                  "Advance custom models & prompts",
                  "24/7 dedicated support priority",
                  "Isolated private deployment targets"
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-4 h-4 rounded-full border border-sky-500/20 flex items-center justify-center flex-shrink-0 bg-sky-500/5">
                      <Check className="w-2.5 h-2.5 text-sky-400" />
                    </div>
                    <span className="text-sm text-white/80 font-light">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => navigate('/auth')}
              className="mt-10 w-full py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all bg-white text-black hover:bg-white/95 shadow-[0_0_30px_rgba(255,255,255,0.15)] focus:outline-none font-bold cursor-pointer font-sans"
            >
              Upgrade
            </button>
          </GlowCard>

          {/* Card 3: BUSINESS PREMIUM PLAN */}
          <GlowCard 
            gradient="linear-gradient(137deg, #059669 0%, #3B82F6 50%, #8B5CF6 100%)"
          >
            <div className="space-y-6 relative flex-1">
              <div>
                <h3 className="text-3xl font-heading italic text-white tracking-wide">Business</h3>
                <p className="text-sm text-white/45 leading-relaxed font-light mt-2 h-12">
                  Advanced controls and power features for growing departments.
                </p>
              </div>

              {/* Pricing & Toggle */}
              <div className="py-4 border-y border-white/5 flex flex-col gap-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-heading italic text-white font-light">${busCalculated}</span>
                  <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest pl-1.5">per month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/40 tracking-wider">shared across unlimited users</span>

                  {/* Local Toggle */}
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setBusAnnual(!busAnnual)}
                      aria-label="Toggle annual billing for business"
                      className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-zinc-800"
                      style={{ backgroundColor: busAnnual ? '#0ea5e9' : 'rgba(255,255,255,0.08)' }}
                    >
                      <span
                        className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        style={{ transform: busAnnual ? 'translateX(16px)' : 'translateX(0)' }}
                      />
                    </button>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">Annual</span>
                  </div>
                </div>
              </div>

              {/* CUSTOM DROPDOWN INPUT */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setBusDropdownOpen(!busDropdownOpen);
                    setProDropdownOpen(false);
                  }}
                  className="w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 rounded-full px-5 py-3 flex items-center justify-between transition-all group/select cursor-pointer text-left focus:outline-none font-sans"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                    {selectedBusOpt.credits}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${busDropdownOpen ? 'rotate-180 text-white' : ''}`} />
                </button>

                <AnimatePresence>
                  {busDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1.5 z-30 bg-[#0A0A0C] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-1 font-sans"
                    >
                      {creditOptions.map((opt) => (
                        <button
                          key={opt.credits}
                          onClick={() => {
                            setSelectedBusOpt(opt);
                            setBusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all border border-transparent ${
                            selectedBusOpt.credits === opt.credits
                              ? 'bg-sky-500/10 text-sky-400 border-sky-500/15'
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {opt.credits}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                All features in Pro, plus:
              </div>

              <ul className="space-y-4 pt-1 flex-1">
                {[
                  `${selectedBusOpt.credits.replace(" / month", " computation credits")}`,
                  "Internal application publishing",
                  "Single Sign-On (SSO) integration",
                  "Consolidated team workspace pipelines",
                  "Dedicated server-isolated compilation nodes",
                  "Personal projects and customized styles"
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-4 h-4 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 bg-white/[0.02]">
                      <Check className="w-2.5 h-2.5 text-white/80" />
                    </div>
                    <span className="text-sm text-white/80 font-light">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => navigate('/auth')}
              className="mt-10 w-full py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-white focus:outline-none font-bold cursor-pointer font-sans"
            >
              Upgrade
            </button>
          </GlowCard>

        </div>

        {/* ENTERPRISE SCALE HIGHLIGHT OVERVIEW BANNER */}
        <div className="w-full glass-card p-10 rounded-[1.5rem] border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 mb-24">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none animate-pulse" />
          
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 font-sans">Enterprise Scale Pack</span>
            </div>
            <h3 className="text-3xl font-heading italic text-white leading-tight">Enterprise Scale</h3>
            <p className="text-sm text-white/40 leading-relaxed font-light">
              Uncapped pipelines, absolute safety, and custom models for teams. Built for large organizations needing flexibility, supreme scale, and robust governance. Enjoy dedicated support, custom fine-tuning, SAML Single Sign-On (SSO), and direct access to system core APIs.
            </p>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            <div className="text-left md:text-right pb-1">
              <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest block font-sans">Enterprise Access</span>
              <span className="text-[28px] font-heading italic text-white leading-none">Custom scale</span>
              <span className="text-white/40 text-[10px] block font-sans mt-1">SLA guarantees & dedicated servers</span>
            </div>
            <button 
              onClick={() => navigate('/auth')}
              className="px-8 py-3.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full transition-all hover:bg-white/90 cursor-pointer font-sans"
            >
              Book a Demo
            </button>
          </div>
        </div>

        {/* BOTTOM NOTES */}
        <div className="text-center pt-8 border-t border-white/5 text-[10px] text-zinc-500 flex items-center justify-center gap-1.5 w-full font-sans tracking-wider uppercase mb-16">
          <HelpCircle className="w-3.5 h-3.5 text-zinc-600" />
          <span>Have compliance or custom sandbox compilation needs? <a href="#" className="text-sky-400 hover:underline">Speak to our architect</a></span>
        </div>

      </div>

      {/* FOOTER SYSTEM FROM LANDING PAGE */}
      <Footer />
    </div>
  );
}

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#040405] pt-32 pb-10 border-t border-white/5 relative z-10 w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-6">
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
                      if (item === 'Home') navigate('/');
                      else if (item === 'Features') navigate('/#features-section');
                      else if (item === 'Vibe Builder') navigate('/studio');
                      else if (item === 'Pricing') navigate('/pricing');
                    }}
                    className="text-white/40 hover:text-white transition-colors text-sm font-light italic cursor-pointer text-left"
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
                    onClick={() => {
                      if (item === 'Dashboard') navigate('/auth');
                      else navigate('/');
                    }}
                    className="text-white/40 hover:text-white transition-colors text-sm font-light italic cursor-pointer text-left"
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
              <button className="bg-white text-black px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all active:scale-95 shadow-2xl cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 font-sans">
            All rights reserved. © 2026 LUCID ARCHITECTURE
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 italic font-sans">
            Designed by <span className="text-white/40">Peter Design</span> — Built by <span className="text-white/40">Lucid AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
