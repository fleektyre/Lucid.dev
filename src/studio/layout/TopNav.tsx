import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, Plus, Settings, Sparkles, LogOut, User, Layout, 
  CreditCard, Menu, PanelLeftClose, PanelLeft, Bell, X, Check, 
  AlertCircle, Coins, Trash2, Eye, CircleDot, PlayCircle
} from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';
import { useNavigate } from 'react-router-dom';

const playSoftChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Play a delightful sweet high cinematic chime note sequence (E5 -> B5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 1.2);

    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      gain2.gain.setValueAtTime(0.08, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 1.5);
    }, 120);
  } catch (error) {
    console.warn("Audio chime prevented by browser autoplay restrictions.", error);
  }
};

export const TopNav: React.FC = () => {
  const { 
    user, 
    currentProject, 
    isSidebarExpanded, 
    toggleSidebar, 
    setShowPricingModal,
    currentView,
    setCurrentView,
    setActiveSettingsTab,
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
    clearAllNotifications
  } = useStudioStore();

  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'ai' | 'billing' | 'error'>('all');
  const [teamNotification, setTeamNotification] = useState<string | null>(null);
  const [activeToast, setActiveToast] = useState<{ id: string, type: string, title: string, message: string } | null>(null);

  const prevLengthRef = useRef(notifications.length);
  const [isMd, setIsMd] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  useEffect(() => {
    const handleResize = () => {
      setIsMd(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen to new notifications and trigger audio chimes & toast popups
  useEffect(() => {
    if (notifications.length > prevLengthRef.current) {
      const latest = notifications[0];
      if (latest) {
        // Trigger soft chime audio synthesize note
        playSoftChime();

        // Trigger dynamic floating toast alert
        setActiveToast({
          id: latest.id,
          type: latest.type,
          title: latest.title,
          message: latest.message
        });

        // Dismiss local toast notification gracefully
        const timer = setTimeout(() => {
          setActiveToast(null);
        }, 4500);

        return () => clearTimeout(timer);
      }
    }
    prevLengthRef.current = notifications.length;
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifs = notifications.filter(n => {
    if (notifFilter === 'all') return true;
    return n.type === notifFilter;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'ai':
        return <Sparkles className="w-4 h-4 text-white hover:scale-110 transition-transform" />;
      case 'billing':
        return <Coins className="w-4 h-4 text-white" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-white" />;
      default:
        return <CircleDot className="w-4 h-4 text-white" />;
    }
  };

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
        <button className="flex items-center gap-1.5 hover:text-white transition-colors duration-200 focus:outline-none cursor-pointer">
          <span>Resources</span>
          <ChevronDown className="w-3.5 h-3.5 text-white/40" />
        </button>
        <button 
          onClick={() => setShowPricingModal(true)}
          className="hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none"
        >
          Pricing
        </button>
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

        {/* Credits Capsule */}
        <div className="flex items-center gap-3 px-4 py-2 bg-zinc-950/40 border border-white/[0.08] rounded-full backdrop-blur-xl shadow-inner">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-extrabold text-white tracking-wider font-schibsted">
              {user.credits} / {user.maxCredits}
            </span>
            <span className="text-[7.5px] font-semibold text-white/30 uppercase tracking-[0.15em] font-fustat leading-none mt-0.5">
              CREDITS REMAINING
            </span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        </div>

        {/* NOTIFICATION BELL */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 bg-zinc-950/40 hover:bg-white/5 border border-white/[0.08] rounded-full text-white/50 hover:text-white transition-all flex items-center justify-center relative cursor-pointer focus:outline-none"
            title="Notifications"
          >
            <Bell className={`w-4 h-4 text-white/70 ${unreadCount > 0 ? 'animate-pulse text-white font-bold' : ''}`} />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-white text-black font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center tracking-tighter shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-96 max-w-[92vw] sm:w-[420px] bg-zinc-950/95 border border-white/10 rounded-[1.5rem] shadow-2xl z-50 backdrop-blur-2xl p-4 overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                      <p className="text-[10px] text-white/40 font-mono mt-0.5">{unreadCount} unread system events</p>
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] text-white hover:text-white/80 flex items-center gap-1 font-bold border border-white/10 px-2.5 py-1 rounded-full cursor-pointer hover:bg-white/5"
                      >
                        <Check className="w-3 h-3" /> Mark read
                      </button>
                    )}
                  </div>

                  {/* Filter Categories */}
                  <div className="flex gap-1.5 py-2.5 overflow-x-auto select-none border-b border-white/5">
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'ai', label: 'AI/Code' },
                      { key: 'billing', label: 'Billing' },
                      { key: 'error', label: 'Errors' }
                    ].map((filt) => (
                      <button
                        key={filt.key}
                        onClick={() => setNotifFilter(filt.key as any)}
                        className={`text-[9.5px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase transition-all cursor-pointer block shrink-0 border
                          ${notifFilter === filt.key 
                            ? 'bg-white text-black border-transparent shadow-[0_0_8px_rgba(255,255,255,0.25)]' 
                            : 'bg-white/5 text-white/50 border-white/5 hover:text-white hover:bg-white/10'
                          }
                        `}
                      >
                        {filt.label}
                      </button>
                    ))}
                  </div>

                  {/* Notification List Container */}
                  <div className="max-h-72 overflow-y-auto py-2 flex flex-col gap-2 custom-scrollbar">
                    {filteredNotifs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Bell className="w-8 h-8 text-white/10 mb-2" />
                        <p className="text-xs font-semibold text-white/40">Workspace is silent</p>
                        <p className="text-[10px] text-white/20 font-sans">All pipelines are nominal</p>
                      </div>
                    ) : (
                      filteredNotifs.map((notif) => (
                        <div 
                          key={notif.id}
                          className={`flex gap-3 p-3 rounded-xl border transition-all duration-300 relative group
                            ${notif.read 
                              ? 'bg-white/[0.01] border-white/5 opacity-60' 
                              : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.06] hover:border-white/15'
                            }
                          `}
                        >
                          {/* Left Icon with color indicator */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5
                            ${notif.type === 'ai' ? 'bg-indigo-500/10 text-indigo-400 font-bold' : ''}
                            ${notif.type === 'billing' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : ''}
                            ${notif.type === 'error' ? 'bg-rose-500/10 text-rose-400 font-bold' : ''}
                          `}>
                            {getNotifIcon(notif.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-xs font-bold leading-tight ${notif.read ? 'text-white/60' : 'text-white'}`}>
                                {notif.title}
                              </h4>
                              <span className="text-[8px] font-mono text-white/20 shrink-0 select-none mt-0.5">
                                {notif.timestamp}
                              </span>
                            </div>
                            <p className="text-[10.5px] leading-relaxed text-white/40 tracking-normal mt-1 leading-normal font-sans text-left">
                              {notif.message}
                            </p>

                            {/* Hover Options */}
                            <div className="flex items-center gap-2 mt-2 pt-1 border-t border-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notif.read && (
                                <button 
                                  onClick={() => markNotificationAsRead(notif.id)}
                                  className="text-[9px] font-bold text-sky-400 flex items-center gap-1 cursor-pointer bg-transparent hover:underline px-0 border-0"
                                >
                                  <Check className="w-2.5 h-2.5" /> Mark read
                                </button>
                              )}
                              <button 
                                onClick={() => clearNotification(notif.id)}
                                className="text-[9px] font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer bg-transparent px-0 border-0"
                              >
                                <Trash2 className="w-2.5 h-2.5" /> Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Simulation Sandbox Footer Panel */}
                  <div className="border-t border-white/5 mt-2 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] tracking-wider uppercase font-extrabold text-white/20 flex items-center gap-1">
                        <PlayCircle className="w-3 h-3 text-white/30" /> Sandbox Simulator
                      </span>
                      {notifications.length > 0 && (
                        <button 
                          onClick={clearAllNotifications}
                          className="text-[9px] text-red-400 hover:text-red-300 font-extrabold flex items-center gap-1 border-0 bg-transparent cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => addNotification('ai', 'AI Compilation Complete', 'Transpiler synthesized 16 clean glass UI containers with zero rendering anomalies.')}
                        className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[9.5px] font-bold py-1.5 px-2 rounded-xl transition-all cursor-pointer truncate"
                        title="Simulate AI Generation Complete"
                      >
                        + AI Event
                      </button>
                      <button
                        onClick={() => addNotification('billing', 'Payment Succeeded', 'Paystack credit replenish transfer of +$29.00 confirmed. +1000 credits allocated.')}
                        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-[9.5px] font-bold py-1.5 px-2 rounded-xl transition-all cursor-pointer truncate"
                        title="Simulate Billing Refill Event"
                      >
                        + Billing
                      </button>
                      <button
                        onClick={() => addNotification('error', 'Execution Error', 'TSX Engine crashed on render payload validation. Exit code 51.')}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[9.5px] font-bold py-1.5 px-2 rounded-xl transition-all cursor-pointer truncate"
                        title="Simulate Pipeline Error Event"
                      >
                        + Error
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
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
                      navigate('/studio/profile');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-xs text-white/70 flex items-center gap-2.5 transition-all cursor-pointer border-none bg-transparent"
                  >
                    <User className="w-4 h-4 text-white/40" />
                    <span>My Profile</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowSettings(false);
                      navigate('/studio');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-xs text-white/70 flex items-center gap-2.5 transition-all cursor-pointer border-none bg-transparent"
                  >
                    <Layout className="w-4 h-4 text-white/40" />
                    <span>Manage Workspace</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowSettings(false);
                      navigate('/studio/billing');
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

        {/* Floating team creation confirmation feedback banner */}
        <AnimatePresence>
          {teamNotification && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-8 right-8 z-[9999] bg-zinc-950/95 border border-sky-500/20 py-3.5 px-5 rounded-2xl shadow-[0_10px_40px_rgba(14,165,233,0.1)] flex items-center gap-3 backdrop-blur-xl"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <p className="text-xs font-bold text-zinc-200">{teamNotification}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating real-time Toasts container */}
        <AnimatePresence>
          {activeToast && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed bottom-6 right-6 z-[9999] w-96 max-w-[calc(100vw-32px)] bg-zinc-950/90 border border-white/10 rounded-[1.25rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex gap-3.5"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-white/10
                ${activeToast.type === 'ai' ? 'bg-indigo-500/10 text-indigo-400' : ''}
                ${activeToast.type === 'billing' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                ${activeToast.type === 'error' ? 'bg-rose-500/10 text-rose-400' : ''}
              `}>
                {getNotifIcon(activeToast.type)}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white tracking-wide">{activeToast.title}</h4>
                  <button onClick={() => setActiveToast(null)} className="p-1 text-white/40 hover:text-white transition-all cursor-pointer border-0 bg-transparent">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed font-sans mt-1 text-left">{activeToast.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
