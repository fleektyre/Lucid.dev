import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Layers, 
  Sparkles, 
  Palette, 
  Image as ImageIcon, 
  Rocket, 
  Users, 
  CreditCard, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';

const navItems = [
  { id: 'workspace', label: 'Workspace', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: Layers },
  { id: 'builder', label: 'AI Builder', icon: Sparkles },
  { id: 'ui', label: 'UI Generator', icon: Palette },
  { id: 'screenshot', label: 'Screenshot to Code', icon: ImageIcon },
  { id: 'deployments', label: 'Deployments', icon: Rocket },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { isSidebarExpanded, toggleSidebar } = useStudioStore();
  const [activeItem, setActiveItem] = React.useState('workspace');

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarExpanded ? 280 : 92 }}
      className="fixed left-6 top-6 bottom-6 lucid-glass rounded-[32px] z-50 flex flex-col p-4 shadow-2xl overflow-hidden"
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-3 mb-12 h-12">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
          <div className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
        </div>
        <AnimatePresence>
          {isSidebarExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-fustat font-semibold text-xl tracking-tight"
            >
              Lucid
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar px-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all relative group
              ${activeItem === item.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}
            `}
          >
            <item.icon className={`w-6 h-6 shrink-0 ${activeItem === item.id ? 'text-accent' : ''}`} />
            {isSidebarExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
            
            {activeItem === item.id && (
              <motion.div
                layoutId="navActive"
                className="absolute left-0 w-1 h-6 bg-accent rounded-r-full shadow-[0_0_10px_rgba(90,225,76,0.8)]"
              />
            )}
            
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-white/[0.03] -z-10 blur-sm" />
          </button>
        ))}
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="mt-4 w-full flex items-center justify-center p-3 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
      >
        {isSidebarExpanded ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
      </button>
    </motion.aside>
  );
};
