import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AIState, Project, AppNotification } from '../types';

interface StudioState {
  user: User;
  currentProject: Project;
  aiState: AIState;
  isSidebarExpanded: boolean;
  showPricingModal: boolean;
  showOnboardingModal: boolean;
  showSettingsModal: boolean;
  showCreateAppModal: boolean;
  currentView: 'chat' | 'settings' | 'all_apps' | 'vibe';
  activeSettingsTab: string;
  notifications: AppNotification[];
  glowFeatureEnabled: boolean;
  finishSoundEnabled: boolean;
  
  // Zero-capital tracking properties
  byokEnabled: boolean;
  dailySparksUsed: number;
  lastSparkReset: string;
  hoursSaved: number;
  
  setUser: (user: User) => void;
  setProject: (project: Project) => void;
  setAIState: (state: Partial<AIState>) => void;
  toggleSidebar: () => void;
  setShowPricingModal: (open: boolean) => void;
  setShowOnboardingModal: (open: boolean) => void;
  setShowSettingsModal: (open: boolean) => void;
  setShowCreateAppModal: (open: boolean) => void;
  setCurrentView: (view: 'chat' | 'settings' | 'all_apps' | 'vibe') => void;
  setActiveSettingsTab: (tab: string) => void;
  setGlowFeatureEnabled: (enabled: boolean) => void;
  setFinishSoundEnabled: (enabled: boolean) => void;
  setByokEnabled: (enabled: boolean) => void;
  addHoursSaved: (hours: number) => void;
  consumeSparks: (amount: number) => boolean;
  
  // Notification actions
  addNotification: (type: 'ai' | 'billing' | 'error' | 'info', title: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // Credit actions
  addCredits: (amount: number) => void;
  setPackageCredits: (maxAmount: number) => void;
  setPlan: (plan: 'Free' | 'Pro' | 'Business') => void;
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set) => ({
      user: {
        id: 'u1',
        name: 'Fleetyre',
        email: 'fleetyre77@gmail.com',
        credits: 10,
        maxCredits: 10,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        plan: 'Free'
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
      showCreateAppModal: false,
      currentView: 'chat',
      activeSettingsTab: 'general',
      glowFeatureEnabled: false,
      finishSoundEnabled: true,
      byokEnabled: false,
      dailySparksUsed: 0,
      lastSparkReset: new Date().toISOString().split('T')[0],
      hoursSaved: 0,
      
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
      setShowCreateAppModal: (open) => set({ showCreateAppModal: open }),
      setCurrentView: (currentView) => set({ currentView }),
      setActiveSettingsTab: (activeSettingsTab) => set({ activeSettingsTab }),
      setGlowFeatureEnabled: (glowFeatureEnabled) => set({ glowFeatureEnabled }),
      setFinishSoundEnabled: (finishSoundEnabled) => set({ finishSoundEnabled }),
      setByokEnabled: (byokEnabled) => set({ byokEnabled }),
      addHoursSaved: (hours) => set((state) => ({ hoursSaved: state.hoursSaved + hours })),
      
      consumeSparks: (amount) => {
        let allowed = false;
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          let sparksUsedToday = state.lastSparkReset === today ? state.dailySparksUsed : 0;
          
          let dailyLimit = 3; // Free
          if (state.user.plan === 'Pro') dailyLimit = 30;
          if (state.user.plan === 'Business') dailyLimit = 150;
          
          if (state.byokEnabled) {
            allowed = true; // Unlimited via BYOK
            return { lastSparkReset: today }; // Just keep tracking dates
          }
          
          if (sparksUsedToday + amount <= dailyLimit && state.user.credits >= amount) {
            allowed = true;
            return {
              dailySparksUsed: sparksUsedToday + amount,
              lastSparkReset: today,
              user: {
                ...state.user,
                credits: state.user.credits - amount
              }
            };
          }
          allowed = false;
          return {
            dailySparksUsed: sparksUsedToday,
            lastSparkReset: today
          };
        });
        return allowed;
      },
      
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
      })),

      setPlan: (plan) => set((state) => ({
        user: {
          ...state.user,
          plan
        }
      }))
    }),
    {
      name: 'lucid-studio-storage',
    }
  )
);
