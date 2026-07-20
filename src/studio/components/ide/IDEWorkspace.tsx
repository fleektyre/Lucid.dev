import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, X, History, GitBranch, Plus, Sparkles, Loader2, 
  MousePointer, Sliders, FileText, User, Mail, Shield, Layers, 
  Globe, PenTool, Mic, ArrowUp, ArrowDown, HelpCircle, Star, Check, ChevronDown, ChevronLeft, Copy,
  Cpu, Database, Key, Play, TrendingUp, AlertTriangle, RefreshCw, Zap, DollarSign,
  Github, Download, Terminal, Settings, Trash2
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useStudioStore } from '../../store/useStudioStore';
import { VibeEngineProPanel } from './VibeEngineProPanel';

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
  isLoading?: boolean;
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
  primaryButtonColor: 'black' | 'violet' | 'indigo' | 'purple';
  setPrimaryButtonColor: (color: 'black' | 'violet' | 'indigo' | 'purple') => void;
  workspaceFiles: WorkspaceFile[];
  playChime: () => void;
  generatedAppType: 'landing_page' | 'calculator' | 'todo' | 'weather' | 'pomodoro' | 'budget' | 'ai_chat';
  setGeneratedAppType?: (type: 'landing_page' | 'calculator' | 'todo' | 'weather' | 'pomodoro' | 'budget' | 'ai_chat') => void;
  width?: number | string;
  isExtended?: boolean;
}

export const IDEWorkspace: React.FC<IDEWorkspaceProps> = ({
  isLoading = false,
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
  playChime,
  generatedAppType,
  setGeneratedAppType,
  width,
  isExtended
}) => {
  const { setPackageCredits, addNotification, setShowPricingModal } = useStudioStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [proAnnual, setProAnnual] = useState(false);
  const [busAnnual, setBusAnnual] = useState(false);

  const [selectedProOpt, setSelectedProOpt] = useState<DropdownOption>(creditOptions[0]);
  const [selectedBusOpt, setSelectedBusOpt] = useState<DropdownOption>(creditOptions[3]);

  const [proDropdownOpen, setProDropdownOpen] = useState(false);
  const [busDropdownOpen, setBusDropdownOpen] = useState(false);
  const [projectStarred, setProjectStarred] = useState(false);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Vibe sub-tabs for splitting prompt instructions vs clean output code files (bolt/lovable behavior)
  const [subTab, setSubTab] = useState<'chat' | 'code'>('chat');
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [filesSubTab, setFilesSubTab] = useState<'export' | 'inspector'>('export');

  // ZIP and GitHub sync integration states
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('lucid_github_token') || '');
  const [githubRepo, setGithubRepo] = useState(() => localStorage.getItem('lucid_github_repo') || '');
  const [isCreateRepoModalOpen, setIsCreateRepoModalOpen] = useState(false);
  const [tempRepoName, setTempRepoName] = useState('your-repository');
  const [showRepoDropdown, setShowRepoDropdown] = useState(false);
  const [githubSettingsOpen, setGithubSettingsOpen] = useState(false);
  const [isGithubDrawerOpen, setIsGithubDrawerOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState('feat: migrate from Supabase to Firebase\n\nReplace Supabase with Firebase Admin SDK for backend database operations and update UI settings components to reflect the new integration');
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'zip' | 'github' | null>(null);
  const [exportSteps, setExportSteps] = useState<{ cmd: string; result: string; status: 'idle' | 'running' | 'success' | 'error' }[]>([
    { cmd: 'lucid deploy-engine --status', result: 'Ready to stream production compilation...', status: 'success' }
  ]);

  const handleGithubTokenChange = (val: string) => {
    setGithubToken(val);
    localStorage.setItem('lucid_github_token', val);
  };

  const handleGithubRepoChange = (val: string) => {
    setGithubRepo(val);
    localStorage.setItem('lucid_github_repo', val);
  };

  // Listen to custom events dispatched from preview header shortcut buttons
  useEffect(() => {
    const handleZipEvent = () => {
      setActiveTab('files');
      setTimeout(() => {
        triggerZipDownload();
      }, 150);
    };

    const handleGithubEvent = () => {
      setTempRepoName(githubRepo || 'your-repository');
      setIsCreateRepoModalOpen(true);
    };

    const handleShowCodebaseEvent = () => {
      setActiveTab('files');
      setSelectedFile(getFileName(generatedAppType));
    };

    window.addEventListener('lucid-trigger-zip-download', handleZipEvent);
    window.addEventListener('lucid-trigger-github-push', handleGithubEvent);
    window.addEventListener('lucid-show-codebase', handleShowCodebaseEvent);
    return () => {
      window.removeEventListener('lucid-trigger-zip-download', handleZipEvent);
      window.removeEventListener('lucid-trigger-github-push', handleGithubEvent);
      window.removeEventListener('lucid-show-codebase', handleShowCodebaseEvent);
    };
  }, [generatedAppType, isExporting, githubToken, githubRepo]);

  // Custom states to match the premium screenshot layout
  const [viewMode, setViewMode] = useState<'build' | 'chat'>('build');
  const [filesExpanded, setFilesExpanded] = useState(true);

  const getFileName = (appType: string) => {
    switch (appType) {
      case 'calculator': return 'Calculator.tsx';
      case 'todo': return 'TodoBoard.tsx';
      case 'weather': return 'WeatherWidget.tsx';
      case 'pomodoro': return 'FocusTimer.tsx';
      case 'budget': return 'BudgetTracker.tsx';
      case 'ai_chat': return 'AIChatbot.tsx';
      default: return 'LandingPage.tsx';
    }
  };

  const getAppCode = (appType: string): string => {
    switch (appType) {
      case 'calculator':
        return `import React, { useState } from 'react';
import { RotateCcw, Percent, Divide, X, Minus, Plus, Equal } from 'lucide-react';

// Sleek glass-morphic arithmetic engine compiled live in container
export default function GlassCalculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
    setEquation(prev => prev + num);
  };

  const handleOperator = (op: string) => {
    setEquation(prev => prev + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      if (!equation) return;
      const formattedEq = equation.replace(/x/g, '*').replace(/÷/g, '/');
      const result = eval(formattedEq);
      setHistory(prev => [\`\${equation} = \${result}\`, ...prev].slice(0, 5));
      setDisplay(String(result));
      setEquation(String(result));
    } catch {
      setDisplay('Error');
      setEquation('');
    }
  };

  const reset = () => {
    setDisplay('0');
    setEquation('');
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-[2rem] bg-zinc-950/90 border border-white/10 shadow-2xl backdrop-blur-xl">
      <div className="text-right mb-6 px-4">
        <div className="text-zinc-500 text-xs font-mono truncate">{equation || '0'}</div>
        <div className="text-white text-4xl font-bold tracking-tight mt-1">{display}</div>
      </div>
      
      {/* Arithmetic interactive keypad grid */}
      <div className="grid grid-cols-4 gap-3">
        {['C', '+/-', '%', '÷'].map((btn) => (
          <button key={btn} onClick={btn === 'C' ? reset : undefined} className="p-4 bg-white/5 hover:bg-white/10 text-indigo-300 rounded-2xl text-sm font-bold transition-all">
            {btn}
          </button>
        ))}
        {/* Digits 7,8,9,X */}
        {['7', '8', '9', 'x'].map((btn) => (
          <button key={btn} onClick={() => isNaN(Number(btn)) ? handleOperator(btn) : handleNumber(btn)} className="p-4 bg-zinc-900/50 hover:bg-zinc-800 text-white rounded-2xl text-sm font-bold transition-all">
            {btn}
          </button>
        ))}
        {/* Digits 4,5,6,- */}
        {['4', '5', '6', '-'].map((btn) => (
          <button key={btn} onClick={() => isNaN(Number(btn)) ? handleOperator(btn) : handleNumber(btn)} className="p-4 bg-zinc-900/50 hover:bg-zinc-800 text-white rounded-2xl text-sm font-bold transition-all">
            {btn}
          </button>
        ))}
        {/* Digits 1,2,3,+ */}
        {['1', '2', '3', '+'].map((btn) => (
          <button key={btn} onClick={() => isNaN(Number(btn)) ? handleOperator(btn) : handleNumber(btn)} className="p-4 bg-zinc-900/50 hover:bg-zinc-800 text-white rounded-2xl text-sm font-bold transition-all">
            {btn}
          </button>
        ))}
        {/* Bottom row */}
        <button onClick={() => handleNumber('0')} className="col-span-2 p-4 bg-zinc-900/50 hover:bg-zinc-800 text-white rounded-2xl text-sm font-bold transition-all">0</button>
        <button onClick={() => handleNumber('.')} className="p-4 bg-zinc-900/50 hover:bg-zinc-800 text-white rounded-2xl text-sm font-bold transition-all">.</button>
        <button onClick={calculate} className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold transition-all">=</button>
      </div>
    </div>
  );
}`;

      case 'todo':
        return `import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Star, Layers } from 'lucide-react';

interface TodoTask {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Interactive Kanban Checklist app hot-compiled on the fly
export default function TodoBoard() {
  const [tasks, setTasks] = useState<TodoTask[]>([
    { id: '1', text: 'Refactor app state managers using context', completed: true, priority: 'high' },
    { id: '2', text: 'Design custom glassy dark bento layouts', completed: false, priority: 'medium' },
    { id: '3', text: 'Configure custom domain SSL certificate', completed: false, priority: 'low' }
  ]);
  const [newText, setNewText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const newTask: TodoTask = {
      id: Date.now().toString(),
      text: newText,
      completed: false,
      priority
    };
    setTasks(prev => [...prev, newTask]);
    setNewText('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="max-w-md mx-auto bg-zinc-950/80 border border-white/10 p-5 rounded-3xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">Workspace Board</h2>
          <p className="text-[10px] text-zinc-500 mt-1">Compiled successfully in Sandbox</p>
        </div>
        <span className="text-[10px] px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-indigo-300 font-bold">
          {completedCount}/{tasks.length} Completed
        </span>
      </div>

      {/* Input bar */}
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder="Add active task name..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="flex-1 bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
        />
        <button type="submit" className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Task list */}
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between p-3 bg-zinc-900/50 border border-white/5 rounded-2xl">
            <button onClick={() => toggleTask(task.id)} className="flex items-center gap-2 text-left">
              {task.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-zinc-500" />}
              <span className={\`text-xs \${task.completed ? 'line-through text-zinc-500' : 'text-zinc-300'}\`}>{task.text}</span>
            </button>
            <button onClick={() => deleteTask(task.id)} className="text-zinc-500 hover:text-red-400 p-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}`;

      case 'weather':
        return `import React, { useState } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Droplets, Compass } from 'lucide-react';

interface WeatherData {
  city: string;
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  humidity: number;
  wind: number;
}

// Gorgeous live weather forecasting module compiled dynamically
export default function WeatherWidget() {
  const [city, setCity] = useState('San Francisco');
  const [weather, setWeather] = useState<WeatherData>({
    city: 'San Francisco',
    temp: 18,
    condition: 'sunny',
    humidity: 62,
    wind: 14
  });

  const cityDatabase: Record<string, WeatherData> = {
    'san francisco': { city: 'San Francisco', temp: 18, condition: 'sunny', humidity: 62, wind: 14 },
    'london': { city: 'London', temp: 12, condition: 'rainy', humidity: 88, wind: 22 },
    'tokyo': { city: 'Tokyo', temp: 22, condition: 'cloudy', humidity: 55, wind: 8 },
    'paris': { city: 'Paris', temp: 15, condition: 'cloudy', humidity: 70, wind: 12 }
  };

  const handleSearch = (cityName: string) => {
    const key = cityName.toLowerCase().trim();
    if (cityDatabase[key]) {
      setWeather(cityDatabase[key]);
      setCity(cityDatabase[key].city);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-zinc-950 p-6 rounded-[2rem] border border-white/10 shadow-xl backdrop-blur-xl text-left">
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-bold text-zinc-400">Vibe Forecast Station</span>
        <Sun className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{weather.city}</h1>
        <p className="text-[11px] text-zinc-500 mt-1 uppercase tracking-widest">{weather.condition} forecast</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-5xl font-black text-white">{weather.temp}°C</span>
        <div className="text-zinc-400 text-xs font-medium">
          <p>Humidity: {weather.humidity}%</p>
          <p className="mt-1">Wind speed: {weather.wind} km/h</p>
        </div>
      </div>

      {/* Preset locations */}
      <div className="grid grid-cols-4 gap-1.5 mt-4">
        {['San Francisco', 'London', 'Tokyo', 'Paris'].map((c) => (
          <button key={c} onClick={() => handleSearch(c)} className="py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[9px] font-bold text-zinc-300 hover:text-white transition-all">
            {c.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
}`;

      case 'pomodoro':
        return `import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Award, Zap, Bell } from 'lucide-react';

// Pomodoro Focus clock application hot-compiled in container
export default function FocusTimer() {
  const [seconds, setSeconds] = useState(1500); // 25 mins
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work');
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      setCompletedCycles(c => c + 1);
      alert("Session completed! Take a break.");
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setSeconds(mode === 'work' ? 1500 : mode === 'short' ? 300 : 900);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return \`\${mins.toString().padStart(2, '0')}:\${rem.toString().padStart(2, '0')}\`;
  };

  return (
    <div className="max-w-xs mx-auto text-center p-6 bg-zinc-950 border border-white/10 rounded-3xl backdrop-blur-xl">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Workspace Focus Mode</span>
      
      <div className="my-8 text-5xl font-black text-white font-mono tracking-tighter">
        {formatTime(seconds)}
      </div>

      <div className="flex justify-center gap-3 mb-6">
        <button onClick={toggle} className="px-5 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-zinc-200 transition-all">
          {isActive ? 'Pause' : 'Start Focus'}
        </button>
        <button onClick={reset} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 rounded-full transition-all">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-500 font-medium">
        <Award className="w-3.5 h-3.5 text-indigo-400" />
        <span>Completed pomodoros: {completedCycles}</span>
      </div>
    </div>
  );
}`;

      case 'budget':
        return `import React, { useState } from 'react';
import { Landmark, ArrowUpRight, ArrowDownRight, DollarSign, Plus, Tag } from 'lucide-react';

interface Transaction {
  id: string;
  desc: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

// Expense tracker financial engine hot-compiled dynamically
export default function BudgetTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', desc: 'SaaS Tool Premium Payout', amount: 480, type: 'income', category: 'Dev' },
    { id: '2', desc: 'Supabase DB Storage Node', amount: 25, type: 'expense', category: 'Cloud' },
    { id: '3', desc: 'Metropolitan Workspace Coffee', amount: 12, type: 'expense', category: 'Food' }
  ]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const addTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;
    const newTx: Transaction = {
      id: Date.now().toString(),
      desc,
      amount: parseFloat(amount),
      type,
      category: type === 'income' ? 'Dev' : 'General'
    };
    setTransactions(prev => [newTx, ...prev]);
    setDesc('');
    setAmount('');
  };

  const balance = transactions.reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);

  return (
    <div className="w-full max-w-sm mx-auto bg-zinc-950 p-6 rounded-3xl border border-white/10 shadow-xl text-left">
      <div className="mb-5">
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Active Ledger Balance</span>
        <h1 className="text-3xl font-black text-white mt-1">\$\${balance.toFixed(2)}</h1>
      </div>

      <form onSubmit={addTx} className="space-y-2.5 mb-5">
        <input 
          type="text" 
          placeholder="Transaction name..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-white"
        />
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-white"
          />
          <button type="submit" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors">Add</button>
        </div>
      </form>

      <div className="space-y-2 max-h-[160px] overflow-y-auto no-scrollbar">
        {transactions.map(t => (
          <div key={t.id} className="flex justify-between items-center p-2.5 bg-zinc-900/50 border border-white/5 rounded-xl">
            <span className="text-xs text-zinc-300 font-medium">{t.desc}</span>
            <span className={\`text-xs font-mono font-bold \${t.type === 'income' ? 'text-emerald-400' : 'text-zinc-500'}\`}>
              {t.type === 'income' ? '+' : '-'}\$\${t.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}`;

      case 'ai_chat':
        return `import React, { useState } from 'react';
import { Send, Sparkles, User, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

// AI Companion Chatbot application hot-compiled in container
export default function AIChatbot() {
  const [chat, setChat] = useState<Message[]>([
    { id: '1', sender: 'bot', text: "Hello! I am your companion AI bot. Let's build something beautiful." }
  ]);
  const [input, setInput] = useState('');

  const sendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setChat(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      setChat(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: \`I've received your query about "\${userMsg.text}". I am processing it through our server-side LLM gateway!\`
      }]);
    }, 1000);
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[380px] text-left">
      <div className="p-3 bg-zinc-900 border-b border-white/10 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        <span className="text-white text-xs font-bold">VibeCoder Companion AI</span>
      </div>
      <div className="flex-1 p-3 overflow-y-auto space-y-2 no-scrollbar">
        {chat.map(m => (
          <div key={m.id} className={\`flex flex-col \${m.sender === 'user' ? 'items-end' : 'items-start'}\`}>
            <div className={\`max-w-[85%] rounded-2xl p-2.5 text-xs \${m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-zinc-900 border border-white/5 text-zinc-300'}\`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`;

      default:
        return `import React, { useState } from 'react';
import { ArrowRight, Terminal, Sparkles } from 'lucide-react';

// Live interactive landing page compiled by AI Studio Vibe
export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white font-sans selection:bg-indigo-500/30 text-left">
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <span className="text-md font-bold tracking-tight">Apex Engine</span>
        </div>
        <button className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-zinc-200 transition-all">
          Deploy Live
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
        <span className="text-[10px] px-3 py-1 bg-white/5 border border-white/10 rounded-full font-bold text-indigo-300 uppercase tracking-widest">
          NOW IN PUBLIC BETA
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-6 tracking-tight leading-tight">
          Build faster. Ship smarter.
        </h1>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto mt-4 leading-relaxed">
          The world's premium cloud native platform for designers, code crafters, and product engineers. Hot-reload components in real time.
        </p>

        <form onSubmit={handleSubscribe} className="max-w-md mx-auto mt-8 flex gap-2">
          <input 
            type="email" 
            placeholder="Enter email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 text-xs text-white focus:outline-none"
          />
          <button type="submit" className="px-5 bg-white text-black text-xs font-bold rounded-full hover:bg-zinc-200 transition-all">
            Get early access
          </button>
        </form>
      </main>
    </div>
  );
}`;
    }
  };

  const handleCopyCode = () => {
    const raw = getAppCode(generatedAppType);
    navigator.clipboard.writeText(raw);
    setCopiedCode(true);
    addNotification(
      'info',
      'Source Copied',
      `${getFileName(generatedAppType)} code copied to your clipboard!`
    );
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getFileContent = (fileName: string): string => {
    if (fileName === 'App.tsx') {
      return `import React from 'react';
import ${generatedAppType === 'landing_page' ? 'LandingPage' : 
        generatedAppType === 'calculator' ? 'GlassCalculator' :
        generatedAppType === 'todo' ? 'TodoBoard' :
        generatedAppType === 'weather' ? 'WeatherWidget' :
        generatedAppType === 'pomodoro' ? 'FocusTimer' :
        generatedAppType === 'budget' ? 'BudgetTracker' : 'AIChatbot'} from './${getFileName(generatedAppType).replace('.tsx', '')}';

export default function App() {
  return (
    <div className="w-full h-screen bg-black">
      <${generatedAppType === 'landing_page' ? 'LandingPage' : 
        generatedAppType === 'calculator' ? 'GlassCalculator' :
        generatedAppType === 'todo' ? 'TodoBoard' :
        generatedAppType === 'weather' ? 'WeatherWidget' :
        generatedAppType === 'pomodoro' ? 'FocusTimer' :
        generatedAppType === 'budget' ? 'BudgetTracker' : 'AIChatbot'} />
    </div>
  );
}`;
    }
    if (fileName === 'package.json') {
      return `{
  "name": "lucid-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^11.3.1",
    "lucide-react": "^0.400.0",
    "canvas-confetti": "^1.6.0"
  },
  "devDependencies": {
    "vite": "^5.3.1",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.2.2"
  }
}`;
    }
    if (fileName === 'global.css') {
      return `@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-heading: "Instrument Serif", serif;
  --font-body: "Barlow", sans-serif;
}

body {
  background-color: #000000;
  color: #ffffff;
  font-family: var(--font-sans);
}`;
    }
    // Otherwise return current app's source code
    return getAppCode(generatedAppType);
  };

  const triggerZipDownload = async () => {
    if (isExporting) return;
    
    const store = useStudioStore.getState();
    if (store.user.plan === 'Free') {
      store.addNotification('error', 'PAYWALL_TRIGGER', 'Static bundle compilation & export is restricted to Pro and Business tiers. Please upgrade your workspace.');
      store.setShowPricingModal(true);
      return;
    }
    
    setIsExporting(true);
    setExportType('zip');
    
    const steps: { cmd: string; result: string; status: 'idle' | 'running' | 'success' | 'error' }[] = [
      { cmd: 'lucid compile-workspace --target=zip', result: 'Reading local files in sandbox...', status: 'running' }
    ];
    setExportSteps([...steps]);
    playChime?.();

    await new Promise(r => setTimeout(r, 600));
    steps[0].status = 'success';
    steps[0].result = '✓ Loaded 6 compilation files successfully';
    
    steps.push({ cmd: 'bundling production-optimized components...', result: 'Compressing source codes into zip archive format...', status: 'running' });
    setExportSteps([...steps]);

    await new Promise(r => setTimeout(r, 800));
    steps[1].status = 'success';
    steps[1].result = `✓ Added src/App.tsx, src/${getFileName(generatedAppType)}, package.json, global.css, index.html, vite.config.ts`;

    steps.push({ cmd: 'compressing project artifact...', result: 'Calculating file checksums and compressing data stream...', status: 'running' });
    setExportSteps([...steps]);

    try {
      const zip = new JSZip();
      
      zip.file('src/App.tsx', getFileContent('App.tsx'));
      const mainFileName = getFileName(generatedAppType);
      zip.file(`src/${mainFileName}`, getAppCode(generatedAppType));
      zip.file('package.json', getFileContent('package.json'));
      zip.file('index.html', `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lucid App</title>
  </head>
  <body class="bg-black text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);

      zip.file('src/main.tsx', `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`);

      zip.file('src/index.css', getFileContent('global.css'));
      zip.file('vite.config.ts', `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`);

      await new Promise(r => setTimeout(r, 600));
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `lucid-${generatedAppType}-app.zip`);

      steps[2].status = 'success';
      steps[2].result = `✓ Archive generated successfully (${(content.size / 1024).toFixed(2)} kB)`;

      steps.push({ cmd: '✓ Download complete', result: 'Invoked browser native download stream. Production bundle ready.', status: 'success' });
      setExportSteps([...steps]);
      addNotification('info', 'Download Triggered', 'Your production ZIP archive is downloading!');
    } catch (err: any) {
      steps[2].status = 'error';
      steps[2].result = `Error: ${err.message || 'Compression failed'}`;
      setExportSteps([...steps]);
      addNotification('error', 'Download Failed', err.message || 'Compression failed');
    } finally {
      setIsExporting(false);
    }
  };

  const triggerGithubPush = async () => {
    if (isExporting) return;
    
    const store = useStudioStore.getState();
    if (store.user.plan === 'Free') {
      store.addNotification('error', 'PAYWALL_TRIGGER', 'Site Publishing to external repositories is restricted to Pro and Business tiers. Please upgrade your workspace.');
      store.setShowPricingModal(true);
      return;
    }
    
    if (!githubToken.trim()) {
      setGithubSettingsOpen(true);
      addNotification('error', 'GitHub Token Required', 'Please provide a GitHub Personal Access Token to push.');
      return;
    }
    if (!githubRepo.trim()) {
      setGithubSettingsOpen(true);
      addNotification('error', 'Repo Name Required', 'Please specify a repository name.');
      return;
    }

    setIsExporting(true);
    setExportType('github');

    const steps: { cmd: string; result: string; status: 'idle' | 'running' | 'success' | 'error' }[] = [
      { cmd: 'lucid deploy-engine --provider=github', result: 'Validating personal access token & authenticating user...', status: 'running' }
    ];
    setExportSteps([...steps]);
    playChime?.();

    try {
      // Step 1: Get User details
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!userRes.ok) {
        throw new Error('Authentication failed. Check your Personal Access Token.');
      }

      const userData = await userRes.json();
      const username = userData.login;

      steps[0].status = 'success';
      steps[0].result = `✓ Authenticated as github.com/${username}`;
      
      // Step 2: Check or create repository
      steps.push({ cmd: `resolving repository: ${username}/${githubRepo}...`, result: 'Checking if remote repository already exists...', status: 'running' });
      setExportSteps([...steps]);
      await new Promise(r => setTimeout(r, 600));

      const repoRes = await fetch(`https://api.github.com/repos/${username}/${githubRepo}`, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      let repoCreated = false;
      if (repoRes.status === 404) {
        steps[1].result = 'Repository not found. Provisioning new GitHub repository...';
        setExportSteps([...steps]);
        await new Promise(r => setTimeout(r, 400));

        const createRes = await fetch('https://api.github.com/user/repos', {
          method: 'POST',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify({
            name: githubRepo,
            description: `Lucid AI generated app: ${generatedAppType}`,
            private: false,
            auto_init: true
          })
        });

        if (!createRes.ok) {
          const errData = await createRes.json();
          throw new Error(`Failed to create repository: ${errData.message}`);
        }
        repoCreated = true;
        steps[1].status = 'success';
        steps[1].result = `✓ Provisioned new repository github.com/${username}/${githubRepo}`;
      } else if (repoRes.ok) {
        steps[1].status = 'success';
        steps[1].result = `✓ Found existing repository github.com/${username}/${githubRepo}`;
      } else {
        throw new Error('Could not access repository. Check your token scopes (repo permission is required).');
      }

      // Step 3: Sequential file uploads
      steps.push({ cmd: 'initiating deployment stream...', result: 'Staging files for commit...', status: 'running' });
      setExportSteps([...steps]);
      await new Promise(r => setTimeout(r, 800));

      const filesToPush = [
        { path: 'package.json', content: getFileContent('package.json') },
        { path: 'index.html', content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lucid App</title>
  </head>
  <body class="bg-black text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>` },
        { path: 'vite.config.ts', content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})` },
        { path: 'src/main.tsx', content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)` },
        { path: 'src/index.css', content: getFileContent('global.css') },
        { path: 'src/App.tsx', content: getFileContent('App.tsx') },
        { path: `src/${getFileName(generatedAppType)}`, content: getAppCode(generatedAppType) }
      ];

      steps[2].status = 'success';
      steps[2].result = `✓ Staged ${filesToPush.length} items for deployment`;

      // Upload files sequentially with nice logging
      for (let i = 0; i < filesToPush.length; i++) {
        const file = filesToPush[i];
        steps.push({ cmd: `transferring payload: ${file.path}...`, result: `Pushing to branch...`, status: 'running' });
        setExportSteps([...steps]);
        await new Promise(r => setTimeout(r, 400));

        // Get file SHA if exists to update it
        let fileSha: string | null = null;
        const fileUrl = `https://api.github.com/repos/${username}/${githubRepo}/contents/${file.path}`;
        const fileCheckRes = await fetch(fileUrl, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (fileCheckRes.ok) {
          const fileCheckData = await fileCheckRes.json();
          fileSha = fileCheckData.sha;
        }

        // Put contents
        const putRes = await fetch(fileUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify({
            message: `${commitMessage.split('\n')[0] || 'Sync file'} - ${file.path}`,
            content: btoa(unescape(encodeURIComponent(file.content))),
            sha: fileSha || undefined
          })
        });

        if (!putRes.ok) {
          const errData = await putRes.json();
          throw new Error(`Failed to commit file ${file.path}: ${errData.message}`);
        }

        steps[steps.length - 1].status = 'success';
        steps[steps.length - 1].result = `✓ ${file.path} successfully synced`;
        setExportSteps([...steps]);
      }

      // Finish deployment
      steps.push({ 
        cmd: '✓ Sync complete', 
        result: `All files compiled and pushed to github.com/${username}/${githubRepo} successfully!`, 
        status: 'success' 
      });
      setExportSteps([...steps]);
      addNotification('info', 'Push Succeeded', `Project successfully pushed to GitHub repository ${githubRepo}!`);
    } catch (err: any) {
      steps.push({
        cmd: '➜ Sync failed',
        result: `Error: ${err.message || 'Operation failed'}`,
        status: 'error'
      });
      setExportSteps([...steps]);
      addNotification('error', 'Push Failed', err.message || 'GitHub synchronization failed');
    } finally {
      setIsExporting(false);
    }
  };

  const renderCodeLine = (line: string) => {
    if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
      return <span className="text-zinc-500 italic font-mono">{line}</span>;
    }
    
    let jsx: React.ReactNode[] = [];
    const words = line.split(/(\s+|=|>|<|\(|\)|\{|\}|\[|\]|;|\.|\"|\')/);
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const trimmed = word.trim();
      
      if (['import', 'from', 'export', 'default', 'function', 'const', 'let', 'return', 'if', 'else', 'switch', 'case', 'break', 'try', 'catch', 'class', 'extends'].includes(trimmed)) {
        jsx.push(<span key={i} className="text-purple-400 font-semibold font-mono">{word}</span>);
      } else if (['useState', 'useEffect', 'useRef', 'useMemo', 'useCallback'].includes(trimmed)) {
        jsx.push(<span key={i} className="text-cyan-400 font-mono">{word}</span>);
      } else if (trimmed.startsWith('<') || trimmed.startsWith('</')) {
        jsx.push(<span key={i} className="text-emerald-400 font-mono">{word}</span>);
      } else if (word.startsWith('"') || word.startsWith("'") || word.startsWith('`')) {
        jsx.push(<span key={i} className="text-amber-300 font-mono">{word}</span>);
      } else if (/^[0-9]+$/.test(trimmed)) {
        jsx.push(<span key={i} className="text-amber-500 font-mono">{word}</span>);
      } else if (['true', 'false', 'null', 'undefined'].includes(trimmed)) {
        jsx.push(<span key={i} className="text-purple-300 italic font-mono">{word}</span>);
      } else {
        jsx.push(<span key={i} className="text-zinc-300 font-mono">{word}</span>);
      }
    }
    
    return <div className="min-h-[1.25rem] select-text">{jsx}</div>;
  };

  if (isLoading) {
    return (
      <main 
        id="ide-workspace" 
        className="flex flex-col h-full bg-[#07080a] border-r border-white/[0.04] relative shrink-0 select-none animate-pulse"
        style={{ 
          width: isExtended ? '100%' : width, 
          minWidth: isExtended ? 'unset' : '340px',
          maxWidth: isExtended ? '100%' : '90%'
        }}
      >
        {/* Workspace Tab Header Skeleton */}
        <header className="h-[52px] border-b border-white/[0.04] px-4 flex items-center justify-between bg-[#09090c]">
          <div className="flex items-center gap-2">
            <div className="h-4 w-36 bg-white/5 rounded-full" />
            <div className="w-4 h-4 bg-white/5 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-16 bg-white/5 rounded-full" />
            <div className="h-6 w-16 bg-white/5 rounded-full" />
          </div>
        </header>

        {/* Tab Selection Header Skeleton */}
        <div className="h-10 border-b border-white/[0.04] flex items-center px-4 bg-[#08080a] gap-4">
          <div className="h-4 w-20 bg-white/5 rounded-full" />
          <div className="h-4 w-20 bg-white/5 rounded-full" />
        </div>

        {/* Main Workspace Scroll Area Skeleton */}
        <div className="flex-1 p-6 flex flex-col gap-5 justify-between overflow-hidden">
          {/* Chat Messages Skeleton */}
          <div className="flex flex-col gap-4 overflow-hidden">
            <div className="flex justify-start">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 w-2/3 flex flex-col gap-2">
                <div className="h-3.5 w-11/12 bg-white/5 rounded-full" />
                <div className="h-3.5 w-5/6 bg-white/5 rounded-full" />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-1/2 flex flex-col gap-2">
                <div className="h-3.5 w-4/5 bg-white/5 rounded-full" />
              </div>
            </div>
          </div>

          {/* Prompt Entry Box Skeleton */}
          <div className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
            <div className="h-10 w-full bg-white/5 rounded-xl" />
            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-white/5" />
                <div className="w-8 h-8 rounded-full bg-white/5" />
              </div>
              <div className="w-16 h-8 rounded-full bg-white/5" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main 
      id="ide-workspace" 
      className="flex flex-col h-full bg-[#07080a] border-r border-white/[0.04] relative shrink-0 select-text"
      style={{ 
        width: isExtended ? '100%' : width, 
        minWidth: isExtended ? 'unset' : '340px',
        maxWidth: isExtended ? '100%' : '90%'
      }}
    >
      
      {/* Workspace Tab Header styled like the screenshot exactly */}
      <header className="h-[52px] border-b border-white/[0.04] px-4 flex items-center justify-between select-none shrink-0 bg-[#09090c]">
        <div className="flex items-center h-full">
          {/* Dropdown for App name matching the screenshot */}
          <div className="relative">
            <button 
              onClick={() => setProDropdownOpen(!proDropdownOpen)} 
              className="flex items-center gap-1.5 text-[13.5px] font-bold text-zinc-100 transition-all cursor-pointer focus:outline-none select-none hover:text-white bg-transparent border-none font-sans"
            >
              <span>Stella AI Frontend</span>
              {projectStarred && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />}
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 animate-fadeIn" />
            </button>
            
            {/* Project Settings / Options Dropdown list resembling the screenshot exactly */}
            {proDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent" 
                  onClick={() => setProDropdownOpen(false)} 
                />
                <div className="absolute left-0 mt-1.5 w-60 bg-[#0c0d12]/95 border border-white/10 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] z-50 p-2 select-none animate-fadeIn backdrop-blur-xl">
                  
                  {/* Settings Option */}
                  <button
                    onClick={() => {
                      setProDropdownOpen(false);
                      setActiveTab('files');
                      setFilesSubTab('export');
                      addNotification('info', 'Deploy & Export Settings', 'Opened the custom build configuration and export manager.');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-white/5 transition-all text-zinc-300 hover:text-white group border-none bg-transparent cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                        <Settings className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold">Settings</div>
                        <div className="text-[9px] text-zinc-500 font-medium font-sans">Deploy & Export settings</div>
                      </div>
                    </div>
                  </button>

                  {/* Star Option */}
                  <button
                    onClick={() => {
                      const newStarred = !projectStarred;
                      setProjectStarred(newStarred);
                      setProDropdownOpen(false);
                      addNotification('info', newStarred ? 'Project Starred' : 'Project Unstarred', newStarred ? 'Stella AI Frontend added to your favorites!' : 'Stella AI Frontend removed from favorites.');
                      playChime?.();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-white/5 transition-all text-zinc-300 hover:text-white group border-none bg-transparent cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                        <Star className={`w-4 h-4 ${projectStarred ? 'text-amber-400 fill-amber-400' : 'text-zinc-400'}`} />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold">{projectStarred ? 'Starred' : 'Star Project'}</div>
                        <div className="text-[9px] text-zinc-500 font-medium font-sans">Toggle favorite project</div>
                      </div>
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="h-[1px] bg-white/[0.05] my-1 mx-2" />

                  {/* Remove from Project Option */}
                  <button
                    onClick={() => {
                      setProDropdownOpen(false);
                      setShowRemoveConfirmModal(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-red-500/10 hover:text-red-300 transition-all text-zinc-400 group border-none bg-transparent cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/[0.04] flex items-center justify-center text-zinc-500 group-hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold">Remove from project</div>
                        <div className="text-[9px] text-zinc-500 font-medium font-sans group-hover:text-red-500/60">Delete from workspace</div>
                      </div>
                    </div>
                  </button>

                  {/* Help Option */}
                  <button
                    onClick={() => {
                      setProDropdownOpen(false);
                      setShowHelpModal(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-white/5 transition-all text-zinc-300 hover:text-white group border-none bg-transparent cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold">Help</div>
                        <div className="text-[9px] text-zinc-500 font-medium font-sans">Tutorials & shortcuts</div>
                      </div>
                    </div>
                  </button>

                </div>
              </>
            )}
          </div>
        </div>

        {/* View Mode Label */}
        <div className="flex items-center bg-[#131317] px-3 py-1 border border-white/[0.04] rounded-full shrink-0">
          <span className="text-[10px] font-extrabold tracking-wider uppercase text-zinc-400 font-sans">
            Chat
          </span>
        </div>
      </header>

      {/* Dynamic Inner Tab Router */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        
        {activeTab === 'ai_editor' && (
          <div className="space-y-6 animate-fadeIn py-2 pr-1 relative">
            
            {/* SPECIFICATIONS VIEW - NOW THE CHAT SECTION */}
            <div className="flex gap-4 items-start select-text pb-6 border-b border-white/[0.04]">
              {/* Circle logo badge exactly like the screenshot but cool dark */}
              <div className="w-9 h-9 rounded-full bg-[#111115] border border-white/[0.08] flex items-center justify-center shadow-[0_4px_16px_rgba(255,255,255,0.03)] shrink-0 select-none">
                {/* Stylish small 'l' logo */}
                <span className="font-heading text-lg italic text-white -translate-y-[1px]">l</span>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-white tracking-tight font-sans">lucid.dev</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/[0.04] uppercase font-semibold">Chat</span>
                </div>
                
                {/* Body content text */}
                <div className="space-y-4 text-[13px] leading-relaxed text-zinc-300 font-body">
                  <p>
                    I'm building a sleek Bootstrap frontend for Stella AI that mirrors design.ai's layout while showcasing Stella's powerful chatbot and content generation capabilities—complete with direct API integration for an interactive user experience!
                  </p>
                  
                  <div className="pt-2">
                    <p className="font-semibold text-zinc-200 mb-2">Screen set in progress:</p>
                    <ul className="space-y-2 pl-0.5">
                      {[
                        'Homepage',
                        'Chatbot Interface',
                        'Content Generator',
                        'Login/Signup Modal',
                        'Pricing Page',
                        'Features Page',
                        'User Dashboard',
                        'Settings Page'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[13px]">
                          <span className="text-zinc-500 font-extrabold text-base leading-none">•</span>
                          <span className="text-zinc-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* White Circle Down-Arrow Button with a premium glow */}
            <div className="flex justify-end pr-1 pt-4">
              <button 
                onClick={() => {
                  const el = document.getElementById('ide-workspace-scroll-bottom');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] cursor-pointer border-none"
                title="Scroll to bottom"
              >
                <ArrowDown className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            <div id="ide-workspace-scroll-bottom" />

          </div>
        )}

        {activeTab === 'visual_editor' && (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 bg-zinc-900 border border-white/[0.04] rounded-full m-auto flex items-center justify-center shadow-md">
              <MousePointer className="w-5 h-5 text-zinc-300" />
            </div>
            <h3 className="text-sm font-bold text-white">Interactive Visual Designer</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Drag-and-drop landing page bento containers or edit structural layouts visually. Any change is hot-compiled onto the right preview instantly.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <button onClick={() => { setShowFeatureBadge(!showFeatureBadge); }} className="p-3 bg-zinc-900/40 hover:bg-zinc-900 border border-white/[0.04] rounded-xl text-left text-xs cursor-pointer shadow-md">
                <p className="font-bold text-white">Feature Badge</p>
                <p className="text-[10px] text-zinc-500 mt-1">{showFeatureBadge ? "Active (Visible)" : "Hidden"}</p>
              </button>
              <button onClick={() => { setShowSecondaryCard(!showSecondaryCard); }} className="p-3 bg-zinc-900/40 hover:bg-zinc-900 border border-white/[0.04] rounded-xl text-left text-xs cursor-pointer shadow-md">
                <p className="font-bold text-white">Stats Container</p>
                <p className="text-[10px] text-zinc-500 mt-1">{showSecondaryCard ? "Active (Visible)" : "Hidden (Not rendered)"}</p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'branding' && (
          <div className="py-8 space-y-4 animate-fadeIn">
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
                       className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${previewTheme === accent.id ? 'border-white bg-white/5' : 'border-white/[0.04] bg-zinc-900/40'}`}
                    >
                      <div className={`w-6 h-6 rounded-md ${accent.color} border border-white/10`} />
                      <span className="text-[9px] font-bold text-zinc-300 truncate w-full text-center">{accent.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Action Button Colors</p>
                <div className="flex gap-2">
                  {[
                    { id: 'black', color: 'bg-black text-white' },
                    { id: 'violet', color: 'bg-violet-600 text-white' },
                    { id: 'indigo', color: 'bg-indigo-600 text-white' },
                    { id: 'purple', color: 'bg-purple-600 text-white' }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => { setPrimaryButtonColor(btn.id as any); playChime(); }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all border cursor-pointer ${primaryButtonColor === btn.id ? 'border-white bg-white text-black font-extrabold shadow-[0_0_12px_rgba(255,255,255,0.1)]' : 'border-white/[0.04] bg-zinc-900/40 hover:bg-[#18181b] text-zinc-300'}`}
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
          <div className="py-2 space-y-4 animate-fadeIn">
            {selectedFile ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors font-semibold bg-transparent border-none cursor-pointer"
                  >
                    <span>← Back to files</span>
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-zinc-400 font-semibold bg-white/5 px-2 py-0.5 rounded border border-white/5">{selectedFile}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(getFileContent(selectedFile));
                        addNotification('info', 'Code Copied', `${selectedFile} copied to clipboard!`);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-zinc-200 text-black rounded-lg text-[10px] font-bold transition-all border-none cursor-pointer shadow-md"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.05] overflow-x-auto overflow-y-auto max-h-[460px] text-[11px] font-mono leading-relaxed select-text custom-scrollbar">
                  {getFileContent(selectedFile).split('\n').map((line, idx) => (
                    <div key={idx} className="flex gap-4">
                      <span className="w-6 text-right select-none text-zinc-600 font-mono pr-2 border-r border-white/5 shrink-0">{idx + 1}</span>
                      <div className="flex-1 whitespace-pre">{renderCodeLine(line)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
                  <span className="text-xs font-extrabold text-white">Files Explorer</span>
                  <span className="text-[10px] text-zinc-500">{workspaceFiles.length} items total in workspace</span>
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  {workspaceFiles.map((file, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedFile(file.name)}
                      className="w-full text-left flex items-center justify-between p-2.5 bg-zinc-900/40 border border-white/[0.04] rounded-xl hover:bg-zinc-800/40 hover:border-white/10 transition-all shadow-md group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                        <FileText className="w-4 h-4 text-zinc-400 group-hover:text-zinc-300 shrink-0" />
                        <span>{file.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                        <span>{file.size}</span>
                        <span>{file.modified}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* GitHub Sync & Export collapsible configuration panel */}
                <div className="mt-6 border-t border-white/[0.04] pt-4">
                  <details className="group" open={githubSettingsOpen} onToggle={(e) => setGithubSettingsOpen(e.currentTarget.open)}>
                    <summary className="flex items-center justify-between text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer select-none list-none">
                      <div className="flex items-center gap-2">
                        <Github className="w-4 h-4 text-zinc-500" />
                        <span>GitHub & Deploy Settings</span>
                      </div>
                      <span className="transition-transform duration-200 group-open:rotate-180 text-zinc-500">
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </summary>

                    <div className="mt-3 space-y-3 p-3.5 rounded-xl bg-zinc-950 border border-white/[0.04] animate-fadeIn">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">GitHub Personal Access Token</label>
                        <input 
                          type="password"
                          value={githubToken}
                          onChange={(e) => handleGithubTokenChange(e.target.value)}
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-3 py-1.5 bg-black/60 border border-white/5 rounded-xl text-[10px] font-mono text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                        <span className="text-[8px] text-zinc-600 font-mono mt-1 block font-sans">Requires standard 'repo' permission scope.</span>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Repository Name</label>
                        <input 
                          type="text"
                          value={githubRepo}
                          onChange={(e) => handleGithubRepoChange(e.target.value)}
                          placeholder="lucid-manifested-app"
                          className="w-full px-3 py-1.5 bg-black/60 border border-white/5 rounded-xl text-[10px] font-mono text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                      </div>
                    </div>
                  </details>
                </div>

                {/* Show active deployment stream terminal if we have active logs */}
                {exportSteps.length > 0 && (
                  <div className="mt-4 rounded-xl bg-[#030305] border border-white/[0.05] overflow-hidden animate-fadeIn shadow-2xl">
                    <div className="flex items-center justify-between px-3 py-2 bg-zinc-950/80 border-b border-white/[0.03]">
                      <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-widest text-zinc-400">
                        <Terminal className="w-3 h-3 text-emerald-500" />
                        <span>DEPLOYMENT STREAM</span>
                      </div>
                      <button 
                        onClick={() => setExportSteps([])}
                        className="text-[9px] font-bold text-zinc-500 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                      >
                        Clear Logs
                      </button>
                    </div>
                    <div className="p-3.5 font-mono text-[9.5px] leading-relaxed space-y-2.5 max-h-[160px] overflow-y-auto custom-scrollbar">
                      {exportSteps.map((step, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400">➜</span>
                            <span className="text-white font-medium">{step.cmd}</span>
                            {step.status === 'running' && (
                              <Loader2 className="w-2.5 h-2.5 text-emerald-400 animate-spin shrink-0" />
                            )}
                          </div>
                          {step.result && (
                            <div className="pl-4 text-zinc-400 font-light">
                              {step.status === 'success' && <span className="text-emerald-400 mr-1">✓</span>}
                              {step.status === 'error' && <span className="text-red-400 mr-1">✗</span>}
                              <span>{step.result}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="py-6 text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 bg-zinc-900 border border-white/[0.04] rounded-full m-auto flex items-center justify-center">
              <User className="w-5 h-5 text-zinc-300" />
            </div>
            <h3 className="text-sm font-bold text-white">Team & Access Controls</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Invite collaborators to edit this sandbox container together or manage role permissions securely.
            </p>
            <button onClick={() => { alert("Invitation sent to collaborator!"); }} className="mt-2.5 px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-full text-xs font-bold transition-all cursor-pointer border-none shadow-[0_0_12px_rgba(255,255,255,0.1)]">
              Invite collaborator
            </button>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="py-6 text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 bg-zinc-900 border border-white/[0.04] rounded-full m-auto flex items-center justify-center">
              <Mail className="w-5 h-5 text-zinc-300" />
            </div>
            <h3 className="text-sm font-bold text-white">Email Notification Triggers</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Configure SMTP, Mailgun, or transactional templates to send out sign-up greetings dynamically.
            </p>
          </div>
        )}

        {activeTab === 'audits' && (
          <div className="py-6 text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 bg-zinc-900 border border-white/[0.04] rounded-full m-auto flex items-center justify-center">
              <Shield className="w-5 h-5 text-zinc-300" />
            </div>
            <h3 className="text-sm font-bold text-white">Compliance & Audit Trails</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Review deployment audit history, security vulnerability reports, and automatic compliance scoring.
            </p>
          </div>
        )}

        {activeTab === 'commerce' && (
          <div className="py-6 text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 bg-zinc-900 border border-white/[0.04] rounded-full m-auto flex items-center justify-center">
              <Layers className="w-5 h-5 text-zinc-300" />
            </div>
            <h3 className="text-sm font-bold text-white">Stripe & Paystack Sandbox</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Enable secure checkout, pricing plans, and credit-card tokenizers out of the box.
            </p>
          </div>
        )}

        {activeTab === 'domains' && (
          <div className="py-6 text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 bg-zinc-900 border border-white/[0.04] rounded-full m-auto flex items-center justify-center">
              <Globe className="w-5 h-5 text-zinc-300" />
            </div>
            <h3 className="text-sm font-bold text-white">Domain Configurations</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Point your custom apex domains or purchase `.dev` domains instantly. Live SSL is auto-certified.
            </p>
          </div>
        )}

        {activeTab === 'vibe_engine' && (
          <VibeEngineProPanel />
        )}

      </div>

      {/* INPUT PROMPT CONTROL BAR AT BOTTOM */}
      <div className="p-4 border-t border-white/[0.03] bg-[#07080a]/90 backdrop-blur-md relative z-30 shrink-0">
        
        <div className="bg-[#0e0e12] border border-white/[0.05] focus-within:border-white/15 focus-within:ring-2 focus-within:ring-white/[0.02] rounded-[1.25rem] p-3 px-4 flex flex-col gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all">
          
          {/* Input message field styled exactly like the screenshot */}
          <input 
            type="text"
            placeholder='Ask me... (or type "@" for context or "/" to command)'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVibeTrigger()}
            className="w-full bg-transparent border-none text-[13px] text-zinc-100 focus:outline-none placeholder:text-zinc-600 py-0.5 font-sans"
          />

          {/* Bottom Toolbar action row */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => alert("File upload modal active. Drag and drop assets directly.")}
                className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-zinc-200 transition-all cursor-pointer focus:outline-none border-none bg-transparent" 
                title="Attach assets"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('ide-workspace-scroll-bottom');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-zinc-200 transition-all cursor-pointer focus:outline-none border-none bg-transparent" 
                title="Scroll to active thread"
              >
                <PenTool className="w-4 h-4" />
              </button>
              
              {/* Build mode identifier status */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#131317] border border-white/[0.04] rounded-lg select-none">
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)] animate-pulse" />
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider font-mono">Build mode</span>
              </div>

              <button className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-zinc-200 transition-all cursor-pointer focus:outline-none border-none bg-transparent" title="Audio voice synthesis input">
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* Vibe send trigger circle button with white glow */}
            <button 
              onClick={() => handleVibeTrigger()}
              disabled={isCompiling}
              className="w-8 h-8 bg-white hover:bg-zinc-200 disabled:bg-zinc-900 text-black disabled:text-zinc-600 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-none shadow-[0_0_15px_rgba(255,255,255,0.15)] border-none"
            >
              {isCompiling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4 font-bold stroke-[3]" />
              )}
            </button>
          </div>

        </div>

        <p className="text-[10px] text-zinc-500 text-center mt-2.5 flex items-center justify-center gap-1 select-none">
          <span>lucid.dev may make mistakes. Verify critical files before pushing.</span>
          <HelpCircle className="w-3.5 h-3.5" />
        </p>

      </div>

      {/* Custom glass-morphic Remove Confirmation Modal */}
      <AnimatePresence>
        {showRemoveConfirmModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRemoveConfirmModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-zinc-950 border border-white/10 rounded-[1.5rem] p-6 shadow-2xl overflow-hidden text-left z-10"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 to-amber-500" />
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mt-2">
                <AlertTriangle className="w-4 h-4 text-red-500" /> Remove Stella AI Frontend?
              </h3>
              <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed font-sans">
                Are you sure you want to remove this project? Removing the project from your workspace is irreversible and will delete all sandbox configurations.
              </p>
              <div className="flex items-center justify-end gap-2.5 mt-5">
                <button 
                  onClick={() => setShowRemoveConfirmModal(false)}
                  className="px-4 py-1.5 rounded-full text-[10px] font-bold bg-white/5 hover:bg-white/10 text-zinc-300 transition-all cursor-pointer focus:outline-none border-none"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowRemoveConfirmModal(false);
                    addNotification('error', 'Project Removed', 'Stella AI Frontend was removed from your active workspace catalog.');
                  }}
                  className="px-4 py-1.5 rounded-full text-[10px] font-bold bg-red-600 hover:bg-red-500 text-white transition-all cursor-pointer focus:outline-none border-none"
                >
                  Yes, Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom glass-morphic Help Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelpModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-zinc-950 border border-white/10 rounded-[1.5rem] p-6 shadow-2xl overflow-hidden text-left z-10"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6366f1] to-violet-500" />
              <div className="flex items-center justify-between mt-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#6366f1]" /> Stella AI Help Center
                </h3>
                <button 
                  onClick={() => setShowHelpModal(false)}
                  className="p-1 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none bg-transparent border-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 mt-3 leading-relaxed font-sans">
                Welcome to Stella AI Workspace! Use these shortcuts and controls to optimize your workspace compilation flow:
              </p>
              <div className="mt-4 space-y-2.5 font-sans">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/[0.03]">
                  <div className="text-[10px] font-bold text-white">⚡ Predictive Vibe Compiler</div>
                  <div className="text-[9px] text-zinc-500 mt-0.5">Type what you want to build in the AI chat panel, and watch the interactive mockup on the right hot reload instantly!</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/[0.03]">
                  <div className="text-[10px] font-bold text-white">📦 Deploy & Export Suite</div>
                  <div className="text-[9px] text-zinc-500 mt-0.5">Click the "Download" or "Github" buttons near Publish, or click Settings in the project menu to configure repository syncs.</div>
                </div>
              </div>
              <div className="flex items-center justify-end mt-5">
                <button 
                  onClick={() => setShowHelpModal(false)}
                  className="px-4 py-1.5 rounded-full text-[10px] font-bold bg-white text-black hover:bg-zinc-200 transition-all cursor-pointer focus:outline-none border-none"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Beautiful Pop-out "Create a GitHub repository" Modal exactly like the screenshot */}
      <AnimatePresence>
        {isCreateRepoModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            {/* Dark translucent backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateRepoModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            {/* Modal Card content container */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-[500px] bg-[#0c0c0e] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-visible z-10"
            >
              {/* GitHub icon badge inside dark ring & X close button */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                  <Github className="w-5 h-5 text-white" />
                </div>
                <button 
                  onClick={() => setIsCreateRepoModalOpen(false)}
                  className="p-1.5 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Header Title & Subtitle */}
              <h3 className="text-xl font-bold text-white font-sans tracking-tight">Create a GitHub repository</h3>
              <p className="text-xs text-zinc-400 mt-1 mb-5 leading-relaxed font-sans">
                Create a new private repository on GitHub and link it to your project.
              </p>

              {/* Alert notification callout box matching Bolt design exactly */}
              <div className="p-3.5 rounded-xl bg-indigo-500/[0.03] border border-indigo-500/15 flex gap-2.5 mb-5">
                <AlertTriangle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  Only organizations that have the <span className="text-zinc-200">Lucid GitHub App</span> installed by an administrator will be shown.{" "}
                  <a 
                    href="https://github.com/apps/lucid-dev-sync" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-indigo-400 hover:underline font-medium inline-flex items-center gap-0.5"
                  >
                    Configure the GitHub App
                  </a>
                </div>
              </div>

              {/* User profile row */}
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-[10px] font-sans">
                  FT
                </div>
                <span className="text-xs font-semibold text-zinc-300 font-sans">fleektyre</span>
              </div>

              {/* Repository Input container with dropdown pop-out suggestions */}
              <div className="space-y-1.5 relative mb-8">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-sans">
                  Repository
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    value={tempRepoName}
                    onChange={(e) => {
                      setTempRepoName(e.target.value);
                      setShowRepoDropdown(true);
                    }}
                    onFocus={() => setShowRepoDropdown(true)}
                    placeholder="your-repository"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-sans text-white focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder-zinc-700 font-medium"
                  />
                  
                  {/* Suggestions Dropdown Popup */}
                  <AnimatePresence>
                    {showRepoDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowRepoDropdown(false)} 
                        />
                        <motion.div 
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="absolute left-0 right-0 mt-1 bg-[#121214] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-white/[0.04]"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setTempRepoName("SEM");
                              setShowRepoDropdown(false);
                            }}
                            className="w-full px-3.5 py-2 text-left text-xs font-sans text-zinc-300 hover:text-white hover:bg-white/5 transition-colors font-medium border-none bg-transparent cursor-pointer"
                          >
                            SEM
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTempRepoName("COMIC-BOOK");
                              setShowRepoDropdown(false);
                            }}
                            className="w-full px-3.5 py-2 text-left text-xs font-sans text-zinc-300 hover:text-white hover:bg-white/5 transition-colors font-medium border-none bg-transparent cursor-pointer"
                          >
                            COMIC-BOOK
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Action Buttons footer */}
              <div className="flex items-center justify-end gap-3 border-t border-white/[0.04] pt-5">
                <button 
                  type="button"
                  onClick={() => setIsCreateRepoModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer border-none bg-transparent"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (!tempRepoName.trim() || tempRepoName === "your-repository") {
                      addNotification('error', 'Invalid Name', 'Please specify a repository name first.');
                      return;
                    }
                    handleGithubRepoChange(tempRepoName);
                    setIsCreateRepoModalOpen(false);
                    setIsGithubDrawerOpen(true);
                    addNotification('info', 'Repository Linked', `Successfully configured repository as github.com/${tempRepoName}`);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold font-sans transition-all cursor-pointer border-none flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                >
                  Create repository
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Beautiful Pop-out GitHub Sync Modal */}
      <AnimatePresence>
        {isGithubDrawerOpen && (
          <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
            {/* Dark translucent backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGithubDrawerOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            {/* Modal Card content container */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-[500px] bg-[#0c0c0e] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] custom-scrollbar z-10 space-y-5"
            >
              {/* GitHub icon badge inside dark ring & X close button */}
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                  <Github className="w-5 h-5 text-indigo-400" />
                </div>
                <button 
                  onClick={() => setIsGithubDrawerOpen(false)}
                  className="p-1.5 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-xl font-bold font-heading italic text-white flex items-center gap-2.5">
                  Sync to GitHub
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans">
                  Export, commit, and push this compiled sandbox codebase into your remote repository.
                </p>
              </div>
              
              {/* Repository details banner with link disconnect state */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-sans">Repository</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setGithubRepo('');
                        addNotification('info', 'Repository Disconnected', 'Active GitHub link removed.');
                      }}
                      className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors border-none bg-transparent cursor-pointer" 
                      title="Disconnect Repo"
                    >
                      <User className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => {
                        setTempRepoName(githubRepo || 'your-repository');
                        setIsCreateRepoModalOpen(true);
                      }}
                      className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors border-none bg-transparent cursor-pointer"
                      title="Create/Link New Repository"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <a 
                      href={`https://github.com/${githubRepo ? githubRepo : 'fleetyre/Lucid.dev'}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors"
                      title="View on GitHub"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">
                    {githubRepo ? `github.com/${githubRepo}` : 'fleetyre/Lucid.dev'}
                  </span>
                  <span className="text-[9px] bg-white/5 text-zinc-400 border border-white/[0.05] px-1.5 py-0.5 rounded-full font-mono flex items-center gap-1 select-none">
                    <span className="w-1.5 h-1.5 bg-[#4f46e5] rounded-full" /> main
                  </span>
                </div>
              </div>
              
              {/* Commit Message Box */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-sans">
                  What changes did you make?
                </label>
                <textarea 
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Describe your commit changes..."
                  rows={4}
                  className="w-full bg-black/40 border border-white/5 rounded-xl text-xs text-white p-3.5 focus:outline-none focus:border-indigo-500/50 transition-colors font-sans leading-relaxed resize-none"
                />
              </div>
              
              {/* Auto staged items lists exactly like screenshot */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-sans">
                    {workspaceFiles.length + 3} changed files
                  </span>
                  <span className="text-[8px] text-zinc-500 uppercase font-mono">auto-staged</span>
                </div>
                
                <div className="max-h-[140px] overflow-y-auto border border-white/[0.04] bg-black/20 rounded-xl divide-y divide-white/[0.03] custom-scrollbar text-[11px] font-mono">
                  <div className="flex items-center justify-between p-2 px-3">
                    <span className="text-zinc-300 truncate max-w-[280px]">package.json</span>
                    <span className="text-[9px] text-amber-500 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10 font-bold font-sans">Modified</span>
                  </div>
                  <div className="flex items-center justify-between p-2 px-3">
                    <span className="text-zinc-300 truncate max-w-[280px]">server.ts</span>
                    <span className="text-[9px] text-amber-500 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10 font-bold font-sans">Modified</span>
                  </div>
                  <div className="flex items-center justify-between p-2 px-3">
                    <span className="text-zinc-300 truncate max-w-[280px]">src/studio/panels/AIPanel.tsx</span>
                    <span className="text-[9px] text-amber-500 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10 font-bold font-sans">Modified</span>
                  </div>
                  <div className="flex items-center justify-between p-2 px-3">
                    <span className="text-zinc-300 truncate max-w-[280px]">src/App.tsx</span>
                    <span className="text-[9px] text-amber-500 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10 font-bold font-sans">Modified</span>
                  </div>
                  <div className="flex items-center justify-between p-2 px-3">
                    <span className="text-zinc-300 truncate max-w-[280px]">src/index.css</span>
                    <span className="text-[9px] text-amber-500 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10 font-bold font-sans">Modified</span>
                  </div>
                  <div className="flex items-center justify-between p-2 px-3">
                    <span className="text-zinc-300 truncate max-w-[280px]">{`src/${getFileName(generatedAppType)}`}</span>
                    <span className="text-[9px] text-emerald-500 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10 font-bold font-sans">Added</span>
                  </div>
                  <div className="flex items-center justify-between p-2 px-3">
                    <span className="text-zinc-300 truncate max-w-[280px]">firebase-applet-config.json</span>
                    <span className="text-[9px] text-emerald-500 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10 font-bold font-sans">Added</span>
                  </div>
                </div>
              </div>

              {/* Pipeline compilation terminal log streams directly inside drawer */}
              {exportSteps.length > 0 && (
                <div className="rounded-xl bg-[#030305] border border-white/[0.05] overflow-hidden animate-fadeIn shadow-xl">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-950/85 border-b border-white/[0.03]">
                    <div className="flex items-center gap-1.5 text-[8.5px] font-mono font-bold tracking-widest text-zinc-400">
                      <Terminal className="w-3 h-3 text-indigo-400" />
                      <span>PIPELINE LOGS</span>
                    </div>
                    <button 
                      onClick={() => setExportSteps([])}
                      className="text-[8.5px] font-bold text-zinc-500 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                    >
                      Clear Logs
                    </button>
                  </div>
                  <div className="p-3 font-mono text-[9px] leading-relaxed space-y-2 max-h-[140px] overflow-y-auto custom-scrollbar">
                    {exportSteps.map((step, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-indigo-400 font-bold">➜</span>
                          <span className="text-zinc-200">{step.cmd}</span>
                          {step.status === 'running' && (
                            <Loader2 className="w-2.5 h-2.5 text-indigo-400 animate-spin shrink-0" />
                          )}
                        </div>
                        {step.result && (
                          <div className="pl-3 text-zinc-500">
                            {step.status === 'success' && <span className="text-emerald-400 mr-1">✓</span>}
                            {step.status === 'error' && <span className="text-red-400 mr-1">✗</span>}
                            <span>{step.result}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Modal buttons footer */}
              <div className="flex items-center justify-end gap-3 border-t border-white/[0.04] pt-5">
                <button 
                  type="button"
                  onClick={() => setIsGithubDrawerOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer border-none bg-transparent"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => triggerGithubPush()}
                  disabled={isExporting}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 disabled:bg-zinc-900 disabled:text-zinc-600 text-black text-xs font-bold font-sans transition-all cursor-pointer border-none flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.06)] hover:shadow-[0_0_25px_rgba(255,255,255,0.12)] active:scale-[0.98]"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Syncing payload...</span>
                    </>
                  ) : (
                    <>
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>Stage and commit all changes</span>
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
};
