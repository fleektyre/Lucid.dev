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
}

export interface AIState {
  isTyping: boolean;
  status: string;
  latency: number;
  model: string;
}
