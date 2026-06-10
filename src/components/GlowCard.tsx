import React from 'react';
import { motion } from 'framer-motion';

export const GlowCard = ({ children, className }: any) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-white/5 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
    <div className="relative bg-zinc-950/80 border border-white/10 rounded-[2rem] backdrop-blur-3xl overflow-hidden">
      {children}
    </div>
  </div>
);
