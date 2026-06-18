import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  FolderKanban, 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  ExternalLink,
  Search,
  ChevronDown,
  Github,
  Twitter,
  Linkedin,
  Compass,
  LogOut,
  Settings,
  Plus,
  Cpu,
  Sparkles,
  CreditCard,
  Cloud
} from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';
import { useNavigate, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    isSidebarExpanded, 
    toggleSidebar,
    currentView,
    setCurrentView,
    setActiveSettingsTab
  } = useStudioStore();
  const [activeItem, setActiveItem] = useState('home');
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [teamNotification, setTeamNotification] = useState<string | null>(null);

  const primaryItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'recent', label: 'Recently viewed', icon: Clock },
    { id: 'shared', label: 'Shared with you', icon: Users },
  ];

  const knowledgeItems = [
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen, tab: 'knowledge' },
    { id: 'connectors', label: 'Connectors (MCP)', icon: Cpu, tab: 'connectors' },
    { id: 'addons', label: 'Add-on features', icon: Sparkles, tab: 'addons' },
  ];

  const workspaceItems = [
    { id: 'subscription', label: 'Subscription & Credits', icon: CreditCard, tab: 'subscription' },
    { id: 'cloud', label: 'Cloud', icon: Cloud, tab: 'cloud' },
  ];

  const secondaryItems = [
    { id: 'docs', label: 'Docs & Help center', icon: BookOpen, hasExternal: true },
  ];

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: isSidebarExpanded ? 0 : -260 }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="fixed left-0 top-0 bottom-0 w-[260px] bg-[#0a0a0b]/90 border-r border-white/[0.05] z-50 flex flex-col justify-between p-4 backdrop-blur-xl"
    >
      {/* Top Menu Block */}
      <div className="flex flex-col gap-5">
        {/* Brand Logo & Search Box */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-2 mt-1">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-heading text-base italic text-white group-hover:scale-105 transition-transform duration-300">
                l
              </div>
              <span className="font-heading text-xl italic text-white tracking-[0.1em] group-hover:opacity-80 transition-opacity">
                lucid.dev
              </span>
            </div>
            
            {/* Search Pill */}
            <button className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Search Trigger Command Block */}
          <div className="px-2">
            <div className="flex items-center justify-between bg-zinc-950/40 hover:bg-zinc-950/80 border border-white/[0.04] rounded-xl px-3 py-2 text-xs text-white/30 transition-all cursor-pointer">
              <span className="flex items-center gap-2 font-medium font-sans">
                <Search className="w-3.5 h-3.5 text-white/20" />
                Search Ctrl+K
              </span>
            </div>
          </div>
        </div>

        {/* User Account Capsule */}
        <div className="px-2 relative">
          <div 
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            className="flex items-center justify-between p-2.5 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 rounded-[14px] hover:border-zinc-750 transition-all cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              {/* Monogram emblem exactly matching user image style */}
              <div className="w-7 h-7 rounded-lg bg-orange-600/30 border border-orange-500/20 text-[#ff6a4a] text-[10px] font-black flex items-center justify-center font-serif leading-none shrink-0">
                π
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-white/90 font-bold truncate tracking-wide">
                  {user.email}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 pl-1.5 font-bold">
              <span className="text-[9px] text-white/80 bg-zinc-800 px-2 py-0.5 rounded uppercase tracking-wider border border-zinc-750 font-black">
                FREE
              </span>
              <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-300 ${showSettingsDropdown ? 'rotate-180' : ''}`} />
            </div>
          </div>

          <AnimatePresence>
            {showSettingsDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSettingsDropdown(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute left-0 right-0 mt-2 bg-[#18181b]/95 border border-zinc-850 rounded-[20px] p-4.5 shadow-2xl z-50 backdrop-blur-xl flex flex-col gap-3.5"
                >
                  {/* Header info card */}
                  <div className="flex items-center gap-3.5 pb-2.5 border-b border-zinc-900/50">
                    <div className="w-10 h-10 rounded-xl bg-orange-600/30 border border-orange-500/20 text-[#ff6a4a] text-sm font-black flex items-center justify-center font-serif leading-none shrink-0 border-zinc-800">
                      π
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white truncate leading-normal">{user.email}</span>
                      <span className="text-[10px] text-zinc-500 leading-normal">Free plan</span>
                    </div>
                  </div>

                  {/* Settings button with cog settings */}
                  <button 
                    onClick={() => {
                      navigate('/studio/profile');
                      setShowSettingsDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2.5 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-200 hover:text-white transition-all cursor-pointer focus:outline-none 
                      ${location.pathname === '/studio/profile' ? 'bg-[#27272a] border-zinc-700 text-white' : ''}
                    `}
                  >
                    <Settings className="w-4 h-4 text-zinc-400" />
                    <span>Settings</span>
                  </button>

                  {/* Plus Create New Team Option */}
                  <button 
                    onClick={() => {
                      setTeamNotification("Team project environment layout requested...");
                      setShowSettingsDropdown(false);
                      setTimeout(() => setTeamNotification(null), 3500);
                    }}
                    className="w-full border border-zinc-850 bg-[#141416]/40 hover:bg-[#1e1e22]/50 hover:border-zinc-700 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-zinc-350 hover:text-white transition-all cursor-pointer focus:outline-none"
                  >
                    <span className="text-sm font-normal text-zinc-500 shrink-0 leading-none">+</span>
                    <span>Create new team</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Group 1 */}
        <div className="flex flex-col gap-1 px-1">
          {primaryItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id && location.pathname === '/studio' && currentView === 'chat';

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  setCurrentView('chat');
                  if (location.pathname !== '/studio') {
                    navigate('/studio');
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all relative group cursor-pointer focus:outline-none 
                  ${isActive 
                    ? 'bg-white/[0.07] text-white border border-white/[0.04]' 
                    : 'text-white/45 hover:text-white hover:bg-white/[0.03]'
                  }
                `}
              >
                <IconComponent className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 duration-200 ${isActive ? 'text-white' : ''}`} />
                <span className="flex-1 text-left font-sans">{item.label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute left-1 w-1 h-5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="px-3">
          <div className="h-px bg-white/[0.04] w-full" />
        </div>

        {/* Knowledge & Setup Items */}
        <div className="flex flex-col gap-1 px-1">
          {knowledgeItems.map((item) => {
            const IconComponent = item.icon;
            const isTabActive = location.pathname === '/studio' && currentView === 'settings' && useStudioStore.getState().activeSettingsTab === item.tab;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  setCurrentView('settings');
                  setActiveSettingsTab(item.tab);
                  if (location.pathname !== '/studio') {
                    navigate('/studio');
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all relative group cursor-pointer focus:outline-none 
                  ${isTabActive 
                    ? 'bg-white/[0.07] text-white border border-white/[0.04]' 
                    : 'text-white/45 hover:text-white hover:bg-white/[0.03]'
                  }
                `}
              >
                <IconComponent className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 duration-200 ${isTabActive ? 'text-white' : ''}`} />
                <span className="flex-1 text-left font-sans">{item.label}</span>
                
                {isTabActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute left-1 w-1 h-5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Workspace section */}
        <div className="px-3 mt-2">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-black px-1.5 select-none font-sans">
              WORKSPACE
            </h3>
            <div className="flex flex-col gap-1">
              {workspaceItems.map((item) => {
                const IconComponent = item.icon;
                
                // Subscription highlights when location is billing!
                const isTabActive = item.tab === 'subscription' 
                  ? location.pathname === '/studio/billing' 
                  : (location.pathname === '/studio' && currentView === 'settings' && useStudioStore.getState().activeSettingsTab === item.tab);

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.tab === 'subscription') {
                        navigate('/studio/billing');
                      } else {
                        setActiveItem(item.id);
                        setCurrentView('settings');
                        setActiveSettingsTab(item.tab);
                        if (location.pathname !== '/studio') {
                          navigate('/studio');
                        }
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all relative group cursor-pointer focus:outline-none 
                      ${isTabActive 
                        ? 'bg-white/[0.07] text-white border border-white/[0.04]' 
                        : 'text-white/45 hover:text-white hover:bg-white/[0.03]'
                      }
                    `}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 duration-200 ${isTabActive ? 'text-white' : ''}`} />
                    <span className="flex-1 text-left font-sans">{item.label}</span>
                    
                    {isTabActive && (
                      <motion.div
                        layoutId="sidebarActivePill"
                        className="absolute left-1 w-1 h-5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="px-3">
          <div className="h-px bg-white/[0.04] w-full" />
        </div>

        {/* Navigation Group 2 (Footer Help) */}
        <div className="flex flex-col gap-1 px-1">
          {secondaryItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all group cursor-pointer focus:outline-none
                  ${isActive 
                    ? 'bg-white/[0.07] text-white border border-white/[0.04]' 
                    : 'text-white/45 hover:text-white hover:bg-white/[0.03]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-4 h-4 shrink-0" />
                  <span className="font-sans">{item.label}</span>
                </div>
                {item.hasExternal && (
                  <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Log Out Button */}
      <div className="px-3 py-1">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-red-400/80 hover:text-red-300 hover:bg-red-500/10 border border-red-500/5 hover:border-red-500/15 bg-red-950/5 transition-all cursor-pointer focus:outline-none"
        >
          <LogOut className="w-4 h-4 text-red-400 shrink-0" />
          <span className="font-sans">Log Out</span>
        </button>
      </div>

      {/* Footer / Branding */}
      <div className="flex flex-col gap-4 px-2 pb-2">
        <div className="flex items-center justify-between border-t border-white/[0.05] pt-4">
          {/* Minimbal circle mark */}
          <div className="flex items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#ff4500]/20 to-[#ff8700]/20 text-[#ff8700] flex items-center justify-center font-extrabold text-xs border border-[#ff8700]/30 shadow-md">
              ⚡
            </div>
          </div>

          {/* Social Channels side-by-side matching bolt.new placement */}
          <div className="flex items-center gap-1.5">
            <a href="#" className="p-1.5 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Discord">
              <Compass className="w-4 h-4" />
            </a>
            <a href="#" className="p-1.5 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="p-1.5 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-1.5 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Github">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Floating team creation confirmation feedback banner */}
      <AnimatePresence>
        {teamNotification && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 left-8 z-[9999] bg-zinc-950/95 border border-sky-500/20 py-3.5 px-5 rounded-2xl shadow-[0_10px_40px_rgba(14,165,233,0.1)] flex items-center gap-3 backdrop-blur-xl"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <p className="text-xs font-bold text-zinc-200">{teamNotification}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};
