import React, { useState } from 'react';
import { BookOpen, Search, PlusCircle, Trash, FileText, CheckCircle2 } from 'lucide-react';

interface KnowledgeSettingsProps {
  triggerToast: (msg: string) => void;
}

export const KnowledgeSettings: React.FC<KnowledgeSettingsProps> = ({ triggerToast }) => {
  const [documents, setDocuments] = useState([
    { id: '1', fileName: 'brand_identity_guide.pdf', size: '2.4 MB', type: 'PDF', wordCount: 4200, status: 'synced' },
    { id: '2', fileName: 'api_endpoints_v3.md', size: '12 KB', type: 'MD', wordCount: 940, status: 'synced' },
    { id: '3', fileName: 'design_tokens_v2.json', size: '45 KB', type: 'JSON', wordCount: 1200, status: 'synced' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter(doc => 
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteDoc = (id: string, name: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    triggerToast(`Document "${name}" unlinked from workspace knowledge base.`);
  };

  const uploadSimulation = () => {
    triggerToast("Drag and drop file selector triggered. Select documents to parse.");
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn font-body text-zinc-300">
      <div>
        <h2 className="text-3xl font-heading text-white tracking-tight">Knowledge</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Provide contextual design tokens, API books, or copywriting guidelines to index across your model workflows.
        </p>
      </div>

      <div className="flex flex-col gap-5 border-t border-zinc-900 pt-6">
        
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4.5 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Filter synced knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-full py-2.5 pl-11 pr-5 text-xs text-white focus:outline-none placeholder-zinc-550 transition-all"
            />
          </div>

          <button
            onClick={uploadSimulation}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-black text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.08)] cursor-pointer focus:outline-none"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Knowledge List */}
        <div className="flex flex-col gap-3.5 mt-2">
          {filteredDocs.length === 0 ? (
            <div className="py-12 border border-dashed border-zinc-900 rounded-[1.5rem] flex flex-col items-center justify-center text-center gap-3">
              <BookOpen className="w-8 h-8 text-zinc-700" />
              <p className="text-xs text-zinc-500">No indexed records found matching search. Ingest documents above.</p>
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div 
                key={doc.id}
                className="p-4 bg-zinc-950/20 border border-zinc-900 hover:border-zinc-800 rounded-[1.5rem] flex items-center justify-between gap-5 transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-center font-bold text-zinc-400 group-hover:bg-white/5 group-hover:border-white/20 transition-all shrink-0">
                    <FileText className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white truncate max-w-sm sm:max-w-md group-hover:text-white transition-colors">
                      {doc.fileName}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                      <span className="uppercase font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-400">{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.wordCount} words cached</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center gap-1 text-[10px] text-white font-bold bg-white/5 py-1 px-2.5 rounded-full border border-white/10">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    <span>Indexed</span>
                  </div>

                  <button
                    onClick={() => deleteDoc(doc.id, doc.fileName)}
                    className="p-2 text-zinc-650 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer focus:outline-none"
                    title="Delete document"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
