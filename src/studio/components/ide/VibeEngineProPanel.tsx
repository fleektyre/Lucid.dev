import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Database, Key, Play, TrendingUp, AlertTriangle, RefreshCw, 
  Zap, DollarSign, CheckCircle, ChevronRight, Sparkles, Code, 
  Shield, Layers, Clock, ShoppingCart, Info, Globe, HardDrive, Plus,
  Lock, ArrowUpRight, Check, Download, ExternalLink, RefreshCcw, HelpCircle
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';

// SQL blueprints representing durable cloud tables
const sqlBlueprints = {
  wallets: `-- Durable balance sheet for usage-based credit ledger
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sparks_balance INT NOT NULL DEFAULT 100, -- Custom billing units called Sparks
  byok_enabled BOOLEAN DEFAULT FALSE,
  byok_key_gemini TEXT,
  byok_key_openai TEXT,
  byok_key_anthropic TEXT,
  subscription_tier VARCHAR(50) DEFAULT 'pro_tier', -- 'free_tier' | 'pro_tier' | 'business_tier'
  package_dropdown_index INT DEFAULT 0, -- Track selected spark tier index
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_wallets_user ON wallets(user_id);`,

  credit_transactions: `-- Audit ledger for usage billing history of Sparks
CREATE TABLE sparks_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL, -- 'debit' | 'credit' | 'top_up'
  sparks_amount INT NOT NULL,
  charge_amount_usd DECIMAL(10, 2) DEFAULT 0.00, -- SaaS license baseline or pack cost
  description TEXT NOT NULL,
  routing_used VARCHAR(50) DEFAULT 'none', -- 'tier_1_flash' | 'tier_2_pro' | 'cache_intercept'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,

  ai_usage_logs: `-- API cost attribution & margin analytics audit trail
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  prompt_hash VARCHAR(64) NOT NULL,
  prompt_tokens INT NOT NULL,
  response_tokens INT NOT NULL,
  model_used VARCHAR(100) NOT NULL,
  routing_tier VARCHAR(50) NOT NULL, -- 'flash_tier_1' | 'pro_tier_2' | 'cache_intercept'
  cache_hit BOOLEAN DEFAULT FALSE,
  latency_ms INT NOT NULL,
  est_api_cost_usd DECIMAL(10, 6) NOT NULL, -- Track actual cent-fractions
  credited_sparks INT NOT NULL, -- sparks deducted from wallet
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,

  cached_boilerplates: `-- Serve pre-audited layout boilerplate instantly at $0 LLM cost
CREATE TABLE cached_boilerplates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash VARCHAR(64) UNIQUE NOT NULL,
  keywords TEXT[] NOT NULL,
  file_name VARCHAR(100) NOT NULL,
  raw_code TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  hits_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`
};

export const VibeEngineProPanel: React.FC = () => {
  const { addNotification } = useStudioStore();
  
  // Internal view navigation
  const [activeTab, setActiveTab] = useState<'tiers' | 'playground' | 'offloading' | 'schemas'>('tiers');
  
  // Workspace Tier States
  const [selectedTier, setSelectedTier] = useState<'free' | 'pro' | 'business'>('pro');
  const [proOptionIdx, setProOptionIdx] = useState<number>(0); // 0: 100 sparks, 1: 500, 2: 1200, 3: 2000
  const [bizOptionIdx, setBizOptionIdx] = useState<number>(0);
  
  // Custom Sparks balance (isolated state to test low-balance and topups)
  const [sparksBalance, setSparksBalance] = useState<number>(100);
  
  // BYOK States
  const [byokActive, setByokActive] = useState<boolean>(false);
  const [openaiKey, setOpenaiKey] = useState<string>('');
  const [geminiKey, setGeminiKey] = useState<string>('');
  
  // SQL Blueprints Selection
  const [selectedSqlTable, setSelectedSqlTable] = useState<'wallets' | 'credit_transactions' | 'ai_usage_logs' | 'cached_boilerplates'>('wallets');

  // AST Prompt Compiler Sandbox States
  const [selectedTask, setSelectedTask] = useState<string>('style_twilight');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compileStep, setCompileStep] = useState<number>(0);
  const [astNodes, setASTNodes] = useState<string[]>([]);
  const [tokenSavings, setTokenSavings] = useState<number>(0);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [cacheStatus, setCacheStatus] = useState<'HIT' | 'MISS'>('MISS');
  const [deductedCost, setDeductedCost] = useState<number>(0);
  const [blockMessage, setBlockMessage] = useState<string | null>(null);

  // Browser Offloading Sandbox States
  const [mockRows, setMockRows] = useState<Array<{ id: string; name: string; email: string; role: string; lastSeen: string }>>([]);
  const [isGeneratingMock, setIsGeneratingMock] = useState<boolean>(false);
  const [isCompressingBundle, setIsCompressingBundle] = useState<boolean>(false);
  const [compressProgress, setCompressProgress] = useState<number>(0);
  const [deploySubdomain, setDeploySubdomain] = useState<string>('vibe-preview-app');
  const [deployStatus, setDeployStatus] = useState<'idle' | 'building' | 'deployed'>('idle');
  const [deployedUrl, setDeployedUrl] = useState<string>('');

  // Local Sparks Ledger list
  const [sparksTransactions, setSparksTransactions] = useState([
    { id: 'spk-004', desc: 'SaaS License Tier Baseline Provision', sparks: '+100 Sparks', cost: '$25.00', date: 'Just Now', tag: 'System Provision' },
    { id: 'spk-003', desc: 'Cached JWT Auth Sign-In Block Intercept', sparks: '0 Sparks', cost: '$0.00', date: '10 mins ago', tag: 'Cache Intercept' },
    { id: 'spk-002', desc: 'Color alignment & Moonlight theme edits', sparks: '-1 Spark', cost: '1 Spark', date: '1 hour ago', tag: 'Tier 1 Flash' },
    { id: 'spk-001', desc: 'Sign-up grant promotional sparks', sparks: '+25 Sparks', cost: '$0.00', date: '3 hours ago', tag: 'Platform' }
  ]);

  // Pricing configuration maps
  const proOptions = [
    { sparks: 100, price: 25 },
    { sparks: 500, price: 65 },
    { sparks: 1200, price: 130 },
    { sparks: 2000, price: 195 }
  ];

  const bizOptions = [
    { sparks: 100, price: 50 },
    { sparks: 500, price: 90 },
    { sparks: 1200, price: 160 },
    { sparks: 2000, price: 230 }
  ];

  // Compilation target task options & cost
  const compileTasks = [
    {
      id: 'style_twilight',
      label: '🎨 Restyle interface to Dark Twilight gradient mode',
      cost: 1,
      desc: 'Minor layout adjustment / cosmetic adjustments. Routes strictly to fast Gemini 1.5 Flash.',
      prompt: 'Refactor all landing pages and main headers into a deep, eyesafe dark twilight glass gradient theme.'
    },
    {
      id: 'boilerplate_auth',
      label: '🔐 Add standard JWT Auth sign-in template',
      cost: 0, // cache hit!
      desc: 'Intercepted and served via static SQLite index cache bypass at $0 API compute expense.',
      prompt: 'Add a standard JWT Auth login page with validation schema and secure state handlers.'
    },
    {
      id: 'create_feature',
      label: '⚡ Build client-side markdown renderer component',
      cost: 2,
      desc: 'Complete feature creation. Routes to Gemini 1.5 Flash / Pro router engine.',
      prompt: 'Create a fully featured, elegant React Markdown preview component styled with responsive glassmorphism.'
    },
    {
      id: 'pixel_extract',
      label: '📸 Hardware-accelerated mobile wireframe pixel extraction',
      cost: 3,
      desc: 'Vision engine analysis. Uses high-performance GPU cluster. Enforces Free tier block.',
      prompt: 'Extract layout wireframes from the uploaded mockup screenshot and render matching HTML-tailwind.'
    },
    {
      id: 'db_spanner',
      label: '🗄️ Deep cloud database synchronization & AWS Spanner logic',
      cost: 5,
      desc: 'Multi-file architectural backend compilation. Requires frontier models. Enforces Pro tier block.',
      prompt: 'Configure AWS Spanner multi-master node replication scripts with transactional safety locks and durable migrations.'
    }
  ];

  // Initialize sparks balance when tier changes
  useEffect(() => {
    if (selectedTier === 'free') {
      setSparksBalance(10);
      setByokActive(false); // blocked on free
    } else if (selectedTier === 'pro') {
      setSparksBalance(proOptions[proOptionIdx].sparks);
    } else {
      setSparksBalance(bizOptions[bizOptionIdx].sparks);
    }
    setBlockMessage(null);
  }, [selectedTier, proOptionIdx, bizOptionIdx]);

  // Execute AST Compilation Simulator
  const handleCompilePrompt = (customText?: string) => {
    // If compiling, do nothing
    if (isCompiling) return;

    setBlockMessage(null);
    const taskDetails = customText 
      ? { id: 'custom', label: customText, cost: 2, desc: 'Custom user prompt compilation task', prompt: customText }
      : compileTasks.find(t => t.id === selectedTask)!;

    const sparkCost = taskDetails.cost;

    // RULE 1: If Sparks balance is 0 and byok is active, bypass deductions. If byok is disabled, freeze and show Section 3 alert.
    if (sparksBalance < sparkCost && !byokActive) {
      setBlockMessage('exhausted');
      addNotification('error', 'Sandboxed Freeze', 'Your Sparks balance has been exhausted.');
      return;
    }

    // RULE 2: Free tier blockers
    if (selectedTier === 'free') {
      if (taskDetails.id === 'pixel_extract') {
        setBlockMessage('free_pixel_block');
        return;
      }
      if (taskDetails.id === 'db_spanner') {
        setBlockMessage('free_cloud_block');
        return;
      }
    }

    // RULE 3: Pro tier blockers
    if (selectedTier === 'pro') {
      if (taskDetails.id === 'db_spanner') {
        setBlockMessage('pro_spanner_block');
        return;
      }
    }

    // If we passed the blockers, compile!
    setIsCompiling(true);
    setCompileStep(1);

    // Simulated timeline
    setTimeout(() => {
      // Step 2: AST Isolation & Payload Pruning
      setCompileStep(2);
      setTokenSavings(96.8); // 96.8% payload size saved by not parsing entire code base
      setASTNodes([
        'File Isolation Context [Target: App.tsx]',
        ' └─ Component Isolated Node: <VibeIDEView />',
        '     └─ Diff Range: lines 122-145 only',
        '     └─ Pruned 12,482 unused characters'
      ]);

      setTimeout(() => {
        // Step 3: Server-side cache intercept check
        setCompileStep(3);
        const isCacheHit = taskDetails.id === 'boilerplate_auth' || taskDetails.prompt.toLowerCase().includes('jwt') || taskDetails.prompt.toLowerCase().includes('boilerplate');
        setCacheStatus(isCacheHit ? 'HIT' : 'MISS');

        setTimeout(() => {
          // Step 4: Routing decision & billing validation
          setCompileStep(4);
          
          let selectedModelName = '';
          if (isCacheHit) {
            selectedModelName = 'Static SQLite Component Index Cache';
          } else if (sparkCost <= 1) {
            selectedModelName = byokActive ? 'BYOK Custom Channel' : 'Gemini 1.5 Flash (Tier 1)';
          } else {
            selectedModelName = byokActive ? 'BYOK Custom Channel' : 'Gemini 1.5 Pro / Claude 3.5 (Tier 2)';
          }
          setSelectedModel(selectedModelName);

          const finalCost = byokActive ? 0 : sparkCost;
          setDeductedCost(finalCost);

          setTimeout(() => {
            // Step 5: Success & Ledger balance updates
            setCompileStep(5);
            setIsCompiling(false);

            // Deduct sparks
            if (!byokActive) {
              setSparksBalance(prev => Math.max(0, prev - sparkCost));
            }

            // Write to transaction ledger
            const newTx = {
              id: `spk-${Math.floor(100 + Math.random() * 899)}`,
              desc: taskDetails.label,
              sparks: byokActive ? '0 Sparks (BYOK)' : `-${sparkCost} Sparks`,
              cost: byokActive ? '$0.00 (Pure Profit)' : `${sparkCost} Sparks`,
              date: 'Just Now',
              tag: isCacheHit ? 'Cache Hit' : byokActive ? 'BYOK Override' : sparkCost <= 1 ? 'Tier 1 Flash' : 'Tier 2 Pro'
            };
            setSparksTransactions(prev => [newTx, ...prev]);

            addNotification('ai', 'Vibe Compiled Successfully', `Wrote ${byokActive ? 0 : sparkCost} Sparks transaction ledger records.`);
          }, 1200);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  // Zero-Capital Offloading Sandbox Operations
  // 1. Local AI Mock Data Generator
  const runLocalGenerator = () => {
    setIsGeneratingMock(true);
    setTimeout(() => {
      const roles = ['Product Architect', 'Founder', 'Growth Hacker', 'DevOps Elite', 'Indie Hacker'];
      const generated = Array.from({ length: 8 }).map((_, idx) => ({
        id: `usr-09${idx}`,
        name: `Fleetyre Developer ${idx + 1}`,
        email: `dev${idx + 1}@fleetcode.io`,
        role: roles[idx % roles.length],
        lastSeen: `${idx * 2 + 1} minutes ago`
      }));
      setMockRows(generated);
      setIsGeneratingMock(false);
      addNotification('info', 'Local Client Data Generated', 'Processed 5,000 array elements purely on client-side JS.');
    }, 1000);
  };

  // 2. Client-Side Asset Compressions
  const triggerClientDownload = () => {
    setIsCompressingBundle(true);
    setCompressProgress(10);
    
    const interval = setInterval(() => {
      setCompressProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Trigger actual file download using blobs
          const textContent = `=====================================================
LUCID BUILDER ARCHITECTURE EXPORT
=====================================================
Bootstrap Export Engine: Client-Side CPU Aggregated
Workspace Tier: ${selectedTier.toUpperCase()}
Durable Balance Ledger Status: Compliant
Vibe Compiler API Overhead: $0.00

Thank you for utilizing the zero-overhead client sandbox download.
This file package was compiled instantly using browser CPU memory blobs.
=====================================================`;
          
          const blob = new Blob([textContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `lucid-workspace-${selectedTier}-export.txt`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          setIsCompressingBundle(false);
          addNotification('billing', 'Client Export Ready', 'Downloaded sandbox archive bundle generated purely in-browser.');
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  // 3. Static Hosting Deployments
  const triggerHeadlessDeploy = () => {
    if (!deploySubdomain.trim()) return;
    setDeployStatus('building');
    setTimeout(() => {
      setDeployStatus('deployed');
      setDeployedUrl(`https://${deploySubdomain}.netlify.app`);
      addNotification('info', 'Headless Subdomain Map Active', 'Mapped static build bundle directly to free edge CDN nodes.');
    }, 2000);
  };

  // Add standard top-up package to reset balance
  const handleTopUp = (amount: number) => {
    setSparksBalance(prev => prev + amount);
    setBlockMessage(null);
    const newTx = {
      id: `top-${Math.floor(100 + Math.random() * 899)}`,
      desc: `Top-Up Pack Purchase (+${amount} Sparks)`,
      sparks: `+${amount} Sparks`,
      cost: `$${(amount * 0.1).toFixed(2)}`,
      date: 'Just Now',
      tag: 'One-Time Topup'
    };
    setSparksTransactions(prev => [newTx, ...prev]);
    addNotification('billing', 'Sparks Replenished', `Added ${amount} Sparks into your dropdown Spark pool.`);
  };

  // Calculate dynamic margin indicator
  const getDynamicMargin = () => {
    if (selectedTier === 'free') return '70.0%';
    if (byokActive) return '99.5%'; // Bypassed compute means 100% margin software fee
    if (selectedTier === 'pro') {
      const option = proOptions[proOptionIdx];
      // More sparks per dollar slightly lowers margin due to bulk scale, but hits zero compute bounds
      const margins = ['82.4%', '78.5%', '74.2%', '71.0%'];
      return margins[proOptionIdx];
    } else {
      // Business has base team margins
      const margins = ['85.2%', '81.4%', '77.8%', '74.5%'];
      return margins[bizOptionIdx];
    }
  };

  return (
    <div className="space-y-6">
      
      {/* CINEMATIC HERO STATS PANEL */}
      <div className="relative rounded-[1.5rem] bg-zinc-950/50 border border-white/[0.04] p-6 backdrop-blur-md overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.1),transparent_60%)]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                VIBE SYSTEM ENGINE PRO
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                {getDynamicMargin()} NET MARGIN
              </span>
              {byokActive && (
                <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  BYOK PASSIVE PROFIT CHANNEL
                </span>
              )}
            </div>
            <h2 className="text-2xl font-heading tracking-tight text-white leading-tight">
              SaaS Architectural Margin Guard & <span className="font-sans italic text-indigo-300">Sparks</span> Ledger
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl font-sans leading-relaxed">
              Maintain durable software licensing annuity yields. Enforce local client computation offloads, local AST diff slices, pre-compiled boilerplate caches, and usage-based prompt gateways to shield raw compute margins.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900/60 p-3 rounded-2xl border border-white/[0.03] shrink-0 self-start md:self-auto">
            <div className="text-center px-4 border-r border-white/5">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Your Sparks Balance</p>
              <div className="flex items-center justify-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                <span className="text-lg font-mono font-bold text-white">{sparksBalance}</span>
                <span className="text-[10px] text-zinc-500 font-sans">Sparks</span>
              </div>
            </div>
            <div className="text-center px-4">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Compute Cost Mode</p>
              <p className="text-xs font-bold font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {byokActive ? 'BYOK Profit Bypassed' : 'Internal Sparks Ledger'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* COMPACT SUB-NAVIGATION TAB RAIL */}
      <div className="flex items-center gap-1 bg-zinc-950/60 p-1 rounded-2xl border border-white/[0.04] overflow-x-auto no-scrollbar">
        {[
          { id: 'tiers', label: 'Tiers & Gatekeeping Paywall', icon: DollarSign },
          { id: 'playground', label: 'AST Compiler Playground', icon: Cpu },
          { id: 'offloading', label: 'Zero-Capital Offloads', icon: HardDrive },
          { id: 'schemas', label: 'Durable SQL Blueprints', icon: Database }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 focus:outline-none whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'bg-white text-black shadow-lg shadow-white/5' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN SWITCHER TAB WRAPPERS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          
          {/* TAB 1: TIERS & GATEKEEPING PAYWALLS */}
          {activeTab === 'tiers' && (
            <div className="space-y-6">
              
              {/* TIER TOGGLE CHOOSER */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Free Tier Card */}
                <div 
                  onClick={() => setSelectedTier('free')}
                  className={`rounded-[1.5rem] p-5 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    selectedTier === 'free' 
                      ? 'bg-zinc-950 border-white/20 shadow-xl shadow-white/[0.02]' 
                      : 'bg-zinc-900/30 border-white/[0.04] hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 font-mono">TRIAL ENGINE</span>
                      {selectedTier === 'free' && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                    </div>
                    <h3 className="text-xl font-heading text-white">Free Tier</h3>
                    <p className="text-2xl font-mono font-bold text-white">$0 <span className="text-xs text-zinc-500 font-sans">/ month</span></p>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      Zero upfront capital trials. Restricted queues and basic compilers to convert users to paid subscribers.
                    </p>
                    
                    <div className="space-y-2 pt-3 border-t border-white/[0.04]">
                      <div className="flex items-center gap-2 text-[11px] text-zinc-300">
                        <Zap className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>10 Sparks Monthly (Max Limit)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-300">
                        <Cpu className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>Standard Engine (Gemini Flash)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-300">
                        <Clock className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>1 Active Sandbox (Auto-sleep)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 line-through">
                        <Lock className="w-3 h-3 text-zinc-600 shrink-0" />
                        <span>Bring Your Own Key (BYOK)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 line-through">
                        <Lock className="w-3 h-3 text-zinc-600 shrink-0" />
                        <span>Pixel wireframe extractions</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pro Tier Card */}
                <div 
                  onClick={() => setSelectedTier('pro')}
                  className={`rounded-[1.5rem] p-5 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    selectedTier === 'pro' 
                      ? 'bg-zinc-950 border-indigo-500/40 shadow-xl shadow-indigo-500/[0.02]' 
                      : 'bg-zinc-900/30 border-white/[0.04] hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-indigo-400 font-mono font-bold">INDIE DEVELOPER</span>
                      {selectedTier === 'pro' && <div className="w-2 h-2 rounded-full bg-indigo-400" />}
                    </div>
                    <h3 className="text-xl font-heading text-white">Pro Tier</h3>
                    <p className="text-2xl font-mono font-bold text-indigo-400">
                      Starts at ${proOptions[proOptionIdx].price} <span className="text-xs text-zinc-500 font-sans">/ month</span>
                    </p>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      For dedicated builders requiring high performance, larger sandbox sizes, and BYOK cost exemptions.
                    </p>

                    <div className="space-y-2 pt-3 border-t border-white/[0.04]">
                      <div className="flex items-center gap-2 text-[11px] text-zinc-300">
                        <Zap className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="font-bold text-white">{proOptions[proOptionIdx].sparks} Sparks Allocation</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-300">
                        <Cpu className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>Lucid Spark priority routing</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-300">
                        <Clock className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>10 Active sandboxes</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-indigo-400 font-bold">
                        <Key className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>BYOK Pro-Override Supported</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-300">
                        <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>Hardware Pixel extractions</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Tier Card */}
                <div 
                  onClick={() => setSelectedTier('business')}
                  className={`rounded-[1.5rem] p-5 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    selectedTier === 'business' 
                      ? 'bg-zinc-950 border-purple-500/40 shadow-xl shadow-purple-500/[0.02]' 
                      : 'bg-zinc-900/30 border-white/[0.04] hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-purple-400 font-mono font-bold">SHARED TEAMS</span>
                      {selectedTier === 'business' && <div className="w-2 h-2 rounded-full bg-purple-400" />}
                    </div>
                    <h3 className="text-xl font-heading text-white">Business Tier</h3>
                    <p className="text-2xl font-mono font-bold text-purple-400">
                      Starts at ${bizOptions[bizOptionIdx].price} <span className="text-xs text-zinc-500 font-sans">/ month</span>
                    </p>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      For teams needing centralized shared balances, organization keys, and custom cloud deployments.
                    </p>

                    <div className="space-y-2 pt-3 border-t border-white/[0.04]">
                      <div className="flex items-center gap-2 text-[11px] text-zinc-300">
                        <Zap className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="font-bold text-white">{bizOptions[bizOptionIdx].sparks} Shared Sparks</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-300">
                        <Shield className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>Team central workspace logging</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-indigo-400 font-bold">
                        <Globe className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>Isolated AWS/GCP targets</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-300">
                        <Key className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>BYOK Shared Organization keys</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* DYNAMIC DROPDOWN CONFIGURATIONS & BYOK BYPASS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left side: Dynamic Pricing Selection */}
                <div className="lg:col-span-7 rounded-[1.5rem] bg-zinc-950/40 border border-white/[0.04] p-5 space-y-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Dynamic Spark Configuration Dropdowns</h3>
                  
                  {selectedTier === 'free' ? (
                    <div className="p-4 bg-zinc-900/40 border border-white/[0.03] rounded-2xl text-center space-y-2">
                      <Lock className="w-5 h-5 text-zinc-500 mx-auto" />
                      <p className="text-xs text-white font-bold">Standard Free Tier Allocations are locked at exactly 10 Sparks / mo.</p>
                      <p className="text-[10.5px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
                        To unlock customizable higher-volume monthly dropdown Spark bundles, upgrade your workspace to Pro or Business.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-zinc-400">
                        Select a monthly package limit. Larger packages reduce the price per spark and yield higher baseline commitment revenues.
                      </p>
                      
                      {/* Dynamic Dropdown Select */}
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Select Spark Allocation Pool</label>
                        <select
                          value={selectedTier === 'pro' ? proOptionIdx : bizOptionIdx}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (selectedTier === 'pro') setProOptionIdx(val);
                            else setBizOptionIdx(val);
                          }}
                          className="w-full bg-[#0a0b10] border border-white/[0.05] focus:border-indigo-500/40 rounded-xl px-4 py-3 text-xs text-white outline-none"
                        >
                          {(selectedTier === 'pro' ? proOptions : bizOptions).map((opt, idx) => (
                            <option key={idx} value={idx}>
                              {opt.sparks} Sparks per month — ${opt.price}.00 / mo (${(opt.price / opt.sparks).toFixed(3)} per Spark)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Display current baseline statistics */}
                      <div className="grid grid-cols-3 gap-2 text-[11px] font-sans text-zinc-400 pt-1">
                        <div className="p-3 bg-zinc-900/30 border border-white/[0.03] rounded-xl text-center">
                          <span className="text-zinc-600 block mb-0.5 uppercase text-[9px] font-bold">Baseline Fee</span>
                          <span className="text-white font-bold font-mono">
                            ${selectedTier === 'pro' ? proOptions[proOptionIdx].price : bizOptions[bizOptionIdx].price}.00
                          </span>
                        </div>
                        <div className="p-3 bg-zinc-900/30 border border-white/[0.03] rounded-xl text-center">
                          <span className="text-zinc-600 block mb-0.5 uppercase text-[9px] font-bold">Allocated Pool</span>
                          <span className="text-indigo-400 font-bold font-mono">
                            {selectedTier === 'pro' ? proOptions[proOptionIdx].sparks : bizOptions[bizOptionIdx].sparks} Sparks
                          </span>
                        </div>
                        <div className="p-3 bg-zinc-900/30 border border-white/[0.03] rounded-xl text-center">
                          <span className="text-zinc-600 block mb-0.5 uppercase text-[9px] font-bold">Average cost</span>
                          <span className="text-emerald-400 font-bold font-mono">
                            ${selectedTier === 'pro' 
                              ? (proOptions[proOptionIdx].price / proOptions[proOptionIdx].sparks).toFixed(2)
                              : (bizOptions[bizOptionIdx].price / bizOptions[bizOptionIdx].sparks).toFixed(2)} / spk
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Manual Spark Top-Ups Block to recover from low-balance */}
                  <div className="pt-4 border-t border-white/[0.04] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Interactive Sandbox Top-Up Packs</span>
                      <span className="text-[9px] text-zinc-500 italic">Simulate balance refills to test recovery</span>
                    </div>
                    <div className="flex gap-2.5">
                      <button 
                        onClick={() => handleTopUp(50)}
                        className="flex-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.04] text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        +50 Sparks ($5.00)
                      </button>
                      <button 
                        onClick={() => handleTopUp(200)}
                        className="flex-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.04] text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        +200 Sparks ($18.00)
                      </button>
                      <button 
                        onClick={() => {
                          setSparksBalance(0);
                          setBlockMessage('exhausted');
                          addNotification('info', 'Sandbox Balance Cleared', 'Sparks pool has been intentionally cleared to 0.');
                        }}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Drain to 0 Sparks
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right side: BYOK Pro-Pass Override */}
                <div className="lg:col-span-5 rounded-[1.5rem] bg-zinc-950/40 border border-white/[0.04] p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                      <span>BYOK Pro-Pass Override</span>
                      {selectedTier === 'free' ? (
                        <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded uppercase font-bold">LOCKED</span>
                      ) : (
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded uppercase font-bold font-mono">SUPPORTED</span>
                      )}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed">
                      Toggle BYOK workspace mode. Bypass internal sparks deduction entirely. Paying users use their own direct developer API credentials. <strong>Platform profit margin hits 99.5%!</strong>
                    </p>
                  </div>

                  {selectedTier === 'free' ? (
                    <div className="p-4 bg-zinc-900/30 border border-white/[0.02] rounded-xl flex items-start gap-2.5 text-[10.5px] text-zinc-500 font-sans">
                      <Lock className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                      <p>BYOK routing controls require Pro or Business memberships. Free trial tiers cannot bypass internal billing engines.</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-[#08080c] border border-white/[0.03] rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white font-bold">BYOK Mode Enabled</span>
                        <button 
                          onClick={() => {
                            setByokActive(!byokActive);
                            addNotification('info', 'BYOK Mode Toggled', byokActive ? 'Standard ledger routing active.' : 'BYOK Pro-override enabled. Bypassing compute charges.');
                          }}
                          className={`w-11 h-6 rounded-full p-1 transition-all ${byokActive ? 'bg-indigo-600' : 'bg-zinc-800'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-all ${byokActive ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      <AnimatePresence>
                        {byokActive && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-3 pt-3 border-t border-white/[0.03]"
                          >
                            <div>
                              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">OpenAI Secret API Key</label>
                              <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
                                <input 
                                  type="password" 
                                  placeholder="sk-..."
                                  value={openaiKey}
                                  onChange={(e) => setOpenaiKey(e.target.value)}
                                  className="w-full bg-[#0a0b10] border border-white/[0.05] rounded-lg pl-9 pr-3 py-1.5 text-[11px] text-white font-mono outline-none"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Google Gemini API Key</label>
                              <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
                                <input 
                                  type="password" 
                                  placeholder="AIzaSy..."
                                  value={geminiKey}
                                  onChange={(e) => setGeminiKey(e.target.value)}
                                  className="w-full bg-[#0a0b10] border border-white/[0.05] rounded-lg pl-9 pr-3 py-1.5 text-[11px] text-white font-mono outline-none"
                                />
                              </div>
                            </div>
                            
                            <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex gap-2 text-[10px] text-emerald-400">
                              <Info className="w-4 h-4 shrink-0" />
                              <p className="font-sans leading-normal">
                                <strong>99.5% Margins Activated</strong>: Payload routing redirects straight to your developer credentials. Software base fees remain pure platform profit.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: AST COMPILER & CACHING PLAYGROUND */}
          {activeTab === 'playground' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column: Input Prompt Options */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* Low balance intercept banner */}
                {blockMessage === 'exhausted' && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3">
                    <div className="flex gap-2 items-start">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-white leading-none mb-1">Durable Compilation Sandbox Frozen</h4>
                        <p className="text-[11px] text-amber-300 font-sans leading-normal">
                          ⚠️ Your current dropdown Spark pool has been exhausted. To continue building, you can either upgrade to a higher monthly Spark tier in your Account Settings, purchase a standard Top-Up pack, or toggle 'Bring Your Own Key (BYOK)' in Settings to activate direct-to-provider routing instantly.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleTopUp(100)} 
                        className="bg-amber-500 text-black px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-amber-400 transition-all cursor-pointer"
                      >
                        Top-Up 100 Sparks ($10.00)
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedTier('pro');
                          setByokActive(true);
                          setBlockMessage(null);
                          addNotification('info', 'BYOK Mode Auto-Enabled', 'Bypassed exhausted balance using direct keys.');
                        }} 
                        className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Toggle Bring Your Own Key (BYOK)
                      </button>
                    </div>
                  </div>
                )}

                {/* Specific blocker alerts */}
                {blockMessage && blockMessage !== 'exhausted' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-2xl flex gap-3 text-left">
                    <Lock className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white leading-none mb-1">Capability Lock Blocked</h4>
                      <p className="text-[11.5px] text-red-400 font-sans leading-normal">
                        {blockMessage === 'free_pixel_block' && (
                          <span>✨ Pixel extraction utilizes high-performance hardware clusters. Upgrade your workspace to Pro or Business to unlock this capability.</span>
                        )}
                        {blockMessage === 'free_cloud_block' && (
                          <span>🔒 Isolated cloud deployments require enterprise-grade infrastructure layers. Please scale your workspace up to the Business Tier ($50 baseline) to deploy directly to custom private endpoints.</span>
                        )}
                        {blockMessage === 'pro_spanner_block' && (
                          <span>🔒 Isolated cloud deployments require enterprise-grade infrastructure layers. Please scale your workspace up to the Business Tier ($50 baseline) to deploy directly to custom private endpoints.</span>
                        )}
                      </p>
                      <button
                        onClick={() => {
                          if (blockMessage === 'free_pixel_block') setSelectedTier('pro');
                          else setSelectedTier('business');
                          setBlockMessage(null);
                        }}
                        className="mt-2.5 bg-white text-black px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-zinc-200 transition-all cursor-pointer"
                      >
                        Upgrade Workspace Tier Instantly
                      </button>
                    </div>
                  </div>
                )}

                {/* Compilation Prompts selector */}
                <div className="rounded-[1.5rem] bg-zinc-950/45 border border-white/[0.04] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      AST Prompt Compiler Sandbox
                    </h3>
                    <span className="text-[9px] text-zinc-500 font-mono">AST Ver 1.4</span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Choose a compiler prompt or write a custom request. See how our local AST diff isolator prunes tokens, checks cache bypasses, and matches model routing.
                  </p>

                  <div className="space-y-2.5">
                    {compileTasks.map((task) => {
                      const isSelected = selectedTask === task.id;
                      return (
                        <button
                          key={task.id}
                          onClick={() => {
                            setSelectedTask(task.id);
                            setCustomPrompt('');
                            setBlockMessage(null);
                          }}
                          className={`w-full text-left p-3 rounded-2xl border transition-all flex flex-col gap-1.5 cursor-pointer ${
                            isSelected 
                              ? 'bg-indigo-600/10 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.08)]' 
                              : 'bg-zinc-900/30 border-white/[0.04] hover:bg-zinc-900/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white leading-tight">{task.label}</span>
                            <span className="text-[9px] font-bold font-mono tracking-wider text-indigo-400 uppercase bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/25">
                              {task.cost === 0 ? 'Cache ($0)' : `${task.cost} Sparks`}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-zinc-500 leading-normal font-sans">{task.desc}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Prompt Box */}
                  <div className="space-y-2 pt-3 border-t border-white/[0.04]">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Or Write Custom Compile Instruction</p>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="Customize current page headers..."
                        value={customPrompt}
                        onChange={(e) => {
                          setCustomPrompt(e.target.value);
                          setBlockMessage(null);
                        }}
                        className="flex-1 bg-[#090a10] border border-white/[0.05] focus:border-indigo-500/45 rounded-xl px-4 py-2 text-xs text-white outline-none"
                      />
                      <button 
                        onClick={() => handleCompilePrompt(customPrompt)}
                        disabled={isCompiling}
                        className="bg-white hover:bg-zinc-200 disabled:bg-zinc-800 text-black disabled:text-zinc-500 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {isCompiling ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-black" />}
                        <span>Compile</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Ledger Log Panel */}
                <div className="rounded-[1.5rem] bg-zinc-950/45 border border-white/[0.04] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      Real-time Sparks Transaction Ledger
                    </h3>
                    <span className="text-[9px] text-zinc-500 font-mono">Durable Audit Trail</span>
                  </div>
                  
                  <div className="space-y-2 overflow-y-auto max-h-[140px] pr-1 no-scrollbar">
                    {sparksTransactions.map((tx, idx) => (
                      <div key={idx} className="p-3 bg-zinc-900/50 border border-white/[0.03] rounded-xl flex items-center justify-between gap-4 text-xs font-sans">
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate mb-1">{tx.desc}</p>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                            <span className="font-mono text-zinc-600">{tx.id}</span>
                            <span>•</span>
                            <span>{tx.date}</span>
                            <span>•</span>
                            <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-zinc-400 font-mono">{tx.tag}</span>
                          </div>
                        </div>
                        <span className={`font-mono font-bold shrink-0 ${tx.sparks.startsWith('-') ? 'text-zinc-400' : 'text-emerald-400'}`}>
                          {tx.sparks}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Visual Compiler Timeline & AST Parser */}
              <div className="lg:col-span-5">
                <div className="rounded-[1.5rem] bg-zinc-950/45 border border-white/[0.04] p-5 backdrop-blur-md h-full flex flex-col justify-between">
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.04]">
                      <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider">Interactive Compiler Console</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[9px] text-indigo-400 font-bold font-mono">SANDBOX ACTIVE</span>
                      </div>
                    </div>

                    {compileStep === 0 && (
                      <div className="text-center py-12 space-y-3">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full mx-auto flex items-center justify-center">
                          <Cpu className="w-4 h-4 text-zinc-400" />
                        </div>
                        <h4 className="text-xs font-bold text-zinc-300">Awaiting Vibe Action</h4>
                        <p className="text-[10.5px] text-zinc-500 max-w-xs mx-auto leading-normal">
                          Trigger standard compile options or custom code queries on the left to see parsing mechanics.
                        </p>
                      </div>
                    )}

                    {compileStep > 0 && (
                      <div className="space-y-4">
                        {[
                          { step: 1, title: 'Parsing Local AST Target Files', desc: 'Isolating workspace node changes on user CPU to bypass transmitting whole files.' },
                          { step: 2, title: 'Pruning Prompt pay-lengths', desc: 'Isolating context diff. Minimizing character length to lower model token bills.' },
                          { step: 3, title: 'Bypass Signature Cache Matcher', desc: 'Parsing commands against our pre-audited static library.' },
                          { step: 4, title: 'Routing Multi-Tiered Router', desc: 'Determining optimal efficiency engines based on task complexity.' }
                        ].map((s) => {
                          const isActive = compileStep === s.step;
                          const isDone = compileStep > s.step;
                          return (
                            <div key={s.step} className="flex gap-3 text-left transition-all duration-300 text-xs">
                              <div className="flex flex-col items-center shrink-0">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono border transition-all ${
                                  isActive ? 'bg-indigo-600 text-white border-indigo-400 scale-110 shadow-[0_0_8px_rgba(99,102,241,0.3)]' :
                                  isDone ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                                  'bg-zinc-900 text-zinc-700 border-white/[0.04]'
                                }`}>
                                  {isDone ? '✓' : s.step}
                                </div>
                                {s.step < 4 && <div className={`w-0.5 h-6 mt-1 ${isDone ? 'bg-emerald-500/25' : 'bg-white/[0.03]'}`} />}
                              </div>
                              <div>
                                <p className={`font-bold ${isActive ? 'text-white' : isDone ? 'text-zinc-400' : 'text-zinc-600'}`}>{s.title}</p>
                                <p className={`text-[10px] leading-relaxed mt-0.5 font-sans ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>{s.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {compileStep === 5 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3.5 bg-[#0a0b12] border border-emerald-500/20 rounded-2xl space-y-3 mt-4"
                    >
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Compilation Optimization Successful</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                        <div className="p-2 bg-zinc-950/80 border border-white/[0.02] rounded-lg">
                          <span className="text-zinc-600 block mb-0.5 font-sans">Token Saving via AST:</span>
                          <span className="text-white font-bold">{tokenSavings}%</span>
                        </div>
                        <div className="p-2 bg-zinc-950/80 border border-white/[0.02] rounded-lg">
                          <span className="text-zinc-600 block mb-0.5 font-sans">Cache Intercept:</span>
                          <span className={cacheStatus === 'HIT' ? 'text-emerald-400 font-bold' : 'text-white font-bold'}>
                            {cacheStatus}
                          </span>
                        </div>
                        <div className="p-2 bg-zinc-950/80 border border-white/[0.02] rounded-lg col-span-2">
                          <span className="text-zinc-600 block mb-0.5 font-sans">Routing Decision:</span>
                          <span className="text-indigo-400 font-bold">{selectedModel}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] bg-zinc-950/60 p-2 rounded-lg border border-white/[0.02]">
                        <span className="font-sans text-zinc-500">Charged Amount:</span>
                        <span className="font-mono font-bold text-white">
                          {byokActive ? 'BYOK Bypassed ($0 Cost)' : `${deductedCost} Sparks`}
                        </span>
                      </div>
                    </motion.div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ZERO-CAPITAL OFFLOADS LAB */}
          {activeTab === 'offloading' && (
            <div className="space-y-6">
              
              <div className="rounded-[1.5rem] bg-zinc-950/40 border border-white/[0.04] p-5 space-y-2">
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  ZERO INFRASTRUCTURE OVERHEAD
                </span>
                <h3 className="text-lg font-heading text-white">Zero-Capital Scaling & Browser Offloading Sandbox</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Eliminate major platform hosting and database query bandwidth costs completely. Run full static deployments, data simulations, and project bundle compilation purely inside the client-side browser thread.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* 1. Client-Side Mock Data Generator */}
                <div className="rounded-[1.5rem] bg-zinc-950/40 border border-white/[0.04] p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-zinc-500 font-mono">OFFLOAD MODULE 1</span>
                      <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono font-bold">$0 SERVER COST</span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-indigo-400" />
                      Local AI Mock Data Engine
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-2 font-sans leading-relaxed">
                      Instead of spinning up high-cost server database instances for client prototypes, generate 5,000 table items locally in fractions of a millisecond.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {mockRows.length > 0 && (
                      <div className="bg-[#050609] border border-white/[0.03] rounded-xl p-2 max-h-[140px] overflow-y-auto no-scrollbar font-mono text-[9.5px] text-zinc-400 space-y-1.5">
                        <div className="grid grid-cols-3 text-zinc-600 border-b border-white/[0.03] pb-1">
                          <span>NAME</span>
                          <span>ROLE</span>
                          <span>LATENCY</span>
                        </div>
                        {mockRows.map((r, i) => (
                          <div key={i} className="grid grid-cols-3 text-indigo-300">
                            <span className="truncate text-white">{r.name}</span>
                            <span className="truncate">{r.role}</span>
                            <span className="text-emerald-400 font-bold">0ms (Local)</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <button 
                      onClick={runLocalGenerator}
                      disabled={isGeneratingMock}
                      className="w-full bg-white hover:bg-zinc-200 text-black py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-500"
                    >
                      {isGeneratingMock ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-black" />}
                      <span>{mockRows.length > 0 ? 'Re-Generate Local Data' : 'Generate Mock Workspace Tables'}</span>
                    </button>
                  </div>
                </div>

                {/* 2. Client-Side Asset Compressions */}
                <div className="rounded-[1.5rem] bg-zinc-950/40 border border-white/[0.04] p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-zinc-500 font-mono">OFFLOAD MODULE 2</span>
                      <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono font-bold">ZERO VM OVERHEAD</span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4 text-indigo-400" />
                      Client-Side CPU Compilation
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-2 font-sans leading-relaxed">
                      Generate project export downloads and build compilation bundles directly inside the client CPU thread. 0% server compute utilization.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {isCompressingBundle && (
                      <div className="space-y-1.5 p-3 bg-zinc-900/40 border border-white/[0.03] rounded-xl text-center">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                          <span>Aggregating zip payload...</span>
                          <span>{compressProgress}%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${compressProgress}%` }} />
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={triggerClientDownload}
                      disabled={isCompressingBundle}
                      className="w-full bg-white hover:bg-zinc-200 text-black py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-500"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Sandbox via Local CPU</span>
                    </button>
                  </div>
                </div>

                {/* 3. Static Hosting Integrations */}
                <div className="rounded-[1.5rem] bg-zinc-950/40 border border-white/[0.04] p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-zinc-500 font-mono">OFFLOAD MODULE 3</span>
                      <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono font-bold">HEADLESS HOSTING</span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-indigo-400" />
                      Static Subdomain Deployment
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-2 font-sans leading-relaxed">
                      Deploy user previews and live instances straight to free third-party edge hosting CDNs (Netlify/Vercel) automatically. Bypasses hosting bills.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase block">Subdomain Prefix</label>
                      <input 
                        type="text"
                        value={deploySubdomain}
                        onChange={(e) => setDeploySubdomain(e.target.value)}
                        className="w-full bg-[#0a0b10] border border-white/[0.05] focus:border-indigo-500/40 rounded-lg px-3 py-1.5 text-xs text-white font-mono outline-none"
                      />
                    </div>

                    {deployStatus === 'building' && (
                      <div className="p-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-center gap-2 text-[10px] text-indigo-400 font-mono">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Pushing bundle blocks to edge CDN...</span>
                      </div>
                    )}

                    {deployStatus === 'deployed' && (
                      <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[10.5px] text-emerald-400 font-mono font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>Subdomain Mapped</span>
                        </div>
                        <a 
                          href={deployedUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] text-white hover:underline flex items-center gap-1 font-mono"
                        >
                          <span>{deployedUrl}</span>
                          <ArrowUpRight className="w-3 h-3 text-indigo-400" />
                        </a>
                      </div>
                    )}

                    <button 
                      onClick={triggerHeadlessDeploy}
                      disabled={deployStatus === 'building' || !deploySubdomain}
                      className="w-full bg-white hover:bg-zinc-200 text-black py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Deploy static sandbox</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: SQL SCHEMAS */}
          {activeTab === 'schemas' && (
            <div className="rounded-[1.5rem] bg-zinc-950/45 border border-white/[0.04] p-6 backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest">
                    POSTGRESQL SCHEMAS
                  </span>
                  <h3 className="text-md font-heading text-white mt-2">Durable Ledger Database Table Definitions</h3>
                </div>
                <div className="flex flex-wrap gap-1 bg-zinc-900/60 p-1 rounded-xl border border-white/[0.04] max-w-full">
                  {(['wallets', 'credit_transactions', 'ai_usage_logs', 'cached_boilerplates'] as const).map((tbl) => (
                    <button
                      key={tbl}
                      onClick={() => setSelectedSqlTable(tbl)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                        selectedSqlTable === tbl 
                          ? 'bg-white text-black' 
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tbl.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-zinc-400 mb-4 leading-relaxed font-sans">
                These RLS-enforced database tables run on our secure storage endpoints. They manage user token balances, audit cost attributions, transaction fees, and boilerplate layout indices securely.
              </p>

              {/* Code window */}
              <div className="bg-[#050609] border border-white/[0.05] rounded-2xl p-4 font-mono text-[11px] leading-relaxed relative overflow-hidden">
                <div className="absolute top-3 right-4 flex items-center gap-1.5 bg-zinc-900/50 px-2.5 py-1 rounded border border-white/5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-[9px] text-zinc-500 font-mono uppercase">Production Postgres Blueprint</span>
                </div>
                <pre className="text-indigo-300 overflow-x-auto whitespace-pre-wrap max-h-[350px] no-scrollbar">
                  {sqlBlueprints[selectedSqlTable]}
                </pre>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
};
