import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ChevronDown, 
  Sparkles, 
  ArrowRight,
  Github,
  PenTool,
  Cpu,
  Bookmark,
  Mic,
  MicOff,
  Paperclip,
  Palette,
  GitBranch,
  Database,
  Search,
  FileText,
  Camera,
  X,
  Loader2,
  ChevronLeft,
  Check,
  Sparkle
} from 'lucide-react';

import { useStudioStore } from '../store/useStudioStore';

export const AIPanel: React.FC = () => {
  const { addNotification, glowFeatureEnabled, finishSoundEnabled, setCurrentView } = useStudioStore();
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [planMode, setPlanMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Standard');
  const [activeDropdown, setActiveDropdown] = useState<'model' | null>(null);

  // Voice recording simulation states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef<any>(null);

  // Prompt enhancer state
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Fading "Let's vibe" ideas state
  const ideas = [
    "a private user portal where guests can submit design briefs...",
    "a SaaS landing page with dark glassmorphic components...",
    "a clean interactive finance dashboard with real-time charts...",
    "a professional portfolio for a digital artist with fluid transitions...",
    "a high-performance task organizer using custom spring physics..."
  ];
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdeaIndex((prev) => (prev + 1) % ideas.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Plus button custom dropdown states
  const [showPlusDropdown, setShowPlusDropdown] = useState(false);
  const [plusDropdownView, setPlusDropdownView] = useState<'main' | 'attach' | 'design' | 'connectors' | 'databases'>('main');
  const [dropdownSearch, setDropdownSearch] = useState('');
  
  // Attachments state
  const [attachedFiles, setAttachedFiles] = useState<{ id: string, name: string, type: 'file' | 'screenshot' }[]>([]);
  const [showCaptureFlash, setShowCaptureFlash] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowPlusDropdown(false);
        setPlusDropdownView('main');
      }
    };
    if (showPlusDropdown) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showPlusDropdown]);

  // Voice Recording Timer hook
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const formatRecordingTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      showToast("Voice recording finished");
    } else {
      setIsRecording(true);
      showToast("Listening... Speak your prompt guidelines now.");
    }
  };

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3500);
  };

  const handleEnhancePrompt = () => {
    if (isEnhancing) return;
    setIsEnhancing(true);
    showToast("Analyzing layout semantics with integrated LLMs...");

    setTimeout(() => {
      setIsEnhancing(false);
      setInputValue(prev => {
        const trimmed = prev.trim();
        if (!trimmed) {
          return "Construct a beautiful state-of-the-art interactive analytical workspace featuring custom liquid-glass aesthetic cards, hardware-accelerated transitions via Framer Motion, micro-interaction state loops, and responsive Barlow typography.";
        }
        return `Architect a professional, high-fidelity responsive layout for ${trimmed} utilizing custom Framer Motion spring parameters, premium Instrument Serif headings, sleek pixel-perfect glassmorphic sidebar assets, and integrated client-side wallet transactions mock states.`;
      });
      showToast("Prompt successfully enhanced for visual fidelity.");
    }, 1300);
  };

  const playFinishChime = () => {
    // Sound disabled by user request
  };

  const handleSend = () => {
    const textToSend = inputValue.trim();
    if (!textToSend && attachedFiles.length === 0) {
      showToast("Please enter a vibe prompt or drop file attachments.");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setInputValue("");
      setAttachedFiles([]);
      
      if (finishSoundEnabled) {
        playFinishChime();
      }
      
      // Dispatch real user event notification
      addNotification(
        'ai', 
        'AI Generation Finished', 
        `Successfully synthesized high fidelity CSS glass modules for: "${textToSend || 'Workspace layout structure'}"`
      );

      // Transition to the interactive Vibe Coding IDE workspace
      setCurrentView('vibe');
    }, 2400);
  };

  // Plus Dropdown Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAttachedFiles(prev => [...prev, {
        id: Math.random().toString(),
        name: file.name,
        type: 'file'
      }]);
      setShowPlusDropdown(false);
      showToast(`Selected file: ${file.name}`);
    }
  };

  const handleTakeScreenshot = () => {
    setShowPlusDropdown(false);
    setShowCaptureFlash(true);

    // After camera flash effect, add virtual screenshot preview file
    setTimeout(() => {
      setShowCaptureFlash(false);
      const screenshotName = `Viewport_Capture_${Math.floor(1000 + Math.random() * 9000)}.png`;
      setAttachedFiles(prev => [...prev, {
        id: Math.random().toString(),
        name: screenshotName,
        type: 'screenshot'
      }]);
      showToast(`Captured workspace screenshot: ${screenshotName}`);
    }, 450);
  };

  const removeAttachedFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[850px] px-4 relative">
      
      {/* Dynamic full-screen camera screenshot capture flash effect */}
      <AnimatePresence>
        {showCaptureFlash && (
          <motion.div 
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="fixed inset-0 bg-white z-[10000] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Floating System Notification Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed top-8 right-8 z-[9999] bg-zinc-950/90 border border-emerald-500/20 shadow-[0_12px_44px_rgba(16,185,129,0.12)] p-4 rounded-2xl flex items-center gap-3 backdrop-blur-xl"
            style={{ borderLeftWidth: '4px', borderLeftColor: '#10b981' }}
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Check className="w-3 h-3" />
            </div>
            <p className="text-xs font-medium text-zinc-100 pr-4">{successToast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER ABOVE THE CHATBOX - Custom Lyric & Aesthetic */}
      <div className="text-center mt-4 mb-2 select-none">
        <h1 className="text-3xl md:text-[46px] font-sans font-medium tracking-tight text-white leading-tight">
          What will you <span className="italic font-serif text-sky-450 font-normal">vibe</span> today?
        </h1>
        <p className="text-sm text-zinc-400 mt-2.5 tracking-wide">
          Vibe full-stack web environments via integrated intelligence engines.
        </p>
      </div>

      {/* CHATBOX PANEL CONTAINER */}
      <div className="relative w-full">
        {glowFeatureEnabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -inset-1.5 rounded-[26px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 blur-2xl opacity-45 pointer-events-none z-0 animate-pulse"
          />
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full backdrop-blur-xl rounded-[24px] p-4.5 transition-all duration-500 relative flex flex-col gap-3 z-10 ${
            glowFeatureEnabled 
              ? "bg-[#18181b]/95 border border-transparent bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 shadow-[0_0_40px_rgba(236,72,153,0.25),0_30px_60px_rgba(0,0,0,0.8)]"
              : "bg-[#18181b]/75 border border-zinc-800/80 shadow-[0_0_50px_rgba(14,165,233,0.12),0_30px_60px_rgba(0,0,0,0.65)] hover:border-sky-500/20 hover:shadow-[0_0_60px_rgba(14,165,233,0.20),0_20px_50px_rgba(0,0,0,0.7)]"
          }`}
        >
        
        {/* Attachment preview row (Prepares pills above input as expected in premium engines) */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-1.5 border-b border-zinc-800/20">
            {attachedFiles.map((file) => (
              <div 
                key={file.id} 
                className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 rounded-full py-1.5 px-3.5 text-[11px] font-sans text-white/90"
              >
                {file.type === 'file' ? (
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="truncate max-w-[140px] italic">{file.name}</span>
                <button 
                  onClick={() => removeAttachedFile(file.id)}
                  className="text-zinc-500 hover:text-white transition-colors ml-1 focus:outline-none cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* INPUT AND RECORDING DISPLAY */}
        <div className="w-full relative min-h-[72px]">
          {/* Custom Animated Placeholder Overlay */}
          {!inputValue && !isRecording && (
            <div 
              className={`absolute top-0 left-0 right-0 bottom-0 pointer-events-none select-none text-[15px] font-sans leading-relaxed pt-1 flex flex-wrap gap-x-1.5 z-0 transition-opacity duration-300
                ${isFocused ? 'opacity-35' : 'opacity-100'}
              `}
            >
              <span className="text-zinc-400 font-sans font-medium">Let's vibe</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentIdeaIndex}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-zinc-500 font-sans font-normal"
                >
                  {ideas[currentIdeaIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}

          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.slice(0, 4000))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isRecording}
            placeholder={isRecording ? "Listening to your spoken guidelines... Tap microphone to stop." : ""}
            className="w-full bg-transparent border-none text-white focus:outline-none resize-none min-h-[72px] text-[15px] font-sans leading-relaxed transition-all duration-300 relative z-10 pt-1"
          />

          {/* Real-time Voice Recording waveform simulation */}
          {isRecording && (
            <div className="absolute top-1 right-2 flex items-center gap-2.5 bg-zinc-900/80 border border-emerald-500/20 px-3 py-1.5 rounded-full backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-mono text-emerald-400 font-bold">{formatRecordingTime(recordingTime)}</span>
              <div className="flex gap-0.5 items-end h-3">
                {[1,2,3,4,5].map(i => (
                  <span 
                    key={i} 
                    className="w-0.5 bg-emerald-400 rounded-full" 
                    style={{ 
                      height: `${30 + Math.random() * 70}%`,
                      animation: 'pulse 0.6s infinite alternate',
                      animationDelay: `${i * 100}ms`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM ROW ACTION BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pt-1 gap-4 select-none border-t border-white/[0.03]">
          
          {/* LEFT: Custom Interactive dropdown with simulated Attach and features */}
          <div className="flex items-center gap-2 relative" ref={dropdownRef}>
            
            {/* Attachment Plus button & Dropdown container */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowPlusDropdown(!showPlusDropdown);
                  setPlusDropdownView('main');
                }}
                className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all cursor-pointer focus:outline-none
                  ${showPlusDropdown 
                    ? 'border-sky-500/50 bg-sky-500/10 text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.3)]' 
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-400 hover:text-white'
                  }
                `}
                title="Add attachment and services"
              >
                <Plus className={`w-4 h-4 transition-transform duration-300 ${showPlusDropdown ? 'rotate-45' : ''}`} />
              </button>

              {/* HIGH FIDELITY POPUP SYSTEM FROM MULTI-STAGE SCREENSHOT SPEC */}
              <AnimatePresence>
                {showPlusDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="absolute bottom-full left-0 mb-3 w-64 bg-zinc-950/95 border border-zinc-850 rounded-[18px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-[100] backdrop-blur-2xl"
                  >
                    {/* View 1: Main Feature Categories */}
                    {plusDropdownView === 'main' && (
                      <div className="flex flex-col gap-1">
                        {/* Search input header */}
                        <div className="px-2.5 py-1.5 mb-1.5 border-b border-zinc-900 flex items-center gap-2">
                          <Search className="w-3.5 h-3.5 text-zinc-500" />
                          <input 
                            type="text" 
                            placeholder="Search modules..."
                            value={dropdownSearch}
                            onChange={(e) => setDropdownSearch(e.target.value)}
                            className="bg-transparent border-none outline-none text-xs text-white placeholder:text-zinc-650 w-full font-light"
                          />
                        </div>

                        {/* List Options */}
                        <button
                          onClick={() => setPlusDropdownView('attach')}
                          className="w-full text-left px-3 py-2.5 hover:bg-zinc-900 rounded-xl text-xs font-medium text-zinc-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Paperclip className="w-3.5 h-3.5 text-zinc-400 group-hover:text-sky-400" />
                            <span>Attach</span>
                          </div>
                          <span className="text-[10px] text-zinc-600 font-sans">❯</span>
                        </button>

                        <button
                          onClick={() => setPlusDropdownView('design')}
                          className="w-full text-left px-3 py-2.5 hover:bg-zinc-900 rounded-xl text-xs font-medium text-zinc-400 cursor-not-allowed flex items-center justify-between group opacity-50"
                        >
                          <div className="flex items-center gap-2.5">
                            <Palette className="w-3.5 h-3.5" />
                            <span>Design</span>
                          </div>
                          <span className="text-[10px] text-zinc-700">❯</span>
                        </button>

                        <button
                          onClick={() => setPlusDropdownView('connectors')}
                          className="w-full text-left px-3 py-2.5 hover:bg-zinc-900 rounded-xl text-xs font-medium text-zinc-400 cursor-not-allowed flex items-center justify-between group opacity-50"
                        >
                          <div className="flex items-center gap-2.5">
                            <GitBranch className="w-3.5 h-3.5" />
                            <span>Connectors</span>
                          </div>
                          <span className="text-[10px] text-zinc-700">❯</span>
                        </button>

                        <button
                          onClick={() => setPlusDropdownView('databases')}
                          className="w-full text-left px-3 py-2.5 hover:bg-zinc-900 rounded-xl text-xs font-medium text-zinc-400 cursor-not-allowed flex items-center justify-between group opacity-50"
                        >
                          <div className="flex items-center gap-2.5">
                            <Database className="w-3.5 h-3.5" />
                            <span>Databases</span>
                          </div>
                          <span className="text-[10px] text-zinc-700">❯</span>
                        </button>
                      </div>
                    )}

                    {/* View 2: ATTACH SUBMENU (EXACT SCREENSHOT HIGH FIDELITY) */}
                    {plusDropdownView === 'attach' && (
                      <div className="flex flex-col gap-1">
                        {/* Interactive back & search row */}
                        <div className="px-2 py-1.5 mb-1.5 border-b border-zinc-900 flex items-center gap-2">
                          <button
                            onClick={() => setPlusDropdownView('main')}
                            className="p-1 rounded bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex items-center gap-1.5 flex-grow">
                            <Search className="w-3 h-3 text-zinc-500" />
                            <span className="text-[11px] text-zinc-400 font-light">Search...</span>
                          </div>
                        </div>

                        {/* File Attachment Action (Triggers true file uploader) */}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full text-left px-3 py-2.5 hover:bg-zinc-900 rounded-xl text-[12px] font-medium text-blue-400 hover:text-blue-300 transition-all flex items-center gap-2.5 cursor-pointer bg-blue-500/5 border border-blue-500/10"
                        >
                          <FileText className="w-4 h-4" />
                          <span>File</span>
                        </button>

                        {/* Screenshot Attachment Action */}
                        <button
                          onClick={handleTakeScreenshot}
                          className="w-full text-left px-3 py-2.5 hover:bg-zinc-900 rounded-xl text-[12px] font-medium text-zinc-300 hover:text-white transition-all flex items-center gap-2.5 cursor-pointer"
                        >
                          <Camera className="w-4 h-4 text-zinc-400" />
                          <span>Take a screenshot</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hidden HTML input for native file browsing hook */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>

            {/* Simulated Voice Recording Microphone Trigger */}
            <button
              onClick={handleToggleRecording}
              className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all cursor-pointer focus:outline-none 
                ${isRecording 
                  ? 'bg-rose-500/10 border-rose-500/50 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse' 
                  : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-400 hover:text-white'
                }
              `}
              title="Voice guidelines feedback"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Selector: Active LLM and compiling level */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'model' ? null : 'model')}
                className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 hover:text-white py-1.5 px-3 rounded-lg border border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all cursor-pointer focus:outline-none"
              >
                <span>{selectedModel}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              <AnimatePresence>
                {activeDropdown === 'model' && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 bottom-full mb-2 w-48 bg-zinc-950 border border-zinc-850 rounded-xl p-1.5 shadow-2xl z-50 backdrop-blur-xl"
                    >
                      {['Standard', 'Hyper Engine', 'Lucid Turbo', 'Low Latency'].map((model) => (
                        <button
                          key={model}
                          onClick={() => {
                            setSelectedModel(model);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
                        >
                          {model}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: Plan Toggle, Prompt Enhancer, and Vibe Button */}
          <div className="flex items-center gap-3">
            {/* Enhance Prompt Magic Wand Button */}
            <button
              onClick={handleEnhancePrompt}
              disabled={isEnhancing}
              className={`flex items-center gap-1.5 text-[11px] font-bold py-1.5 px-3 rounded-lg border border-zinc-850 bg-zinc-900/40 text-zinc-400 hover:text-sky-400 hover:border-sky-500/30 transition-all cursor-pointer focus:outline-none
                ${isEnhancing ? 'text-zinc-500 border-zinc-900 bg-transparent animate-pulse' : ''}
              `}
              title="Enhance guidelines with AI specification details"
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Enhancing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-sky-400 grayscale-30 hover:grayscale-0" />
                  <span>Enhance prompt</span>
                </>
              )}
            </button>

            {/* Plan Button */}
            <button
              onClick={() => setPlanMode(!planMode)}
              className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer focus:outline-none 
                ${planMode 
                  ? 'bg-zinc-800 text-white border border-zinc-700' 
                  : 'text-zinc-400 hover:text-white border border-transparent'
                }
              `}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Plan</span>
            </button>

            {/* Vibe Button (Vibrant blue-purple gradient with glow matching the screenshot) */}
            <button
              onClick={handleSend}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 disabled:from-blue-800 disabled:to-purple-800 text-white font-extrabold text-[12px] px-6 py-2.5 rounded-full flex items-center gap-1.5 shadow-[0_0_20px_rgba(99,102,241,0.55)] hover:shadow-[0_0_30px_rgba(99,102,241,0.85)] cursor-pointer hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 border border-white/10"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Compiling...</span>
                </>
              ) : (
                <>
                  <span>Vibe now</span>
                  <ArrowRight className="w-3.5 h-3.5 font-black text-white" strokeWidth={3} />
                </>
              )}
            </button>
          </div>

        </div>
      </motion.div>
      </div>

      {/* Try One Suggestion Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5 text-xs text-white/70 select-none">
        <span className="font-medium text-zinc-400">Try one</span>
        <span className="text-white/20">→</span>
        <button 
          onClick={() => setInputValue("Build a modern SaaS landing page with fluid glass layouts...")}
          className="bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 rounded-full transition-all cursor-pointer font-sans text-white/90 font-medium"
        >
          Landing page
        </button>
        <button 
          onClick={() => setInputValue("Create a dark aesthetic personal website with portfolio gallery...")}
          className="bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 rounded-full transition-all cursor-pointer font-sans text-white/90 font-medium"
        >
          Personal website
        </button>
        <button 
          onClick={() => setInputValue("Architect a multi-tenant SaaS App with relational database logs...")}
          className="bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 rounded-full transition-all cursor-pointer font-sans text-white/90 font-medium"
        >
          SaaS App
        </button>
      </div>

      {/* My Apps Section */}
      <div className="w-full mt-10 select-none">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white tracking-tight font-sans">My apps</h2>
          <button 
            onClick={() => addNotification('info', 'All Apps Directory', 'Opening your comprehensive applications archive...')}
            className="text-zinc-400 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>See all</span>
            <span className="text-[10px] opacity-60">❯</span>
          </button>
        </div>

        {/* Grid of Apps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          
          {/* Card 1: Black & White Launch */}
          <div className="bg-[#121214]/40 border border-white/[0.06] hover:border-white/12 rounded-[1.25rem] p-3.5 flex flex-col gap-3.5 transition-all duration-300 hover:translate-y-[-2px] group relative overflow-hidden backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
            
            {/* Custom high-fidelity CSS illustration mockup */}
            <div className="aspect-[16/10] bg-[#fafafc] rounded-xl border border-black/5 overflow-hidden flex flex-col justify-between p-3 relative select-none">
              {/* Header bar of mock site */}
              <div className="flex items-center justify-between">
                <span className="text-[7px] font-black text-black tracking-tighter">Apex</span>
                <div className="flex items-center gap-1.5 text-[5px] text-zinc-500 font-semibold scale-90">
                  <span>Product</span>
                  <span>Features</span>
                  <span>Pricing</span>
                  <span>About</span>
                </div>
                <div className="flex items-center gap-1 scale-85">
                  <span className="text-[4px] text-zinc-700 font-bold px-1 py-0.5 rounded bg-zinc-100">Sign in</span>
                  <span className="text-[4px] text-white font-bold px-1.5 py-0.5 rounded bg-black">Get started</span>
                </div>
              </div>

              {/* Hero section inside mock site */}
              <div className="text-center my-auto flex flex-col items-center gap-1">
                <span className="text-[4px] font-bold text-zinc-400 bg-zinc-100 px-1 py-0.5 rounded uppercase tracking-wider">NOW IN PUBLIC BETA</span>
                <h3 className="text-xs font-black text-black leading-none tracking-tight mt-1 max-w-[110px]">
                  Build faster. Ship smarter.
                </h3>
                <p className="text-[4.5px] text-zinc-500 leading-normal max-w-[120px] mt-1 scale-90">
                  The platform that eliminates friction between your idea and your users. Simply by design, powerful at scale.
                </p>
                <div className="flex gap-1.5 mt-1 scale-85">
                  <span className="bg-black text-white text-[4px] px-2 py-1 rounded font-bold cursor-pointer hover:bg-zinc-800 transition-colors">Start for free</span>
                  <span className="border border-zinc-200 text-zinc-700 text-[4px] px-2 py-1 rounded font-bold cursor-pointer hover:bg-zinc-50 transition-colors">View the docs</span>
                </div>
              </div>

              {/* Visual Geometric Grid of half-filled triangles */}
              <div className="grid grid-cols-7 gap-1 w-full border-t border-zinc-150 pt-1.5 px-2">
                {Array.from({ length: 14 }).map((_, idx) => (
                  <div key={idx} className="aspect-square relative overflow-hidden bg-zinc-50 border border-zinc-100/60 rounded">
                    {idx % 3 === 0 && <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />}
                    {idx % 3 === 1 && <div className="absolute inset-0 bg-zinc-300" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />}
                    {idx % 3 === 2 && <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Card Info */}
            <div className="flex flex-col text-left px-0.5">
              <span className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">Black & White Launch</span>
              <span className="text-[10px] text-zinc-500 font-medium mt-1">Edited 24 minutes ago</span>
            </div>
          </div>

          {/* Card 2: SaaS Analytics Hub */}
          <div className="bg-[#121214]/40 border border-white/[0.06] hover:border-white/12 rounded-[1.25rem] p-3.5 flex flex-col gap-3.5 transition-all duration-300 hover:translate-y-[-2px] group relative overflow-hidden backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
            
            <div className="aspect-[16/10] bg-[#0c0c0e] rounded-xl border border-white/5 overflow-hidden flex flex-col justify-between p-3 relative select-none">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-1">
                <span className="text-[7px] font-bold text-white/95">Nucleus</span>
                <span className="text-[5px] text-zinc-400">v1.2.4</span>
              </div>
              
              <div className="grid grid-cols-3 gap-1.5 my-auto">
                <div className="bg-white/[0.02] border border-white/[0.04] rounded p-1 flex flex-col gap-0.5">
                  <span className="text-[4px] text-zinc-500">MAU</span>
                  <span className="text-[8px] font-bold text-emerald-400">+14.2%</span>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.04] rounded p-1 flex flex-col gap-0.5">
                  <span className="text-[4px] text-zinc-500">ARR</span>
                  <span className="text-[8px] font-bold text-sky-400">$84.2k</span>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.04] rounded p-1 flex flex-col gap-0.5">
                  <span className="text-[4px] text-zinc-500">VIBE</span>
                  <span className="text-[8px] font-bold text-purple-400">99.8%</span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-1 w-full px-1 border-t border-white/[0.04] pt-1.5">
                {[30, 60, 45, 90, 75, 50, 85, 95, 40, 70].map((h, i) => (
                  <div key={i} className="bg-white/10 rounded-t w-full" style={{ height: `${h * 0.15}px` }}>
                    {i === 7 && <div className="bg-sky-400 w-full h-full rounded-t" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col text-left px-0.5">
              <span className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">SaaS Analytics Hub</span>
              <span className="text-[10px] text-zinc-500 font-medium mt-1">Edited 2 hours ago</span>
            </div>
          </div>

          {/* Card 3: Celestial Vibe Portal */}
          <div className="bg-[#121214]/40 border border-white/[0.06] hover:border-white/12 rounded-[1.25rem] p-3.5 flex flex-col gap-3.5 transition-all duration-300 hover:translate-y-[-2px] group relative overflow-hidden backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
            
            <div className="aspect-[16/10] bg-gradient-to-br from-[#0c051a] to-[#04020a] rounded-xl border border-white/5 overflow-hidden flex flex-col justify-between p-3 relative select-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0,transparent_70%)]" />
              
              <div className="flex items-center justify-between relative z-10">
                <span className="text-[7px] font-serif italic text-purple-200">Cosmic</span>
                <span className="text-[4px] text-zinc-400 bg-white/5 px-1 py-0.5 rounded">ONLINE</span>
              </div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 border border-purple-400/30 m-auto relative z-10 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center">
                  <span className="text-[6px] text-purple-200 font-bold">VIBE</span>
                </div>
              </div>

              <span className="text-[5px] text-zinc-500 text-center relative z-10">Orbit: Active Sync Pipeline</span>
            </div>

            <div className="flex flex-col text-left px-0.5">
              <span className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">Celestial Vibe Portal</span>
              <span className="text-[10px] text-zinc-500 font-medium mt-1">Edited yesterday</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
