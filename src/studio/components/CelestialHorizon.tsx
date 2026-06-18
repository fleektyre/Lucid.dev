import React from 'react';

export const CelestialHorizon: React.FC = () => {
  return (
    <div className="absolute inset-x-0 bottom-0 top-[20%] pointer-events-none overflow-hidden select-none z-0">
      {/* Planetary radial backlight */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[160%] aspect-square max-w-[1600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.14)_0%,rgba(37,99,235,0.04)_50%,transparent_100%)] blur-[90px]" />
      
      {/* Curved Glowing Horizon Line */}
      <svg
        className="absolute bottom-[-20px] left-0 w-full h-[360px] overflow-visible"
        viewBox="0 0 1440 360"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Intense neon glow blending filter */}
          <filter id="horizonGlow1" x="-20%" y="-100%" width="140%" height="300%">
            <feGaussianBlur stdDeviation="14" result="blur1" />
            <feGaussianBlur stdDeviation="28" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Semi-sharp accent neon edge filter */}
          <filter id="horizonGlowSharp" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glowing under-arc planetary atmosphere fill */}
          <linearGradient id="horizonAtmosphere" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
            <stop offset="25%" stopColor="#0284c7" stopOpacity="0.04" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Atmospheric bleed fill directly under curving path */}
        <path
          d="M -100,240 Q 720,380 1540,240 L 1540,400 L -100,400 Z"
          fill="url(#horizonAtmosphere)"
          className="opacity-75"
        />

        {/* Base dark sapphire background glow */}
        <path
          d="M -100,240 Q 720,380 1540,240"
          fill="none"
          stroke="#1e3a8a"
          strokeWidth="48"
          strokeLinecap="round"
          className="opacity-[0.25] blur-2xl"
        />

        {/* Broad deep cobalt-blue neon halo */}
        <path
          d="M -100,240 Q 720,380 1540,240"
          fill="none"
          stroke="#2563eb"
          strokeWidth="24"
          strokeLinecap="round"
          className="opacity-[0.35] blur-xl"
        />

        {/* Brilliant cyan electric plasma charge */}
        <path
          d="M -100,240 Q 720,380 1540,240"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#horizonGlow1)"
          className="opacity-[0.60]"
        />

        {/* Medium-thin vibrant white-sky-blue beam */}
        <path
          d="M -100,240 Q 720,380 1540,240"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#horizonGlowSharp)"
          className="opacity-[0.80]"
        />

        {/* Sun-lit white horizon core line */}
        <path
          d="M -100,240 Q 720,380 1540,240"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-[0.95]"
        />
      </svg>
    </div>
  );
};
