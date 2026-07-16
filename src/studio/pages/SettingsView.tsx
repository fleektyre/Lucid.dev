import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Settings, 
  Layers, 
  BookOpen, 
  Cpu, 
  Sparkles, 
  CreditCard, 
  Cloud,
  Check
} from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';

// Import newly modularized settings page files
import { GeneralSettings } from '../components/settings/GeneralSettings';
import { ApplicationsSettings } from '../components/settings/ApplicationsSettings';
import { KnowledgeSettings } from '../components/settings/KnowledgeSettings';
import { ConnectorsSettings } from '../components/settings/ConnectorsSettings';
import { AddonsSettings } from '../components/settings/AddonsSettings';
import { SubscriptionSettings } from '../components/settings/SubscriptionSettings';
import { CloudSettings } from '../components/settings/CloudSettings';

export const SettingsView: React.FC = () => {
  const { currentView, setCurrentView, activeSettingsTab, setActiveSettingsTab, user } = useStudioStore();
  const [notification, setNotification] = useState<string | null>(null);

  const triggerToast = (text: string) => {
    setNotification(text);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const navItems = [
    { id: 'general', label: 'General', icon: Settings, section: 'Account' },
    { id: 'applications', label: 'Applications', icon: Layers, section: 'Account' },
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen, section: 'Account' },
    { id: 'connectors', label: 'Connectors (MCP)', icon: Cpu, section: 'Account' },
    { id: 'addons', label: 'Add-on features', icon: Sparkles, section: 'Account' },
    { id: 'subscription', label: 'Subscription & Sparks', icon: CreditCard, section: 'Workspace' },
    { id: 'cloud', label: 'Cloud', icon: Cloud, section: 'Workspace' },
  ];

  return (
    <div className="w-full max-w-[1300px] mx-auto min-h-[85vh] grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 py-6 px-4 md:px-6 relative font-sans text-zinc-300">
      
      {/* Toast Feedback Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-8 right-8 z-[1000] max-w-sm bg-zinc-950/95 border border-white/20 text-white py-3.5 px-5 rounded-2xl shadow-[0_10px_40px_rgba(255,255,255,0.05)] flex items-center gap-2.5 backdrop-blur-xl"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span className="text-xs font-bold font-body">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT COLUMN: SETTINGS SIDEBAR (Exact match to screenshots layout) */}
      <div className="flex flex-col gap-8">
        
        {/* Clean Back trigger matching bolt.new header */}
        <button 
          onClick={() => setCurrentView('chat')}
          className="flex items-center gap-2.5 group text-xs text-white/95 hover:text-white font-black uppercase tracking-widest transition-colors duration-300 self-start cursor-pointer focus:outline-none bg-transparent border-0 select-none"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:-translate-x-1.5 transition-transform duration-300" />
          <span className="font-body">Back</span>
        </button>

        {/* Separator line */}
        <div className="h-px bg-zinc-900/60 w-full" />

        {/* Categories Group list */}
        <div className="flex flex-col gap-6">
          {['Account', 'Workspace'].map((sec) => (
            <div key={sec} className="flex flex-col gap-2">
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-zinc-650 font-black px-3.5 mb-1 select-none">
                {sec}
              </h3>
              
              <div className="flex flex-col gap-1">
                {navItems.filter(item => item.section === sec).map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeSettingsTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSettingsTab(item.id)}
                      className={`flex items-center gap-3.5 px-4 py-3 text-xs font-bold rounded-xl transition-all text-left focus:outline-none border select-none cursor-pointer duration-300
                        ${isSelected 
                          ? 'bg-zinc-900/60 text-white border-zinc-800 shadow-sm relative overflow-hidden' 
                          : 'bg-transparent border-transparent text-zinc-450 hover:text-white hover:bg-zinc-900/20'
                        }
                      `}
                    >
                      {/* Active glow dot accent on selected tabs */}
                      {isSelected && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
                      )}
                      
                      <Icon className={`w-4 h-4 shrink-0 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-zinc-500'}`} />
                      <span className="font-body tracking-wider">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: MAIN SETTINGS GRID CONTEXT */}
      <div className="bg-[#08080a]/90 border border-zinc-900/90 rounded-[1.5rem] p-6.5 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-start relative overflow-hidden min-h-[650px] backdrop-blur-xl">
        
        {/* Soft background glow light in bottom corner */}
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-zinc-900/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 w-full">
          {activeSettingsTab === 'general' && (
            <GeneralSettings triggerToast={triggerToast} />
          )}

          {activeSettingsTab === 'applications' && (
            <ApplicationsSettings triggerToast={triggerToast} />
          )}

          {activeSettingsTab === 'knowledge' && (
            <KnowledgeSettings triggerToast={triggerToast} />
          )}

          {activeSettingsTab === 'connectors' && (
            <ConnectorsSettings triggerToast={triggerToast} />
          )}

          {activeSettingsTab === 'addons' && (
            <AddonsSettings triggerToast={triggerToast} />
          )}

          {activeSettingsTab === 'subscription' && (
            <SubscriptionSettings userEmail={user.email} triggerToast={triggerToast} />
          )}

          {activeSettingsTab === 'cloud' && (
            <CloudSettings triggerToast={triggerToast} />
          )}
        </div>
      </div>

    </div>
  );
};
