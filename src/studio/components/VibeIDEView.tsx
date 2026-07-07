import React, { useState, useEffect, useRef } from 'react';
import { Search, Zap, Plus, Sparkles } from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';
import { IDESidebar } from './ide/IDESidebar';
import { IDEWorkspace } from './ide/IDEWorkspace';
import { IDEPreview } from './ide/IDEPreview';
import { PricingModal } from './PricingModal';

export const VibeIDEView: React.FC = () => {
  const { 
    setCurrentView,
    finishSoundEnabled,
    showPricingModal,
    setShowPricingModal,
    user
  } = useStudioStore();

  // Selected sub-tab / views in the Vibe IDE
  const [activeTab, setActiveTab] = useState<'ai_editor' | 'visual_editor' | 'branding' | 'files' | 'users' | 'email' | 'audits' | 'commerce' | 'domains' | 'pricing'>('ai_editor');
  
  // Sidebar app dropdown switcher
  const [selectedAppName, setSelectedAppName] = useState('Black & White Launch');
  const [showAppSelector, setShowAppSelector] = useState(false);

  // Chat message thread
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string; card?: boolean }>>([
    {
      sender: 'assistant',
      text: 'What kind of changes or feature additions do you want to vibe compile for your "Black & White Launch" landing page today?',
      time: '12:00 PM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);

  // Live preview mockup options that can be mutated by typing or clicking!
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark' | 'glass' | 'cosmic'>('light');
  const [previewHeadline, setPreviewHeadline] = useState('Build faster. Ship smarter.');
  const [showFeatureBadge, setShowFeatureBadge] = useState(true);
  const [badgeText, setBadgeText] = useState('NOW IN PUBLIC BETA');
  const [primaryButtonColor, setPrimaryButtonColor] = useState<'black' | 'emerald' | 'indigo' | 'purple'>('black');
  const [showSecondaryCard, setShowSecondaryCard] = useState(false);
  const [activePreviewDevice, setActivePreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Interactive files list
  const [workspaceFiles] = useState([
    { name: 'App.tsx', size: '2.4kb', modified: '2 mins ago' },
    { name: 'index.html', size: '1.1kb', modified: '1 day ago' },
    { name: 'LandingPage.tsx', size: '8.7kb', modified: 'Just now' },
    { name: 'global.css', size: '4.2kb', modified: '3 hours ago' }
  ]);

  // Play chime helper
  const playChime = () => {
    // Sound disabled by user request
  };

  // Compile runner triggered by vibe button or message enter
  const handleVibeTrigger = (customText?: string) => {
    const text = customText || inputText;
    if (!text.trim()) return;

    if (!customText) {
      // Add user message
      setMessages(prev => [...prev, {
        sender: 'user',
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setInputText('');
    }

    setIsCompiling(true);

    // Apply natural language mutations to preview based on keywords
    setTimeout(() => {
      setIsCompiling(false);

      const promptLower = text.toLowerCase();
      let feedbackText = "Vibe changes successfully compiled into the sandbox container!";

      if (promptLower.includes('dark') || promptLower.includes('night')) {
        setPreviewTheme('dark');
        feedbackText = "Applied a responsive minimal dark theme to the landing page layout with full contrast.";
      } else if (promptLower.includes('cosmic') || promptLower.includes('purple') || promptLower.includes('galaxy')) {
        setPreviewTheme('cosmic');
        feedbackText = "Woven a celestial vibe into the website preview complete with a purple starry accent gradient.";
      } else if (promptLower.includes('light') || promptLower.includes('white')) {
        setPreviewTheme('light');
        feedbackText = "Reset preview workspace to our signature clean daylight layout.";
      } else if (promptLower.includes('glass') || promptLower.includes('frosted')) {
        setPreviewTheme('glass');
        feedbackText = "Infused dynamic .liquid-glass backdrop-blur backdrops to preview cards.";
      }

      if (promptLower.includes('headline') || promptLower.includes('title') || promptLower.includes('change text')) {
        const words = text.split(" ");
        const index = words.findIndex(w => w.toLowerCase().includes('headline') || w.toLowerCase().includes('title'));
        if (index !== -1 && index + 1 < words.length) {
          const matched = words.slice(index + 1).join(" ").replace(/['"]+/g, '');
          if (matched.trim().length > 3) {
            setPreviewHeadline(matched);
            feedbackText += ` Updated landing page main display heading to "${matched}".`;
          }
        } else {
          setPreviewHeadline("Design with code. Build with light.");
          feedbackText += " Set headline banner to standard alternative mockup mode.";
        }
      }

      if (promptLower.includes('badge') || promptLower.includes('pill')) {
        if (promptLower.includes('hide') || promptLower.includes('remove')) {
          setShowFeatureBadge(false);
          feedbackText += " Hidden the public beta announcement badge capsule.";
        } else {
          setShowFeatureBadge(true);
          const customBadge = text.match(/"([^"]+)"/);
          if (customBadge && customBadge[1]) {
            setBadgeText(customBadge[1]);
          }
          feedbackText += " Enabled and updated notification badge layout.";
        }
      }

      if (promptLower.includes('button') || promptLower.includes('cta')) {
        if (promptLower.includes('green') || promptLower.includes('emerald')) {
          setPrimaryButtonColor('emerald');
        } else if (promptLower.includes('indigo') || promptLower.includes('blue')) {
          setPrimaryButtonColor('indigo');
        } else if (promptLower.includes('purple')) {
          setPrimaryButtonColor('purple');
        } else {
          setPrimaryButtonColor('black');
        }
        feedbackText += " Re-configured primary CTA button visual weight and accent glow.";
      }

      if (promptLower.includes('card') || promptLower.includes('feature') || promptLower.includes('grid')) {
        setShowSecondaryCard(true);
        feedbackText += " Synthesized an extra secondary live stats card to preview bento grid.";
      }

      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: feedbackText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      if (finishSoundEnabled) {
        playChime();
      }
    }, 1200);
  };

  // Preset quick helper actions
  const triggerQuickVibe = (prompt: string) => {
    setInputText(prompt);
    handleVibeTrigger(prompt);
  };

  return (
    <div className="fixed inset-0 bg-[#060709] text-zinc-300 font-sans flex flex-col overflow-hidden z-[100] animate-fadeIn">
      
      {/* GLOWING AMBIENT BACKGROUND TOP-LIGHT */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[80px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06)_0%,transparent_70%)] blur-[40px] pointer-events-none z-0" />

      {/* NEW PREMIUM LUCID TOP BAR NAVBAR */}
      <header className="relative z-10 w-full h-14 bg-[#07080c]/85 backdrop-blur-md border-b border-white/[0.04] flex items-center justify-between px-4 select-none">
        
        {/* Left Section: Sidebar Toggle & App Name */}
        <div className="flex items-center gap-3">
          {/* Custom Sidebar Toggle Button resembling the screenshot exactly */}
          <button 
            onClick={() => alert("Sidebar view customized")}
            className="w-8 h-8 rounded-lg hover:bg-white/5 border border-white/[0.04] bg-white/[0.01] flex items-center justify-center transition-all cursor-pointer group focus:outline-none"
            title="Toggle workspace layout"
          >
            <div className="w-4 h-4 border border-zinc-500 rounded flex overflow-hidden group-hover:border-zinc-300 transition-colors">
              <div className="w-1.5 h-full border-r border-zinc-500 bg-zinc-700/30 group-hover:border-zinc-300" />
            </div>
          </button>

          {/* Selected App Name Display */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-medium">Workspace</span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-bold text-white tracking-wide font-sans">{selectedAppName}</span>
          </div>
        </div>

        {/* Center Section: Glass Search Bar */}
        <div className="flex-1 max-w-sm mx-4 hidden md:block">
          <div className="relative w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 group-focus-within:text-[#6366f1] transition-colors" />
            <input 
              type="text" 
              placeholder="Search files, components, and templates..." 
              className="w-full bg-[#0a0b10] hover:bg-[#0c0d15] focus:bg-[#0c0d15] border border-white/[0.05] focus:border-[#6366f1]/30 rounded-full pl-10 pr-4 py-1.5 text-xs text-zinc-300 placeholder-zinc-500 font-sans outline-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
            />
          </div>
        </div>

        {/* Right Section: Credits Zap chip + UPGRADE button + User avatar */}
        <div className="flex items-center gap-3">
          
          {/* Sparkly UPGRADE Button in top bar */}
          <button 
            onClick={() => setShowPricingModal(true)}
            className="h-8 bg-white hover:bg-white/90 text-black px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-[0_3px_16px_rgba(255,255,255,0.15)] flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <Sparkles className="w-3 h-3 fill-black text-black" />
            <span>UPGRADE</span>
          </button>

          {/* Credits zap chip - Pill styled, glowing purple/blue border */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1a1c35]/35 hover:bg-[#1a1c35]/50 border border-[#6366f1]/25 rounded-full transition-all duration-300 shadow-[0_2px_12px_rgba(99,102,241,0.05)]">
            <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20 animate-pulse" />
            <span className="text-[11px] font-bold text-indigo-300 font-mono tracking-tight">{user.credits}.0</span>
          </div>

          {/* User Profile Avatar with custom green haired character image / placeholder */}
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.5)] cursor-pointer hover:border-white/20 transition-all flex items-center justify-center bg-zinc-950">
            <img 
              src="https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=80&h=80&fit=crop" 
              alt="Fleetyre" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Small active dot indicator */}
            <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[#07080c]" />
          </div>

        </div>

      </header>

      {/* MAIN CONTENT SPLIT */}
      <div className="flex-1 flex overflow-hidden w-full relative z-10">
        
        {/* LEFT SIDEBAR PANEL */}
        <IDESidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedAppName={selectedAppName}
          setSelectedAppName={setSelectedAppName}
          showAppSelector={showAppSelector}
          setShowAppSelector={setShowAppSelector}
        />

        {/* CENTER WORKSPACE PANEL */}
        <IDEWorkspace
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          messages={messages}
          inputText={inputText}
          setInputText={setInputText}
          isCompiling={isCompiling}
          handleVibeTrigger={handleVibeTrigger}
          triggerQuickVibe={triggerQuickVibe}
          showFeatureBadge={showFeatureBadge}
          setShowFeatureBadge={setShowFeatureBadge}
          showSecondaryCard={showSecondaryCard}
          setShowSecondaryCard={setShowSecondaryCard}
          previewTheme={previewTheme}
          setPreviewTheme={setPreviewTheme}
          primaryButtonColor={primaryButtonColor}
          setPrimaryButtonColor={setPrimaryButtonColor}
          workspaceFiles={workspaceFiles}
          playChime={playChime}
        />

        {/* RIGHT PREVIEW PANEL */}
        <IDEPreview
          activePreviewDevice={activePreviewDevice}
          setActivePreviewDevice={setActivePreviewDevice}
          previewTheme={previewTheme}
          previewHeadline={previewHeadline}
          showFeatureBadge={showFeatureBadge}
          badgeText={badgeText}
          primaryButtonColor={primaryButtonColor}
          showSecondaryCard={showSecondaryCard}
          playChime={playChime}
        />

      </div>

      {/* POPPING OUT PRICING OVERLAY */}
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />

    </div>
  );
};
