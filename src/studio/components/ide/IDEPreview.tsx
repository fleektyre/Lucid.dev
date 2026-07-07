import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, Smartphone, ChevronDown, RotateCw, ExternalLink, ArrowRight, Terminal, Sparkles
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';

interface IDEPreviewProps {
  activePreviewDevice: 'desktop' | 'mobile';
  setActivePreviewDevice: (device: 'desktop' | 'mobile') => void;
  previewTheme: 'light' | 'dark' | 'glass' | 'cosmic';
  previewHeadline: string;
  showFeatureBadge: boolean;
  badgeText: string;
  primaryButtonColor: 'black' | 'emerald' | 'indigo' | 'purple';
  showSecondaryCard: boolean;
  playChime: () => void;
}

export const IDEPreview: React.FC<IDEPreviewProps> = ({
  activePreviewDevice,
  setActivePreviewDevice,
  previewTheme,
  previewHeadline,
  showFeatureBadge,
  badgeText,
  primaryButtonColor,
  showSecondaryCard,
  playChime
}) => {
  const [mobileSubDevice, setMobileSubDevice] = useState<'phone' | 'tablet_portrait' | 'tablet_landscape'>('phone');
  const { setShowPricingModal } = useStudioStore();

  return (
    <section id="ide-preview" className="w-[45%] bg-[#08080c] flex flex-col h-full shrink-0">
      
      {/* Browser Mockup Toolbar Header */}
      <header className="h-[52px] border-b border-white/[0.04] px-4 flex items-center justify-between select-none shrink-0 bg-[#060608]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-white">Preview</span>
          
          {/* Viewport switch icons */}
          <div className="flex items-center bg-zinc-900/60 p-0.5 border border-white/[0.03] rounded-lg">
            <button 
              onClick={() => setActivePreviewDevice('desktop')}
              className={`p-1 rounded-md transition-all focus:outline-none cursor-pointer ${activePreviewDevice === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Desktop view"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setActivePreviewDevice('mobile')}
              className={`p-1 rounded-md transition-all focus:outline-none cursor-pointer ${activePreviewDevice === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Mobile views"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile sub-devices menu matching screenshot exactly */}
          {activePreviewDevice === 'mobile' && (
            <div className="flex items-center bg-zinc-900/40 p-0.5 border border-white/[0.03] rounded-lg gap-0.5">
              {(['phone', 'tablet_portrait', 'tablet_landscape'] as const).map((subDev) => {
                const isActive = mobileSubDevice === subDev;
                const labels = {
                  phone: 'Phone',
                  tablet_portrait: 'Tablet (Portrait)',
                  tablet_landscape: 'Tablet (Landscape)'
                };
                return (
                  <button
                    key={subDev}
                    onClick={() => setMobileSubDevice(subDev)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all focus:outline-none cursor-pointer ${
                      isActive 
                        ? 'bg-white text-black font-extrabold shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {labels[subDev]}
                  </button>
                );
              })}
            </div>
          )}

          {/* Codebase Logo element close to the desktop / mobile show toggles */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/[0.04] rounded-lg select-none">
            <Terminal className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-[10px] font-bold text-white/95 font-sans tracking-tight">Codebase</span>
          </div>
        </div>

        {/* Version, Publish, Dev Machine indicator */}
        <div className="flex items-center gap-3">
          
          {/* Version dropdown */}
          <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-white/[0.04] px-2 py-1 rounded-lg">
            <span>v1</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </div>

          {/* Publish button */}
          <button 
            onClick={() => {
              playChime();
              alert("Site deployed live to production! Point domains at custom SSL.");
            }}
            className="bg-white hover:bg-zinc-200 text-black text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all focus:outline-none cursor-pointer"
          >
            Publish
          </button>

          {/* Dev machine online status */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-zinc-500 font-medium">Dev Machine</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

        </div>
      </header>

      {/* Address URL inputs bar */}
      <div className="p-2 border-b border-white/[0.04] bg-[#050507] flex items-center justify-between gap-3 select-none shrink-0">
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-white/5 rounded text-zinc-500 hover:text-white transition-all focus:outline-none cursor-pointer" title="Reload browser">
            <RotateCw className="w-3 h-3" />
          </button>
        </div>
        
        <div className="flex-1 max-w-lg bg-zinc-950 border border-white/[0.03] rounded-lg px-3 py-1 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>/</span>
          <ExternalLink className="w-3 h-3 text-zinc-600 hover:text-zinc-300 cursor-pointer" />
        </div>
      </div>

      {/* Browser Stage Window frame wrapper */}
      <div className="flex-1 bg-zinc-950/60 p-4 overflow-y-auto no-scrollbar flex items-start justify-center">
        
        {/* DEVICE SIMULATOR WIDTH SWITCHER */}
        <div className={`transition-all duration-300 w-full ${
          activePreviewDevice === 'mobile' 
            ? mobileSubDevice === 'phone' ? 'max-w-[340px] aspect-[9/16] my-6 border-8 border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden'
              : mobileSubDevice === 'tablet_portrait' ? 'max-w-[560px] aspect-[3/4] my-6 border-8 border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden'
              : 'max-w-[760px] aspect-[4/3] my-6 border-8 border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden'
            : 'w-full'
        }`}>
          
          {/* LIVE PREVIEW CANVAS (Interactive Apex landing page) */}
          <div className={`w-full min-h-[500px] bg-white text-zinc-800 transition-all duration-500 relative flex flex-col p-5 select-none ${
            previewTheme === 'dark' ? 'bg-[#0a0c10] text-zinc-200' :
            previewTheme === 'cosmic' ? 'bg-gradient-to-br from-[#0c051a] to-[#04020a] text-purple-100 border border-purple-500/10' :
            previewTheme === 'glass' ? 'bg-zinc-900 text-zinc-200 backdrop-blur-md border border-white/5' :
            'bg-[#fafafc] text-zinc-900 border border-black/5'
          }`}>
            
            {/* Optional Background visual glow elements for Cosmic theme */}
            {previewTheme === 'cosmic' && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12)_0,transparent_75%)] pointer-events-none" />
            )}

            {/* Apex Website Landing Page Navigation */}
            <nav className="flex items-center justify-between pb-4 border-b border-zinc-100/60 transition-colors relative z-10"
              style={{ borderColor: previewTheme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-1">
                <span className={`text-sm font-black tracking-tight ${previewTheme === 'light' ? 'text-black' : 'text-white'}`}>Apex</span>
              </div>
              
              {/* Horizontal navigation menu (Hidden on mobile simulator viewport) */}
              {activePreviewDevice !== 'mobile' && (
                <div className="flex items-center gap-3 text-[10px] font-semibold text-zinc-500">
                  <span className="hover:text-black cursor-pointer">Product</span>
                  <span className="hover:text-black cursor-pointer">Features</span>
                  <span className="hover:text-black cursor-pointer">Pricing</span>
                  <span className="hover:text-black cursor-pointer">About</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {activePreviewDevice === 'mobile' && (
                  <button 
                    onClick={() => setShowPricingModal(true)}
                    className="text-[9px] font-extrabold px-2.5 py-1 bg-[#6366f1]/15 hover:bg-[#6366f1]/25 text-indigo-400 border border-[#6366f1]/30 rounded-full transition-all flex items-center gap-1 cursor-pointer font-sans"
                  >
                    <Sparkles className="w-2.5 h-2.5 fill-indigo-400/20 text-indigo-400" />
                    <span>UPGRADE</span>
                  </button>
                )}
                <span className="text-[9px] text-zinc-500 hover:text-black cursor-pointer font-bold">Sign in</span>
                <button className="text-[9px] font-bold px-2.5 py-1 bg-black text-white hover:bg-zinc-800 rounded-lg transition-all"
                  style={{ 
                    backgroundColor: previewTheme === 'light' ? '#000000' : '#ffffff',
                    color: previewTheme === 'light' ? '#ffffff' : '#000000'
                  }}
                >
                  Get started
                </button>
              </div>
            </nav>

            {/* Hero Banner Grid section */}
            <div className="flex-1 flex flex-col justify-center text-center items-center py-10 px-2 relative z-10">
              
              {/* Responsive beta badge capsule */}
              {showFeatureBadge && (
                <motion.span 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider uppercase inline-block border ${
                    previewTheme === 'light' ? 'bg-zinc-100 text-zinc-500 border-zinc-200' : 'bg-white/5 text-zinc-300 border-white/10'
                  }`}
                >
                  {badgeText}
                </motion.span>
              )}

              {/* Main Headline banner */}
              <h1 className={`text-2xl md:text-3xl font-heading italic font-normal tracking-tight leading-tight mt-4 max-w-[320px] ${
                previewTheme === 'light' ? 'text-black' : 'text-white'
              }`}>
                {previewHeadline}
              </h1>

              {/* Subtitle description */}
              <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-3.5 leading-relaxed">
                Connect your team workspaces, streamline visual state management, and build glass cards inside standard browser sandboxes.
              </p>

              {/* Multi-action CTA layout */}
              <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
                <button 
                  className={`text-[10px] font-extrabold px-4 py-2 rounded-full transition-all flex items-center gap-1 hover:scale-105 cursor-pointer ${
                    primaryButtonColor === 'emerald' ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.3)]' :
                    primaryButtonColor === 'indigo' ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.3)]' :
                    primaryButtonColor === 'purple' ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.3)]' :
                    previewTheme === 'light' ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button className={`text-[10px] font-semibold px-4 py-2 rounded-full border transition-all hover:bg-white/5 cursor-pointer ${
                  previewTheme === 'light' ? 'border-zinc-200 text-zinc-700' : 'border-white/10 text-zinc-300'
                }`}>
                  Book a demo
                </button>
              </div>

              {/* SECONDARY PREVIEW BENTO Grid section if enabled visually */}
              {showSecondaryCard && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-8 p-3.5 border rounded-2xl w-full max-w-[280px] text-left transition-all relative overflow-hidden ${
                    previewTheme === 'light' 
                      ? 'bg-zinc-50/50 border-zinc-200 text-zinc-800' 
                      : 'bg-zinc-900/40 border-white/[0.04] text-white/90'
                  }`}
                >
                  <p className="text-[9px] uppercase tracking-wider font-extrabold text-zinc-500">Live Compute Power</p>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-xl font-bold tracking-tight">842</span>
                    <span className="text-[10px] text-emerald-500 font-bold">ms compile</span>
                  </div>
                  <div className="w-full bg-zinc-200/50 h-1 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[84%]" />
                  </div>
                </motion.div>
              )}

            </div>

            {/* Simulated browser footer badge */}
            <footer className="pt-4 border-t border-zinc-100/40 mt-10 text-[9px] text-zinc-400 flex items-center justify-between select-none relative z-10"
              style={{ borderColor: previewTheme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}
            >
              <span>Powered by lucid.dev</span>
              <span>All rights reserved 2026</span>
            </footer>

          </div>

        </div>

      </div>

    </section>
  );
};
