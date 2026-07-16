import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, Smartphone, ChevronDown, RotateCw, ExternalLink, ArrowRight, Terminal, Sparkles,
  Cloud, Sun, CloudRain, Snowflake, Droplets, Plus, Trash2, Check, Copy, FileText, Layers,
  History, Download, UserPlus, Github
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { InteractiveIDEMockup } from './InteractiveIDEMockup';

interface IDEPreviewProps {
  activePreviewDevice: 'desktop' | 'mobile';
  setActivePreviewDevice: (device: 'desktop' | 'mobile') => void;
  previewTheme: 'light' | 'dark' | 'glass' | 'cosmic';
  previewHeadline: string;
  showFeatureBadge: boolean;
  badgeText: string;
  primaryButtonColor: 'black' | 'violet' | 'indigo' | 'purple';
  showSecondaryCard: boolean;
  playChime: () => void;
  generatedAppType: string;
}

const CalculatorSimulator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

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
    <div className="w-full max-w-[280px] mx-auto p-5 rounded-[2rem] bg-[#0c0d12] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl text-left select-text relative z-10">
      <div className="text-right mb-6 px-2">
        <div className="text-zinc-500 text-[10px] font-mono truncate h-4">{equation || '0'}</div>
        <div className="text-white text-3xl font-bold tracking-tight mt-1 truncate">{display}</div>
      </div>
      
      <div className="grid grid-cols-4 gap-2.5">
        <button onClick={reset} className="p-3 bg-white/5 hover:bg-white/10 text-indigo-300 rounded-xl text-xs font-bold transition-all cursor-pointer">
          C
        </button>
        <button className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-xl text-xs font-bold transition-all">
          +/-
        </button>
        <button className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-xl text-xs font-bold transition-all">
          %
        </button>
        <button onClick={() => handleOperator('÷')} className="p-3 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-400 rounded-xl text-xs font-bold transition-all cursor-pointer">
          ÷
        </button>

        {['7', '8', '9'].map((btn) => (
          <button key={btn} onClick={() => handleNumber(btn)} className="p-3 bg-zinc-900/60 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
            {btn}
          </button>
        ))}
        <button onClick={() => handleOperator('x')} className="p-3 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-400 rounded-xl text-xs font-bold transition-all cursor-pointer">
          x
        </button>

        {['4', '5', '6'].map((btn) => (
          <button key={btn} onClick={() => handleNumber(btn)} className="p-3 bg-zinc-900/60 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
            {btn}
          </button>
        ))}
        <button onClick={() => handleOperator('-')} className="p-3 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-400 rounded-xl text-xs font-bold transition-all cursor-pointer">
          -
        </button>

        {['1', '2', '3'].map((btn) => (
          <button key={btn} onClick={() => handleNumber(btn)} className="p-3 bg-zinc-900/60 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
            {btn}
          </button>
        ))}
        <button onClick={() => handleOperator('+')} className="p-3 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-400 rounded-xl text-xs font-bold transition-all cursor-pointer">
          +
        </button>

        <button onClick={() => handleNumber('0')} className="col-span-2 p-3 bg-zinc-900/60 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
          0
        </button>
        <button onClick={() => handleNumber('.')} className="p-3 bg-zinc-900/60 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
          .
        </button>
        <button onClick={calculate} className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
          =
        </button>
      </div>
    </div>
  );
};

const TodoSimulator: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Configure custom domain SSL', completed: false },
    { id: '2', text: 'Design custom glassy dark bento layouts', completed: true },
    { id: '3', text: 'Refactor app state managers using context', completed: false }
  ]);
  const [input, setInput] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), text: input, completed: false }]);
    setInput('');
  };

  const toggle = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const remove = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completed = tasks.filter(t => t.completed).length;

  return (
    <div className="w-full max-w-[290px] mx-auto p-4 bg-[#0a0c10] border border-white/10 rounded-[1.75rem] text-white font-sans shadow-2xl backdrop-blur-md text-left relative z-10">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xs font-bold">TodoBoard</h2>
          <p className="text-[8px] text-zinc-500 mt-0.5">Project sandbox active</p>
        </div>
        <span className="text-[8px] px-2.5 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-full font-bold text-indigo-400">
          {completed}/{tasks.length} Completed
        </span>
      </div>

      <form onSubmit={addTask} className="flex gap-1.5 mb-3">
        <input 
          type="text" 
          placeholder="New task name..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-white/5 border border-white/5 rounded-lg px-2.5 py-1 text-[10px] text-white focus:outline-none"
        />
        <button type="submit" className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer text-[10px] font-bold">
          Add
        </button>
      </form>

      <div className="space-y-1.5 max-h-[160px] overflow-y-auto no-scrollbar">
        {tasks.map(t => (
          <div key={t.id} className="flex items-center justify-between p-2 bg-zinc-950/40 border border-white/5 rounded-xl">
            <button onClick={() => toggle(t.id)} className="flex items-center gap-2 text-left flex-1 cursor-pointer">
              <span className={`w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center shrink-0 ${t.completed ? 'bg-emerald-500 border-emerald-500' : ''}`}>
                {t.completed && <span className="block w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              <span className={`text-[10px] ${t.completed ? 'line-through text-zinc-500' : 'text-zinc-300'}`}>{t.text}</span>
            </button>
            <button onClick={() => remove(t.id)} className="text-zinc-500 hover:text-red-400 px-1 py-0.5 cursor-pointer text-[9px] font-bold transition-colors">
              Del
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const WeatherSimulator: React.FC = () => {
  const [city, setCity] = useState('San Francisco');
  const [weather, setWeather] = useState({
    city: 'San Francisco',
    temp: 18,
    condition: 'Sunny',
    humidity: 62,
    wind: 14
  });

  const cityDatabase: Record<string, typeof weather> = {
    'san francisco': { city: 'San Francisco', temp: 18, condition: 'Sunny', humidity: 62, wind: 14 },
    'london': { city: 'London', temp: 12, condition: 'Rainy', humidity: 88, wind: 22 },
    'tokyo': { city: 'Tokyo', temp: 22, condition: 'Cloudy', humidity: 55, wind: 8 },
    'paris': { city: 'Paris', temp: 15, condition: 'Cloudy', humidity: 70, wind: 12 }
  };

  const handleSearch = (cityName: string) => {
    const key = cityName.toLowerCase().trim();
    if (cityDatabase[key]) {
      setWeather(cityDatabase[key]);
      setCity(cityDatabase[key].city);
    }
  };

  const getGradient = (cond: string) => {
    switch (cond) {
      case 'Rainy': return 'from-slate-800 to-slate-950';
      case 'Cloudy': return 'from-zinc-800 to-zinc-950';
      default: return 'from-[#0b0c10] via-[#10121a] to-[#1a1d26]';
    }
  };

  return (
    <div className={`w-full max-w-[290px] mx-auto p-4 rounded-[1.75rem] border border-white/10 text-white font-sans shadow-2xl bg-gradient-to-br transition-all duration-500 text-left relative z-10 ${getGradient(weather.condition)}`}>
      <div className="flex justify-between items-center mb-4">
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">WeatherWidget</span>
        <span className="text-[9px] text-indigo-300 font-bold bg-white/5 px-2 py-0.5 border border-white/5 rounded">Live Data</span>
      </div>

      <div className="mb-4">
        <h1 className="text-xl font-extrabold">{weather.city}</h1>
        <p className="text-[9px] text-indigo-200 mt-0.5">{weather.condition} Conditions</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl font-black">{weather.temp}°C</span>
        <div className="text-[9px] text-zinc-400">
          <p>Humidity: {weather.humidity}%</p>
          <p className="mt-0.5">Wind: {weather.wind} km/h</p>
        </div>
      </div>

      {/* Preset locations clickable buttons */}
      <div className="grid grid-cols-4 gap-1 mt-2">
        {['San Francisco', 'London', 'Tokyo', 'Paris'].map((c) => (
          <button key={c} onClick={() => handleSearch(c)} className="py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[8px] font-bold text-zinc-300 hover:text-white transition-all cursor-pointer">
            {c.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
};

const PomodoroSimulator: React.FC = () => {
  const [seconds, setSeconds] = useState(1500); // 25 mins
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      setCycles(c => c + 1);
      setSeconds(1500);
      alert("Break time!");
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setSeconds(1500);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-[280px] mx-auto text-center p-5 bg-[#0a0c10] border border-white/10 rounded-[1.75rem] text-white font-sans shadow-2xl backdrop-blur-md relative z-10">
      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-indigo-400 block mb-2">FocusTimer</span>
      
      <div className="my-4 text-4xl font-black font-mono tracking-tighter">
        {formatTime(seconds)}
      </div>

      <div className="flex justify-center gap-2 mb-4">
        <button onClick={toggle} className="px-4 py-1.5 bg-white text-black text-[10px] font-bold rounded-full hover:bg-zinc-200 transition-all cursor-pointer">
          {isActive ? 'Pause' : 'Start Focus'}
        </button>
        <button onClick={reset} className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 rounded-full transition-all cursor-pointer">
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="text-[9px] text-zinc-500 font-medium">
        <span>Focus cycle completions: {cycles}</span>
      </div>
    </div>
  );
};

const BudgetSimulator: React.FC = () => {
  const [transactions, setTransactions] = useState([
    { id: '1', desc: 'Premium SaaS Payout', amount: 480, type: 'income' },
    { id: '2', desc: 'Supabase Node Cost', amount: 25, type: 'expense' },
    { id: '3', desc: 'Coffee shop workspace', amount: 12, type: 'expense' }
  ]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  const addTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;
    setTransactions(prev => [{
      id: Date.now().toString(),
      desc,
      amount: parseFloat(amount),
      type: 'expense'
    }, ...prev]);
    setDesc('');
    setAmount('');
  };

  const balance = transactions.reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);

  return (
    <div className="w-full max-w-[280px] mx-auto p-4 bg-[#0a0c10] rounded-[1.75rem] border border-white/10 text-white font-sans shadow-2xl backdrop-blur-md text-left relative z-10">
      <div className="mb-4">
        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Active Balance</span>
        <h1 className="text-2xl font-black text-indigo-300 mt-0.5">${balance.toFixed(2)}</h1>
      </div>

      <form onSubmit={addTx} className="space-y-1.5 mb-4">
        <input 
          type="text" 
          placeholder="New expense name..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full bg-white/5 border border-white/5 rounded-lg px-2.5 py-1 text-[10px] text-white focus:outline-none"
        />
        <div className="flex gap-1.5">
          <input 
            type="number" 
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-white/5 border border-white/5 rounded-lg px-2.5 py-1 text-[10px] text-white focus:outline-none"
          />
          <button type="submit" className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer">Add</button>
        </div>
      </form>

      <div className="space-y-1.5 max-h-[100px] overflow-y-auto no-scrollbar">
        {transactions.map(t => (
          <div key={t.id} className="flex justify-between items-center p-2 bg-zinc-950/40 border border-white/5 rounded-xl text-[10px]">
            <span className="text-zinc-300 font-medium truncate max-w-[140px]">{t.desc}</span>
            <span className={`font-mono font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-zinc-500'}`}>
              {t.type === 'income' ? '+' : '-'}${t.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AIChatSimulator: React.FC = () => {
  const [chat, setChat] = useState([
    { id: '1', sender: 'bot', text: "Hello! I am your live VibeCoder companion. How can I assist you with code?" }
  ]);
  const [input, setInput] = useState('');

  const sendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), sender: 'user', text: input };
    setChat(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      setChat(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `Active container live-evaluated: "${userMsg.text}"`
      }]);
    }, 800);
  };

  return (
    <div className="w-full max-w-[280px] mx-auto bg-[#0a0c10] border border-white/10 rounded-[1.75rem] overflow-hidden flex flex-col h-[280px] text-left relative z-10">
      <div className="p-2.5 bg-zinc-900 border-b border-white/10 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
        <span className="text-white text-[10px] font-bold font-mono">AIChatbot.tsx</span>
      </div>
      <div className="flex-1 p-2.5 overflow-y-auto space-y-1.5 no-scrollbar bg-[#06070a]">
        {chat.map(m => (
          <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-xl p-2 text-[10px] leading-snug ${m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-zinc-900 border border-white/5 text-zinc-300'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMsg} className="p-2 bg-zinc-900 border-t border-white/10 flex gap-1 shrink-0">
        <input 
          type="text" 
          placeholder="Message companion..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-white/5 border border-white/5 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none"
        />
        <button type="submit" className="p-1 px-2 bg-indigo-600 text-white rounded-lg cursor-pointer text-[10px] font-bold">Send</button>
      </form>
    </div>
  );
};

export const IDEPreview: React.FC<IDEPreviewProps> = ({
  activePreviewDevice,
  setActivePreviewDevice,
  previewTheme,
  previewHeadline,
  showFeatureBadge,
  badgeText,
  primaryButtonColor,
  showSecondaryCard,
  playChime,
  generatedAppType
}) => {
  const [mobileSubDevice, setMobileSubDevice] = useState<'phone' | 'tablet_portrait' | 'tablet_landscape'>('phone');
  const [showCodebaseIDE, setShowCodebaseIDE] = useState<boolean>(false);
  const { setShowPricingModal, addNotification } = useStudioStore();

  useEffect(() => {
    const handleShowCodebase = () => {
      setShowCodebaseIDE(true);
    };
    window.addEventListener('lucid-show-codebase', handleShowCodebase);
    return () => {
      window.removeEventListener('lucid-show-codebase', handleShowCodebase);
    };
  }, []);



  return (
    <section id="ide-preview" className="flex-1 bg-[#08080c] flex flex-col h-full min-w-0">
      
      {/* Browser Mockup Toolbar Header */}
      <header className="h-[52px] border-b border-white/[0.04] px-4 flex items-center justify-between select-none shrink-0 bg-[#060608]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-white">Preview</span>
          
          {/* Viewport switch icons */}
          <div className="flex items-center bg-zinc-900/60 p-0.5 border border-white/[0.03] rounded-lg">
            <button 
              onClick={() => setActivePreviewDevice('desktop')}
              className={`p-1 rounded-md transition-all focus:outline-none cursor-pointer ${activePreviewDevice === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Desktop view"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setActivePreviewDevice('mobile')}
              className={`p-1 rounded-md transition-all focus:outline-none cursor-pointer ${activePreviewDevice === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Mobile views"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile sub-devices menu matching screenshot exactly */}
          {activePreviewDevice === 'mobile' && (
            <div className="flex items-center bg-zinc-900/40 p-0.5 border border-white/[0.03] rounded-lg gap-0.5">
              {(['phone', 'tablet_portrait', 'tablet_landscape'] as const).map((subDev) => {
                const isActive = mobileSubDevice === subDev;
                const labels = {
                  phone: 'Phone',
                  tablet_portrait: 'Tablet (Portrait)',
                  tablet_landscape: 'Tablet (Landscape)'
                };
                return (
                  <button
                    key={subDev}
                    onClick={() => setMobileSubDevice(subDev)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all focus:outline-none cursor-pointer ${
                      isActive 
                        ? 'bg-white text-black font-extrabold shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {labels[subDev]}
                  </button>
                );
              })}
            </div>
          )}

          {/* Codebase Logo element close to the desktop / mobile show toggles */}
          <button
            onClick={() => {
              if (showCodebaseIDE) {
                setShowCodebaseIDE(false);
                addNotification('info', 'Closing Codebase', 'Returned to active interactive preview simulator.');
              } else {
                setShowCodebaseIDE(true);
                addNotification('info', 'Opening Codebase', 'Inspecting the dynamic source code of the website you built...');
              }
              playChime?.();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-lg select-none transition-all cursor-pointer focus:outline-none ${
              showCodebaseIDE 
                ? 'bg-[#6366f1]/20 border-[#6366f1]/40 text-[#a5b4fc]' 
                : 'bg-white/5 border-white/[0.04] hover:bg-white/10 hover:border-white/10 text-zinc-300 hover:text-white'
            }`}
            title="Inspect generated website code"
          >
            <Terminal className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-[10px] font-bold text-white/95 font-sans tracking-tight">Codebase</span>
          </button>
        </div>

        {/* Version, Publish */}
        <div className="flex items-center gap-3">
          
          {/* Quick Action Shortcuts Group close to Publish */}
          <div className="flex items-center gap-1.5 border-r border-white/[0.06] pr-3 mr-1">
            <button 
              onClick={() => {
                addNotification('info', 'Checkpoint Restored', 'The development sandbox was successfully restored to the last compiled checkpoint.');
                playChime?.();
              }}
              className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.01] hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none"
              title="Restore Sandbox to checkpoint"
            >
              <History className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                addNotification('info', 'Compiling ZIP', 'Beginning local sandbox file compilation stream...');
                window.dispatchEvent(new CustomEvent('lucid-trigger-zip-download'));
              }}
              className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.01] hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none"
              title="Download Standalone ZIP"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                addNotification('info', 'Collaborator Link Copied', 'Project share link copied to clipboard! Send it to invite your team.');
                playChime?.();
              }}
              className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.01] hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none"
              title="Add Collaborator / Share"
            >
              <UserPlus className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                addNotification('info', 'Initiating GitHub Commit', 'Authenticating Git access credentials & launching deployment stream...');
                window.dispatchEvent(new CustomEvent('lucid-trigger-github-push'));
              }}
              className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.01] hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none"
              title="Push to GitHub repository"
            >
              <Github className="w-4 h-4" />
            </button>
          </div>

          {/* Version dropdown */}
          <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-white/[0.04] px-2 py-1 rounded-lg">
            <span>v1</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </div>

          {/* Publish button */}
          <button 
            onClick={() => {
              alert("Site deployed live to production! Point domains at custom SSL.");
            }}
            className="bg-white hover:bg-zinc-200 text-black text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all focus:outline-none cursor-pointer"
          >
            Publish
          </button>

        </div>
      </header>

      {/* Address URL inputs bar */}
      <div className="p-2 border-b border-white/[0.04] bg-[#050507] flex items-center justify-between gap-3 select-none shrink-0">
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-white/5 rounded text-zinc-500 hover:text-white transition-all focus:outline-none cursor-pointer" title="Reload browser">
            <RotateCw className="w-3 h-3" />
          </button>
        </div>
        
        <div className="flex-1 max-w-lg bg-zinc-950 border border-white/[0.03] rounded-lg px-3 py-1 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>/</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-600 hover:text-zinc-300 cursor-pointer" />
        </div>
      </div>

      {/* Browser Stage Window frame wrapper */}
      <div className="flex-1 overflow-hidden relative">
        {showCodebaseIDE ? (
          <div className="absolute inset-0 p-4 bg-[#08080c] overflow-y-auto flex flex-col h-full z-20">
            <InteractiveIDEMockup generatedAppType={generatedAppType} onClose={() => setShowCodebaseIDE(false)} />
          </div>
        ) : (
          <div className="absolute inset-0 bg-zinc-950/60 p-4 overflow-y-auto flex items-start justify-center z-10">
            {/* DEVICE SIMULATOR WIDTH SWITCHER */}
            <div className={`transition-all duration-300 w-full ${
              activePreviewDevice === 'mobile' 
                ? mobileSubDevice === 'phone' ? 'max-w-[340px] aspect-[9/16] my-6 border-8 border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden'
                  : mobileSubDevice === 'tablet_portrait' ? 'max-w-[560px] aspect-[3/4] my-6 border-8 border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden'
                  : 'max-w-[760px] aspect-[4/3] my-6 border-8 border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden'
                : 'w-full'
            }`}>
              
              {/* LIVE PREVIEW CANVAS */}
              <div 
                id="active-preview-canvas"
                className={`w-full min-h-[500px] bg-white text-zinc-800 transition-all duration-500 relative flex flex-col p-5 select-none ${
                  (!generatedAppType || generatedAppType === 'landing_page') ? (
                    previewTheme === 'dark' ? 'bg-[#0a0c10] text-zinc-200' :
                    previewTheme === 'cosmic' ? 'bg-gradient-to-br from-[#0c051a] to-[#04020a] text-purple-100 border border-purple-500/10' :
                    previewTheme === 'glass' ? 'bg-zinc-900 text-zinc-200 backdrop-blur-md border border-white/5' :
                    'bg-[#fafafc] text-zinc-900 border border-black/5'
                  ) : 'bg-[#06070a] border border-white/[0.04] text-zinc-200'
                }`}
              >
                {(!generatedAppType || generatedAppType === 'landing_page') ? (
                  <>
                    {/* Optional Background visual glow elements for Cosmic theme */}
                    {previewTheme === 'cosmic' && (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12)_0,transparent_75%)] pointer-events-none" />
                    )}

                    {/* Apex Website Landing Page Navigation */}
                    <nav className="flex items-center justify-between pb-4 border-b border-zinc-100/60 transition-colors relative z-10"
                      style={{ borderColor: previewTheme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}
                    >
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-black tracking-tight ${previewTheme === 'light' ? 'text-black' : 'text-white'}`}>Apex</span>
                      </div>
                      
                      {/* Horizontal navigation menu (Hidden on mobile simulator viewport) */}
                      {activePreviewDevice !== 'mobile' && (
                        <div className="flex items-center gap-3 text-[10px] font-semibold text-zinc-500">
                          <span className="hover:text-black cursor-pointer">Product</span>
                          <span className="hover:text-black cursor-pointer">Features</span>
                          <span className="hover:text-black cursor-pointer">Pricing</span>
                          <span className="hover:text-black cursor-pointer">About</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-zinc-500 hover:text-black cursor-pointer font-bold">Sign in</span>
                        <button className="text-[9px] font-bold px-2.5 py-1 bg-black text-white hover:bg-zinc-800 rounded-lg transition-all"
                          style={{ 
                            backgroundColor: previewTheme === 'light' ? '#000000' : '#ffffff',
                            color: previewTheme === 'light' ? '#ffffff' : '#000000'
                          }}
                        >
                          Get started
                        </button>
                      </div>
                    </nav>

                    {/* Hero Banner Grid section */}
                    <div className="flex-1 flex flex-col justify-center text-center items-center py-10 px-2 relative z-10">
                      
                      {/* Responsive beta badge capsule */}
                      {showFeatureBadge && (
                        <motion.span 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider uppercase inline-block border ${
                            previewTheme === 'light' ? 'bg-zinc-100 text-zinc-500 border-zinc-200' : 'bg-white/5 text-zinc-300 border-white/10'
                          }`}
                        >
                          {badgeText}
                        </motion.span>
                      )}

                      {/* Main Headline banner */}
                      <h1 className={`text-2xl md:text-3xl font-heading italic font-normal tracking-tight leading-tight mt-4 max-w-[320px] ${
                        previewTheme === 'light' ? 'text-black' : 'text-white'
                      }`}>
                        {previewHeadline}
                      </h1>

                      {/* Subtitle description */}
                      <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-3.5 leading-relaxed">
                        Connect your team workspaces, streamline visual state management, and build glass cards inside standard browser sandboxes.
                      </p>

                      {/* Multi-action CTA layout */}
                      <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
                        <button 
                          className={`text-[10px] font-extrabold px-4 py-2 rounded-full transition-all flex items-center gap-1 hover:scale-105 cursor-pointer ${
                            primaryButtonColor === 'violet' ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]' :
                            primaryButtonColor === 'indigo' ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.3)]' :
                            primaryButtonColor === 'purple' ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.3)]' :
                            previewTheme === 'light' ? 'bg-black text-white' : 'bg-white text-black'
                          }`}
                        >
                          <span>Start Free Trial</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button className={`text-[10px] font-semibold px-4 py-2 rounded-full border transition-all hover:bg-white/5 cursor-pointer ${
                          previewTheme === 'light' ? 'border-zinc-200 text-zinc-700' : 'border-white/10 text-zinc-300'
                        }`}>
                          Book a demo
                        </button>
                      </div>

                      {/* SECONDARY PREVIEW BENTO Grid section if enabled visually */}
                      {showSecondaryCard && (
                        <motion.div 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-8 p-3.5 border rounded-2xl w-full max-w-[280px] text-left transition-all relative overflow-hidden ${
                            previewTheme === 'light' 
                              ? 'bg-zinc-50/50 border-zinc-200 text-zinc-800' 
                              : 'bg-zinc-900/40 border-white/[0.04] text-white/90'
                          }`}
                        >
                          <p className="text-[9px] uppercase tracking-wider font-extrabold text-zinc-500">Live Compute Power</p>
                          <div className="flex items-baseline gap-1 mt-1.5">
                            <span className="text-xl font-bold tracking-tight">842</span>
                            <span className="text-[10px] text-indigo-400 font-bold">ms compile</span>
                          </div>
                          <div className="w-full bg-zinc-200/50 h-1 rounded-full mt-2.5 overflow-hidden">
                            <div className="bg-indigo-500 h-full w-[84%]" />
                          </div>
                        </motion.div>
                      )}

                    </div>

                    {/* Simulated browser footer badge */}
                    <footer className="pt-4 border-t border-zinc-100/40 mt-10 text-[9px] text-zinc-400 flex items-center justify-between select-none relative z-10"
                      style={{ borderColor: previewTheme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}
                    >
                      <span>Powered by lucid.dev</span>
                      <span>All rights reserved 2026</span>
                    </footer>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col justify-center items-center py-6 px-1 relative z-10">
                    {generatedAppType === 'calculator' && <CalculatorSimulator />}
                    {generatedAppType === 'todo' && <TodoSimulator />}
                    {generatedAppType === 'weather' && <WeatherSimulator />}
                    {generatedAppType === 'pomodoro' && <PomodoroSimulator />}
                    {generatedAppType === 'budget' && <BudgetSimulator />}
                    {generatedAppType === 'ai_chat' && <AIChatSimulator />}
                    
                    {/* Standard live sandbox footer inside device screen */}
                    <div className="mt-6 text-[8px] font-mono font-medium text-zinc-600 flex items-center gap-1.5 select-none">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                      <span>Interactive Live Preview Sandbox Active (lucid.dev container)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </section>
  );
};
