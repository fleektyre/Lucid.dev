import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layout, 
  Code2, 
  Globe, 
  Database, 
  Smartphone, 
  Check, 
  Sparkles, 
  Rocket, 
  Terminal,
  Layers,
  Image as ImageIcon,
  Activity
} from 'lucide-react';

const floatingVariant = {
  initial: { y: 0 },
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const PreviewCards: React.FC = () => {
  return (
    <>
      {/* Right Top: Screenshot to Code */}
      <motion.div 
        variants={floatingVariant}
        initial="initial"
        animate="animate"
        className="fixed top-[120px] right-24 w-[340px] lucid-glass rounded-[32px] p-1 shadow-2xl z-30 pointer-events-auto"
      >
        <div className="bg-black/40 rounded-[28px] p-6 flex flex-col gap-5">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Screenshot → Code</span>
              <div className="px-2 py-1 bg-accent/20 rounded border border-accent/20">
                <span className="text-[8px] font-black text-accent uppercase">Vision Alpha</span>
              </div>
           </div>
           <div className="relative group overflow-hidden rounded-2xl h-40 border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bbbda536339a?w=600&h=400&fit=crop" 
                alt="Vision Input"
                className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Scanline Effect */}
              <motion.div 
                animate={{ y: [-160, 160] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 right-0 h-0.5 bg-accent/40 shadow-[0_0_15px_#5ae14c] z-10"
              />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-white uppercase mt-1">Landing_Hero_Mockup.png</span>
                    <span className="text-[7px] text-white/40 uppercase">Uploaded 2m ago</span>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-accent text-black flex items-center justify-center">
                    <Check className="w-4 h-4" />
                 </div>
              </div>
           </div>
           
           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[9px] font-bold text-white/60 uppercase">Extraction progress</span>
                 <span className="text-[9px] font-bold text-accent">88%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   animate={{ width: "88%" }}
                   className="h-full bg-accent shadow-[0_0_10px_#5ae14c]" 
                 />
              </div>
           </div>
        </div>
      </motion.div>

      {/* Left Bottom: AI UI Generator */}
      <motion.div 
        animate={{
          y: [0, 15, 0],
          transition: { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }}
        className="fixed bottom-24 left-[340px] w-[300px] lucid-glass rounded-[32px] p-1 shadow-2xl z-30 pointer-events-auto"
      >
        <div className="bg-black/60 rounded-[28px] p-6 flex flex-col gap-5">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">AI UI Generator</span>
           </div>
           
           <div className="space-y-4">
              {[
                { label: 'Navbar Component', status: 'Generated' },
                { label: 'Hero Section', status: 'Syncing' },
                { label: 'Feature Grid', status: 'Pending' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                   <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center">
                      <Layout className="w-5 h-5 text-white/20" />
                   </div>
                   <div className="flex-1">
                      <div className="h-1.5 w-16 bg-white/20 rounded-full mb-1.5" />
                      <div className="text-[9px] font-bold text-white/30 uppercase">{item.label}</div>
                   </div>
                   <div className={`text-[8px] font-black uppercase ${item.status === 'Generated' ? 'text-accent' : 'text-white/20'}`}>
                      {item.status}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </motion.div>

      {/* Right Middle: Deployment Center */}
      <motion.div 
        animate={{
          y: [0, -10, 0],
          rotate: [0, 1, 0],
          transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        className="fixed bottom-[320px] right-12 w-[280px] lucid-glass rounded-[32px] p-1 shadow-2xl z-30 pointer-events-auto"
      >
        <div className="bg-zinc-950/80 rounded-[28px] p-6 flex flex-col gap-5">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-white/40" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Deployment</span>
              </div>
              <Activity className="w-4 h-4 text-accent animate-pulse" />
           </div>
           
           <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-bold text-white/60 uppercase">Vercel Edge</span>
                 <span className="text-[10px] font-mono text-emerald-400">Stable</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-bold text-white/60 uppercase">Supabase DB</span>
                 <span className="text-[10px] font-mono text-emerald-400">Connected</span>
              </div>
           </div>

           <div className="h-px w-full bg-white/10" />
           
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center border border-accent/20">
                 <Rocket className="w-6 h-6 text-accent" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[11px] font-bold text-white uppercase">Production Live</span>
                 <span className="text-[9px] text-white/40 uppercase">v2.4.0 deployed</span>
              </div>
           </div>
        </div>
      </motion.div>
    </>
  );
};
