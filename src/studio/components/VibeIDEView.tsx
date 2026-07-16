import React, { useState, useEffect, useRef } from 'react';
import { Search, Zap, Plus, Sparkles, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'ai_editor' | 'visual_editor' | 'branding' | 'files' | 'users' | 'email' | 'audits' | 'commerce' | 'domains' | 'pricing' | 'vibe_engine'>('ai_editor');
  
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
  const [primaryButtonColor, setPrimaryButtonColor] = useState<'black' | 'violet' | 'indigo' | 'purple'>('black');
  const [showSecondaryCard, setShowSecondaryCard] = useState(false);
  const [activePreviewDevice, setActivePreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Interactive Resizable split-pane & "Roller" Extension controls
  const [workspaceWidth, setWorkspaceWidth] = useState<number>(400);
  const [isResizing, setIsResizing] = useState(false);
  const [isExtended, setIsExtended] = useState(false);
  const [isHoveringRoller, setIsHoveringRoller] = useState(false);

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isResizing) return;
      // Chatbox is on the left, so its width is equal to the clientX position
      const newWidth = clientX;
      if (newWidth >= 250 && newWidth <= 800) {
        setWorkspaceWidth(newWidth);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isResizing]);

  // Dynamic app builder type for vibe coding preview (like bolt.new or lovable)
  const [generatedAppType, setGeneratedAppType] = useState<'landing_page' | 'calculator' | 'todo' | 'weather' | 'pomodoro' | 'budget' | 'ai_chat'>('landing_page');

  const getFileName = (appType: 'landing_page' | 'calculator' | 'todo' | 'weather' | 'pomodoro' | 'budget' | 'ai_chat') => {
    switch (appType) {
      case 'calculator': return 'Calculator.tsx';
      case 'todo': return 'TodoBoard.tsx';
      case 'weather': return 'WeatherWidget.tsx';
      case 'pomodoro': return 'FocusTimer.tsx';
      case 'budget': return 'BudgetTracker.tsx';
      case 'ai_chat': return 'AIChatbot.tsx';
      default: return 'LandingPage.tsx';
    }
  };

  const activeFileName = getFileName(generatedAppType);

  // Interactive dynamic files list based on the vibe-compiled app
  const workspaceFiles = [
    { name: 'App.tsx', size: '2.4kb', modified: '2 mins ago' },
    { name: activeFileName, size: '12.4kb', modified: 'Just now' },
    { name: 'package.json', size: '1.1kb', modified: '1 day ago' },
    { name: 'global.css', size: '4.2kb', modified: '3 hours ago' }
  ];

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
      
      let detectedAppType: 'landing_page' | 'calculator' | 'todo' | 'weather' | 'pomodoro' | 'budget' | 'ai_chat' | null = null;

      // Determine which high-fidelity app code they want to compile (like bolt.new / lovable)
      if (promptLower.includes('calculator') || promptLower.includes('calc') || promptLower.includes('math') || promptLower.includes('arithmetic')) {
        detectedAppType = 'calculator';
      } else if (promptLower.includes('todo') || promptLower.includes('task') || promptLower.includes('list') || promptLower.includes('kanban') || promptLower.includes('checklist')) {
        detectedAppType = 'todo';
      } else if (promptLower.includes('weather') || promptLower.includes('forecast') || promptLower.includes('rain') || promptLower.includes('sunny') || promptLower.includes('temperature')) {
        detectedAppType = 'weather';
      } else if (promptLower.includes('pomodoro') || promptLower.includes('timer') || promptLower.includes('clock') || promptLower.includes('countdown')) {
        detectedAppType = 'pomodoro';
      } else if (promptLower.includes('budget') || promptLower.includes('finance') || promptLower.includes('expense') || promptLower.includes('transaction') || promptLower.includes('money')) {
        detectedAppType = 'budget';
      } else if (promptLower.includes('assistant') || promptLower.includes('bot') || promptLower.includes('gpt') || promptLower.includes('ai chat') || (promptLower.includes('ai') && promptLower.includes('chat'))) {
        detectedAppType = 'ai_chat';
      } else if (promptLower.includes('landing') || promptLower.includes('website') || promptLower.includes('apex') || promptLower.includes('marketing')) {
        detectedAppType = 'landing_page';
      }

      if (detectedAppType) {
        setGeneratedAppType(detectedAppType);
        const codeFile = getFileName(detectedAppType);
        feedbackText = `Successfully analyzed prompt intents, generated React + Tailwind source, and compiled fully functional interactive ${detectedAppType.replace('_', ' ')} components inside **${codeFile}**! Hot reloading complete.`;
      } else {
        // Apply micro-style modifications if they are customizing the existing theme/elements
        if (promptLower.includes('dark') || promptLower.includes('night')) {
          setPreviewTheme('dark');
          feedbackText = "Applied a responsive minimal dark theme with full contrast.";
        } else if (promptLower.includes('cosmic') || promptLower.includes('purple') || promptLower.includes('galaxy')) {
          setPreviewTheme('cosmic');
          feedbackText = "Woven a celestial vibe into the preview complete with a purple starry accent gradient.";
        } else if (promptLower.includes('light') || promptLower.includes('white')) {
          setPreviewTheme('light');
          feedbackText = "Reset preview workspace to our signature clean daylight layout.";
        } else if (promptLower.includes('glass') || promptLower.includes('frosted')) {
          setPreviewTheme('glass');
          feedbackText = "Infused dynamic .liquid-glass backdrop-blur backdrops to layout cards.";
        }

        if (promptLower.includes('headline') || promptLower.includes('title') || promptLower.includes('change text')) {
          const words = text.split(" ");
          const index = words.findIndex(w => w.toLowerCase().includes('headline') || w.toLowerCase().includes('title'));
          if (index !== -1 && index + 1 < words.length) {
            const matched = words.slice(index + 1).join(" ").replace(/['"]+/g, '');
            if (matched.trim().length > 3) {
              setPreviewHeadline(matched);
              feedbackText += ` Updated the primary headline view to "${matched}".`;
            }
          } else {
            setPreviewHeadline("Design with code. Build with light.");
            feedbackText += " Set headline banner to standard alternative mockup mode.";
          }
        }

        if (promptLower.includes('badge') || promptLower.includes('pill')) {
          if (promptLower.includes('hide') || promptLower.includes('remove')) {
            setShowFeatureBadge(false);
            feedbackText += " Hidden the active promotional badge capsule.";
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
          if (promptLower.includes('green') || promptLower.includes('emerald') || promptLower.includes('violet')) {
            setPrimaryButtonColor('violet');
          } else if (promptLower.includes('indigo') || promptLower.includes('blue')) {
            setPrimaryButtonColor('indigo');
          } else if (promptLower.includes('purple')) {
            setPrimaryButtonColor('purple');
          } else {
            setPrimaryButtonColor('black');
          }
          feedbackText += " Re-configured primary CTA button visual accent.";
        }

        if (promptLower.includes('card') || promptLower.includes('feature') || promptLower.includes('grid')) {
          setShowSecondaryCard(true);
          feedbackText += " Synthesized an extra secondary stats card layout.";
        }
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
        
        {/* Left Section: Logo & App Name */}
        <div className="flex items-center gap-3">
          {/* Back to Dashboard Button */}
          <button 
            onClick={() => setCurrentView('chat')}
            className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-zinc-400 hover:text-white transition-colors mr-1 cursor-pointer border-r border-white/10 pr-3"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          
          {/* Custom lucid.dev Logo styled elegantly following the design guidelines */}
          <div className="flex items-center gap-2 mr-1 border-r border-white/10 pr-3">
            <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center font-heading text-xs italic">
              l
            </div>
            <span className="font-heading text-base italic text-white tracking-wider select-none">lucid.dev</span>
          </div>

          {/* Custom Toggle Button resembling the screenshot exactly */}
          <button 
            onClick={() => alert("Workspace view customized")}
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

        {/* Right Section: Sparks Zap chip + UPGRADE button + User avatar */}
        <div className="flex items-center gap-3">
          
          {/* Sparkly UPGRADE Button in top bar */}
          <button 
            onClick={() => setShowPricingModal(true)}
            className="h-8 bg-white hover:bg-white/90 text-black px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-[0_3px_16px_rgba(255,255,255,0.15)] flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <Sparkles className="w-3 h-3 fill-black text-black" />
            <span>UPGRADE</span>
          </button>

          {/* Sparks zap chip - Pill styled, glowing purple/blue border */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1a1c35]/35 hover:bg-[#1a1c35]/50 border border-[#6366f1]/25 rounded-full transition-all duration-300 shadow-[0_2px_12px_rgba(99,102,241,0.05)]">
            <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20 animate-pulse" />
            <span className="text-[11px] font-bold text-indigo-300 font-mono tracking-tight">{user.credits}.0</span>
          </div>

          {/* User Profile Avatar with custom character image */}
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.5)] cursor-pointer hover:border-white/20 transition-all flex items-center justify-center bg-zinc-950">
            <img 
              src="https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=80&h=80&fit=crop" 
              alt="Fleetyre" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Small active dot indicator */}
            <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-indigo-500 border border-[#07080c]" />
          </div>

        </div>

      </header>

      {/* MAIN CONTENT SPLIT */}
      <div className="flex-1 flex overflow-hidden w-full relative z-10">
        
        {/* LEFT WORKSPACE PANEL */}
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
          primaryButtonColor={primaryButtonColor as any}
          setPrimaryButtonColor={setPrimaryButtonColor as any}
          workspaceFiles={workspaceFiles}
          playChime={playChime}
          generatedAppType={generatedAppType}
          setGeneratedAppType={setGeneratedAppType}
          width={workspaceWidth}
          isExtended={isExtended}
        />

        {/* THE DIVIDER LINE (RESIZE HANDLE / SPLITTER) */}
        <div 
          onMouseEnter={() => setIsHoveringRoller(true)}
          onMouseLeave={() => setIsHoveringRoller(false)}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            setIsResizing(true);
          }}
          className={`relative w-2 h-full flex items-center justify-center cursor-col-resize select-none z-40 transition-all duration-300 ${
            isResizing 
              ? 'bg-violet-600/30 border-l-2 border-r-2 border-violet-500 shadow-[0_0_30px_rgba(139,92,246,0.7)]' 
              : isHoveringRoller 
                ? 'bg-violet-600/10 border-l border-r border-violet-500/35 shadow-[0_0_15px_rgba(139,92,246,0.4)]' 
                : 'bg-[#060608] border-l border-r border-white/[0.02]'
          }`}
        >
          {/* Electric Violet Handle Line */}
          <div className={`w-[2px] h-full transition-all duration-300 ${
            isResizing 
              ? 'bg-violet-400 shadow-[0_0_15px_#8b5cf6]' 
              : isHoveringRoller 
                ? 'bg-violet-500/70 shadow-[0_0_8px_rgba(139,92,246,0.5)]' 
                : 'bg-white/[0.04]'
          }`} />

          {/* Floating Pill Extension Badge close to the roller cursor */}
          {(isHoveringRoller || isResizing || isExtended) && (
            <div 
              onMouseDown={(e) => e.stopPropagation()} // Prevent initiating resizing drag when clicking button!
              onTouchStart={(e) => e.stopPropagation()}
              className="absolute pointer-events-auto flex items-center gap-1 p-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.8)] z-50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-white/10"
              title={isExtended ? "Restore split layout" : "Extend Chatbox over Preview"}
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              <button 
                onClick={() => setIsExtended(!isExtended)}
                className="flex items-center gap-1 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider font-sans border-none bg-transparent cursor-pointer select-none text-white"
              >
                {isExtended ? (
                  <>
                     <ChevronLeft className="w-3.5 h-3.5 text-white stroke-[3]" />
                    <span>Split View</span>
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-white stroke-[3]" />
                    <span>Extend Chat</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT LIVE RENDERING VIBE SANDBOX PREVIEW SECTION */}
        {!isExtended && (
          <IDEPreview
            activePreviewDevice={activePreviewDevice}
            setActivePreviewDevice={setActivePreviewDevice}
            previewTheme={previewTheme}
            previewHeadline={previewHeadline}
            showFeatureBadge={showFeatureBadge}
            badgeText={badgeText}
            primaryButtonColor={primaryButtonColor as any}
            showSecondaryCard={showSecondaryCard}
            playChime={playChime}
            generatedAppType={generatedAppType}
          />
        )}

      </div>

      {/* POPPING OUT PRICING OVERLAY */}
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />

    </div>
  );
};
