import React from 'react';
import { 
  Sparkles, MousePointer, Sliders, FileText, User, Mail, Shield, 
  Layers, Globe, ChevronDown, Check, MessageSquare, Settings,
  Cpu, TrendingUp, DollarSign
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { LucidLogo } from '../../../components/LucidLogo';

interface IDESidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  selectedAppName: string;
  setSelectedAppName: (name: string) => void;
  showAppSelector: boolean;
  setShowAppSelector: (show: boolean) => void;
}

export const IDESidebar: React.FC<IDESidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedAppName,
  setSelectedAppName,
  showAppSelector,
  setShowAppSelector
}) => {
  const { setCurrentView } = useStudioStore();

  return (
    <aside id="ide-sidebar" className="w-[240px] bg-[#07080c] border-r border-white/[0.04] h-full flex flex-col justify-between select-none shrink-0">
      
      <div className="flex flex-col gap-4 p-5 overflow-y-auto no-scrollbar">
        {/* Logo / Title */}
        <div className="pb-3 border-b border-white/[0.04] flex justify-start select-none">
          <LucidLogo />
        </div>

        {/* Create New App button */}
        <div className="px-1.5 pt-1">
          <button
            onClick={() => alert("Creating a fresh sandboxed application blueprint in your workspace!")}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/[0.05] rounded-xl py-2 px-3 text-[11px] font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Create new app</span>
          </button>
        </div>

        {/* App Select Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAppSelector(!showAppSelector)}
            className="w-full bg-zinc-900/60 hover:bg-zinc-900 border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white/90 flex items-center justify-between font-medium transition-all"
          >
            <span className="truncate">{selectedAppName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          {showAppSelector && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#0e0e11] border border-white/[0.08] rounded-xl p-1 shadow-2xl z-50 flex flex-col gap-0.5">
              {['Black & White Launch', 'SaaS Analytics Hub', 'Celestial Vibe Portal'].map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    setSelectedAppName(name);
                    setShowAppSelector(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-white/5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center justify-between"
                >
                  <span>{name}</span>
                  {selectedAppName === name && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* BUILD MENU SECTION */}
        <div className="flex flex-col gap-1 mt-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2.5 mb-1.5">Build</span>
          
          {[
            { id: 'ai_editor', label: 'AI Editor', icon: Sparkles, badge: null },
            { id: 'visual_editor', label: 'Visual Editor', icon: MousePointer, badge: null },
            { id: 'branding', label: 'Branding & SEO', icon: Sliders, badge: null },
            { id: 'files', label: 'Files & Media', icon: FileText, badge: null },
            { id: 'users', label: 'Users & Access', icon: User, badge: null },
            { id: 'email', label: 'Email', icon: Mail, badge: null },
            { id: 'audits', label: 'Audits', icon: Shield, badge: 'New', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
            { id: 'commerce', label: 'Commerce', icon: Layers, badge: 'Beta', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-white/10 text-white border border-white/[0.05]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] border px-1.5 py-0.5 rounded-md font-bold leading-none ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* MONETIZATION & CORE ARCHITECTURE */}
        <div className="flex flex-col gap-1 mt-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2.5 mb-1.5">Monetization & API</span>
          
          <button
            onClick={() => setActiveTab('vibe_engine')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'vibe_engine' 
                ? 'bg-white/10 text-white border border-white/[0.05]' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className={`w-4 h-4 ${activeTab === 'vibe_engine' ? 'text-indigo-400' : 'text-zinc-500'}`} />
            <span className="flex-1 text-left">Vibe Engine Pro</span>
            <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded-md font-bold leading-none">
              75% Margin
            </span>
          </button>
        </div>

        {/* PUBLISH MENU SECTION */}
        <div className="flex flex-col gap-1 mt-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2.5 mb-1.5">Publish</span>
          
          <button
            onClick={() => setActiveTab('domains')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'domains' 
                ? 'bg-white/10 text-white border border-white/[0.05]' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className={`w-4 h-4 ${activeTab === 'domains' ? 'text-blue-400' : 'text-zinc-500'}`} />
            <span className="flex-1 text-left">Domains</span>
          </button>
        </div>

      </div>

      {/* Bottom Sidebar Controls */}
      <div className="p-4 border-t border-white/[0.04] bg-[#09090b]/40 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => alert("Help Center loaded! Direct support message line connected.")}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition-all text-left"
          >
            <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
            <span>Support & feedback</span>
          </button>
          <button
            onClick={() => setCurrentView('chat')}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition-all text-left"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-500" />
            <span>Go to main app</span>
          </button>
        </div>

        {/* Profile Dropdown Simulation */}
        <div className="flex items-center justify-between p-2 bg-zinc-950/60 border border-white/[0.04] rounded-xl">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              N
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-white truncate leading-none">Nwuba Joshua</span>
              <span className="text-[9px] text-zinc-500 mt-1">fleetyre77@gmail.com</span>
            </div>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        </div>
      </div>

    </aside>
  );
};
