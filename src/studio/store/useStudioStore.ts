import { create } from 'zustand';
import { User, AIState, Project } from '../types';

interface StudioState {
  user: User;
  currentProject: Project;
  aiState: AIState;
  isSidebarExpanded: boolean;
  
  setUser: (user: User) => void;
  setProject: (project: Project) => void;
  setAIState: (state: Partial<AIState>) => void;
  toggleSidebar: () => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  user: {
    id: 'u1',
    name: 'Fleetyre',
    email: 'fleetyre77@gmail.com',
    credits: 428,
    maxCredits: 1200,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
  },
  currentProject: {
    id: 'p1',
    name: 'Untitled Project',
    status: 'active',
    lastModified: '2026-05-21'
  },
  aiState: {
    isTyping: false,
    status: 'Lucid AI Active',
    latency: 12,
    model: 'GPT-4o'
  },
  isSidebarExpanded: false,

  setUser: (user) => set({ user }),
  setProject: (currentProject) => set({ currentProject }),
  setAIState: (state) => set((prev) => ({ aiState: { ...prev.aiState, ...state } })),
  toggleSidebar: () => set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
}));
