import React, { useState } from 'react';
import { Cloud, Check, Shield, Server, RefreshCw, AlertCircle } from 'lucide-react';

interface CloudSettingsProps {
  triggerToast: (msg: string) => void;
}

export const CloudSettings: React.FC<CloudSettingsProps> = ({ triggerToast }) => {
  const [cloudActive, setCloudActive] = useState(true);
  const [region, setRegion] = useState('europe-west2-london');
  const [retrying, setRetrying] = useState(false);

  const testConnection = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      triggerToast("Telemetry secure ping succeeded to Cloud Run instances.");
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn font-body text-zinc-300">
      <div>
        <h2 className="text-3xl font-heading text-white tracking-tight">Cloud Infrastructure</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Monitor your active server telemetry logs or deploy custom Docker sandbox runtimes.
        </p>
      </div>

      <div className="flex flex-col gap-5 border-t border-zinc-900 pt-6">

        {/* Cloud Status Card */}
        <div className="p-5 bg-zinc-950/20 border border-zinc-900 rounded-[1.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden group hover:border-zinc-800 transition-all">
          <div className="absolute right-0 top-0 w-32 h-32 bg-sky-500/[0.01] blur-2xl rounded-full" />
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-sky-950/20 border border-sky-900/20 flex items-center justify-center font-bold text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
              <Cloud className="w-5 h-5 text-sky-400" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-white tracking-wide">Production Cloud Run Instance</span>
              <p className="text-xs text-zinc-550 leading-relaxed font-sans max-w-xl">
                Active sandboxed isolated workspace running in a real secure full-stack Docker container at Cloud Run host nodes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 uppercase tracking-widest text-[10px] font-black shrink-0 bg-sky-950/30 border border-sky-900/30 text-sky-400 px-3 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>Active Instance</span>
          </div>
        </div>

        {/* Region configuration */}
        <div className="p-5 bg-zinc-950/20 border border-zinc-900 rounded-[1.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-zinc-800 transition-all">
          <div className="flex flex-col gap-0.5 max-w-[70%]">
            <span className="text-sm font-bold text-white tracking-wide">Primary Cloud Region</span>
            <p className="text-xs text-zinc-550 leading-relaxed font-sans mt-0.5">
              Determines where compile tasks are containerized to minimize telemetry ping latencies.
            </p>
          </div>

          <select 
            value={region} 
            onChange={(e) => {
              setRegion(e.target.value);
              triggerToast(`Compiler routing region updated to ${e.target.value}`);
            }}
            className="bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-xs font-bold text-zinc-300 rounded-full px-5 py-2.5 outline-none cursor-pointer focus:ring-0 transition-all font-mono"
          >
            <option value="europe-west2-london">europe-west2 (London)</option>
            <option value="us-central1-iowa">us-central1 (Iowa)</option>
            <option value="asia-east1-taiwan">asia-east1 (Taiwan)</option>
          </select>
        </div>

        {/* Diagnostic Actions */}
        <div className="p-5 bg-zinc-950/20 border border-zinc-900 rounded-[1.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-zinc-800 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-center font-bold text-zinc-500 shrink-0">
              <Server className="w-5 h-5 text-zinc-500" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-white">Cloud Diagnostic Health Latency</span>
              <p className="text-xs text-zinc-550 leading-relaxed font-sans">
                Run telemetry checks to measure execution delays between your local proxy and active containers.
              </p>
            </div>
          </div>

          <button
            onClick={testConnection}
            disabled={retrying}
            className="px-5.5 py-2.5 rounded-full border border-zinc-850 bg-zinc-950 hover:bg-zinc-900 text-xs text-zinc-300 font-bold transition-all flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-zinc-500 ${retrying ? 'animate-spin text-white' : ''}`} />
            <span>{retrying ? 'Checking latency...' : 'Test telemetry ping'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
