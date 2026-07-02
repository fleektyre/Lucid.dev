import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  LayoutGrid, 
  Plug, 
  ChevronDown, 
  ChevronsUpDown, 
  Settings, 
  LogOut, 
  Plus, 
  MessageSquare, 
  Check, 
  UserPlus 
} from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';
import { useNavigate } from 'react-router-dom';
import { LucidLogo } from '../../components/LucidLogo';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    isSidebarExpanded, 
    currentView,
    setCurrentView,
    setActiveSettingsTab,
    addNotification
  } = useStudioStore();

  const [activeItem, setActiveItem] = useState<'home' | 'all_apps' | 'integrations'>('home');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAppDropdown, setShowAppDropdown] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(true);
  const [feedbackNotification, setFeedbackNotification] = useState<string | null>(null);

  // Custom action triggers for inline feedback
  const handleCreateNewApp = () => {
    addNotification(
      'info',
      'App Synthesis Started',
      'Initializing a fresh sandboxed application blueprint in your workspace environment.'
    );
    showToastFeedback('Creating new app layout...');
  };

  const handleSelectAppClick = () => {
    showToastFeedback('Loading workspace apps roster...');
  };

  const handleInviteClick = () => {
    addNotification(
      'info',
      'Invite Link Copied',
      'An invitation link has been copied to your clipboard. Send it to your team members.'
    );
    showToastFeedback('Invite link copied!');
    setShowProfileDropdown(false);
  };

  const handleSupportClick = () => {
    addNotification(
      'info',
      'Support Center',
      'Connecting to the Lucid support center. A staff member will assist you shortly.'
    );
    showToastFeedback('Opening support panel...');
  };

  const handleSettingsClick = () => {
    setCurrentView('settings');
    setActiveSettingsTab('general');
  };

  const showToastFeedback = (message: string) => {
    setFeedbackNotification(message);
    setTimeout(() => {
      setFeedbackNotification(null);
    }, 3000);
  };

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: isSidebarExpanded ? 0 : -260 }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="fixed left-0 top-0 bottom-0 w-[260px] bg-[#070709]/75 border-r border-white/[0.06] backdrop-blur-xl z-50 flex flex-col justify-between p-5 select-none text-white/90 font-body"
    >
      {/* Top Section */}
      <div className="flex flex-col gap-4">
        
        {/* Logo Section */}
        <div className="pb-2 border-b border-white/[0.04] flex justify-start">
          <LucidLogo />
        </div>
        
        {/* Create New App Pill Button (CTA) */}
        <div className="pt-2">
          <button
            onClick={handleCreateNewApp}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.5)] focus:outline-none border border-white/10"
          >
            <Plus className="w-4 h-4 text-white shrink-0" />
            <span className="font-sans tracking-wide">Create new app</span>
          </button>
        </div>

        {/* Select An App Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAppDropdown(!showAppDropdown)}
            className="w-full bg-zinc-900/60 hover:bg-zinc-900/95 border border-white/[0.08] hover:border-white/15 rounded-xl px-4 py-2.5 text-xs text-white/85 flex items-center justify-between font-medium transition-all cursor-pointer shadow-sm select-none focus:outline-none"
          >
            <span className="font-sans truncate max-w-[150px]">
              {selectedApp || "Select an app"}
            </span>
            <ChevronsUpDown className="w-3.5 h-3.5 text-white/40 shrink-0 transition-colors" />
          </button>

          <AnimatePresence>
            {showAppDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAppDropdown(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-[#0c0c0e]/95 border border-white/[0.08] rounded-xl p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.5)] z-50 flex flex-col gap-0.5 text-white/90 backdrop-blur-xl"
                >
                  {[
                    "Black & White Launch",
                    "SaaS Analytics Hub",
                    "Celestial Vibe Portal"
                  ].map((appName) => (
                    <button
                      key={appName}
                      onClick={() => {
                        setSelectedApp(appName);
                        setShowAppDropdown(false);
                        addNotification(
                          'info',
                          'Workspace App Selected',
                          `Successfully switched current workspace view to active node context: "${appName}"`
                        );
                        showToastFeedback(`Switched to: ${appName}`);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{appName}</span>
                      {selectedApp === appName && (
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
                  
                  <div className="h-px bg-white/5 my-1" />
                  
                  <button
                    onClick={() => {
                      setShowAppDropdown(false);
                      handleCreateNewApp();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-xs font-bold text-blue-400 hover:text-blue-300 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-400" />
                    <span>Create new app</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Primary Menu Navigation List */}
        <div className="flex flex-col gap-1 mt-2">
          {/* Home */}
          <button
            onClick={() => {
              setActiveItem('home');
              setCurrentView('chat');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none 
              ${activeItem === 'home' && currentView === 'chat'
                ? 'bg-white/10 text-white border border-white/[0.05] shadow-sm' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <Home className="w-4 h-4 shrink-0 text-white/60" />
            <span className="flex-1 text-left font-sans font-medium">Home</span>
          </button>

          {/* All Apps */}
          <button
            onClick={() => {
              setActiveItem('all_apps');
              showToastFeedback('Viewing all applications...');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none 
              ${activeItem === 'all_apps'
                ? 'bg-white/10 text-white border border-white/[0.05] shadow-sm' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <LayoutGrid className="w-4 h-4 shrink-0 text-white/60" />
            <span className="flex-1 text-left font-sans font-medium">All Apps</span>
          </button>

          {/* Integrations with New Badge */}
          <button
            onClick={() => {
              setActiveItem('integrations');
              setCurrentView('settings');
              setActiveSettingsTab('connectors');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none 
              ${activeItem === 'integrations' && currentView === 'settings'
                ? 'bg-white/10 text-white border border-white/[0.05] shadow-sm' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <Plug className="w-4 h-4 shrink-0 text-white/60" />
            <span className="text-left font-sans font-medium">Integrations</span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] rounded-md font-semibold px-1.5 py-0.5 ml-auto">
              New
            </span>
          </button>
        </div>

        {/* Favorites Header and List */}
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="flex items-center justify-between text-white/40 hover:text-white/70 font-extrabold uppercase tracking-widest text-[10px] font-sans mt-4 px-3 select-none focus:outline-none w-full text-left"
          >
            <span>Favorites</span>
            <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${showFavorites ? '' : '-rotate-90'}`} />
          </button>
          
          <AnimatePresence>
            {showFavorites && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="text-white/40 text-xs font-normal pl-3 pt-1 font-sans">
                  No favorites
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-5 mt-6 pt-2">
        
        {/* Support and settings links */}
        <div className="flex flex-col gap-2">
          {/* Support & feedback */}
          <button
            onClick={handleSupportClick}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer focus:outline-none"
          >
            <MessageSquare className="w-4 h-4 text-white/60 shrink-0" />
            <span className="font-sans">Support & feedback</span>
          </button>

          {/* Settings */}
          <button
            onClick={handleSettingsClick}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer focus:outline-none"
          >
            <Settings className="w-4 h-4 text-white/60 shrink-0" />
            <span className="font-sans">Settings</span>
          </button>
        </div>

        {/* Organization label and profile dropdown */}
        <div className="flex flex-col gap-1.5 border-t border-white/[0.06] pt-4">
          <div className="text-white/40 font-extrabold uppercase tracking-widest text-[10px] font-sans px-3 select-none">
            Organization
          </div>

          <div className="relative mt-1">
            {/* Custom N Nwuba Joshua dropdown switcher */}
            <div
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-full flex items-center justify-between p-2 bg-zinc-950/40 hover:bg-zinc-950/80 border border-white/[0.06] rounded-[14px] transition-all cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 text-white/90 text-xs font-bold flex items-center justify-center shrink-0 border border-white/5">
                  N
                </div>
                <span className="text-xs text-white/90 font-bold truncate leading-none">
                  Nwuba Joshua
                </span>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-white/40 shrink-0" />
            </div>

            {/* Premium dropdown list matching second screenshot */}
            <AnimatePresence>
              {showProfileDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute bottom-[54px] left-0 right-0 bg-[#0B0B0C] border border-white/[0.08] rounded-[20px] p-4.5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-50 flex flex-col gap-3.5 text-white/90"
                  >
                    {/* Account Info card */}
                    <div className="flex items-center gap-3 pb-1">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 text-white text-sm font-extrabold flex items-center justify-center shrink-0">
                        N
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-black text-white leading-none">Nwuba Joshua</span>
                        <span className="text-[10px] text-white/40 font-semibold leading-none mt-1.5">1 member</span>
                      </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => {
                          setCurrentView('settings');
                          setActiveSettingsTab('general');
                          setShowProfileDropdown(false);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-white/90 rounded-full text-[11px] font-bold transition-all cursor-pointer focus:outline-none"
                      >
                        <Settings className="w-3.5 h-3.5 text-white/50" />
                        <span>Settings</span>
                      </button>
                      
                      <button
                        onClick={handleInviteClick}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-white/90 rounded-full text-[11px] font-bold transition-all cursor-pointer focus:outline-none"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-white/50" />
                        <span>Invite</span>
                      </button>
                    </div>

                    {/* Separator */}
                    <div className="h-px bg-white/5 w-full" />

                    {/* Workspaces list */}
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-[10px] text-white/40 font-mono tracking-wide px-1">
                        {user.email}
                      </span>
                      
                      <div className="flex items-center justify-between p-2 bg-white/5 border border-white/[0.06] rounded-xl mt-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-zinc-800 text-white/90 text-[10px] font-bold flex items-center justify-center shrink-0 border border-white/5">
                            N
                          </div>
                          <span className="text-xs text-white/90 font-bold truncate leading-none">
                            Nwuba Joshua
                          </span>
                        </div>
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="h-px bg-white/5 w-full" />

                    {/* Logout Option */}
                    <button
                      onClick={() => navigate('/')}
                      className="w-full flex items-center gap-2.5 px-3 py-1 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none text-left"
                    >
                      <LogOut className="w-4 h-4 text-white/40 shrink-0" />
                      <span>Log out</span>
                    </button>

                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Floating toast notification inside the sidebar */}
      <AnimatePresence>
        {feedbackNotification && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-6 z-[9999] bg-[#0B0B0C]/90 border border-white/[0.08] py-2.5 px-4 rounded-xl shadow-lg flex items-center gap-2.5 backdrop-blur-md pointer-events-none"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-[11px] font-semibold text-white/90 font-sans">{feedbackNotification}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};
