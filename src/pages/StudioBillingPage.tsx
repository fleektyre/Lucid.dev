import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Check, ChevronDown, Sparkles, ShieldCheck, 
  HelpCircle, Receipt, ArrowUpRight, DollarSign, Terminal, HardDrive
} from 'lucide-react';
import { Sidebar } from '../studio/layout/Sidebar';
import { TopNav } from '../studio/layout/TopNav';
import { StudioBackground } from '../studio/components/StudioBackground';
import { CelestialHorizon } from '../studio/components/CelestialHorizon';
import { useStudioStore } from '../studio/store/useStudioStore';
import { ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip } from 'recharts';

interface DropdownOption {
  credits: string;
  pricePro: number;
  priceBus: number;
  desc: string;
}

const creditOptions: DropdownOption[] = [
  { credits: '100 Sparks / month', pricePro: 25, priceBus: 50, desc: '100 monthly Sparks' },
  { credits: '500 Sparks / month', pricePro: 65, priceBus: 90, desc: '500 monthly Sparks' },
  { credits: '1200 Sparks / month', pricePro: 130, priceBus: 160, desc: '1200 monthly Sparks' },
  { credits: '2000 Sparks / month', pricePro: 195, priceBus: 230, desc: '2000 monthly Sparks' }
];

export const StudioBillingPage: React.FC = () => {
  const { user, isSidebarExpanded, addCredits, setPackageCredits, addNotification } = useStudioStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Billing states
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedProOpt, setSelectedProOpt] = useState<DropdownOption>(creditOptions[0]);
  const [selectedBusOpt, setSelectedBusOpt] = useState<DropdownOption>(creditOptions[2]);
  const [showProCreditsMenu, setShowProCreditsMenu] = useState(false);
  const [showBusCreditsMenu, setShowBusCreditsMenu] = useState(false);

  // Credit Slider simulator states
  const [simulatedCredits, setSimulatedCredits] = useState<number>(800);
  
  // Custom interactive Wallet simulated features
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isFundingWallet, setIsFundingWallet] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Price calculations and discount rates
  const proMonthlyValue = selectedProOpt.pricePro;
  const proCalculated = billingPeriod === 'yearly' ? Math.floor(proMonthlyValue * 0.8) : proMonthlyValue;

  const busMonthlyValue = selectedBusOpt.priceBus;
  const busCalculated = billingPeriod === 'yearly' ? Math.floor(busMonthlyValue * 0.8) : busMonthlyValue;

  // Custom simulator calculation
  const calculatedSimulatorPrice = Math.floor(simulatedCredits * 0.08);

  const handleCheckout = (planName: string, selectedPackage: string, price: number) => {
    // Determine Sparks count from selected package text (e.g. "100 Sparks / month" -> 100)
    const amount = parseInt(selectedPackage.replace(/[^0-9]/g, ''), 10) || 100;
    const isRefill = planName.toLowerCase().includes('refill') || planName.toLowerCase().includes('micro');
    const useWallet = walletBalance >= price;

    if (useWallet) {
      triggerToast(`Deducting $${price} from Developer Wallet balance...`);
      setTimeout(() => {
        setWalletBalance(prev => Math.max(0, Number((prev - price).toFixed(2))));
        if (isRefill) {
          addCredits(amount);
          triggerToast(`Successfully purchased +${amount} On-The-Go Sparks from Wallet!`);
          addNotification(
            'billing',
            'Wallet Refill Confirmed',
            `Paid $${price} with Developer Wallet balance. +${amount} computation Sparks added to your active workspace.`
          );
        } else {
          setPackageCredits(amount);
          triggerToast(`Workspace upgraded with Wallet: ${planName} (${amount} Sparks)`);
          addNotification(
            'billing',
            'Subscription Wallet Upgrade',
            `Upgraded workspace to ${planName} using Developer Wallet funds. Unified allowance set to ${amount} Sparks.`
          );
        }
      }, 1000);
    } else {
      triggerToast(`Routing Paystack payment gateway for $${price}...`);
      setTimeout(() => {
        if (isRefill) {
          addCredits(amount);
          triggerToast(`Direct purchase complete: +${amount} On-The-Go Sparks added!`);
          addNotification(
            'billing',
            'On-The-Go Refill Confirmed',
            `Paystack sandbox transfer of $${price} confirmed. +${amount} computation Sparks allocated to your workspace.`
          );
        } else {
          setPackageCredits(amount);
          triggerToast(`Paystack subscription complete: Upgraded to ${planName}!`);
          addNotification(
            'billing',
            'Subscription Activated via Paystack',
            `Successfully processed Paystack sandbox upgrade. Workspace is now on ${planName} (${amount} Sparks).`
          );
        }
      }, 1200);
    }
  };

  const handleWalletFund = (amount: number) => {
    setIsFundingWallet(true);
    setTimeout(() => {
      setWalletBalance(prev => prev + amount);
      setIsFundingWallet(false);
      triggerToast(`Successfully processed Paystack sandbox transfer! Added $${amount} to your developer wallet.`);
    }, 1500);
  };

  // Compute logs daily Sparks spending database Mock representation
  const sparksUsageHistory = [
    { date: 'June 4', spent: 12, task: 'Prompt alignment' },
    { date: 'June 5', spent: 85, task: 'Sandbox render' },
    { date: 'June 6', spent: 34, task: 'Refactoring script' },
    { date: 'June 7', spent: 110, task: 'Asset synthesis' },
    { date: 'June 8', spent: 15, task: 'Theme adjustment' },
    { date: 'June 9', spent: 60, task: 'Compile pipeline' },
    { date: 'June 10', spent: 95, task: 'Vibe check engine' },
    { date: 'June 11', spent: 14, task: 'Schema migration' },
  ];

  // Dynamically generated 30 days daily credit consumption that responds & scales based on active user package capacity & credits
  const sparklineData = useMemo(() => {
    const scaleFactor = user.maxCredits / 428;
    const baseSpline = [
      { day: 'Day 1', spent: 12 },
      { day: 'Day 2', spent: 15 },
      { day: 'Day 3', spent: 8 },
      { day: 'Day 4', spent: 22 },
      { day: 'Day 5', spent: 34 },
      { day: 'Day 6', spent: 40 },
      { day: 'Day 7', spent: 11 },
      { day: 'Day 8', spent: 18 },
      { day: 'Day 9', spent: 25 },
      { day: 'Day 10', spent: 30 },
      { day: 'Day 11', spent: 55 },
      { day: 'Day 12', spent: 42 },
      { day: 'Day 13', spent: 15 },
      { day: 'Day 14', spent: 20 },
      { day: 'Day 15', spent: 65 },
      { day: 'Day 16', spent: 85 },
      { day: 'Day 17', spent: 45 },
      { day: 'Day 18', spent: 30 },
      { day: 'Day 19', spent: 28 },
      { day: 'Day 20', spent: 14 },
      { day: 'Day 21', spent: 35 },
      { day: 'Day 22', spent: 38 },
      { day: 'Day 23', spent: 42 },
      { day: 'Day 24', spent: 60 },
      { day: 'Day 25', spent: 78 },
      { day: 'Day 26', spent: 50 },
      { day: 'Day 27', spent: 32 },
      { day: 'Day 28', spent: 18 },
      { day: 'Day 29', spent: 22 },
      { day: 'Day 30', spent: Math.round(26 + (user.credits / 10)) } // dynamic link to current remaining budget
    ];
    return baseSpline.map(item => ({
      ...item,
      spent: Math.round(item.spent * scaleFactor)
    }));
  }, [user.maxCredits, user.credits]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#060813] via-[#040406] to-[#020204] text-white overflow-hidden selection:bg-white/10 selection:text-white font-body">
      {/* Main Structural Layout */}
      <Sidebar />
      <TopNav />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-8 right-8 z-[1000] max-w-sm bg-zinc-950/95 border border-white/20 text-white py-3.5 px-5 rounded-2xl shadow-[0_10px_40px_rgba(255,255,255,0.05)] flex items-center gap-2.5 backdrop-blur-xl"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span className="text-xs font-bold font-body">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <motion.main 
        animate={{ 
          paddingLeft: isSidebarExpanded ? 260 : 0
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="relative z-10 pr-0 pb-16 min-h-screen flex flex-col items-center justify-start pt-32 w-full"
      >
        <div className="relative w-full max-w-[1240px] mx-auto py-10 px-6 lg:px-8">
          
          {/* Header Title section */}
          <div className="mb-10 text-left">
            <h1 className="text-5xl font-heading italic text-white tracking-wide">Billing & Sparks Environment</h1>
            <p className="text-sm text-zinc-400 mt-1.5 font-body">
              Monitor active resource usage balances, estimate costs dynamically, simulate cloud payment gateways, and configure active compilation limits.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            
            {/* ROW 1: Usage Stats & Simulated Wallet */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* CURRENT BALANCE CAPSULE */}
              <div className="lg:col-span-2 p-7 bg-zinc-950/80 border border-zinc-900 rounded-[1.5rem] relative overflow-hidden group hover:border-zinc-800 transition-all flex flex-col justify-between min-h-[220px]">
                {/* Silver Glow Aura */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.015] blur-3xl rounded-full pointer-events-none group-hover:bg-white/[0.03] transition-all duration-700" />
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 z-10 w-full text-left items-center">
                  <div className="md:col-span-3 flex flex-col gap-1.5">
                    <span className="text-[10px] font-black tracking-[0.2em] text-white/50 uppercase font-sans">
                      active computation Spark line
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <h3 className="text-5xl font-heading italic text-white tracking-widest leading-none">
                        {user.credits}
                      </h3>
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider ml-1">Sparks Remaining</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 font-body max-w-sm leading-relaxed">
                      Sparks are parsed in real-time as your workspace compiles JSX modules and interfaces with AI models. Your next package refill occurs on <span className="text-white font-bold underline">July 1, 2026</span>.
                    </p>
                  </div>

                  {/* Sparkline mini-graph Container */}
                  <div className="md:col-span-2 flex flex-col justify-center items-stretch bg-[#0c0c0e]/60 border border-white/[0.03] rounded-2xl p-4 min-h-[110px] backdrop-blur-md relative select-none">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-black tracking-wider text-white/40 uppercase font-sans">
                        30-Day Burn Sparkline
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        Avg: ~{Math.round(sparklineData.reduce((acc, curr) => acc + curr.spent, 0) / 30)}/day
                      </span>
                    </div>
                    <div className="h-[64px] w-full mt-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparklineData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                          <defs>
                            <linearGradient id="billingSparklineGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.25} />
                              <stop offset="100%" stopColor="#ffffff" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <RechartsTooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-zinc-950 border border-white/10 px-2 py-1 rounded text-[9px] font-mono text-white/90 shadow-xl">
                                    <span className="text-zinc-500">{payload[0].payload.day}: </span>
                                    <span className="font-extrabold text-white">{payload[0].value} cr</span>
                                  </div>
                                );
                              }
                              return null;
                            }}
                            cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1 }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="spent" 
                            stroke="#ffffff" 
                            strokeWidth={1.5} 
                            fill="url(#billingSparklineGrad)"
                            dot={false}
                            activeDot={{ r: 3, strokeWidth: 0, fill: '#ffffff' }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Simulated bar progress bar */}
                <div className="w-full z-10 mt-6">
                  <div className="w-full h-1.5 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-zinc-300 via-white to-zinc-400 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.2)] transition-all duration-500" 
                      style={{ width: `${Math.min(100, Math.max(1, (user.credits / user.maxCredits) * 100))}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-2 font-mono tracking-wide">
                    <span>{user.credits} / {user.maxCredits} STANDARD SPARKS ({Math.round(Math.min(100, Math.max(0, (user.credits / user.maxCredits) * 100)))}% CAP)</span>
                    <span>RESET PERIOD EXPIRES IN 20 DAYS</span>
                  </div>
                </div>
              </div>

              {/* PAYSTACK PORTAL / WALLET FUNDING MODULE */}
              <div className="p-7 bg-zinc-950/80 border border-zinc-900 rounded-[1.5rem] relative overflow-hidden flex flex-col justify-between hover:border-zinc-800 transition-all text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] blur-2xl rounded-full" />
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black tracking-[0.2em] text-white/50 uppercase font-sans">Developer Wallet</span>
                    <span className="text-[9px] bg-white/15 text-white/90 border border-white/10 rounded-full px-2 py-0.5 uppercase font-sans font-bold">Paystack Core</span>
                  </div>
                  <h4 className="text-4xl font-heading italic text-white mt-1">
                    ${walletBalance.toFixed(2)}
                  </h4>
                  <p className="text-xs text-zinc-500 font-body mt-1.5">
                    Preloaded sandbox balance used to pay for instant ad-hoc micro-refills.
                  </p>
                </div>

                <div className="space-y-2.5 mt-6 z-10 font-sans">
                  <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest block select-none">Quick Preload sandbox funds:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[10, 25, 50].map((amount) => (
                      <button
                        key={amount}
                        disabled={isFundingWallet}
                        onClick={() => handleWalletFund(amount)}
                        className="py-2.5 rounded-xl border border-zinc-900 hover:border-zinc-800 bg-zinc-950 text-white text-xs font-bold transition-all flex items-center justify-center gap-0.5 cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                      >
                        <PlusCircleIcon className="w-3.5 h-3.5 text-zinc-400" />
                        <span>${amount}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 2: Compute Usage Logs bar chart & Ad-hoc Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* COMPUTE LEVEL CHRONOS CHART */}
              <div className="lg:col-span-7 p-7 bg-zinc-950/80 border border-zinc-900 rounded-[1.5rem] relative overflow-hidden flex flex-col justify-between text-left">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xl font-heading italic text-white tracking-wide">Daily Computation Metrics</h3>
                    <span className="text-[10px] text-zinc-500 font-mono">PAST 14 DAYS</span>
                  </div>
                  <p className="text-xs text-zinc-500 font-body mb-6">
                    A visual representation of compute allocations spent running Sandbox virtual frames.
                  </p>
                </div>

                {/* Elegant Custom CSS & SVG chart */}
                <div className="h-44 flex items-end justify-between w-full gap-2.5 px-2 select-none border-b border-zinc-900/60 pb-1">
                  {sparksUsageHistory.map((day, idx) => {
                    const maxHeight = 110; 
                    const heightPercent = (day.spent / maxHeight) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center flex-1 group gap-2 h-full justify-end cursor-pointer">
                        {/* Dynamic Tooltip display on Hover */}
                        <div className="absolute bg-[#121214] border border-zinc-800 text-[10px] font-mono text-zinc-300 py-1 px-2 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity translate-y-[-125px] flex flex-col gap-0.5 z-20 shadow-xl border-white/5">
                          <span className="font-bold text-white">{day.spent} Sparks</span>
                          <span className="text-[9px] text-zinc-500">{day.task}</span>
                        </div>

                        {/* Bar styled with a white glow animation */}
                        <div className="w-full relative flex justify-center">
                          <div 
                            style={{ height: `${heightPercent}%` }} 
                            className="w-5 lg:w-7 rounded-t-md bg-gradient-to-t from-zinc-950 to-zinc-400 group-hover:to-white transition-all duration-300 relative overflow-hidden"
                          >
                            {/* Inner gradient sweep */}
                            <div className="absolute inset-0 bg-white/10" />
                          </div>
                        </div>

                        <span className="text-[9px] text-zinc-500 font-mono tracking-tight mt-1 scale-90 sm:scale-100">{day.date}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-6 text-[10.5px] mt-4 font-mono text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-zinc-400" />
                    <span>Layout Engine</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-zinc-700" />
                    <span>Database Sync</span>
                  </div>
                </div>
              </div>

              {/* AD-HOC SPARKS SIMULATOR SLIDER */}
              <div className="lg:col-span-5 p-7 bg-zinc-950/80 border border-zinc-900 rounded-[1.5rem] relative overflow-hidden flex flex-col justify-between text-left group hover:border-zinc-800 transition-all">
                {/* Silver Aura light on Simulator */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-white/[0.012] blur-2xl pointer-events-none" />
                
                <div>
                  <h3 className="text-xl font-heading italic text-white tracking-wide">Interactive Refill Estimator</h3>
                  <p className="text-xs text-zinc-500 font-body mt-1">
                    Estimate individual resource prices. Drag the slider to review micro-refill cost rates.
                  </p>
                </div>

                <div className="my-6 space-y-4 font-sans">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-body">Refill Units</span>
                    <span className="text-2xl font-heading italic text-white">{simulatedCredits} Sparks</span>
                  </div>

                  {/* Elegant Range Input Slider */}
                  <input 
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={simulatedCredits}
                    onChange={(e) => setSimulatedCredits(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-ew-resize accent-white"
                  />

                  <div className="flex justify-between items-center text-[10px] text-zinc-650 font-mono select-none">
                    <span>100 MIN</span>
                    <span>5000 MAX</span>
                  </div>
                </div>

                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-900 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-body">ESTIMATED PRICE</span>
                    <span className="text-3xl font-heading italic text-white leading-none mt-1">${calculatedSimulatorPrice}</span>
                  </div>
                  <button 
                    onClick={() => handleCheckout(`Micro-Refill`, `${simulatedCredits} Sparks`, calculatedSimulatorPrice)}
                    className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white hover:text-black hover:bg-white text-xs font-black tracking-widest uppercase rounded-full transition-all cursor-pointer"
                  >
                    PREPAY GATEWAY
                  </button>
                </div>
              </div>

            </div>

            {/* ROW 3: Subscription Plans upgraded columns */}
            <div className="flex flex-col items-center gap-5 mt-6 pb-2">
              <div className="text-center select-none">
                <h3 className="text-2xl font-heading text-white tracking-tight italic">Upgrade Plan Workspace</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-md font-body">Scale up memory configurations and dedicated server execution environments.</p>
              </div>

              {/* Billing Toggle */}
              <div className="flex items-center gap-6 mt-1 font-sans">
                <div className="bg-zinc-950 border border-zinc-900 p-1 rounded-full flex items-center select-none">
                  <button 
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${billingPeriod === 'monthly' ? 'bg-[#1e1e24] text-white' : 'text-zinc-500 hover:text-zinc-350 bg-transparent'}`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setBillingPeriod('yearly')}
                    className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${billingPeriod === 'yearly' ? 'bg-[#1e1e24] text-white' : 'text-zinc-500 hover:text-zinc-350 bg-transparent'}`}
                  >
                    Yearly
                  </button>
                </div>

                <span className="text-[10px] text-white font-extrabold uppercase tracking-widest bg-zinc-900 border border-zinc-800 py-1.5 px-3.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  SAVE UP TO 28% WITH YEARLY BILLING
                </span>
              </div>
            </div>

            {/* Plan dynamic card comparisons in place */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch select-none">
              
              {/* Card 1: PRO PLAN */}
              <div className="relative group cursor-default flex flex-col justify-between min-h-[480px]">
                {/* Silver Aura light glow */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-[1.5rem] opacity-20 pointer-events-none filter blur-[35px] transition-all duration-700 group-hover:opacity-50 group-hover:scale-[1.03]"
                  style={{ background: 'linear-gradient(137deg, #ffffff 0%, #a1a1aa 50%, #404040 100%)' }}
                />
                <div 
                  className="relative z-10 w-full h-full rounded-[1.5rem] p-7 flex flex-col justify-between bg-zinc-950/45 border hover:border-zinc-700 transition-all duration-500"
                  style={{
                    background: 'linear-gradient(#08080a, #040405) padding-box, linear-gradient(137deg, #ffffff 0%, #71717a 100%) border-box',
                    border: '1.2px solid transparent'
                  }}
                >
                  <div className="space-y-5 flex-1 select-none text-left">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-black tracking-[0.25em] text-white/70 uppercase font-sans">
                          PRO LEVEL
                        </span>
                        <h4 className="text-2xl font-heading italic text-white tracking-wide mt-1">Pro Plan</h4>
                      </div>
                      <div className="px-3.5 py-1 bg-white/5 border border-white/10 text-white rounded-full text-[9px] font-black tracking-widest font-sans uppercase">
                        ACTIVE REFILLS
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1 py-1 border-y border-zinc-900/50">
                      <span className="text-4xl font-heading italic text-white font-light">${proCalculated}</span>
                      <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest pl-1 font-sans">
                        / mo {billingPeriod === 'yearly' ? 'billed annually' : 'billed monthly'}
                      </span>
                    </div>

                    {/* Dropdown credits selector */}
                    <div className="flex flex-col gap-2 relative z-30">
                      <label className="text-[9px] text-zinc-505 font-bold tracking-widest uppercase font-sans">Monthly Package Sparks</label>
                      <button 
                        onClick={() => {
                          setShowProCreditsMenu(!showProCreditsMenu);
                          setShowBusCreditsMenu(false);
                        }}
                        className="flex items-center justify-between w-full bg-[#141416] border border-zinc-850 hover:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold text-zinc-200 text-left transition-all cursor-pointer focus:outline-none font-sans"
                      >
                        <span>{selectedProOpt.credits}</span>
                        <ChevronDown className={`w-4 h-4 text-zinc-550 transition-transform ${showProCreditsMenu ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {showProCreditsMenu && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setShowProCreditsMenu(false)} />
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute left-0 right-0 top-full mt-2 bg-[#121214] border border-zinc-850 p-1.5 rounded-2xl z-30 shadow-2xl font-sans"
                            >
                              {creditOptions.map((opt) => (
                                <button
                                  key={opt.credits}
                                  onClick={() => {
                                    setSelectedProOpt(opt);
                                    setShowProCreditsMenu(false);
                                    triggerToast(`Pro package selected: ${opt.credits}`);
                                  }}
                                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs hover:bg-zinc-900 transition-all cursor-pointer font-bold uppercase tracking-wider border-none bg-transparent ${
                                    selectedProOpt.credits === opt.credits ? 'bg-white/5 text-white' : 'text-zinc-400'
                                  }`}
                                >
                                  {opt.credits}
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Features list */}
                    <div className="flex flex-col gap-3.5 mt-5">
                      {[
                        `${selectedProOpt.credits.replace(" Sparks / month", " computation Sparks")}`,
                        'Lucid Spark Compilation Engine',
                        'Vibe Sandbox Live Rendering Core',
                        'Dynamic code-to-theme templates',
                        'Figma developer pipeline integration'
                      ].map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-400">
                          <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCheckout('Pro Plan', selectedProOpt.credits, proCalculated)}
                    className="w-full mt-8 py-3.5 rounded-full bg-white hover:bg-zinc-100 text-black text-xs font-black tracking-widest uppercase hover:scale-[1.01] transition-all shadow-xl cursor-pointer border-none z-10"
                  >
                    UPGRADE PRO PLAN
                  </button>
                </div>
              </div>

              {/* Card 2: BUSINESS PLAN */}
              <div className="relative group cursor-default flex flex-col justify-between min-h-[480px]">
                {/* Silver Aura light glow */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-[1.5rem] opacity-20 pointer-events-none filter blur-[35px] transition-all duration-700 group-hover:opacity-50 group-hover:scale-[1.03]"
                  style={{ background: 'linear-gradient(137deg, #e4e4e7 0%, #a1a1aa 50%, #3f3f46 100%)' }}
                />
                <div 
                  className="relative z-10 w-full h-full rounded-[1.5rem] p-7 flex flex-col justify-between bg-zinc-950/45 border hover:border-zinc-700 transition-all duration-500"
                  style={{
                    background: 'linear-gradient(#08080a, #040405) padding-box, linear-gradient(137deg, #e4e4e7 0%, #3f3f46 100%) border-box',
                    border: '1.2px solid transparent'
                  }}
                >
                  <div className="space-y-5 flex-1 select-none text-left">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-black tracking-[0.25em] text-white/70 uppercase font-sans">
                          BUSINESS LEVEL
                        </span>
                        <h4 className="text-2xl font-heading italic text-white tracking-wide mt-1">Business Plan</h4>
                      </div>
                      <div className="px-3.5 py-1 bg-white/5 border border-white/10 text-white rounded-full text-[9px] font-black tracking-widest font-sans uppercase">
                        ENTERPRISE CONTROL
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1 py-1 border-y border-zinc-900/50">
                      <span className="text-4xl font-heading italic text-white font-light">${busCalculated}</span>
                      <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest pl-1 font-sans">
                        / mo {billingPeriod === 'yearly' ? 'billed annually' : 'billed monthly'}
                      </span>
                    </div>

                    {/* Dropdown credits selector */}
                    <div className="flex flex-col gap-2 relative z-30">
                      <label className="text-[9px] text-zinc-505 font-bold tracking-widest uppercase font-sans font-body">Monthly Package Sparks</label>
                      <button 
                        onClick={() => {
                          setShowBusCreditsMenu(!showBusCreditsMenu);
                          setShowProCreditsMenu(false);
                        }}
                        className="flex items-center justify-between w-full bg-[#141416] border border-zinc-850 hover:border-zinc-805 rounded-xl px-4 py-2.5 text-xs font-bold text-zinc-200 text-left transition-all cursor-pointer focus:outline-none font-sans"
                      >
                        <span>{selectedBusOpt.credits}</span>
                        <ChevronDown className={`w-4 h-4 text-zinc-550 transition-transform ${showBusCreditsMenu ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {showBusCreditsMenu && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setShowBusCreditsMenu(false)} />
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute left-0 right-0 top-full mt-2 bg-[#121214] border border-zinc-850 p-1.5 rounded-2xl z-30 shadow-2xl font-sans"
                            >
                              {creditOptions.map((opt) => (
                                <button
                                  key={opt.credits}
                                  onClick={() => {
                                    setSelectedBusOpt(opt);
                                    setShowBusCreditsMenu(false);
                                    triggerToast(`Business package selected: ${opt.credits}`);
                                  }}
                                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs hover:bg-zinc-900 transition-all cursor-pointer font-bold uppercase tracking-wider border-none bg-transparent ${
                                    selectedBusOpt.credits === opt.credits ? 'bg-white/5 text-white' : 'text-zinc-400'
                                  }`}
                                >
                                  {opt.credits}
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Features list */}
                    <div className="flex flex-col gap-3.5 mt-5">
                      {[
                        `${selectedBusOpt.credits.replace(" Sparks / month", " computation Sparks")}`,
                        'Internal application sandboxed publishing',
                        'Single Sign-On (SSO) secure login',
                        'Consolidated workspace pipelines',
                        'Isolated private deployment targets'
                      ].map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-400">
                          <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCheckout('Business Plan', selectedBusOpt.credits, busCalculated)}
                    className="w-full mt-8 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-black tracking-widest uppercase hover:scale-[1.01] transition-all cursor-pointer z-10"
                  >
                    UPGRADE BUSINESS PLAN
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </motion.main>
    </div>
  );
};

// Internal icon helpers for self-contained execution
const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
  </svg>
);
