import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDocFromServer } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../../lib/firebase/client';
import { StudioBackground } from '../components/StudioBackground';
import { CelestialHorizon } from '../components/CelestialHorizon';
import { Sidebar } from '../layout/Sidebar';
import { TopNav } from '../layout/TopNav';
import { AIPanel } from '../panels/AIPanel';
import { AllAppsView } from '../components/AllAppsView';
import { VibeIDEView } from '../components/VibeIDEView';
import { SettingsModal } from '../components/SettingsModal';
import { useStudioStore } from '../store/useStudioStore';
import { PricingModal } from '../components/PricingModal';
import { OnboardingModal } from '../components/OnboardingModal';
import { CreateAppModal } from '../components/CreateAppModal';

const StudioWorkspace: React.FC = () => {
  const { 
    isSidebarExpanded, 
    showPricingModal, 
    setShowPricingModal, 
    showOnboardingModal, 
    setShowOnboardingModal, 
    showSettingsModal,
    setShowSettingsModal,
    showCreateAppModal,
    setShowCreateAppModal,
    currentView 
  } = useStudioStore();

  const [isMd, setIsMd] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);

  useEffect(() => {
    let active = true;
    
    // Listen to the auth state change to wait for Firebase to restore the session in the background
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!active) return;
      
      const startTime = Date.now();
      try {
        if (!user) {
          // If no user session is found, sign in anonymously as fallback
          await signInAnonymously(auth);
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn("Firebase connection warning (client offline): Please check your Firebase configuration or network connectivity.");
        }
      } finally {
        if (active) {
          setIsFirebaseLoading(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMd(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Safely trigger the onboarding modal on the client side after initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('lucid_onboarding_seen_v2');
      if (seen !== 'true') {
        setShowOnboardingModal(true);
      }
    }
  }, [setShowOnboardingModal]);

  // Direct fullscreen override for the interactive Vibe IDE workspace
  if (currentView === 'vibe') {
    return <VibeIDEView isLoading={isFirebaseLoading} />;
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#060813] via-[#040406] to-[#020204] text-white overflow-hidden selection:bg-emerald-500/20 selection:text-white font-sans font-normal">
      {/* Top cosmic ambient light to blend any dark sections seamlessly */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[350px] rounded-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08)_0%,transparent_70%)] blur-[80px] pointer-events-none z-0" />

      {/* Floating Layout Layer */}
      <Sidebar isLoading={isFirebaseLoading} />
      <TopNav isLoading={isFirebaseLoading} />
      
      {/* Decorative Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/85 to-transparent" />
      </div>

      {/* Main Content Workspace with smooth dynamic sidebar padding shift */}
      <motion.main 
        animate={{ 
          paddingLeft: isSidebarExpanded && isMd ? 260 : 0
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="relative z-10 pr-0 pb-16 min-h-screen flex flex-col items-center justify-start pt-32"
      >
        
        {/* BACKGROUND WORKSPACE GRID AND FRAMING CONTAINER */}
        <div className="relative w-full mx-auto py-10 px-4 transition-all duration-300 max-w-[1000px] flex flex-col items-center">
          
          {/* Centralized AI chat primary interface */}
          <div className="relative z-10 w-full flex flex-col items-center">
            {currentView === 'all_apps' ? (
              <AllAppsView isLoading={isFirebaseLoading} />
            ) : (
              <AIPanel isLoading={isFirebaseLoading} />
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

      {/* Modern interactive Settings Overlay */}
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />

      {/* Modern interactive Pricing Overlay */}
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />

      {/* Modern interactive Onboarding Flow Overlay */}
      <OnboardingModal isOpen={showOnboardingModal} onClose={() => setShowOnboardingModal(false)} />

      {/* Premium custom Create App Modal */}
      <CreateAppModal isOpen={showCreateAppModal} onClose={() => setShowCreateAppModal(false)} />
    </div>
  );
};

export default StudioWorkspace;
