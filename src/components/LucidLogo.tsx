import React from 'react';

export const LucidLogo: React.FC = () => (
  <div className="flex items-center gap-3 group cursor-pointer select-none">
    <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-heading text-base italic text-white group-hover:scale-105 transition-transform duration-300">l</div>
    <span className="font-heading text-2xl italic text-white tracking-[0.1em]">lucid.dev</span>
  </div>
);
