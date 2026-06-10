import React from 'react';
import { motion } from 'framer-motion';
import { StudioBackground } from '../components/StudioBackground';
import { Sidebar } from '../layout/Sidebar';
import { TopNav } from '../layout/TopNav';
import { AIPanel } from '../panels/AIPanel';
import { PreviewCards } from '../panels/PreviewCards';

const StudioWorkspace: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white overflow-hidden selection:bg-accent/30 selection:text-white">
      {/* Cinematic Studio Background */}
      <StudioBackground src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064209_0cb7d815-ff61-4caa-a6d5-bbff145ab272.mp4" />

      {/* Floating Layout Layer */}
      <Sidebar />
      <TopNav />
      
      {/* Decorative Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Main Content Workspace */}
      <main className="relative z-10 pt-32 pl-[116px] pr-6 pb-6 min-h-screen flex flex-col items-center">
        <div className="w-full max-w-[1200px] flex flex-col items-center pt-20">
          <AIPanel />
        </div>
      </main>

      {/* Floating Preview Panels */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <PreviewCards />
      </div>

      {/* Cinematic Noise Texture */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.02] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-50">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Bottom Floating Terminal Indicator */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 px-6 py-2 rounded-full z-40">
        <div className="flex gap-1.5">
          {[1,2,3].map(i => <div key={i} className="w-1 h-3 rounded-full bg-accent/40" />)}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Studio Session Verified</span>
        <div className="h-4 w-px bg-white/10" />
        <span className="text-[9px] font-mono text-accent">0x7F4...A2</span>
      </div>
    </div>
  );
};

export default StudioWorkspace;
