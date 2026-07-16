import React, { useState, useEffect } from 'react';
import { 
  Folder, FolderOpen, FileText, FileCode, ChevronRight, ChevronDown, 
  Search, Copy, X, Terminal, ArrowUpRight, Play, Eye
} from 'lucide-react';

interface FileItem {
  name: string;
  path: string;
  content: string;
  type: 'md' | 'json' | 'js' | 'ts' | 'tsx' | 'html' | 'css' | 'git' | 'env';
}

interface InteractiveIDEMockupProps {
  generatedAppType: string;
  onClose: () => void;
}

export const InteractiveIDEMockup: React.FC<InteractiveIDEMockupProps> = ({ 
  generatedAppType, 
  onClose 
}) => {
  const [selectedFile, setSelectedFile] = useState<string>('README.md');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Sidebar folder expand states
  const [isPublicExpanded, setIsPublicExpanded] = useState<boolean>(false);
  const [isSrcExpanded, setIsSrcExpanded] = useState<boolean>(false);
  
  // Logs terminal minimized or maximized
  const [isLogsMinimized, setIsLogsMinimized] = useState<boolean>(false);

  // Helper to get actual file name based on generatedAppType
  const getAppFileName = (type: string) => {
    switch (type) {
      case 'calculator': return 'Calculator.tsx';
      case 'todo': return 'TodoBoard.tsx';
      case 'weather': return 'WeatherWidget.tsx';
      case 'pomodoro': return 'FocusTimer.tsx';
      case 'budget': return 'BudgetTracker.tsx';
      case 'ai_chat': return 'AIChatbot.tsx';
      default: return 'LandingPage.tsx';
    }
  };

  const getAppTitle = (type: string) => {
    switch (type) {
      case 'calculator': return 'Glass Calculator';
      case 'todo': return 'Todo Board';
      case 'weather': return 'Weather Widget';
      case 'pomodoro': return 'Focus Timer';
      case 'budget': return 'Budget Tracker';
      case 'ai_chat': return 'AI Chatbot';
      default: return 'Landing Page';
    }
  };

  const activeAppFileName = getAppFileName(generatedAppType);
  const activeAppTitle = getAppTitle(generatedAppType);

  // File database containing code and configurations
  const filesList: FileItem[] = [
    { 
      name: 'README.md', 
      path: 'README.md', 
      type: 'md', 
      content: `# React\n\nA modern React-based project utilizing the latest frontend technologies and tools for building responsive web applications.\n\n## 🚀 Features\n\n- **React 18** - React version with improved rendering and concurrent features\n- **Vite** - Lightning-fast build tool and development server\n- **Redux Toolkit** - State management with simplified Redux setup\n- **TailwindCSS** - Utility-first CSS framework with extensive customization\n- **React Router v6** - Declarative routing for React applications\n- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization\n- **Form Management** - React Hook Form for efficient form handling\n- **Animation** - Framer Motion for smooth UI animations\n- **Testing** - Jest and React Testing Library setup\n\n## 📋 Prerequisites\n\n- Node.js (v14.x or higher)\n` 
    },
    { 
      name: '.env', 
      path: '.env', 
      type: 'env', 
      content: `VITE_API_URL=https://api.lucid.dev\nVITE_WS_PORT=3000\n` 
    },
    { 
      name: '.gitignore', 
      path: '.gitignore', 
      type: 'git', 
      content: `node_modules/\ndist/\n.env\n.env.local\n.env.development.local\n` 
    },
    { 
      name: 'index.html', 
      path: 'index.html', 
      type: 'html', 
      content: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <link rel="icon" type="image/svg+xml" href="/vite.svg" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Lucid React App</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n` 
    },
    { 
      name: 'jsconfig.json', 
      path: 'jsconfig.json', 
      type: 'json', 
      content: `{\n  "compilerOptions": {\n    "target": "ESNext",\n    "module": "ESNext",\n    "moduleResolution": "Node",\n    "strict": true,\n    "jsx": "preserve",\n    "baseUrl": ".",\n    "paths": {\n      "@/*": ["src/*"]\n    }\n  }\n}\n` 
    },
    { 
      name: 'package-lock.json', 
      path: 'package-lock.json', 
      type: 'json', 
      content: `{\n  "name": "lucid-generated-app",\n  "version": "1.0.0",\n  "lockfileVersion": 3,\n  "requires": true,\n  "packages": {\n    "": {\n      "name": "lucid-generated-app"\n    }\n  }\n}\n` 
    },
    { 
      name: 'package.json', 
      path: 'package.json', 
      type: 'json', 
      content: `{\n  "name": "lucid-generated-app",\n  "private": true,\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "tsc && vite build",\n    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "react": "^18.3.1",\n    "react-dom": "^18.3.1",\n    "framer-motion": "^11.2.10",\n    "lucide-react": "^0.395.0"\n  },\n  "devDependencies": {\n    "vite": "^5.2.11",\n    "typescript": "^5.2.2",\n    "tailwindcss": "^3.4.3"\n  }\n}\n` 
    },
    { 
      name: 'postcss.config.js', 
      path: 'postcss.config.js', 
      type: 'js', 
      content: `export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n}\n` 
    },
    { 
      name: 'tailwind.config.js', 
      path: 'tailwind.config.js', 
      type: 'js', 
      content: `/** @type {import('tailwindcss').Config} */\nexport default {\n  content: [\n    "./index.html",\n    "./src/**/*.{js,ts,jsx,tsx}",\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}\n` 
    },
    { 
      name: 'vite.config.mjs', 
      path: 'vite.config.mjs', 
      type: 'js', 
      content: `import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    port: 3000,\n    host: '0.0.0.0'\n  }\n})\n` 
    },
    
    // public folder
    {
      name: 'favicon.ico',
      path: 'public/favicon.ico',
      type: 'env',
      content: `[Binary icon content]`
    },
    {
      name: 'logo.png',
      path: 'public/logo.png',
      type: 'env',
      content: `[Binary asset logo]`
    },

    // src folder
    {
      name: 'main.tsx',
      path: 'src/main.tsx',
      type: 'ts',
      content: `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App.tsx'\nimport './index.css'\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n)\n`
    },
    {
      name: 'index.css',
      path: 'src/index.css',
      type: 'css',
      content: `@import "tailwindcss";\n\nbody {\n  background-color: #030305;\n  color: #f3f4f6;\n  font-family: 'Barlow', sans-serif;\n}\n`
    },
    {
      name: 'App.tsx',
      path: 'src/App.tsx',
      type: 'ts',
      content: `import React from 'react';\nimport MainView from './${activeAppFileName.replace('.tsx', '')}';\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">\n      <MainView />\n    </div>\n  );\n}\n`
    },
    {
      name: activeAppFileName,
      path: `src/${activeAppFileName}`,
      type: 'tsx',
      content: `import React, { useState } from 'react';\nimport { Sparkles, Check, Play, Terminal } from 'lucide-react';\n\n// Compiled live container for ${activeAppTitle}\nexport default function InteractiveContainer() {\n  const [isActive, setIsActive] = useState(false);\n\n  return (\n    <div className="p-8 max-w-lg mx-auto rounded-3xl bg-zinc-900/60 border border-white/5 backdrop-blur-md text-center mt-10 shadow-xl">\n      <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">\n        <Sparkles className="w-6 h-6 animate-pulse" />\n      </div>\n      <h1 className="text-xl font-bold text-white mb-2">${activeAppTitle} Sandbox App</h1>\n      <p className="text-zinc-400 text-xs mb-6">Fully compiled and running inside standard secure container at port 3000.</p>\n      <button \n        onClick={() => setIsActive(!isActive)}\n        className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-full font-bold text-xs transition-all shadow-md cursor-pointer border-none"\n      >\n        {isActive ? 'Sandbox Activated' : 'Trigger Vibe State'}\n      </button>\n    </div>\n  );\n}\n`
    }
  ];

  // Helper to get active file by path name
  const activeFile = filesList.find(f => f.name === selectedFile || f.path === selectedFile) || filesList[0];

  // Search filter
  const filteredRootFiles = filesList.filter(file => {
    if (file.path.startsWith('public/') || file.path.startsWith('src/')) return false;
    return file.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredPublicFiles = filesList.filter(file => {
    if (!file.path.startsWith('public/')) return false;
    return file.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredSrcFiles = filesList.filter(file => {
    if (!file.path.startsWith('src/')) return false;
    return file.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Custom code highlights
  const renderMarkdownLine = (line: string) => {
    if (line.startsWith('# ')) {
      return (
        <span className="text-blue-600 font-extrabold font-sans text-xs">
          <span className="text-zinc-400 mr-1">#</span>{line.substring(2)}
        </span>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <span className="text-blue-600 font-bold font-sans text-[11px] block mt-2">
          <span className="text-zinc-400 mr-1">##</span>{line.substring(3)}
        </span>
      );
    }
    if (line.startsWith('- ')) {
      const match = line.match(/^(-\s+)\*\*([^*]+)\*\*(.*)$/);
      if (match) {
        return (
          <span className="text-zinc-800 font-sans text-[11px]">
            <span className="text-zinc-400 mr-1.5">-</span>
            <span className="font-extrabold text-black">{match[2]}</span>
            <span className="text-zinc-600">{match[3]}</span>
          </span>
        );
      }
    }
    return <span className="text-zinc-600 font-sans text-[11px]">{line}</span>;
  };

  const renderCodeLine = (line: string, fileType: string) => {
    if (fileType === 'md') {
      return renderMarkdownLine(line);
    }

    if (fileType === 'json') {
      // Simple JSON highlight
      const parts = line.split(/(".*?"\s*:)/);
      return (
        <span className="text-zinc-800 text-[11px] font-mono">
          {parts.map((part, i) => {
            if (part.endsWith(':')) {
              return <span key={i} className="text-indigo-600 font-semibold">{part}</span>;
            }
            if (part.trim().startsWith('"') && part.trim().endsWith('"')) {
              return <span key={i} className="text-emerald-600">{part}</span>;
            }
            return <span key={i}>{part}</span>;
          })}
        </span>
      );
    }

    // Default code highlight (js, ts, tsx)
    const words = line.split(/(\b(?:import|export|const|let|function|default|return|from|class|extends|async|await|const|var|if|else|switch|case|break)\b)/);
    return (
      <span className="text-zinc-800 text-[11px] font-mono">
        {words.map((word, i) => {
          if (['import', 'export', 'const', 'let', 'function', 'default', 'return', 'from', 'class', 'extends', 'async', 'await', 'if', 'else', 'switch', 'case', 'break'].includes(word)) {
            return <span key={i} className="text-purple-600 font-semibold">{word}</span>;
          }
          if (word.startsWith('//') || word.startsWith('/*')) {
            return <span key={i} className="text-zinc-400 italic">{word}</span>;
          }
          // Check if string literal
          if (word.startsWith('"') || word.startsWith("'") || word.startsWith('`')) {
            return <span key={i} className="text-emerald-600">{word}</span>;
          }
          return <span key={i}>{word}</span>;
        })}
      </span>
    );
  };

  const lines = activeFile.content.split('\n');

  // File type icon resolver
  const renderFileIcon = (file: FileItem) => {
    if (file.type === 'md') return <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    if (file.type === 'json') return <FileCode className="w-3.5 h-3.5 text-yellow-500 shrink-0" />;
    if (file.type === 'js' || file.type === 'ts' || file.type === 'tsx') return <FileCode className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
    if (file.type === 'html') return <FileCode className="w-3.5 h-3.5 text-orange-500 shrink-0" />;
    if (file.type === 'css') return <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    if (file.type === 'git') return <FileText className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
    return <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
  };

  return (
    <div className="flex-1 bg-[#030305] flex flex-row h-full min-h-[500px] border border-white/[0.06] overflow-hidden rounded-[1.5rem] select-none text-left font-sans shadow-2xl backdrop-blur-lg">
      
      {/* 1. LEFT PANE - FILE EXPLORER */}
      <aside className="w-52 bg-[#0a0a0c]/80 border-r border-white/[0.05] flex flex-col h-full shrink-0 backdrop-blur-sm">
        
        {/* Explorer Header */}
        <div className="p-3 pb-2.5 flex items-center justify-between border-b border-white/[0.02]">
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase font-sans">Explorer</span>
          <button 
            onClick={() => alert("File copy initiated")}
            className="p-1 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white transition-all bg-transparent border-none cursor-pointer"
            title="Duplicate workspace"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>

        {/* Search Files Input */}
        <div className="p-2 border-b border-white/[0.02]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full bg-[#16161a] hover:bg-[#1f1f24] focus:bg-[#1f1f24] border border-white/10 rounded-full pl-7 pr-2.5 py-1 text-[10.5px] text-zinc-300 placeholder-zinc-500 font-sans outline-none transition-all"
            />
          </div>
        </div>

        {/* Files Structure List */}
        <div className="flex-1 overflow-y-auto py-2 px-1 text-[11px] font-medium custom-scrollbar space-y-0.5">
          
          {/* Folders List */}
          {/* public folder */}
          <div className="space-y-0.5">
            <button 
              onClick={() => setIsPublicExpanded(!isPublicExpanded)}
              className="w-full text-left flex items-center gap-1.5 px-2 py-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors bg-transparent border-none cursor-pointer"
            >
              {isPublicExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <Folder className="w-3.5 h-3.5 text-indigo-500/70 shrink-0" />
              <span>public</span>
            </button>
            {isPublicExpanded && (
              <div className="pl-5 space-y-0.5 border-l border-white/5 ml-3">
                {filteredPublicFiles.map(file => (
                  <button 
                    key={file.path}
                    onClick={() => setSelectedFile(file.path)}
                    className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded-full transition-all bg-transparent border-none cursor-pointer ${
                      selectedFile === file.path ? 'bg-indigo-500/20 text-indigo-200 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {renderFileIcon(file)}
                    <span className="truncate">{file.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* src folder */}
          <div className="space-y-0.5">
            <button 
              onClick={() => setIsSrcExpanded(!isSrcExpanded)}
              className="w-full text-left flex items-center gap-1.5 px-2 py-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors bg-transparent border-none cursor-pointer"
            >
              {isSrcExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <Folder className="w-3.5 h-3.5 text-indigo-500/70 shrink-0" />
              <span>src</span>
            </button>
            {isSrcExpanded && (
              <div className="pl-5 space-y-0.5 border-l border-white/5 ml-3">
                {filteredSrcFiles.map(file => (
                  <button 
                    key={file.path}
                    onClick={() => setSelectedFile(file.path)}
                    className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded-full transition-all bg-transparent border-none cursor-pointer ${
                      selectedFile === file.path ? 'bg-indigo-500/20 text-indigo-200 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {renderFileIcon(file)}
                    <span className="truncate">{file.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Root Level Files */}
          {filteredRootFiles.map(file => (
            <button 
              key={file.path}
              onClick={() => setSelectedFile(file.path)}
              className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded-full transition-all bg-transparent border-none cursor-pointer ${
                selectedFile === file.path || selectedFile === file.name ? 'bg-indigo-500/20 text-indigo-200 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {renderFileIcon(file)}
              <span className="truncate">{file.name}</span>
            </button>
          ))}

        </div>

      </aside>

      {/* 2. MAIN WORKSPACE / EDITOR + LOGS */}
      <main className="flex-1 flex flex-col h-full bg-[#030305] overflow-hidden min-w-0">
        
        {/* Editor Tab Bar Header */}
        <div className="h-9 bg-[#0a0a0c]/80 border-b border-white/[0.05] flex items-center justify-between px-3 shrink-0">
          <div className="flex items-center h-full">
            <div className="h-full px-3.5 bg-[#16161a] border-r border-white/5 flex items-center gap-1.5 text-[11px] font-bold text-zinc-300 rounded-tr-lg">
              {renderFileIcon(activeFile)}
              <span>{activeFile.name}</span>
              <button 
                onClick={() => setSelectedFile('README.md')}
                className="p-0.5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-zinc-200 transition-colors bg-transparent border-none cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
          
          {/* Close preview mockup */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 text-zinc-200 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10 shadow-sm"
              title="Close codebase inspection and return to live website preview"
            >
              <Eye className="w-3 h-3 text-zinc-400" />
              <span>Preview Live Site</span>
            </button>
          </div>
        </div>

        {/* Selected file label */}
        <div className="px-5 py-2 bg-[#0a0a0c]/50 text-[11px] font-semibold text-zinc-500 font-sans border-b border-white/[0.05] select-text">
          {activeFile.path}
        </div>

        {/* Text Code Editor content container */}
        <div className="flex-1 flex flex-row overflow-hidden bg-[#030305] select-text relative">
          
          {/* Editor Body */}
          <div className="flex-1 overflow-y-auto py-4 font-mono leading-relaxed custom-scrollbar flex flex-col h-full max-h-[420px] min-h-[250px]">
            {lines.map((line, idx) => (
              <div key={idx} className="flex gap-4 px-1 group hover:bg-white/5">
                {/* Line count column */}
                <span className="w-8 text-right select-none text-zinc-700 group-hover:text-zinc-500 font-mono text-[10.5px] pr-2.5 border-r border-white/5 shrink-0">
                  {idx + 1}
                </span>
                {/* High-fidelity formatted line content */}
                <div className="flex-1 whitespace-pre leading-5">
                  {renderCodeLine(line, activeFile.type)}
                </div>
              </div>
            ))}
          </div>

          {/* Minimap Scroll map column matching VS Code exact screenshots */}
          <div className="w-14 border-l border-white/5 shrink-0 hidden sm:flex flex-col py-3 px-1 bg-[#0a0a0c]/50 gap-0.5 select-none overflow-hidden h-full">
            {lines.map((_, i) => (
              <div 
                key={i} 
                className={`h-0.5 rounded-full ${
                  i % 4 === 0 ? 'w-8 bg-zinc-800' :
                  i % 3 === 0 ? 'w-6 bg-zinc-800' :
                  i % 5 === 0 ? 'w-10 bg-indigo-500/30' :
                  'w-4 bg-zinc-900'
                }`} 
              />
            ))}
          </div>

        </div>

        {/* 3. LOGS TERMINAL FOOTER PANEL */}
        <div className="border-t border-white/[0.05] shrink-0 bg-[#0a0a0c]/80 flex flex-col overflow-hidden">
          
          {/* Logs Header banner */}
          <div 
            onClick={() => setIsLogsMinimized(!isLogsMinimized)}
            className="px-4 py-2 flex items-center justify-between cursor-pointer border-b border-white/[0.05] hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[10.5px] font-bold text-zinc-400 tracking-wide font-sans">Logs</span>
            </div>
            <button className="text-zinc-500 hover:text-zinc-200 bg-transparent border-none">
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLogsMinimized ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Logs Output logs console body */}
          {!isLogsMinimized && (
            <div className="p-4 bg-[#030305] text-zinc-400 font-mono text-[11px] leading-relaxed flex flex-col gap-1.5 select-text text-left max-h-[140px] overflow-y-auto custom-scrollbar">
              <div className="text-zinc-600">Welcome to Logs Terminal</div>
              <div className="flex items-start">
                <span className="text-zinc-700 mr-2 shrink-0">$</span>
                <span className="text-red-500 font-medium font-sans">Terminal initialization failed..</span>
              </div>
              <div className="flex items-center">
                <span className="text-zinc-700 mr-2 shrink-0">$</span>
                <span className="w-1.5 h-3.5 bg-zinc-500/80 animate-[ping_1.2s_infinite] shrink-0" />
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
};
