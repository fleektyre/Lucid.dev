import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Paperclip, 
  Mic, 
  ArrowUp, 
  ChevronDown, 
  Layout, 
  Database, 
  Globe, 
  Code2,
  Zap,
  Image as ImageIcon,
  Rocket,
  Sparkles
} from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';

const prompts = [
  "Build a futuristic SaaS dashboard for a finance startup",
  "Create an AI real estate marketplace with interactive maps",
  "Generate a luxury car dealership website with 3D transitions",
  "Build a social platform for creators with monetization",
  "Create a modern architecture portfolio with cinematic scrolling",
  "Generate a smart home control dashboard with AI automation"
];

const models = ["GPT-4o", "Claude 3.5", "Gemini 1.5", "DeepSeek-V3"];
const tabs = ["Build", "UI", "Backend", "Database", "Deploy"];

export const AIPanel: React.FC = () => {
  const { aiState, setAIState } = useStudioStore();
  const [displayText, setDisplayText] = useState("");
  const [promptIdx, setPromptIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("Build");

  useEffect(() => {
    let timer: any;
    const currentPrompt = prompts[promptIdx];
    
    const tick = () => {
      if (!isDeleting) {
        setDisplayText(currentPrompt.substring(0, displayText.length + 1));
        if (displayText.length === currentPrompt.length) {
          timer = setTimeout(() => setIsDeleting(true), 3000);
          return;
        }
      } else {
        setDisplayText(currentPrompt.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setPromptIdx((prev) => (prev + 1) % prompts.length);
          return;
        }
      }
      timer = setTimeout(tick, isDeleting ? 30 : 60);
    };

    timer = setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, promptIdx]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="max-w-[920px] w-full lucid-glass-dark rounded-[32px] p-8 shadow-2xl relative overflow-hidden group"
    >
      {/* Decorative Glow */}
      <div className="absolute -inset-20 bg-accent/5 blur-[120px] pointer-events-none -z-10 group-hover:bg-accent/10 transition-colors duration-1000" />
      
      {/* Header Tabs & Model */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-2xl transition-all border border-white/5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">{aiState.model}</span>
            <ChevronDown className="w-4 h-4 text-white/20" />
          </button>
          <div className="h-6 w-px bg-white/10" />
          <nav className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                  ${activeTab === tab ? 'bg-white text-black shadow-lg' : 'text-white/30 hover:text-white'}
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Status</span>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-accent uppercase tracking-tight">Active</span>
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Latency</span>
            <span className="text-[10px] font-bold text-white/80">{aiState.latency}ms</span>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="relative space-y-6">
        <div className="lucid-glass-strong p-1 rounded-[32px] ring-1 ring-white/10 group-hover:ring-accent/30 transition-all duration-700">
          <div className="bg-black/60 rounded-[31px] p-8 flex flex-col gap-6">
             <div className="flex items-start gap-4">
               <div className="flex flex-col gap-2 pt-2">
                  <button className="p-3 hover:bg-white/5 rounded-xl transition-all text-white/40 hover:text-white group/btn">
                    <Paperclip className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button className="p-3 hover:bg-white/5 rounded-xl transition-all text-white/40 hover:text-white group/btn">
                    <Mic className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </button>
               </div>
               
               <div className="flex-1 py-4 px-2 min-h-[140px] relative">
                 <div className="text-3xl font-schibsted font-medium tracking-tight text-white leading-relaxed">
                    {displayText}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-1 h-9 bg-accent ml-2 align-middle shadow-[0_0_15px_rgba(90,225,76,0.6)]"
                    />
                 </div>
               </div>

               <button className="mt-2 w-16 h-16 rounded-[24px] bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.25)] group/submit">
                 <ArrowUp className="w-8 h-8 group-hover/submit:-translate-y-1 transition-transform" strokeWidth={3} />
               </button>
             </div>

             <div className="flex flex-wrap gap-3">
               {[
                 { label: 'Screenshot → Code', icon: ImageIcon },
                 { label: 'AI UI Generation', icon: Layout },
                 { label: 'Full-Stack Apps', icon: Code2 },
                 { label: 'Supabase Integration', icon: Database },
                 { label: 'One-Click Deploy', icon: Rocket },
                 { label: 'Realtime Preview', icon: Globe }
               ].map((pill) => (
                 <button key={pill.label} className="lucid-glass px-4 py-2.5 rounded-full flex items-center gap-2.5 group/pill hover:bg-white/5 hover:border-white/20 transition-all">
                    <pill.icon className="w-4 h-4 text-white/40 group-hover/pill:text-accent transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover/pill:text-white">{pill.label}</span>
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
