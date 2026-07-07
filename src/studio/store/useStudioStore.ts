import { create } from 'zustand';
import { User, AIState, Project, AppNotification } from '../types';

interface StudioState {
  user: User;
  currentProject: Project;
  aiState: AIState;
  isSidebarExpanded: boolean;
  showPricingModal: boolean;
  showOnboardingModal: boolean;
  showSettingsModal: boolean;
  currentView: 'chat' | 'settings' | 'all_apps' | 'vibe';
  activeSettingsTab: string;
  notifications: AppNotification[];
  glowFeatureEnabled: boolean;
  finishSoundEnabled: boolean;
  
  setUser: (user: User) => void;
  setProject: (project: Project) => void;
  setAIState: (state: Partial<AIState>) => void;
  toggleSidebar: () => void;
  setShowPricingModal: (open: boolean) => void;
  setShowOnboardingModal: (open: boolean) => void;
  setShowSettingsModal: (open: boolean) => void;
  setCurrentView: (view: 'chat' | 'settings' | 'all_apps' | 'vibe') => void;
  setActiveSettingsTab: (tab: string) => void;
  setGlowFeatureEnabled: (enabled: boolean) => void;
  setFinishSoundEnabled: (enabled: boolean) => void;
  
  // Notification actions
  addNotification: (type: 'ai' | 'billing' | 'error' | 'info', title: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // Credit actions
  addCredits: (amount: number) => void;
  setPackageCredits: (maxAmount: number) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  user: {
    id: 'u1',
    name: 'Fleetyre',
    email: 'fleetyre77@gmail.com',
    credits: 428,
    maxCredits: 428,
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
  isSidebarExpanded: true,
  showPricingModal: false,
  showOnboardingModal: false,
  showSettingsModal: false,
  currentView: 'chat',
  activeSettingsTab: 'general',
  glowFeatureEnabled: false,
  finishSoundEnabled: true,
  
  notifications: [],

  setUser: (user) => set({ user }),
  setProject: (currentProject) => set({ currentProject }),
  setAIState: (state) => set((prev) => ({ aiState: { ...prev.aiState, ...state } })),
  toggleSidebar: () => set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
  setShowPricingModal: (open) => set({ showPricingModal: open }),
  setShowOnboardingModal: (open) => {
    if (!open && typeof window !== 'undefined') {
      localStorage.setItem('lucid_onboarding_seen_v2', 'true');
    }
    set({ showOnboardingModal: open });
  },
  setShowSettingsModal: (open) => set({ showSettingsModal: open }),
  setCurrentView: (currentView) => set({ currentView }),
  setActiveSettingsTab: (activeSettingsTab) => set({ activeSettingsTab }),
  setGlowFeatureEnabled: (glowFeatureEnabled) => set({ glowFeatureEnabled }),
  setFinishSoundEnabled: (finishSoundEnabled) => set({ finishSoundEnabled }),
  
  addNotification: (type, title, message) => {},
  
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),
  
  markAllNotificationsAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  })),
  
  clearNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
  
  clearAllNotifications: () => set({ notifications: [] }),

  addCredits: (amount) => set((state) => ({
    user: {
      ...state.user,
      credits: state.user.credits + amount,
      maxCredits: state.user.maxCredits + amount
    }
  })),

  setPackageCredits: (maxAmount) => set((state) => ({
    user: {
      ...state.user,
      credits: maxAmount,
      maxCredits: maxAmount
    }
  }))
}));
