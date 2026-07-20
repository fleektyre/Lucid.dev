import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Mic, MicOff, ChevronDown, ArrowRight, X, Sparkles, Check, Loader2, Cpu } from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';
import { auth } from '../../lib/firebase/client';

interface CreateAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAppModal: React.FC<CreateAppModalProps> = ({ isOpen, onClose }) => {
  const { 
    setShowCreateAppModal, 
    setCurrentView, 
    addNotification,
    glowFeatureEnabled
  } = useStudioStore();

  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  // Stop recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  // Recording Timer hook
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
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn('Error stopping speech recognition:', e);
        }
      }
      setIsRecording(false);
      addNotification('info', 'Voice Input', 'Voice guidelines recording stopped.');
    } else {
      if (!SpeechRecognitionAPI) {
        setIsRecording(true);
        addNotification('info', 'Voice Input', 'Speech Recognition API not supported. Simulating...');
        return;
      }

      try {
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let startValue = prompt;

        recognition.onstart = () => {
          setIsRecording(true);
          addNotification('info', 'Voice Input', 'Listening... Speak your prompt guidelines now.');
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const speechText = finalTranscript || interimTranscript;
          if (speechText) {
            setPrompt((startValue ? startValue.trim() + " " : "") + speechText);
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          let userMessage = `Voice entry error: ${event.error || 'unknown'}`;
          if (event.error === 'not-allowed') {
            userMessage = 'Microphone access is blocked. Please allow microphone permissions in your browser or click on the browser address bar icon to unblock.';
          } else if (event.error === 'service-not-allowed') {
            userMessage = 'Speech recognition service is not allowed by your browser or network.';
          }
          addNotification('error', 'Voice Input', userMessage);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();

      } catch (err: any) {
        console.error("SpeechRecognition initialization failed:", err);
        setIsRecording(true);
        addNotification('info', 'Voice Input', 'Speech Recognition failed to start. Simulating...');
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsSubmitting(true);

    try {
      // Hit the compilation endpoint to register the generation task
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: auth.currentUser?.uid || 'u1',
          prompt: prompt.trim(),
          taskType: 'STANDARD_UI'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Synthesis engine failed.');
      }

      setSuccess(true);
      
      // Notify user
      addNotification(
        'ai',
        'Vibe App Synthesized',
        'Successfully initiated app build from the workspace popup!'
      );

      // Short delay for high fidelity success state
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccess(false);
        setPrompt('');
        setShowCreateAppModal(false);
        setCurrentView('vibe');
      }, 800);

    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
      addNotification(
        'error',
        'Compilation Failure',
        (error as Error).message || 'Failed to trigger Vibe IDE compilation.'
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 24, stiffness: 180 }}
            className="relative w-full max-w-2xl bg-[#0b0b0c] text-zinc-100 rounded-[28px] p-8 shadow-[0_0_80px_rgba(0,0,0,0.9),0_0_50px_rgba(14,165,233,0.08)] z-10 flex flex-col overflow-hidden border border-zinc-800/80 font-body"
          >
            {/* Ambient background glow if enabled */}
            {glowFeatureEnabled && (
              <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 blur-2xl opacity-40 pointer-events-none z-0 animate-pulse" />
            )}

            {/* Cinematic Background Glows */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Close trigger */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/5 w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer focus:outline-none border border-transparent hover:border-white/5 z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Content */}
            <div className="text-center mt-2 mb-8 select-none z-10">
              <h2 className="text-3xl md:text-[40px] font-sans font-medium tracking-tight text-white leading-tight">
                What will you <span className="italic font-heading text-sky-400 font-normal">vibe</span> today?
              </h2>
              <p className="text-sm text-zinc-400 mt-2.5 tracking-wide">
                Vibe full-stack web environments via integrated intelligence engines.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative flex flex-col gap-4 z-10">
              <div 
                className={`w-full backdrop-blur-xl rounded-[24px] p-4.5 transition-all duration-300 flex flex-col gap-3 relative border ${
                  isFocused 
                    ? 'bg-[#18181b]/95 border-sky-500/20 shadow-[0_0_40px_rgba(14,165,233,0.25),0_30px_60px_rgba(0,0,0,0.8)]' 
                    : 'bg-[#18181b]/75 border-zinc-800/80 shadow-[0_0_50px_rgba(14,165,233,0.12),0_30px_60px_rgba(0,0,0,0.65)] hover:border-sky-500/20'
                }`}
              >
                {/* Textarea */}
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={isRecording ? "Listening to your spoken guidelines... Tap microphone to stop." : "Ask anything to build or modify application environments..."}
                  rows={4}
                  className="w-full bg-transparent resize-none border-none focus:ring-0 focus:outline-none text-[15px] leading-relaxed text-white placeholder:text-zinc-500 font-sans pr-24"
                  disabled={isSubmitting || isRecording}
                />

                {/* Real-time Voice Recording waveform simulation */}
                {isRecording && (
                  <div className="absolute top-4 right-4 flex items-center gap-2.5 bg-zinc-900/80 border border-emerald-500/20 px-3 py-1.5 rounded-full backdrop-blur z-20">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{formatRecordingTime(recordingTime)}</span>
                    <div className="flex gap-0.5 items-end h-3">
                      {[1,2,3,4,5].map(i => (
                        <span 
                          key={i} 
                          className="w-0.5 bg-emerald-400 rounded-full animate-pulse" 
                          style={{ 
                            height: `${30 + Math.random() * 70}%`,
                            animationDelay: `${i * 100}ms`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-white/[0.03] pt-4 gap-4 select-none">
                  {/* Left Controls */}
                  <div className="flex items-center gap-2">
                    {/* Attachment Plus button */}
                    <button 
                      type="button"
                      className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-400 hover:text-white transition-all focus:outline-none cursor-pointer"
                      title="Add attachment"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Microphone voice button */}
                    <button
                      type="button"
                      onClick={handleToggleRecording}
                      className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all cursor-pointer focus:outline-none 
                        ${isRecording 
                          ? 'bg-rose-500/10 border-rose-500/50 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse' 
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-400 hover:text-white'
                        }
                      `}
                      title="Voice input"
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    {/* LLM Selector Dropdown */}
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 hover:text-white py-1.5 px-3 rounded-lg border border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all cursor-pointer">
                      <span>Gemini 3.5 Flash</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </div>

                  {/* Right Action Trigger (Enhance, Plan & Vibe Now) */}
                  <div className="flex items-center gap-3">
                    {/* Enhance prompt button */}
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-[11px] font-bold py-1.5 px-3 rounded-lg border border-zinc-850 bg-zinc-900/40 text-zinc-400 hover:text-sky-400 hover:border-sky-500/30 transition-all focus:outline-none cursor-pointer"
                      title="Enhance prompt"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      <span>Enhance prompt</span>
                    </button>

                    {/* Plan toggle button */}
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg text-zinc-400 hover:text-white border border-transparent transition-all focus:outline-none cursor-pointer"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Plan</span>
                    </button>

                    {/* Vibe now trigger */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !prompt.trim()}
                      className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 disabled:from-blue-800 disabled:to-purple-800 text-white font-extrabold text-[12px] px-6 py-2.5 rounded-full flex items-center gap-1.5 shadow-[0_0_20px_rgba(99,102,241,0.55)] hover:shadow-[0_0_30px_rgba(99,102,241,0.85)] cursor-pointer hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 border border-white/10"
                    >
                      {isSubmitting ? (
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
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
