import React, { useState } from 'react';
import { Database, Globe, Check, Github, ExternalLink, RefreshCw } from 'lucide-react';

interface ApplicationsSettingsProps {
  triggerToast: (msg: string) => void;
}

export const ApplicationsSettings: React.FC<ApplicationsSettingsProps> = ({ triggerToast }) => {
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [netlifyConnected, setNetlifyConnected] = useState(false);
  const [figmaConnected, setFigmaConnected] = useState(true);

  return (
    <div className="flex flex-col gap-8 animate-fadeIn font-body text-zinc-300">
      <div>
        <h2 className="text-3xl font-heading text-white tracking-tight">Applications</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Connect other cloud environments and services to extend what you can construct with Lucid.
        </p>
      </div>

      <div className="flex flex-col gap-5 border-t border-zinc-900 pt-6">
        
        {/* Database - Supabase */}
        <div className="p-5 bg-zinc-950/20 border border-zinc-900 rounded-[1.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-zinc-800 transition-all group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/[0.01] blur-2xl rounded-full" />
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-teal-950/20 border border-teal-900/30 flex items-center justify-center font-bold text-teal-400">
              <Database className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">Database Link</span>
                <span className="text-xs text-[#3ecf8e] font-heading font-normal">Supabase</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans max-w-xl">
                Link dynamic tables and user database schemas to enable persistent production user logins and secure tables with row level security (RLS).
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSupabaseConnected(!supabaseConnected);
              triggerToast(supabaseConnected ? "Supabase engine decoupled from compiler" : "Establishing connection pipelines to Supabase schema...");
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all focus:outline-none cursor-pointer
              ${supabaseConnected 
                ? 'bg-zinc-900 hover:bg-zinc-850 text-zinc-400 border border-zinc-800' 
                : 'bg-white hover:bg-zinc-100 text-black shadow-[0_0_20px_rgba(255,255,255,0.08)]'
              }
            `}
          >
            {supabaseConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>

        {/* Hosting - Netlify */}
        <div className="p-5 bg-zinc-950/20 border border-zinc-900 rounded-[1.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-zinc-800 transition-all group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/[0.01] blur-2xl rounded-full" />
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-cyan-950/20 border border-cyan-900/30 flex items-center justify-center font-bold text-cyan-400">
              <Globe className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">Hosting Webhook</span>
                <span className="text-xs text-cyan-400 font-heading font-normal">Netlify</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans max-w-xl">
                Automatically bundle, optimize, and publish production web instances onto custom Netlify edge endpoints.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setNetlifyConnected(!netlifyConnected);
              triggerToast(netlifyConnected ? "Netlify deployment pipeline suspended" : "Attaching serverless edge webhooks for automated Netlify deployment...");
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all focus:outline-none cursor-pointer
              ${netlifyConnected 
                ? 'bg-zinc-900 hover:bg-zinc-850 text-zinc-400 border border-zinc-800' 
                : 'bg-white hover:bg-zinc-100 text-black shadow-[0_0_20px_rgba(255,255,255,0.08)]'
              }
            `}
          >
            {netlifyConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>

        {/* Design - Figma */}
        <div className="p-5 bg-zinc-950/20 border border-zinc-900 rounded-[1.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-zinc-800 transition-all group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/[0.01] blur-2xl rounded-full" />
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-950/10 border border-orange-900/30 flex items-center justify-center font-bold text-orange-400">
              <Check className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">Visual Importer</span>
                <span className="text-xs text-orange-400 font-heading font-normal">Figma API</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans max-w-xl">
                Synchronize, ingest, and translate Figma frames directly into code layouts within your active workspace.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setFigmaConnected(!figmaConnected);
              triggerToast(figmaConnected ? "Figma token access unlinked" : "Authenticating Figma developer account credentials...");
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all focus:outline-none cursor-pointer
              ${figmaConnected 
                ? 'bg-zinc-900 hover:bg-zinc-850 text-zinc-400 border border-zinc-800' 
                : 'bg-white hover:bg-zinc-100 text-black shadow-[0_0_20px_rgba(255,255,255,0.08)]'
              }
            `}
          >
            {figmaConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>

        {/* Code Sync - GitHub */}
        <div className="p-5 bg-zinc-950/20 border border-zinc-900 rounded-[1.5rem] flex flex-col gap-4 hover:border-zinc-800 transition-all group relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-center text-white font-bold text-white">
              <Github className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">Repository Syncer</span>
                <span className="text-xs text-zinc-400 font-heading font-normal">GitHub Workspace</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans max-w-2xl">
                To revoke active Lucid repository synchronizations, please visit <span className="underline text-zinc-400 font-mono">github.com/settings/apps/authorizations</span>, locate the "Lucid Workspace Connect" applet, and select "Revoke".
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-zinc-900 pt-3.5 mt-1">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest cursor-pointer select-none"
            >
              <span>Manage active auth logs on StackBlitz</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
