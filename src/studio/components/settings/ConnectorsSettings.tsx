import React, { useState } from 'react';
import { Network, Search, PlusCircle, Trash, Check, Wifi, Globe, Terminal, FileCode } from 'lucide-react';

interface ConnectorsSettingsProps {
  triggerToast: (msg: string) => void;
}

export const ConnectorsSettings: React.FC<ConnectorsSettingsProps> = ({ triggerToast }) => {
  const [connectors, setConnectors] = useState([
    { id: '1', name: 'Slack workspace integration', url: 'https://mcp.lucid.dev/slack', status: 'online', type: 'API Router' },
    { id: '2', name: 'Supabase schema retriever', url: 'https://mcp.lucid.dev/supabase', status: 'online', type: 'Database connection' },
    { id: '3', name: 'Netlify edge deployment webhook', url: 'https://mcp.lucid.dev/netlify', status: 'offline', type: 'deployment webhook' },
  ]);

  const [newConnectorName, setNewConnectorName] = useState('');
  const [newConnectorUrl, setNewConnectorUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addConnector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConnectorName || !newConnectorUrl) return;

    const newConn = {
      id: Date.now().toString(),
      name: newConnectorName,
      url: newConnectorUrl,
      status: 'online',
      type: 'Custom API'
    };

    setConnectors([...connectors, newConn]);
    setNewConnectorName('');
    setNewConnectorUrl('');
    setIsAdding(false);
    triggerToast(`MCP Server "${newConnectorName}" mounted successfully.`);
  };

  const removeConnector = (id: string, name: string) => {
    setConnectors(connectors.filter(c => c.id !== id));
    triggerToast(`MCP Server "${name}" unmounted.`);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn font-body text-zinc-300">
      <div>
        <h2 className="text-3xl font-heading text-white tracking-tight">Connectors (MCP)</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Mount Model Context Protocol servers to give Lucid models direct file read/write, terminal execution, or live API toolboxes.
        </p>
      </div>

      <div className="flex flex-col gap-5 border-t border-zinc-900 pt-6">

        {/* Add integration toggle */}
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
            Active MC Protocols
          </h3>

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Mount MCP Server</span>
            </button>
          )}
        </div>

        {/* Mounting Form */}
        {isAdding && (
          <form onSubmit={addConnector} className="p-5 bg-zinc-950/40 border border-zinc-900 rounded-[1.5rem] flex flex-col gap-4 animate-slideDown">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Mount New Integration Tool</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Server Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Stripe checkout pipeline tool"
                  value={newConnectorName}
                  onChange={(e) => setNewConnectorName(e.target.value)}
                  className="bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-0 placeholder-zinc-700 transition-all font-sans"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Sse URL / WebSocket Endpoint</label>
                <input 
                  type="url" 
                  placeholder="https://mcp.example.com/sse"
                  value={newConnectorUrl}
                  onChange={(e) => setNewConnectorUrl(e.target.value)}
                  className="bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-0 placeholder-zinc-700 transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3.5 border-t border-zinc-900/50 pt-4 mt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4.5 py-2 rounded-full hover:bg-zinc-900 text-xs text-zinc-400 font-bold transition-all cursor-pointer focus:outline-none bg-transparent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5.5 py-2 rounded-full bg-white hover:bg-zinc-100 text-black text-xs font-bold transition-all cursor-pointer focus:outline-none"
              >
                Mount Tool
              </button>
            </div>
          </form>
        )}

        {/* MCP Connectors List */}
        <div className="flex flex-col gap-3.5">
          {connectors.map((c) => (
            <div 
              key={c.id}
              className="p-5 bg-zinc-950/20 border border-zinc-900 hover:border-zinc-800 rounded-[1.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all group relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/[0.01] blur-2xl rounded-full" />
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold border shrink-0 transition-colors
                  ${c.status === 'online' 
                    ? 'bg-white/5 border-white/20 text-white' 
                    : 'bg-zinc-950 border-zinc-850 text-zinc-500'
                  }
                `}>
                  <Network className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-wide group-hover:text-white transition-colors">{c.name}</span>
                    <span className="text-[10px] font-mono tracking-wider text-zinc-550 border border-zinc-900 bg-zinc-950/50 px-1.5 py-0.5 rounded">
                      {c.type}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-normal font-mono truncate max-w-sm sm:max-w-md md:max-w-lg">
                    {c.url}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 border-t sm:border-t-0 border-zinc-900 pt-3.5 sm:pt-0 mt-1 sm:mt-0">
                <div className="flex items-center gap-1.5 text-[10.5px] font-bold">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'online' ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]' : 'bg-zinc-650'}`} />
                  <span className={c.status === 'online' ? 'text-white' : 'text-zinc-500'}>
                    {c.status.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={() => removeConnector(c.id, c.name)}
                  className="p-2 text-zinc-650 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer focus:outline-none"
                  title="Unmount integration"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Concept Explanation */}
        <div className="p-5 rounded-[1.5rem] bg-zinc-900/10 border border-zinc-900 flex gap-4 mt-2">
          <Terminal className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">How to implement custom MC Protocols</h5>
            <p className="text-xs text-zinc-500 leading-relaxed font-sans">
              Lucid communicates via JSON-RPC 2.0 over standard serverless server SSE tunnels. Write an MCP applet container, expose endpoints on Netlify, and point back here.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
