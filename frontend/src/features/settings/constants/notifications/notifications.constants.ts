import React from 'react';
import { AlertTriangle, Cpu, CheckCircle, Clock } from 'lucide-react';
import type { NotificationItem, ChatMessage, TeamMember, Ticket } from '../../types/notifications/notifications.types';

export const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  warning: AlertTriangle,
  hardware: Cpu,
  check_circle: CheckCircle,
  schedule: Clock,
};

export const initialNotifications: NotificationItem[] = [
  { id: '1', type: 'urgent', title: 'Low Stock Alert', time: '2 min', message: 'iPhone 14 Pro Max screens are below 5 units. Re-order recommended.', action: 'Create Order', icon: 'warning', read: false },
  { id: '2', type: 'system', title: 'New Repair Ticket', time: '14 min', message: '#TK-8842: Samsung S23 Ultra - Water Damage. Assigned to Technical A.', action: 'View Ticket', icon: 'hardware', read: false },
  { id: '3', type: 'sale', title: 'Sale Completed', time: '1 hour', message: 'Repair #TK-8831 has been picked up and paid. Total: $249.00', action: 'Receipt', icon: 'check_circle', read: true },
  { id: '4', type: 'general', title: 'Shift Reminder', time: '4 hours', message: "Tomorrow's staff meeting starts at 08:30 AM in the lounge.", action: 'Dismiss', icon: 'schedule', read: true },
];

export const initialChat: ChatMessage[] = [
  {
    id: 'm1', author: 'Alex (Senior Tech)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    time: '10:45 AM',
    content: React.createElement('span', null, 'Hey team, checking the water damage on #TK-8842. The charging coil looks corroded. Should we replace or just clean with IPA?'),
  },
  {
    id: 'm2', author: 'You', time: '10:48 AM', self: true,
    content: React.createElement(React.Fragment, null,
      'Better replace it. Cleaning might fail in a month. I\'ve attached the circuit diagram for reference where the short might be.',
      React.createElement('div', { className: 'mt-2 w-64 ml-auto rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm' },
        React.createElement('img', { alt: 'Circuit diagram', className: 'w-full h-auto', src: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400' })
      )
    ),
  },
  {
    id: 'm3', author: 'Sarah',
    avatar: 'https://images.unsplash.com/photo-1494790108777-466d853a7733?w=150',
    time: '11:02 AM',
    content: React.createElement('span', null,
      React.createElement('span', { className: 'text-blue-600 font-bold' }, '@Alex'),
      ' go ahead with the replacement. We have 4 in stock. I\'ll update the customer on the revised quote.'
    ),
  },
];

export const teamMembers: TeamMember[] = [
  { name: 'Alex Chen', role: 'Senior Tech', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', online: true, status: 'Working on #TK-8842' },
  { name: 'Sarah Johnson', role: 'Manager', avatar: 'https://images.unsplash.com/photo-1494790108777-466d853a7733?w=150', online: true, status: 'In meeting' },
  { name: 'Mike Rodriguez', role: 'Technician', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', online: false, status: 'Away' },
  { name: 'Lisa Wang', role: 'Sales', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', online: true, status: 'With customer' },
  { name: 'Carlos Mendez', role: 'Technician', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', online: true, status: 'Break' },
];

export const tickets: Ticket[] = [
  { id: '#TK-8842', title: 'S23 Ultra Water Damage', status: 'In Progress', priority: 'High', active: 3, device: 'Samsung S23 Ultra' },
  { id: '#TK-8843', title: 'iPhone 14 Screen', status: 'Waiting Parts', priority: 'Medium', active: 2, device: 'iPhone 14' },
  { id: '#TK-8844', title: 'Pixel 7 Battery', status: 'Completed', priority: 'Low', active: 0, device: 'Google Pixel 7' },
];
