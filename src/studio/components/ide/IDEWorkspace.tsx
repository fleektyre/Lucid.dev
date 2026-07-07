import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, X, History, GitBranch, Plus, Sparkles, Loader2, 
  MousePointer, Sliders, FileText, User, Mail, Shield, Layers, 
  Globe, PenTool, Mic, ArrowUp, HelpCircle, Star, Check, ChevronDown
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';

interface DropdownOption {
  credits: string;
  pricePro: number;
  priceBus: number;
  desc: string;
}

const creditOptions: DropdownOption[] = [
  { credits: '100 credits / month', pricePro: 25, priceBus: 50, desc: '100 monthly credits' },
  { credits: '500 credits / month', pricePro: 45, priceBus: 85, desc: '500 monthly credits' },
  { credits: '1200 credits / month', pricePro: 79, priceBus: 140, desc: '1200 monthly credits' },
  { credits: '2000 credits / month', pricePro: 109, priceBus: 199, desc: '2000 monthly credits' }
];

// Reusable Custom Styled Glow Card following the "Pills & Glass" design system
const GlowCard = ({ children, gradient, popular, className = "" }: any) => (
  <motion.div
    whileHover={{ scale: 1.015 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={`relative group cursor-default h-full flex flex-col justify-between ${className}`}
  >
    {/* Glowing Aura Effect */}
    <div 
      className="absolute inset-0 w-full h-full rounded-[1.5rem] opacity-25 pointer-events-none filter blur-[35px] transition-all duration-700 group-hover:opacity-60 group-hover:scale-[1.03]"
      style={{ background: gradient }}
    />
    
    {/* Foreground Card with Gradient Border */}
    <div 
      className="relative z-10 w-full h-full rounded-[1.5rem] p-6 flex flex-col justify-between bg-zinc-950/45 border border-zinc-800/80 backdrop-blur-md hover:border-zinc-700/85 transition-all duration-500"
      style={{
        background: `linear-gradient(#08080a, #040405) padding-box, ${gradient} border-box`,
        border: '1.2px solid transparent'
      }}
    >
      {/* Popular Tag */}
      {popular && (
        <div className="absolute -top-3.5 right-6 bg-white text-black text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-[0_4px_24px_rgba(255,255,255,0.35)] z-20 flex items-center gap-1 font-sans">
          <Star className="w-3 h-3 fill-black text-black" /> Popular
        </div>
      )}
      {children}
    </div>
  </motion.div>
);

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  card?: boolean;
}

interface WorkspaceFile {
  name: string;
  size: string;
  modified: string;
}

interface IDEWorkspaceProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  messages: Message[];
  inputText: string;
  setInputText: (text: string) => void;
  isCompiling: boolean;
  handleVibeTrigger: (customText?: string) => void;
  triggerQuickVibe: (prompt: string) => void;
  showFeatureBadge: boolean;
  setShowFeatureBadge: (show: boolean) => void;
  showSecondaryCard: boolean;
  setShowSecondaryCard: (show: boolean) => void;
  previewTheme: 'light' | 'dark' | 'glass' | 'cosmic';
  setPreviewTheme: (theme: 'light' | 'dark' | 'glass' | 'cosmic') => void;
  primaryButtonColor: 'black' | 'emerald' | 'indigo' | 'purple';
  setPrimaryButtonColor: (color: 'black' | 'emerald' | 'indigo' | 'purple') => void;
  workspaceFiles: WorkspaceFile[];
  playChime: () => void;
}

export const IDEWorkspace: React.FC<IDEWorkspaceProps> = ({
  activeTab,
  setActiveTab,
  messages,
  inputText,
  setInputText,
  isCompiling,
  handleVibeTrigger,
  triggerQuickVibe,
  showFeatureBadge,
  setShowFeatureBadge,
  showSecondaryCard,
  setShowSecondaryCard,
  previewTheme,
  setPreviewTheme,
  primaryButtonColor,
  setPrimaryButtonColor,
  workspaceFiles,
  playChime
}) => {
  const { setPackageCredits, addNotification, setShowPricingModal } = useStudioStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [proAnnual, setProAnnual] = useState(false);
  const [busAnnual, setBusAnnual] = useState(false);

  const [selectedProOpt, setSelectedProOpt] = useState<DropdownOption>(creditOptions[0]);
  const [selectedBusOpt, setSelectedBusOpt] = useState<DropdownOption>(creditOptions[3]);

  const [proDropdownOpen, setProDropdownOpen] = useState(false);
  const [busDropdownOpen, setBusDropdownOpen] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isCompiling]);

  return (
    <main id="ide-workspace" className="flex-1 flex flex-col h-full bg-[#090a0f] border-r border-white/[0.04] relative">
      
      {/* Workspace Tab Header */}
      <header className="h-[52px] border-b border-white/[0.04] px-4 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-1.5 h-full">
          {/* Active file/tab */}
          <div className="bg-[#12141a] text-white border border-white/[0.04] border-b-transparent rounded-t-xl px-4 h-[38px] flex items-center gap-2 text-xs font-bold mt-[14px]">
            {activeTab === 'ai_editor' && (
              <>
                <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>LandingPage.tsx</span>
              </>
            )}
            {activeTab === 'visual_editor' && (
              <>
                <MousePointer className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Visual Editor</span>
              </>
            )}
            {activeTab === 'branding' && (
              <>
                <Sliders className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Branding & SEO</span>
              </>
            )}
            {activeTab === 'files' && (
              <>
                <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Workspace Files</span>
              </>
            )}
            {activeTab === 'users' && (
              <>
                <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Users & Access</span>
              </>
            )}
            {activeTab === 'email' && (
              <>
                <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Email Delivery</span>
              </>
            )}
            {activeTab === 'audits' && (
              <>
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Audits & Safety</span>
              </>
            )}
            {activeTab === 'commerce' && (
              <>
                <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Commerce Billing</span>
              </>
            )}
            {activeTab === 'domains' && (
              <>
                <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Domains</span>
              </>
            )}
            <X 
              onClick={() => setActiveTab('ai_editor')}
              className="w-3 h-3 text-zinc-500 hover:text-white ml-1.5 cursor-pointer" 
            />
          </div>
        </div>

        {/* History/Git controls */}
        <div className="flex items-center gap-3">
          <button className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all focus:outline-none" title="History logs">
            <History className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all focus:outline-none" title="Git repository branch">
            <GitBranch className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all focus:outline-none" title="Create new task flow">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Dynamic Inner Tab Router */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
        
        {activeTab === 'ai_editor' && (
          <>
            {/* Chat thread */}
            <div className="space-y-4 pb-20">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-[1.25rem] p-4 text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold' 
                      : 'bg-zinc-900/60 text-zinc-300 border border-white/[0.04]'
                  }`}>
                    <p>{msg.text}</p>
                    
                    {/* Interactive App Widget card */}
                    {idx === 0 && (
                      <div className="mt-3.5 bg-zinc-950/60 border border-white/[0.04] p-3 rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#121318] rounded-lg border border-white/[0.04] flex items-center justify-center shrink-0">
                          <Smartphone className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs font-bold text-white leading-none">Enable PWA Support</p>
                          <p className="text-[10px] text-zinc-500 mt-1.5 truncate">Progressive Web App configuration</p>
                        </div>
                        <button 
                          onClick={() => triggerQuickVibe("Add full Progressive Web App configuration to build scheme")}
                          className="text-[10px] bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer shrink-0"
                        >
                          Compile
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-zinc-600 mt-1 px-1.5">{msg.time}</span>
                </div>
              ))}

              {/* Compilation loading indicators */}
              {isCompiling && (
                <div className="flex flex-col items-start gap-1">
                  <div className="bg-zinc-900/60 border border-white/[0.04] p-3 rounded-full flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-[11px] font-medium text-zinc-400 pr-1 select-none">Vibing...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Float suggestions bar inside main chat workspace */}
            <div className="absolute bottom-[114px] left-4 right-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-1 z-20">
              {[
                { text: '🌙 Make it dark', prompt: 'Enable dark night styling on landing page' },
                { text: '✨ Cosmic glow', prompt: 'Wove deep purple cosmic twilight theme' },
                { text: '💳 Add secondary bento stats', prompt: 'Add a secondary stats grid card to live bento section' },
                { text: '❇️ Use emerald primary button', prompt: 'Make primary button emerald green' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => triggerQuickVibe(item.prompt)}
                  className="shrink-0 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.04] text-[10.5px] font-semibold px-3 py-1.5 rounded-full transition-all focus:outline-none flex items-center gap-1 cursor-pointer"
                >
                  <span>{item.text}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {activeTab === 'visual_editor' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-full m-auto flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Interactive Visual Designer</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Drag-and-drop landing page bento containers or edit structural layouts visually. Any change is hot-compiled onto the right preview instantly.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <button onClick={() => { setShowFeatureBadge(!showFeatureBadge); }} className="p-3 bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/[0.04] rounded-xl text-left text-xs cursor-pointer">
                <p className="font-bold text-white">Feature Badge</p>
                <p className="text-[10px] text-zinc-500 mt-1">{showFeatureBadge ? "Active (Visible)" : "Hidden"}</p>
              </button>
              <button onClick={() => { setShowSecondaryCard(!showSecondaryCard); }} className="p-3 bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/[0.04] rounded-xl text-left text-xs cursor-pointer">
                <p className="font-bold text-white">Stats Container</p>
                <p className="text-[10px] text-zinc-500 mt-1">{showSecondaryCard ? "Active (Visible)" : "Hidden (Not rendered)"}</p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'branding' && (
          <div className="py-8 space-y-4">
            <h3 className="text-sm font-bold text-white">Visual Style Guide & Accents</h3>
            <div className="space-y-3 max-w-md mx-auto">
              <div>
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Preset Theme Accents</p>
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { id: 'light', name: 'Daylight Light', color: 'bg-white' },
                    { id: 'dark', name: 'Slate Dark', color: 'bg-[#0c0c0e]' },
                    { id: 'cosmic', name: 'Cosmic Sky', color: 'bg-indigo-950' },
                    { id: 'glass', name: 'Blur Glass', color: 'bg-zinc-800' }
                  ].map((accent) => (
                    <button 
                      key={accent.id}
                      onClick={() => { setPreviewTheme(accent.id as any); }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${previewTheme === accent.id ? 'border-blue-500 bg-blue-500/5' : 'border-white/[0.04] bg-zinc-900/40'}`}
                    >
                      <div className={`w-6 h-6 rounded-md ${accent.color} border border-white/10`} />
                      <span className="text-[9px] font-bold text-zinc-400 truncate w-full text-center">{accent.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Action Button Colors</p>
                <div className="flex gap-2">
                  {[
                    { id: 'black', color: 'bg-black text-white' },
                    { id: 'emerald', color: 'bg-emerald-500 text-black' },
                    { id: 'indigo', color: 'bg-indigo-600 text-white' },
                    { id: 'purple', color: 'bg-purple-600 text-white' }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => { setPrimaryButtonColor(btn.id as any); playChime(); }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all border cursor-pointer ${primaryButtonColor === btn.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/[0.04] bg-zinc-900/40'}`}
                    >
                      {btn.id} Color
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
              <span className="text-xs font-extrabold text-white">Files Explorer</span>
              <span className="text-[10px] text-zinc-500">4 items total in workspace</span>
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              {workspaceFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-zinc-900/40 border border-white/[0.04] rounded-xl hover:bg-zinc-800/40 transition-colors">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-white">
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{file.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                    <span>{file.size}</span>
                    <span>{file.modified}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-full m-auto flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Team & Access Controls</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Invite collaborators to edit this sandbox container together or manage role permissions securely.
            </p>
            <button onClick={() => { alert("Invitation sent to collaborator!"); }} className="mt-2.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-bold transition-all cursor-pointer">
              Invite collaborator
            </button>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-full m-auto flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Email Notification Triggers</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Configure SMTP, Mailgun, or transactional templates to send out sign-up greetings dynamically.
            </p>
          </div>
        )}

        {activeTab === 'audits' && (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-500/20 rounded-full m-auto flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Compliance & Audit Trails</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Review deployment audit history, security vulnerability reports, and automatic compliance scoring.
            </p>
          </div>
        )}

        {activeTab === 'commerce' && (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 bg-amber-600/10 border border-emerald-500/20 rounded-full m-auto flex items-center justify-center">
              <Layers className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Stripe & Paystack Sandbox</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Enable secure checkout, pricing plans, and credit-card tokenizers out of the box.
            </p>
          </div>
        )}

        {activeTab === 'domains' && (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-full m-auto flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Domain Configurations</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Point your custom apex domains or purchase `.dev` domains instantly. Live SSL is auto-certified.
            </p>
          </div>
        )}

      </div>

      {/* INPUT PROMPT CONTROL BAR AT BOTTOM */}
      <div className="p-4 border-t border-white/[0.04] bg-[#07080c]/80 relative z-30 shrink-0">
        
        <div className="bg-zinc-950/80 border border-white/[0.04] focus-within:border-zinc-700/80 rounded-[1.25rem] p-3 px-4 flex flex-col gap-3 shadow-inner transition-all">
          
          {/* Input message field */}
          <input 
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVibeTrigger()}
            className="w-full bg-transparent border-none text-xs text-white focus:outline-none placeholder:text-zinc-500 py-0.5"
          />

          {/* Bottom Toolbar action row */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all cursor-pointer focus:outline-none" title="Attach assets">
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all cursor-pointer focus:outline-none" title="Edit source code">
                <PenTool className="w-3.5 h-3.5" />
              </button>
              
              {/* Build mode identifier status */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-white/[0.03] rounded-lg select-none">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Build mode</span>
              </div>

              <button className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all cursor-pointer focus:outline-none" title="Audio voice synthesis input">
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Vibe send trigger circle button */}
            <button 
              onClick={() => handleVibeTrigger()}
              disabled={isCompiling}
              className="w-7 h-7 bg-white hover:bg-zinc-200 disabled:bg-zinc-800 text-black disabled:text-zinc-600 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-none shadow-md"
            >
              {isCompiling ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ArrowUp className="w-3.5 h-3.5 font-bold" strokeWidth={3} />
              )}
            </button>
          </div>

        </div>

        <p className="text-[10px] text-zinc-600 text-center mt-2.5 flex items-center justify-center gap-1 select-none">
          <span>lucid.dev may make mistakes. Verify critical files before pushing.</span>
          <HelpCircle className="w-3 h-3" />
        </p>

      </div>

    </main>
  );
};
