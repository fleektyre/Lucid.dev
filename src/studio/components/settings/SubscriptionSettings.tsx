import React, { useState } from 'react';
import { CreditCard, Check, ChevronDown, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';

interface SubscriptionSettingsProps {
  userEmail: string;
  triggerToast: (msg: string) => void;
}

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

export const SubscriptionSettings: React.FC<SubscriptionSettingsProps> = ({ userEmail, triggerToast }) => {
  const { user, setPackageCredits, setPlan, addNotification } = useStudioStore();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedProOpt, setSelectedProOpt] = useState<DropdownOption>(creditOptions[0]);
  const [selectedBusOpt, setSelectedBusOpt] = useState<DropdownOption>(creditOptions[2]);
  const [showProCreditsMenu, setShowProCreditsMenu] = useState(false);
  const [showBusCreditsMenu, setShowBusCreditsMenu] = useState(false);

  // Pro price calculations
  const proMonthlyValue = selectedProOpt.pricePro;
  const proCalculated = billingPeriod === 'yearly' ? Math.floor(proMonthlyValue * 0.8) : proMonthlyValue;

  // Business price calculations
  const busMonthlyValue = selectedBusOpt.priceBus;
  const busCalculated = billingPeriod === 'yearly' ? Math.floor(busMonthlyValue * 0.8) : busMonthlyValue;

  const handleCheckout = (planName: string, selectedPackage: string, price: number) => {
    const amount = parseInt(selectedPackage.replace(/[^0-9]/g, ''), 10) || 100;
    const targetPlan = planName.includes('Business') ? 'Business' : 'Pro';
    
    triggerToast(`Routing Paystack payment gateway for ${planName} ($${price})...`);
    setTimeout(() => {
      setPackageCredits(amount);
      setPlan(targetPlan);
      triggerToast(`Paystack subscription active: Upgraded workspace to ${planName}!`);
      addNotification(
        'billing',
        'Upgrade Activated',
        `Processed Paystack sandbox payment. Your standard Sparks volume is updated to ${amount}.`
      );
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn font-body text-zinc-300">
      <div>
        <h2 className="text-3xl font-heading text-white tracking-tight">Sparks & Billing</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Monitor your active resource usage, manage Sparks limit refills, or upgrade plan environments.
        </p>
      </div>

      <div className="flex flex-col gap-6 border-t border-zinc-900 pt-6">
        
        {/* Next refill prompt line */}
        <p className="text-xs text-zinc-400 font-sans tracking-wide">
          Your next package refill of <span className="text-white font-bold">{user.maxCredits} Sparks</span> will occur on <span className="text-white font-bold underline">July 1, 2026</span>.
        </p>

        {/* Balance Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Main Balance Box */}
          <div className="lg:col-span-2 p-6.5 bg-[#09090b]/80 border border-zinc-850 rounded-[1.5rem] relative overflow-hidden group hover:border-zinc-800 transition-all flex flex-col justify-between min-h-[160px]">
            {/* Soft inner glow - White / silver accent */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-white/[0.02] blur-3xl rounded-full pointer-events-none group-hover:bg-white/[0.04] transition-all duration-500" />
            
            <div className="flex flex-col gap-1.5 z-10">
              <span className="text-[10px] font-black tracking-[0.2em] text-white/60 uppercase font-sans">
                Current Sparks Balance
              </span>
              <h3 className="text-4xl font-black text-white tracking-wider flex items-baseline gap-1 mt-1">
                <span>{user.credits}</span>
                <span className="text-xs text-zinc-500 font-normal ml-1">Sparks available</span>
              </h3>
            </div>

            {/* Credit progress slider */}
            <div className="w-full z-10 mt-6 md:mt-2">
              <div className="w-full h-1.5 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-white to-zinc-400 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.2)] transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.max(1, (user.credits / user.maxCredits) * 100))}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-2 font-mono tracking-wide">
                {user.credits} / {user.maxCredits} monthly Sparks — Unused Sparks expire July 1, 2026.
              </p>
            </div>
          </div>

          {/* Account Profile Box (Normalized, no flashing green lights) */}
          <div className="p-6 bg-[#09090b]/80 border border-zinc-900 rounded-[1.5rem] flex flex-col items-center justify-center text-center gap-4 relative hover:border-zinc-800 transition-all">
            <div className="w-13 h-13 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-lg font-black flex items-center justify-center font-serif leading-none shadow-lg">
              π
            </div>
            <div className="flex flex-col min-w-0 max-w-full">
              <span className="text-xs text-zinc-500 font-sans tracking-wide uppercase font-bold">Standard Workspace</span>
              <span className="text-sm font-bold text-white truncate max-w-xs mt-0.5">{userEmail}</span>
            </div>
            
            {/* Clean tag - reflecting real plan tier */}
            <div className="flex items-center gap-1.5 shrink-0 bg-zinc-900 border border-zinc-800 text-white px-3.5 py-1.5 rounded-full uppercase tracking-wider text-[9px] font-extrabold select-none">
              <span>{user.plan ? `${user.plan} Workspace` : 'Free Plan'}</span>
            </div>
          </div>

        </div>


        {/* Daily limit banner */}
        <div className="p-4 rounded-[1rem] bg-[#0c0c0e]/30 border border-zinc-900 font-sans text-xs text-zinc-400 flex items-center justify-between">
          <div className="flex items-center gap-2 select-none">
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            <span>Daily restriction limit: <span className="font-bold text-white">14 / 14 Sparks</span></span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Resets in 11h 32m</span>
        </div>

        {/* Pricing Heading & Period Selector */}
        <div className="flex flex-col items-center gap-5 mt-8 pb-3">
          <div className="text-center">
            <h3 className="text-2xl font-heading text-white tracking-tight">Upgrade Plan Workspace</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-md">Scale up your memory workspace and API model Spark lines instantaneously.</p>
          </div>

          {/* Billing Period Switcher in Lucid Dev style */}
          <div className="flex items-center gap-6.5 mt-2">
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

            <span className="text-[10px] text-white font-extrabold uppercase tracking-widest bg-zinc-900 border border-zinc-800 py-1 px-3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              SAVE UP TO 28% WITH YEARLY BILLING
            </span>
          </div>
        </div>

        {/* Plan Cards comparison with premium white glow styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2 items-stretch select-none">
          
          {/* Card 1: PRO PLAN */}
          <div className="relative group cursor-default flex flex-col justify-between min-h-[480px]">
            {/* Glowing Aura Effect - uses beautiful silver/white metallic glow */}
            <div 
              className="absolute inset-0 w-full h-full rounded-[1.5rem] opacity-20 pointer-events-none filter blur-[35px] transition-all duration-700 group-hover:opacity-50 group-hover:scale-[1.03]"
              style={{ background: 'linear-gradient(137deg, #ffffff 0%, #a1a1aa 50%, #404040 100%)' }}
            />
            {/* Foreground Card with Gradient Border */}
            <div 
              className="relative z-10 w-full h-full rounded-[1.5rem] p-7 flex flex-col justify-between bg-zinc-950/45 border hover:border-zinc-700 transition-all duration-500"
              style={{
                background: 'linear-gradient(#08080a, #040405) padding-box, linear-gradient(137deg, #ffffff 0%, #71717a 100%) border-box',
                border: '1.2px solid transparent'
              }}
            >
              <div className="space-y-5 flex-1 select-none">
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
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest pl-1">
                    / mo {billingPeriod === 'yearly' ? 'billed annually' : 'billed monthly'}
                  </span>
                </div>

                {/* Dropdown Sparks selector */}
                <div className="flex flex-col gap-2 relative z-30">
                  <label className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase">Monthly Package Sparks</label>
                  <button 
                    onClick={() => {
                      setShowProCreditsMenu(!showProCreditsMenu);
                      setShowBusCreditsMenu(false);
                    }}
                    className="flex items-center justify-between w-full bg-[#141416] border border-zinc-850 hover:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold text-zinc-200 text-left transition-all cursor-pointer focus:outline-none font-sans"
                  >
                    <span>{selectedProOpt.credits}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${showProCreditsMenu ? 'rotate-180' : ''}`} />
                  </button>
                  {showProCreditsMenu && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setShowProCreditsMenu(false)} />
                      <div className="absolute left-0 right-0 top-full mt-2 bg-[#121214] border border-zinc-850 p-1.5 rounded-2xl z-30 shadow-2xl font-sans">
                        {creditOptions.map((opt) => (
                          <button
                            key={opt.credits}
                            onClick={() => {
                              setSelectedProOpt(opt);
                              setShowProCreditsMenu(false);
                              triggerToast(`Pro Plan configuration updated: ${opt.credits}`);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs hover:bg-zinc-900 transition-all cursor-pointer font-bold uppercase tracking-wider ${
                              selectedProOpt.credits === opt.credits ? 'bg-white/5 text-white' : 'text-zinc-400'
                            }`}
                          >
                            {opt.credits}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
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
                UPGRADE PRO
              </button>
            </div>
          </div>

          {/* Card 2: BUSINESS PLAN (In place of Teams) */}
          <div className="relative group cursor-default flex flex-col justify-between min-h-[480px]">
            {/* Glowing Aura Effect - uses beautiful heavy slate/white metallic glow */}
            <div 
              className="absolute inset-0 w-full h-full rounded-[1.5rem] opacity-20 pointer-events-none filter blur-[35px] transition-all duration-700 group-hover:opacity-50 group-hover:scale-[1.03]"
              style={{ background: 'linear-gradient(137deg, #e4e4e7 0%, #a1a1aa 50%, #3f3f46 100%)' }}
            />
            {/* Foreground Card with Gradient Border */}
            <div 
              className="relative z-10 w-full h-full rounded-[1.5rem] p-7 flex flex-col justify-between bg-zinc-950/45 border hover:border-zinc-700 transition-all duration-500"
              style={{
                background: 'linear-gradient(#08080a, #040405) padding-box, linear-gradient(137deg, #e4e4e7 0%, #3f3f46 100%) border-box',
                border: '1.2px solid transparent'
              }}
            >
              <div className="space-y-5 flex-1 select-none">
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
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest pl-1">
                    / mo {billingPeriod === 'yearly' ? 'billed annually' : 'billed monthly'}
                  </span>
                </div>

                {/* Dropdown Sparks selector */}
                <div className="flex flex-col gap-2 relative z-30">
                  <label className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase">Monthly Package Sparks</label>
                  <button 
                    onClick={() => {
                      setShowBusCreditsMenu(!showBusCreditsMenu);
                      setShowProCreditsMenu(false);
                    }}
                    className="flex items-center justify-between w-full bg-[#141416] border border-zinc-850 hover:border-zinc-805 rounded-xl px-4 py-2.5 text-xs font-bold text-zinc-200 text-left transition-all cursor-pointer focus:outline-none font-sans"
                  >
                    <span>{selectedBusOpt.credits}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${showBusCreditsMenu ? 'rotate-180' : ''}`} />
                  </button>
                  {showBusCreditsMenu && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setShowBusCreditsMenu(false)} />
                      <div className="absolute left-0 right-0 top-full mt-2 bg-[#121214] border border-zinc-850 p-1.5 rounded-2xl z-30 shadow-2xl font-sans">
                        {creditOptions.map((opt) => (
                          <button
                            key={opt.credits}
                            onClick={() => {
                              setSelectedBusOpt(opt);
                              setShowBusCreditsMenu(false);
                              triggerToast(`Business Plan configuration updated: ${opt.credits}`);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs hover:bg-zinc-900 transition-all cursor-pointer font-bold uppercase tracking-wider ${
                              selectedBusOpt.credits === opt.credits ? 'bg-white/5 text-white' : 'text-zinc-400'
                            }`}
                          >
                            {opt.credits}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Features list */}
                <div className="flex flex-col gap-3.5 mt-5">
                  {[
                    `${selectedBusOpt.credits.replace(" Sparks / month", " computation Sparks")}`,
                    'Internal application sandboxed publishing',
                    'Single Sign-On (SSO) secure login',
                    'Consolidated team workspace pipelines',
                    'Isolated private deployment container targets'
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
                UPGRADE BUSINESS
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
