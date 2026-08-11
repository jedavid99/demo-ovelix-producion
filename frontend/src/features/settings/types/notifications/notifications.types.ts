import type { LucideIcon } from 'lucide-react';

export interface NotificationItem {
  id: string;
  type: 'urgent' | 'system' | 'sale' | 'general';
  title: string;
  time: string;
  message: string;
  action: string;
  icon: string;
  read?: boolean;
}

export interface ChatMessage {
  id: string;
  author?: string;
  avatar?: string;
  time?: string;
  content: React.ReactNode;
  self?: boolean;
  system?: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  online: boolean;
  status: string;
}

export interface Ticket {
  id: string;
  title: string;
  status: string;
  priority: string;
  active: number;
  device: string;
}

export type NotificationFilter = 'all' | 'unread' | 'urgent' | 'system';
export type ActiveTab = 'equipo' | 'tickets';
