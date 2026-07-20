import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowUpDown, 
  ChevronDown, 
  LayoutGrid, 
  List, 
  Plus, 
  Check, 
  Sparkles, 
  Globe, 
  User, 
  Eye, 
  FolderSync 
} from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';

export interface AllAppsViewProps {
  isLoading?: boolean;
}

export const AllAppsView: React.FC<AllAppsViewProps> = ({ isLoading = false }) => {
  const { addNotification, setCurrentView, setShowCreateAppModal } = useStudioStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<'default' | 'name' | 'edited'>('default');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'deployed'>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [creatorFilter, setCreatorFilter] = useState<'all' | 'me' | 'team'>('all');

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  const [showCreatorDropdown, setShowCreatorDropdown] = useState(false);

  // App definitions matching the screenshot and AIPanel mockups
  const apps = [
    {
      id: 'app-1',
      name: 'Black & White Launch',
      status: 'deployed',
      visibility: 'public',
      creator: 'me',
      editedText: 'Edited 1 day ago',
      editedDays: 1,
      thumbnailType: 'bw_launch'
    },
    {
      id: 'app-2',
      name: 'SaaS Analytics Hub',
      status: 'active',
      visibility: 'private',
      creator: 'me',
      editedText: 'Edited 2 hours ago',
      editedDays: 0.1,
      thumbnailType: 'analytics'
    },
    {
      id: 'app-3',
      name: 'Celestial Vibe Portal',
      status: 'active',
      visibility: 'public',
      creator: 'team',
      editedText: 'Edited yesterday',
      editedDays: 1.2,
      thumbnailType: 'celestial'
    }
  ];

  // Filters & Sorting logic
  const filteredApps = apps
    .filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesVisibility = visibilityFilter === 'all' || app.visibility === visibilityFilter;
      const matchesCreator = creatorFilter === 'all' || app.creator === creatorFilter;
      return matchesSearch && matchesStatus && matchesVisibility && matchesCreator;
    })
    .sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortOption === 'edited') {
        return a.editedDays - b.editedDays;
      }
      return 0; // Default
    });

  const handleCreateNewApp = () => {
    addNotification(
      'info',
      'App Synthesis Started',
      'Initializing a fresh sandboxed application blueprint in your workspace environment.'
    );
    setShowCreateAppModal(true);
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6 animate-fadeIn font-sans text-zinc-300 max-w-[950px] mx-auto select-none animate-pulse">
        {/* Header Block with Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.04] pb-6">
          <div>
            <div className="h-8 w-40 bg-white/5 rounded-lg mb-2" />
            <div className="h-4 w-72 bg-white/5 rounded-full" />
          </div>
          <div className="h-10 w-36 bg-white/5 rounded-full" />
        </div>

        {/* Control Bar Skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/40 border border-zinc-900/60 p-3 rounded-2xl">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            <div className="h-9 w-48 bg-white/5 rounded-xl" />
            <div className="h-9 w-28 bg-white/5 rounded-xl" />
            <div className="h-9 w-24 bg-white/5 rounded-xl" />
            <div className="h-9 w-28 bg-white/5 rounded-xl" />
          </div>
          <div className="flex gap-2.5">
            <div className="w-9 h-9 bg-white/5 rounded-xl" />
            <div className="w-9 h-9 bg-white/5 rounded-xl" />
          </div>
        </div>

        {/* Grid of Apps Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-zinc-900/40 border border-white/[0.04] rounded-[24px] p-4 flex flex-col gap-4">
              <div className="w-full aspect-[4/3] bg-white/5 rounded-[20px]" />
              <div className="flex flex-col gap-2 px-1">
                <div className="h-4 w-2/3 bg-white/5 rounded-full" />
                <div className="flex items-center justify-between mt-1">
                  <div className="h-3.5 w-24 bg-white/5 rounded-full" />
                  <div className="h-5 w-16 bg-white/5 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn font-sans text-zinc-300 max-w-[950px] mx-auto select-none">
      
      {/* Header Block with Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight font-sans">All Apps</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Browse, search, and manage your sandbox environment applications.
          </p>
        </div>

        {/* Back to chat / Create new app */}
        <button
          onClick={handleCreateNewApp}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-[0.98] border border-white/10"
        >
          <Plus className="w-4 h-4 text-white shrink-0" />
          <span>Create new app</span>
        </button>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/40 border border-zinc-900/60 p-3 rounded-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          
          {/* Search Field */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/60 border border-zinc-850 focus:border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none placeholder:text-zinc-500 transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSortDropdown(!showSortDropdown);
                setShowStatusDropdown(false);
                setShowVisibilityDropdown(false);
                setShowCreatorDropdown(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900/40 border border-zinc-850 hover:border-zinc-750 text-xs font-medium text-zinc-300 rounded-xl transition-all cursor-pointer focus:outline-none"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
              <span>{sortOption === 'default' ? 'Default' : sortOption === 'name' ? 'Alphabetical' : 'Recently Edited'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            <AnimatePresence>
              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 mt-1.5 w-44 bg-[#0a0a0c] border border-zinc-800 rounded-xl p-1 shadow-xl z-50 flex flex-col gap-0.5"
                  >
                    {[
                      { value: 'default', label: 'Default' },
                      { value: 'name', label: 'Alphabetical' },
                      { value: 'edited', label: 'Recently Edited' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortOption(opt.value as any);
                          setShowSortDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition-all flex items-center justify-between"
                      >
                        <span>{opt.label}</span>
                        {sortOption === opt.value && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowSortDropdown(false);
                setShowVisibilityDropdown(false);
                setShowCreatorDropdown(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900/40 border border-zinc-850 hover:border-zinc-750 text-xs font-medium text-zinc-300 rounded-xl transition-all cursor-pointer focus:outline-none"
            >
              <span>{statusFilter === 'all' ? 'All' : statusFilter === 'active' ? 'Active' : 'Deployed'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            <AnimatePresence>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowStatusDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 mt-1.5 w-36 bg-[#0a0a0c] border border-zinc-800 rounded-xl p-1 shadow-xl z-50 flex flex-col gap-0.5"
                  >
                    {[
                      { value: 'all', label: 'All' },
                      { value: 'active', label: 'Active' },
                      { value: 'deployed', label: 'Deployed' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setStatusFilter(opt.value as any);
                          setShowStatusDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition-all flex items-center justify-between"
                      >
                        <span>{opt.label}</span>
                        {statusFilter === opt.value && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Visibility Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowVisibilityDropdown(!showVisibilityDropdown);
                setShowSortDropdown(false);
                setShowStatusDropdown(false);
                setShowCreatorDropdown(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900/40 border border-zinc-850 hover:border-zinc-750 text-xs font-medium text-zinc-300 rounded-xl transition-all cursor-pointer focus:outline-none"
            >
              <span>{visibilityFilter === 'all' ? 'All visibility' : visibilityFilter === 'public' ? 'Public' : 'Private'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            <AnimatePresence>
              {showVisibilityDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowVisibilityDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 mt-1.5 w-40 bg-[#0a0a0c] border border-zinc-800 rounded-xl p-1 shadow-xl z-50 flex flex-col gap-0.5"
                  >
                    {[
                      { value: 'all', label: 'All visibility' },
                      { value: 'public', label: 'Public' },
                      { value: 'private', label: 'Private' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setVisibilityFilter(opt.value as any);
                          setShowVisibilityDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition-all flex items-center justify-between"
                      >
                        <span>{opt.label}</span>
                        {visibilityFilter === opt.value && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Creators Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCreatorDropdown(!showCreatorDropdown);
                setShowSortDropdown(false);
                setShowStatusDropdown(false);
                setShowVisibilityDropdown(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900/40 border border-zinc-850 hover:border-zinc-750 text-xs font-medium text-zinc-300 rounded-xl transition-all cursor-pointer focus:outline-none"
            >
              <span>{creatorFilter === 'all' ? 'All creators' : creatorFilter === 'me' ? 'Only Me' : 'Team Members'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            <AnimatePresence>
              {showCreatorDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowCreatorDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 mt-1.5 w-40 bg-[#0a0a0c] border border-zinc-800 rounded-xl p-1 shadow-xl z-50 flex flex-col gap-0.5"
                  >
                    {[
                      { value: 'all', label: 'All creators' },
                      { value: 'me', label: 'Only Me' },
                      { value: 'team', label: 'Team Members' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setCreatorFilter(opt.value as any);
                          setShowCreatorDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition-all flex items-center justify-between"
                      >
                        <span>{opt.label}</span>
                        {creatorFilter === opt.value && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* View Mode Toggle Button Group */}
        <div className="flex items-center bg-zinc-900/80 p-1 border border-zinc-850 rounded-xl self-end md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer focus:outline-none ${viewMode === 'grid' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer focus:outline-none ${viewMode === 'list' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Apps Display List / Grid */}
      {filteredApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 py-20 border border-dashed border-zinc-850 rounded-3xl text-center gap-3">
          <FolderSync className="w-10 h-10 text-zinc-600 animate-pulse" />
          <p className="text-sm font-semibold text-white">No applications match your search criteria</p>
          <p className="text-xs text-zinc-500 max-w-sm">
            Try resetting your search filters or input keyword queries to look up other sandboxed apps.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredApps.map((app) => (
            <div 
              key={app.id}
              onClick={() => {
                addNotification(
                  'info', 
                  'Workspace App Loaded', 
                  `Loading and executing runtime components for: "${app.name}"`
                );
                setCurrentView('chat');
              }}
              className="bg-[#121214]/40 border border-white/[0.06] hover:border-white/12 rounded-[1.25rem] p-3.5 flex flex-col gap-3.5 transition-all duration-300 hover:translate-y-[-3px] group relative overflow-hidden backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              
              {/* Conditional high fidelity thumbnail rendering */}
              {app.thumbnailType === 'bw_launch' && (
                <div className="aspect-[16/10] bg-[#fafafc] rounded-xl border border-black/5 overflow-hidden flex flex-col justify-between p-3 relative select-none">
                  <div className="flex items-center justify-between">
                    <span className="text-[7px] font-black text-black tracking-tighter">Apex</span>
                    <div className="flex items-center gap-1.5 text-[5px] text-zinc-500 font-semibold scale-90">
                      <span>Product</span>
                      <span>Features</span>
                      <span>Pricing</span>
                      <span>About</span>
                    </div>
                    <div className="flex items-center gap-1 scale-85">
                      <span className="text-[4px] text-zinc-700 font-bold px-1 py-0.5 rounded bg-zinc-100">Sign in</span>
                      <span className="text-[4px] text-white font-bold px-1.5 py-0.5 rounded bg-black">Get started</span>
                    </div>
                  </div>

                  <div className="text-center my-auto flex flex-col items-center gap-1">
                    <span className="text-[4px] font-bold text-zinc-400 bg-zinc-100 px-1 py-0.5 rounded uppercase tracking-wider">NOW IN PUBLIC BETA</span>
                    <h3 className="text-xs font-black text-black leading-none tracking-tight mt-1 max-w-[110px]">
                      Build faster. Ship smarter.
                    </h3>
                    <p className="text-[4.5px] text-zinc-500 leading-normal max-w-[120px] mt-1 scale-90">
                      The platform that eliminates friction between your idea and your users. Simply by design, powerful at scale.
                    </p>
                  </div>

                  <div className="grid grid-cols-7 gap-1 w-full border-t border-zinc-150 pt-1.5 px-2">
                    {Array.from({ length: 14 }).map((_, idx) => (
                      <div key={idx} className="aspect-square relative overflow-hidden bg-zinc-50 border border-zinc-100/60 rounded">
                        {idx % 3 === 0 && <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />}
                        {idx % 3 === 1 && <div className="absolute inset-0 bg-zinc-300" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />}
                        {idx % 3 === 2 && <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {app.thumbnailType === 'analytics' && (
                <div className="aspect-[16/10] bg-[#0c0c0e] rounded-xl border border-white/5 overflow-hidden flex flex-col justify-between p-3 relative select-none">
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-1">
                    <span className="text-[7px] font-bold text-white/95">Nucleus</span>
                    <span className="text-[5px] text-zinc-400">v1.2.4</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1.5 my-auto">
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded p-1 flex flex-col gap-0.5">
                      <span className="text-[4px] text-zinc-500">MAU</span>
                      <span className="text-[8px] font-bold text-emerald-400">+14.2%</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded p-1 flex flex-col gap-0.5">
                      <span className="text-[4px] text-zinc-500">ARR</span>
                      <span className="text-[8px] font-bold text-sky-400">$84.2k</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded p-1 flex flex-col gap-0.5">
                      <span className="text-[4px] text-zinc-500">VIBE</span>
                      <span className="text-[8px] font-bold text-purple-400">99.8%</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-1 w-full px-1 border-t border-white/[0.04] pt-1.5">
                    {[30, 60, 45, 90, 75, 50, 85, 95, 40, 70].map((h, i) => (
                      <div key={i} className="bg-white/10 rounded-t w-full" style={{ height: `${h * 0.15}px` }}>
                        {i === 7 && <div className="bg-sky-400 w-full h-full rounded-t" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {app.thumbnailType === 'celestial' && (
                <div className="aspect-[16/10] bg-gradient-to-br from-[#0c051a] to-[#04020a] rounded-xl border border-white/5 overflow-hidden flex flex-col justify-between p-3 relative select-none">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0,transparent_70%)]" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[7px] font-serif italic text-purple-200">Cosmic</span>
                    <span className="text-[4px] text-zinc-400 bg-white/5 px-1 py-0.5 rounded">ONLINE</span>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 border border-purple-400/30 m-auto relative z-10 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center">
                      <span className="text-[6px] text-purple-200 font-bold">VIBE</span>
                    </div>
                  </div>

                  <span className="text-[5px] text-zinc-500 text-center relative z-10">Orbit: Active Sync Pipeline</span>
                </div>
              )}

              {/* Card Meta Details */}
              <div className="flex flex-col text-left px-0.5 mt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{app.name}</span>
                  {app.status === 'deployed' ? (
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                      Deployed
                    </span>
                  ) : (
                    <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full font-semibold">
                      Active
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-2.5 text-[10px] text-zinc-500">
                  <span className="font-medium">{app.editedText}</span>
                  <span className="font-semibold uppercase tracking-wider text-[8px] bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                    {app.visibility}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="flex flex-col gap-3 w-full">
          {filteredApps.map((app) => (
            <div 
              key={app.id}
              onClick={() => {
                addNotification(
                  'info', 
                  'Workspace App Loaded', 
                  `Loading and executing runtime components for: "${app.name}"`
                );
                setCurrentView('chat');
              }}
              className="w-full bg-[#121214]/40 border border-white/[0.04] hover:border-white/10 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 hover:translate-x-1 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-850 rounded-xl flex items-center justify-center text-zinc-500 shrink-0">
                  {app.thumbnailType === 'bw_launch' && <Sparkles className="w-5 h-5 text-zinc-400" />}
                  {app.thumbnailType === 'analytics' && <Globe className="w-5 h-5 text-zinc-400" />}
                  {app.thumbnailType === 'celestial' && <User className="w-5 h-5 text-zinc-400" />}
                </div>
                
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-white">{app.name}</span>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>{app.editedText}</span>
                    <span>•</span>
                    <span className="capitalize">{app.visibility} visibility</span>
                    <span>•</span>
                    <span className="capitalize">Created by {app.creator === 'me' ? 'me' : 'team'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {app.status === 'deployed' ? (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                    Deployed
                  </span>
                ) : (
                  <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                    Active
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
