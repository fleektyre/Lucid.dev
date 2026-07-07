import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Shield, Check, ChevronDown, 
  Key, Copy, Eye, EyeOff, Save, Trash2, Sparkles
} from 'lucide-react';
import { Sidebar } from '../studio/layout/Sidebar';
import { TopNav } from '../studio/layout/TopNav';
import { StudioBackground } from '../studio/components/StudioBackground';
import { CelestialHorizon } from '../studio/components/CelestialHorizon';
import { useStudioStore } from '../studio/store/useStudioStore';

export const StudioProfilePage: React.FC = () => {
  const { user, setUser, isSidebarExpanded } = useStudioStore();
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState('Senior SaaS Architect');
  const [location, setLocation] = useState('San Francisco, CA');
  const [company, setCompany] = useState('Antigravity Labs');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [revealKey, setRevealKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // General state preferences
  const [theme, setTheme] = useState<'Dark' | 'Light' | 'System'>('Dark');
  const [soundNotify, setSoundNotify] = useState(true);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const [keys, setKeys] = useState([
    { id: '1', name: 'Gemini Production Key', prefix: 'AIzaSy...', value: 'AIzaSyD8GkL90PqX72Mv_lucidDevKey99281', created: 'June 01, 2026' },
    { id: '2', name: 'Supabase Main RLS Key', prefix: 'sb_anon...', value: 'sb_anon_lucid_dev_db_secret_key_88291244', created: 'May 18, 2026' },
    { id: '3', name: 'Paystack Sandbox Public', prefix: 'pk_test...', value: 'pk_test_lucid_dev_payment_gateway_556112', created: 'May 20, 2026' },
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(id);
    triggerToast('API key successfully copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 3500);
  };

  const handleSaveProfile = () => {
    setUser({ ...user, name });
    triggerToast('Developer profile configurations saved successfully!');
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#060813] via-[#040406] to-[#020204] text-white overflow-hidden selection:bg-white/10 selection:text-white font-body">
      {/* Main Structural Layout */}
      <Sidebar />
      <TopNav />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-8 right-8 z-[1000] max-w-sm bg-zinc-950/95 border border-white/20 text-white py-3.5 px-5 rounded-2xl shadow-[0_10px_40px_rgba(255,255,255,0.05)] flex items-center gap-2.5 backdrop-blur-xl"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span className="text-xs font-bold font-body">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <motion.main 
        animate={{ 
          paddingLeft: isSidebarExpanded ? 260 : 0
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="relative z-10 pr-0 pb-16 min-h-screen flex flex-col items-center justify-start pt-32 w-full"
      >
        <div className="relative w-full max-w-[1200px] mx-auto py-10 px-6 lg:px-8">
          
          {/* Header Title section using custom fonts */}
          <div className="mb-10 text-left">
            <h1 className="text-5xl font-heading italic text-white tracking-wide">Developer Profile</h1>
            <p className="text-sm text-zinc-400 mt-1.5 font-body">
              Configure your developer workspace identity, customize core platform behaviors, and manage secure cloud integration keys.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* COLUMN 1: Profile card + Interactive Badge Generator */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* INTERACTIVE PASS BADGE */}
              <div className="relative group overflow-hidden rounded-[1.5rem] bg-zinc-950/70 border border-zinc-900 p-6 flex flex-col items-center justify-between text-center min-h-[420px] transition-all hover:border-zinc-800">
                {/* Silver Gradient Glow Backdrop */}
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none group-hover:from-white/[0.08] transition-all duration-500" />
                
                {/* Custom top bar of the digital pass */}
                <div className="w-full flex items-center justify-between border-b border-zinc-900/50 pb-4 mb-4 select-none">
                  <span className="text-[9px] font-black tracking-[0.2em] text-white/40 uppercase">digital workspace pass</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                </div>

                {/* Avatar with beautiful border */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border border-white/20 p-1 bg-zinc-950/80 mb-4">
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="absolute bottom-4 right-0 w-6 h-6 rounded-full bg-white border border-black flex items-center justify-center shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
                  </div>
                </div>

                {/* User details */}
                <div className="space-y-1">
                  <h2 className="text-3xl font-heading italic text-white tracking-wider">{user.name}</h2>
                  <p className="text-xs text-zinc-400 font-mono tracking-wide">{role}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{company}</p>
                </div>

                {/* Virtual barcode scanning element */}
                <div className="w-full mt-6 border-t border-zinc-900/50 pt-5 flex flex-col items-center gap-1 select-none opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-0.5 h-8 w-full justify-center">
                    {[1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2].map((w, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white/80 h-full" 
                        style={{ width: `${w * 1.5}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[8px] font-mono tracking-[0.4em] text-zinc-500">LUCID-SYSTEM-{user.id.toUpperCase()}-026</span>
                </div>
              </div>

              {/* STATS CAPSULE */}
              <div className="p-5 bg-zinc-950/40 border border-zinc-900 rounded-[1.5rem] space-y-3 font-sans">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium font-body uppercase tracking-wider">Account Creation Date</span>
                  <span className="text-white font-bold font-body">May 15, 2026</span>
                </div>
                <div className="h-px bg-zinc-900/60" />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium font-body uppercase tracking-wider">Permissions Tier</span>
                  <span className="text-[#3eef8e] font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 py-0.5 px-2.5 rounded-full text-[9px]">Developer Core</span>
                </div>
                <div className="h-px bg-zinc-900/60" />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium font-body uppercase tracking-wider">Network Routing Status</span>
                  <span className="text-white font-bold font-body flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
                    Secure Sandbox
                  </span>
                </div>
              </div>

            </div>

            {/* COLUMN 2 & 3: Interactive preferences, profile builder, and api keys */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* PROFILE CONTROL CARD */}
              <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-[1.5rem] relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/[0.01]/[0.01] blur-3xl pointer-events-none" />
                <h3 className="text-xl font-heading italic text-white mb-6 tracking-wide">Workspace Identity</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 font-sans">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-body">User Profile Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-zinc-950/50 border border-zinc-850 hover:border-zinc-800 focus:border-zinc-705 px-4 py-2.5 rounded-xl text-xs font-bold text-white focus:outline-none transition-all font-body"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-body">Email Address</label>
                    <input 
                      type="email" 
                      value={user.email}
                      disabled
                      className="bg-zinc-950/20 border border-zinc-900 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-550 cursor-not-allowed font-body"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-body">Developer Title/Role</label>
                    <input 
                      type="text" 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="bg-zinc-950/50 border border-zinc-850 hover:border-zinc-800 focus:border-zinc-705 px-4 py-2.5 rounded-xl text-xs font-bold text-white focus:outline-none transition-all font-body"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-body">Platform Organization</label>
                    <input 
                      type="text" 
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="bg-zinc-950/50 border border-zinc-850 hover:border-zinc-800 focus:border-zinc-705 px-4 py-2.5 rounded-xl text-xs font-bold text-white focus:outline-none transition-all font-body"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button 
                    onClick={handleSaveProfile}
                    className="px-6 py-2.5 bg-white hover:bg-zinc-100 text-black text-xs font-black tracking-widest uppercase rounded-full flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-black" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </div>

              {/* APPEARANCE & PREFERENCES CONFIGURATIONS */}
              <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-[1.5rem]">
                <h3 className="text-xl font-heading italic text-white mb-4 tracking-wide text-left">Custom Workspace Behaviors</h3>
                
                <div className="flex flex-col gap-5 border-t border-zinc-900 pt-4">
                  {/* Theme controls */}
                  <div className="flex items-center justify-between py-2.5 border-b border-zinc-900/50">
                    <div className="flex flex-col gap-0.5 text-left max-w-[70%]">
                      <span className="text-sm font-bold text-zinc-100 font-sans">Visual Color Environment</span>
                      <span className="text-xs text-zinc-500 font-body leading-relaxed">
                        Fine-tunes layout views of files and sandbox render states. Defaulting to Dark theme.
                      </span>
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setShowThemeMenu(!showThemeMenu)}
                        className="flex items-center justify-between gap-3 text-xs font-bold text-zinc-200 bg-zinc-950 border border-zinc-850 hover:border-zinc-800 rounded-full px-5 py-2 w-32 transition-all cursor-pointer focus:outline-none font-body"
                      >
                        <span>{theme}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                      </button>
                      <AnimatePresence>
                        {showThemeMenu && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)} />
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute right-0 top-full mt-2 w-32 bg-[#121214] border border-zinc-850 rounded-2xl p-1.5 z-50 shadow-2xl font-body"
                            >
                              {['Dark', 'Light', 'System'].map((t) => (
                                <button
                                  key={t}
                                  onClick={() => {
                                    setTheme(t as any);
                                    setShowThemeMenu(false);
                                    triggerToast(`Theme preset successfully adjusted to ${t}`);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-zinc-900 text-xs font-bold text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer border-none"
                                >
                                  {t}
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Sound controls */}
                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex flex-col gap-0.5 text-left max-w-[70%]">
                      <span className="text-sm font-bold text-zinc-100 font-sans">Compilation Audio Feedback</span>
                      <span className="text-xs text-zinc-500 font-body leading-relaxed">
                        Chimes dynamic ambient audio waveforms as tasks finish rendering.
                      </span>
                    </div>

                    <button 
                      onClick={() => {
                        setSoundNotify(!soundNotify);
                        triggerToast(`Chime sound systems ${!soundNotify ? 'indexed' : 'suspended'}`);
                      }}
                      className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-305 ease-in-out cursor-pointer focus:outline-none border-none
                        ${soundNotify ? 'bg-white' : 'bg-zinc-800'}
                      `}
                    >
                      <div className={`w-5 h-5 rounded-full bg-black transition-transform duration-305 ease-in-out transform ${soundNotify ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* SECURE INTEGRATION KEYS MANAGER */}
              <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-[1.5rem] text-left">
                <div className="flex justify-between items-center mb-1 border-b border-zinc-900 pb-4 mb-5">
                  <div>
                    <h3 className="text-xl font-heading italic text-white tracking-wide">Developer API Credentials</h3>
                    <p className="text-xs text-zinc-500 mt-0.5 font-body">Integrate individual credentials without public exposure.</p>
                  </div>
                  <button 
                    onClick={() => triggerToast('Provisioning and connecting standard MCP security rules...')}
                    className="px-4 py-2 border border-zinc-850 hover:bg-zinc-900 text-xs font-bold rounded-full text-zinc-300 uppercase tracking-widest font-body cursor-pointer transition-all"
                  >
                    Create Custom Token
                  </button>
                </div>

                <div className="space-y-4">
                  {keys.map((k) => {
                    const isRevealed = revealKey === k.id;
                    return (
                      <div 
                        key={k.id}
                        className="p-4 bg-zinc-950/30 border border-zinc-900 hover:border-zinc-850 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center shrink-0 shadow-lg">
                            <Key className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-white tracking-wide font-sans">{k.name}</span>
                            <span className="text-[11px] font-mono tracking-wider text-zinc-500 mt-0.5 select-all">
                              {isRevealed ? k.value : `${k.prefix}••••••••••••••••••••`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <button 
                            onClick={() => setRevealKey(isRevealed ? null : k.id)}
                            className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all cursor-pointer border-none bg-transparent"
                            title={isRevealed ? "Hide key" : "View key"}
                          >
                            {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => handleCopy(k.id, k.value)}
                            className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all cursor-pointer border-none bg-transparent"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => triggerToast(`Permission restricted. Key deletion locked by standard RLS policies.`)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-400 transition-all cursor-pointer border-none bg-transparent"
                            title="Deauthorize token"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>
      </motion.main>
    </div>
  );
};
