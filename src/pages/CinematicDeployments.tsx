import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ShieldCheck, Cpu, Play, Check, Copy, ArrowRight, Server, Activity, ArrowUpRight, CloudLightning } from 'lucide-react';

export const CinematicDeployments: React.FC = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [step, setStep] = useState<'idle' | 'compiling' | 'securing' | 'routing' | 'live'>('idle');
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [edgeNodes, setEdgeNodes] = useState([
    { region: 'US West (Silicon Valley)', latency: '9ms', active: true, status: 'idle' },
    { region: 'EU West (London)', latency: '11ms', active: true, status: 'idle' },
    { region: 'APAC South (Singapore)', latency: '18ms', active: true, status: 'idle' },
    { region: 'EU Central (Frankfurt)', latency: '12ms', active: true, status: 'idle' },
    { region: 'APAC East (Tokyo)', latency: '15ms', active: true, status: 'idle' },
    { region: 'APAC Oceania (Sydney)', latency: '21ms', active: true, status: 'idle' },
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText('https://lucid.dev/v/vibe-canvas-39');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startDeployment = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setStep('compiling');
    setProgress(0);
    
    // Reset nodes
    setEdgeNodes(prev => prev.map(node => ({ ...node, status: 'idle' })));

    // Compiling phase
    setTimeout(() => {
      setStep('securing');
      setProgress(25);
      
      // Securing phase
      setTimeout(() => {
        setStep('routing');
        setProgress(60);

        // Update edge nodes one by one with delays
        edgeNodes.forEach((_, i) => {
          setTimeout(() => {
            setEdgeNodes(prev => {
              const next = [...prev];
              next[i].status = 'live';
              return next;
            });
            setProgress(60 + Math.floor(((i + 1) / edgeNodes.length) * 35));
          }, i * 400);
        });

        // Live phase
        setTimeout(() => {
          setStep('live');
          setProgress(100);
        }, edgeNodes.length * 400 + 400);

      }, 1200);
    }, 1500);
  };

  const getStepText = () => {
    switch (step) {
      case 'compiling': return 'Analyzing & Bundling AST Modules...';
      case 'securing': return 'Encrypting Environment Layer & SSL...';
      case 'routing': return 'Broadcasting Workspace Assets Globally...';
      case 'live': return 'Workspace Live on 24 Global Edge Zones!';
      default: return 'Environment Idle. Ready for Deployment.';
    }
  };

  return (
    <div className="relative w-full rounded-[1.5rem] p-1 md:p-8 flex flex-col items-center justify-center overflow-hidden bg-black/40 border border-white/5 backdrop-blur-xl group z-10">
      
      {/* Decorative dynamic ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 via-transparent to-emerald-500/5 opacity-40 group-hover:opacity-80 transition-opacity z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] z-0 pointer-events-none" />
      
      {/* Simulation Dashboard Header */}
      <div className="relative z-15 w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6 px-4 md:px-8 py-6 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full hidden sm:flex items-center justify-center bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <CloudLightning className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-white tracking-wide">Edge Production Network</h4>
            <p className="text-xs text-zinc-500 mt-1 font-mono">{getStepText()}</p>
          </div>
        </div>

        {/* Deploy Pill Trigger */}
        <button
          onClick={startDeployment}
          disabled={isDeploying && step !== 'live'}
          className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-2 cursor-pointer transition-all duration-300 focus:outline-none ${
            isDeploying && step !== 'live'
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
              : step === 'live'
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : 'bg-white hover:bg-white/90 text-black hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.15)]'
          }`}
        >
          {isDeploying && step !== 'live' ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
              <span>Deploying Now</span>
            </>
          ) : step === 'live' ? (
            <>
              <Check className="w-4 h-4" />
              <span>Redeploy Edge</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Deploy to Edge</span>
            </>
          )}
        </button>
      </div>

      {/* Main Core Viewport - Flex Grid */}
      <div className="relative z-15 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-8">
        
        {/* LEFT: Live Global Edge Nodes Distribution (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              Edge Distribution Locations
            </span>
            <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              Nodes Activated: {edgeNodes.filter(n => n.status === 'live').length}/6
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {edgeNodes.map((node, i) => (
              <div
                key={i}
                className={`p-4 rounded-[1rem] border transition-all duration-300 flex items-center justify-between ${
                  node.status === 'live'
                    ? 'bg-emerald-500/[0.03] border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.02)]'
                    : isDeploying && step === 'routing' && node.status === 'idle'
                    ? 'bg-sky-500/[0.03] border-sky-400/20 animate-pulse'
                    : 'bg-zinc-950/40 border-white/[0.03]'
                }`}
              >
                <div className="flex flex-col gap-1 pr-2 overflow-hidden">
                  <span className="text-xs font-semibold text-zinc-200 truncate">{node.region}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-zinc-500">Latency:</span>
                    <span className={`text-[9px] font-mono font-bold ${
                      node.status === 'live' ? 'text-emerald-400' : 'text-zinc-500'
                    }`}>
                      {node.latency}
                    </span>
                  </div>
                </div>

                {/* Status dot indicator */}
                <div className="flex items-center justify-center shrink-0">
                  {node.status === 'live' ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  ) : isDeploying && step === 'routing' ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-zinc-800 border border-white/10" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Real-time Virtual Terminal (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-zinc-400" />
              Deployment Logs
            </span>
          </div>

          <div className="flex-1 bg-zinc-950/80 border border-white/5 rounded-[1.2rem] p-5 font-mono text-[10px] sm:text-xs text-zinc-400 min-h-[190px] flex flex-col justify-between overflow-hidden relative shadow-inner">
            <div className="flex flex-col gap-2.5 leading-relaxed">
              <div className="flex items-center gap-2 text-zinc-500">
                <span className="text-sky-500">➜</span>
                <span>lucid deploy --production</span>
              </div>
              
              <AnimatePresence mode="popLayout">
                {step !== 'idle' && (
                  <motion.div
                    key="compiling-log"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2 text-zinc-300"
                  >
                    <span className="text-emerald-400">●</span>
                    <span>Bundling AST hierarchy modules...</span>
                  </motion.div>
                )}

                {(step === 'securing' || step === 'routing' || step === 'live') && (
                  <motion.div
                    key="securing-log"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2 text-zinc-300"
                  >
                    <span className="text-emerald-400">●</span>
                    <span>Creating isolated sandbox layer encryption...</span>
                  </motion.div>
                )}

                {(step === 'routing' || step === 'live') && (
                  <motion.div
                    key="routing-log"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2 text-zinc-300 font-bold"
                  >
                    <span className="text-sky-400">★</span>
                    <span>Broadcasting to global CDN networks...</span>
                  </motion.div>
                )}

                {step === 'live' && (
                  <motion.div
                    key="live-success-log"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-1.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 leading-tight"
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>DEPLOYMENT SUCCESSFUL</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">SSL certified. Edge route optimized globally.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Simulated Live Broadcast latency indicator at center bottom */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 mt-4 leading-none">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-400" />
                Network: Active
              </span>
              <span>100% Health</span>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER: Interactive deployment completion slider output */}
      <AnimatePresence>
        {step === 'live' && (
          <motion.div
            key="live-deploy-footer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="relative z-15 w-full max-w-4xl p-4 md:p-6 mb-6 rounded-[1.2rem] bg-zinc-900/50 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 mx-auto"
          >
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400">Deploy Successful</span>
              <span className="text-sm font-bold text-white tracking-wide">Your Lucid Application is Live at:</span>
            </div>
            
            <div className="flex items-center bg-black/50 border border-white/5 pl-4 pr-1.5 py-1.5 rounded-full w-full sm:w-auto overflow-hidden shadow-inner">
              <span className="text-xs font-mono text-white/75 select-all truncate pr-5">https://lucid.dev/v/vibe-canvas-39</span>
              
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCopy}
                  className="p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full text-white/70 hover:text-white cursor-pointer focus:outline-none transition-all duration-200"
                  title="Copy URL"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href="https://ais-dev-g3s7nwwsa6cfvocimd5ua5-351763284765.europe-west2.run.app"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-emerald-500 hover:bg-emerald-400 active:scale-90 rounded-full text-black hover:text-black cursor-pointer focus:outline-none transition-all duration-200"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
