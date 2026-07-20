export interface Project {
  id: string;
  name: string;
  status: 'active' | 'generating' | 'deployed' | 'error';
  lastModified: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  maxCredits: number;
  avatarUrl: string;
  plan?: 'Free' | 'Pro' | 'Business';
}

export interface AIState {
  isTyping: boolean;
  status: string;
  latency: number;
  model: string;
}

export interface AppNotification {
  id: string;
  type: 'ai' | 'billing' | 'error' | 'info';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}
