import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Zap, Bell, ChevronDown } from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';

export const TopNav: React.FC = () => {
  const { user, currentProject, aiState } = useStudioStore();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-[116px] right-6 h-20 lucid-glass rounded-[32px] z-40 px-8 flex items-center justify-between shadow-2xl"
    >
      {/* Left */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Workspace</span>
            <span className="text-sm font-semibold tracking-tight">{currentProject.name}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-white/20 mt-3 cursor-pointer hover:text-white transition-colors" />
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="px-3.5 py-1.5 bg-accent/10 border border-accent/20 rounded-full flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#5ae14c]" />
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Active</span>
        </div>
      </div>

      {/* Center - AI Status */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/5 py-2 px-6 rounded-full border border-white/5 shadow-inner">
        <div className="relative">
          <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_15px_#5ae14c] animate-pulse" />
          <div className="absolute -inset-1 border border-accent/30 rounded-full animate-ping opacity-50" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/80">{aiState.status}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <div className="flex items-center">
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-2xl transition-all group">
              <UserPlus className="w-4 h-4 text-white/40 group-hover:text-white" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white">Invite</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-2 text-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all rounded-full ml-2">
              <Zap className="w-4 h-4 fill-current" />
              <span>Upgrade</span>
            </button>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{user.credits} / {user.maxCredits}</span>
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Credits Remaining</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_#5ae14c]" />
        </div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-11 h-11 rounded-2xl border border-white/10 overflow-hidden cursor-pointer p-0.5"
        >
          <img 
            src={user.avatarUrl} 
            alt={user.name}
            className="w-full h-full object-cover rounded-xl"
          />
        </motion.div>
      </div>
    </motion.header>
  );
};
