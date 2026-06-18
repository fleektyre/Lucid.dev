import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StudioBackground } from '../components/StudioBackground';
import { CelestialHorizon } from '../components/CelestialHorizon';
import { Sidebar } from '../layout/Sidebar';
import { TopNav } from '../layout/TopNav';
import { AIPanel } from '../panels/AIPanel';
import { SettingsView } from './SettingsView';
import { useStudioStore } from '../store/useStudioStore';
import { PricingModal } from '../components/PricingModal';

const StudioWorkspace: React.FC = () => {
  const { isSidebarExpanded, showPricingModal, setShowPricingModal, currentView } = useStudioStore();

  const [isMd, setIsMd] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  useEffect(() => {
    const handleResize = () => {
      setIsMd(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white overflow-hidden selection:bg-emerald-500/20 selection:text-white font-sans font-normal">
      {/* Cinematic Studio Background - Atmosphere MP4 */}
      <StudioBackground src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4" />

      {/* Blue planet-edge curved lighting arc */}
      <CelestialHorizon />

      {/* Floating Layout Layer */}
      {currentView !== 'settings' && (
        <>
          <Sidebar />
          <TopNav />
        </>
      )}
      
      {/* Decorative Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/85 to-transparent" />
      </div>

      {/* Main Content Workspace with smooth dynamic sidebar padding shift */}
      <motion.main 
        animate={{ 
          paddingLeft: currentView === 'settings' ? 0 : (isSidebarExpanded && isMd ? 260 : 0)
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className={`relative z-10 pr-0 pb-16 min-h-screen flex flex-col items-center justify-start ${
          currentView === 'settings' ? 'pt-8 w-full' : 'pt-32'
        }`}
      >
        
        {/* BACKGROUND WORKSPACE GRID AND FRAMING CONTAINER */}
        <div className={`relative w-full mx-auto py-10 px-4 transition-all duration-300 ${
          currentView === 'settings' ? 'max-w-[1500px]' : 'max-w-[1000px] flex flex-col items-center'
        }`}>
          
          {/* Centralized AI chat primary interface or high-fidelity settings tab */}
          <div className="relative z-10 w-full flex flex-col items-center">
            {currentView === 'settings' ? (
              <SettingsView />
            ) : (
              <AIPanel />
            )}
          </div>
        </div>
      </motion.main>

      {/* Floating Preview Panels removed as requested */}

      {/* Cinematic Noise Texture */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.015] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-50">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Modern interactive Pricing Overlay */}
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
    </div>
  );
};

export default StudioWorkspace;
