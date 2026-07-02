import { create } from 'zustand';
import { User, AIState, Project, AppNotification } from '../types';

interface StudioState {
  user: User;
  currentProject: Project;
  aiState: AIState;
  isSidebarExpanded: boolean;
  showPricingModal: boolean;
  showOnboardingModal: boolean;
  currentView: 'chat' | 'settings';
  activeSettingsTab: string;
  notifications: AppNotification[];
  
  setUser: (user: User) => void;
  setProject: (project: Project) => void;
  setAIState: (state: Partial<AIState>) => void;
  toggleSidebar: () => void;
  setShowPricingModal: (open: boolean) => void;
  setShowOnboardingModal: (open: boolean) => void;
  setCurrentView: (view: 'chat' | 'settings') => void;
  setActiveSettingsTab: (tab: string) => void;
  
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
  currentView: 'chat',
  activeSettingsTab: 'general',
  
  // Seed initial notifications representing user requirements: AI completion, billing, errors
  notifications: [
    {
      id: 'nt-1',
      type: 'ai',
      title: 'AI Generation Completed',
      message: 'The custom glass pill compilation pipeline for lucid.dev completed successfully in 842ms.',
      read: false,
      timestamp: '5 mins ago'
    },
    {
      id: 'nt-2',
      type: 'billing',
      title: 'Billing Refill Initiated',
      message: 'Paystack Sandbox transfer confirmed: +500 compute credits allocated to your workspace.',
      read: false,
      timestamp: '1 hour ago'
    },
    {
      id: 'nt-3',
      type: 'error',
      title: 'Sync Pipeline Interrupted',
      message: 'Error: Connection timed out while trying to establish live workspace sockets.',
      read: true,
      timestamp: '1 day ago'
    }
  ],

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
  setCurrentView: (currentView) => set({ currentView }),
  setActiveSettingsTab: (activeSettingsTab) => set({ activeSettingsTab }),
  
  addNotification: (type, title, message) => set((state) => {
    const newNotif: AppNotification = {
      id: `nt-${Date.now()}`,
      type,
      title,
      message,
      read: false,
      timestamp: 'Just now'
    };
    return { notifications: [newNotif, ...state.notifications] };
  }),
  
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
