import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, Plus, Sparkles, LogOut, User, Layout, 
  CreditCard, PanelLeftClose, PanelLeft
} from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';
import { useNavigate } from 'react-router-dom';

export const TopNav: React.FC = () => {
  const { 
    user, 
    currentProject, 
    isSidebarExpanded, 
    toggleSidebar, 
    setShowPricingModal,
    showSettingsModal,
    setShowSettingsModal,
    setActiveSettingsTab
  } = useStudioStore();

  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [isMd, setIsMd] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  useEffect(() => {
    const handleResize = () => {
      setIsMd(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        left: isSidebarExpanded && isMd ? 260 : 0
      }}
      transition={{ 
        left: { type: 'spring', damping: 28, stiffness: 220 },
        y: { duration: 0.3 }
      }}
      className="fixed top-0 right-0 h-20 bg-black/30 border-b border-white/[0.06] backdrop-blur-md z-40 px-6 xl:px-8 flex items-center justify-between"
    >
      {/* LEFT: Sidebar Toggle & Workspace Name */}
      <div className="flex items-center gap-5">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-all cursor-pointer focus:outline-none flex items-center justify-center border border-white/5"
          title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isSidebarExpanded ? (
            <PanelLeftClose className="w-4 h-4 text-white/85" />
          ) : (
            <PanelLeft className="w-4 h-4 text-white/70" />
          )}
        </button>

        {/* Workspace Selector without Status Pill */}
        <div className="relative">
          <button 
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-bold font-schibsted">WORKSPACE</span>
              <span className="text-sm font-semibold tracking-wide text-white flex items-center gap-1.5 font-schibsted mt-0.5">
                {currentProject.name}
                <ChevronDown className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-y-0.5 transition-all" />
              </span>
            </div>
          </button>

          <AnimatePresence>
            {showWorkspaceMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowWorkspaceMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 mt-3 w-64 bg-zinc-950/95 border border-white/10 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-xl"
                >
                  <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-white/30 font-bold font-schibsted border-b border-white/5 mb-1.5">
                    Your Workspaces
                  </div>
                  <button className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm font-medium transition-all text-white flex items-center justify-between">
                    <span>{currentProject.name}</span>
                    <span className="text-[8px] bg-white/10 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Active</span>
                  </button>
                  <button className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm font-medium transition-all text-white/40 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Create New Project</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CENTER: Navigation Links */}
      <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-medium text-white/60">
      </div>

      {/* RIGHT: Upgrade & Credits & User Settings */}
      <div className="flex items-center gap-4 xl:gap-5">
        {/* Upgrade Button */}
        <button 
          onClick={() => setShowPricingModal(true)}
          className="bg-white hover:bg-white/90 text-black px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          UPGRADE
        </button>

        {/* Sparks Capsule */}
        <div className="flex items-center gap-3 px-4 py-2 bg-zinc-950/40 border border-white/[0.08] rounded-full backdrop-blur-xl shadow-inner">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-extrabold text-white tracking-wider font-schibsted">
              {user.credits} / {user.maxCredits}
            </span>
            <span className="text-[7.5px] font-semibold text-white/30 uppercase tracking-[0.15em] font-fustat leading-none mt-0.5">
              SPARKS REMAINING
            </span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        </div>

        {/* User Avatar & Settings Trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-full border border-white/15 overflow-hidden p-0.5 bg-zinc-950/50 cursor-pointer"
            >
              <img 
                src={user.avatarUrl} 
                alt={user.name}
                className="w-full h-full object-cover rounded-full"
              />
            </motion.div>
          </button>

          <AnimatePresence>
            {showSettings && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-zinc-950/95 border border-white/10 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-xl"
                >
                  <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                    <p className="text-xs font-semibold text-white">{user.name}</p>
                    <p className="text-[10px] text-white/40 truncate">{user.email}</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setShowSettings(false);
                      setShowSettingsModal(true);
                      setActiveSettingsTab('profile');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-xs text-white/70 flex items-center gap-2.5 transition-all cursor-pointer border-none bg-transparent"
                  >
                    <User className="w-4 h-4 text-white/40" />
                    <span>My Profile</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowSettings(false);
                      setShowSettingsModal(true);
                      setActiveSettingsTab('general');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-xs text-white/70 flex items-center gap-2.5 transition-all cursor-pointer border-none bg-transparent"
                  >
                    <Layout className="w-4 h-4 text-white/40" />
                    <span>Manage Workspace</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowSettings(false);
                      setShowSettingsModal(true);
                      setActiveSettingsTab('subscription');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-xs text-white/70 flex items-center gap-2.5 transition-all cursor-pointer border-none bg-transparent"
                  >
                    <CreditCard className="w-4 h-4 text-white/40" />
                    <span>Billing & Credits</span>
                  </button>
                  
                  <div className="h-px bg-white/5 my-1.5" />
                  
                  <button 
                    onClick={() => navigate('/')} 
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-500/10 text-xs text-red-400 flex items-center gap-2.5 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Exit Studio</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};
