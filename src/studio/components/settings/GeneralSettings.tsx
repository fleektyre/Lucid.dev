import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface GeneralSettingsProps {
  triggerToast: (msg: string) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ triggerToast }) => {
  const [theme, setTheme] = useState<'Dark' | 'Light' | 'System'>('Dark');
  const [displayCredit, setDisplayCredit] = useState(true);
  const [soundNotify, setSoundNotify] = useState(true);

  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <div className="flex flex-col gap-8 animate-fadeIn font-body text-zinc-300">
      <div>
        <h2 className="text-3xl font-heading text-white tracking-tight">General Settings</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Manage your preferences for appearance and notifications.
        </p>
      </div>

      {/* Appearance & Notifications Section */}
      <div className="flex flex-col gap-5 border-t border-zinc-900 pt-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/90 mb-2">
          Appearance & Sound
        </h3>

        {/* Theme item */}
        <div className="flex items-center justify-between py-4 border-b border-zinc-900/50">
          <div className="flex flex-col gap-0.5 max-w-[70%]">
            <span className="text-sm font-bold text-zinc-100">Workspace Theme</span>
            <span className="text-xs text-zinc-500 leading-relaxed">
              Sets the editor workspace and preview panels to light mode, dark mode, or to match system preferences.
            </span>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center justify-between gap-3 text-xs font-bold text-zinc-200 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-full px-5 py-2 w-32 transition-all cursor-pointer"
            >
              <span>{theme}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            {showThemeMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-32 bg-zinc-950/95 backdrop-blur-md border border-zinc-850 rounded-2xl p-1.5 z-50 shadow-2xl">
                  {['Dark', 'Light', 'System'].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTheme(t as any);
                        setShowThemeMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-zinc-900 text-xs font-medium text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Display credit */}
        <div className="flex items-center justify-between py-4 border-b border-zinc-900/50">
          <div className="flex flex-col gap-0.5 max-w-[70%]">
            <span className="text-sm font-bold text-zinc-100">Display credit usage in chat</span>
            <span className="text-xs text-zinc-500 leading-relaxed">
              Always shows monthly workspace credit balance above the chatbox as you build.
            </span>
          </div>

          <button 
            onClick={() => {
              setDisplayCredit(!displayCredit);
            }}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-305 ease-in-out cursor-pointer ${displayCredit ? 'bg-white' : 'bg-zinc-800'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-black transition-transform duration-305 ease-in-out transform ${displayCredit ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Sound notification */}
        <div className="flex items-center justify-between py-4">
          <div className="flex flex-col gap-0.5 max-w-[70%]">
            <span className="text-sm font-bold text-zinc-100">Chime notifications</span>
            <span className="text-xs text-zinc-500 leading-relaxed">
              Plays a subtle ambient tone when compilation tasks complete or the assistant finishes processing.
            </span>
          </div>

          <button 
            onClick={() => {
              setSoundNotify(!soundNotify);
            }}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-305 ease-in-out cursor-pointer ${soundNotify ? 'bg-white' : 'bg-zinc-800'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-black transition-transform duration-305 ease-in-out transform ${soundNotify ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
