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
  const { addNotification } = useStudioStore();
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

  // Plus button custom dropdown states
  const [showPlusDropdown, setShowPlusDropdown] = useState(false);
  const [plusDropdownView, setPlusDropdownView] = useState<'main' | 'attach' | 'design' | 'connectors' | 'databases'>('main');
  const [dropdownSearch, setDropdownSearch] = useState('');
  
  // Attachments state
  const [attachedFiles, setAttachedFiles] = useState<{ id: string, name: string, type: 'file' | 'screenshot' }[]>([]);
  const [showCaptureFlash, setShowCaptureFlash] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

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

  const handleSend = () => {
    const textToSend = inputValue.trim();
    if (!textToSend && attachedFiles.length === 0) {
      showToast("Please enter a vibe prompt or drop file attachments.");
      return;
    }

    setIsGenerating(true);
    showToast("Starting modular workspace compiler pipeline...");

    setTimeout(() => {
      setIsGenerating(false);
      setInputValue("");
      setAttachedFiles([]);
      showToast("Vibe workspace compilation complete! Running dev server on port 3500.");
      
      // Dispatch real user event notification
      addNotification(
        'ai', 
        'AI Generation Finished', 
        `Successfully synthesized high fidelity CSS glass modules for: "${textToSend || 'Workspace layout structure'}"`
      );
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-[#18181b]/75 backdrop-blur-xl border border-zinc-800/80 rounded-[24px] p-4.5 shadow-[0_0_50px_rgba(14,165,233,0.12),0_30px_60px_rgba(0,0,0,0.65)] hover:border-sky-500/20 hover:shadow-[0_0_60px_rgba(14,165,233,0.20),0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-500 relative flex flex-col gap-3"
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
        <div className="w-full relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.slice(0, 4000))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isRecording}
            placeholder={isRecording ? "Listening to your spoken guidelines... Tap microphone to stop." : "Let's vibe a private user portal where guests can..."}
            className={`w-full bg-transparent border-none text-white focus:outline-none resize-none min-h-[72px] text-15 font-sans leading-relaxed transition-all duration-300
              ${isRecording ? 'placeholder:text-emerald-400 italic' : 'placeholder:text-zinc-500/95'}
            `}
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
        <div className="flex flex-col md:flex-row md:items-center justify-between pt-1 gap-4 select-none">
          
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

            {/* Vibe Button (Premium Sky Blue like reference) */}
            <button
              onClick={handleSend}
              disabled={isGenerating}
              className="bg-sky-500 hover:bg-sky-400 disabled:bg-sky-650 text-black font-extrabold text-[12px] px-5 py-2 rounded-full flex items-center gap-1.5 shadow-lg shadow-sky-500/10 cursor-pointer hover:scale-102 active:scale-98 transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>Compiling...</span>
                </>
              ) : (
                <>
                  <span>Vibe now</span>
                  <ArrowRight className="w-3.5 h-3.5 font-black" strokeWidth={3} />
                </>
              )}
            </button>
          </div>

        </div>
      </motion.div>

      {/* FOOTER ANCHORS - or start from */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2 select-none">
        <span className="text-[11px] font-sans text-zinc-500">or start from</span>

        <button className="flex items-center gap-1.5 bg-zinc-900/40 hover:bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-full text-xs text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer">
          <PenTool className="w-3.5 h-3.5 text-purple-400" />
          <span>Figma</span>
        </button>

        <button className="flex items-center gap-1.5 bg-zinc-900/40 hover:bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-full text-xs text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer">
          <Github className="w-3.5 h-3.5 text-zinc-300" />
          <span>GitHub</span>
        </button>

        <button className="flex items-center gap-1.5 bg-zinc-900/40 hover:bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-full text-xs text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer">
          <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
          <span>Team template</span>
        </button>
      </div>

    </div>
  );
};
