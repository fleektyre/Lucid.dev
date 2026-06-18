import React, { useState } from 'react';
import { Layers, Sparkles, Check, ToggleLeft, ToggleRight, Settings } from 'lucide-react';

interface AddonsSettingsProps {
  triggerToast: (msg: string) => void;
}

export const AddonsSettings: React.FC<AddonsSettingsProps> = ({ triggerToast }) => {
  const [addons, setAddons] = useState([
    { id: '1', title: 'Smart Auto-Scaffolding', desc: 'Predictively generate routes, setup files, and standard API controllers using zero-shot context analysis.', active: true, badge: 'PRO' },
    { id: '2', title: 'Vector DB Context Chunking', desc: 'Auto-embed files under workspace subfolders using highly-accurate text-embedding models to save credit usage.', active: false, badge: 'ENTERPRISE' },
    { id: '3', title: 'Tailwind Real-time Parser', desc: 'Statically-analyzes Tailwind className tags to instantly optimize CSS bundling payloads during builds.', active: true, badge: 'FREE' },
  ]);

  const toggleAddon = (id: string, name: string) => {
    setAddons(addons.map(add => {
      if (add.id === id) {
        const nextState = !add.active;
        triggerToast(`${name} integration ${nextState ? 'enabled' : 'disabled'}`);
        return { ...add, active: nextState };
      }
      return add;
    }));
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn font-body text-zinc-300">
      <div>
        <h2 className="text-3xl font-heading text-white tracking-tight">Add-on Features</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Toggle preview add-ons, beta features, or intelligence extensions to modify Lucid compiler behaviors.
        </p>
      </div>

      <div className="flex flex-col gap-5 border-t border-zinc-900 pt-6">

        {/* Addon components */}
        <div className="flex flex-col gap-4">
          {addons.map((addon) => (
            <div 
              key={addon.id}
              className="p-5 bg-zinc-950/20 border border-zinc-900 hover:border-zinc-805 rounded-[1.5rem] flex items-start justify-between gap-5 transition-all group relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/[0.005] blur-2xl rounded-full" />
              <div className="flex gap-4.5">
                <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-center font-bold text-zinc-500 shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-white tracking-wide group-hover:text-white transition-colors">
                      {addon.title}
                    </span>
                    <span className="text-[8px] font-black tracking-widest text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded font-sans scale-90">
                      {addon.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed font-sans max-w-xl">
                    {addon.desc}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => toggleAddon(addon.id, addon.title)}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-305 ease-in-out shrink-0 mt-1 cursor-pointer focus:outline-none bg-transparent border-0
                  ${addon.active ? 'bg-white' : 'bg-zinc-800'}
                `}
              >
                <div className={`w-5 h-5 rounded-full bg-black transition-transform duration-305 ease-in-out transform ${addon.active ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
