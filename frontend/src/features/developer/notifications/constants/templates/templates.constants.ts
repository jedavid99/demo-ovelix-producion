import { UserPlus, Key, Bell, FileText, Clock, XCircle, CreditCard, FileQuestion, MessageSquare } from 'lucide-react';
import type { PageTemplate } from '../../types/templates/templates.types';

export const EMAIL_TYPE_ICONS: Record<string, any> = {
  welcome: UserPlus,
  password_reset: Key,
  notification: Bell,
  invoice: FileText,
  trial_end: Clock,
  subscription_end: XCircle,
  payment_reminder: CreditCard,
  page_404: FileQuestion,
};

export const WHATSAPP_TYPE_ICONS: Record<string, any> = {
  whatsapp_trial_end: Clock,
  whatsapp_subscription_end: XCircle,
  whatsapp_payment_reminder: CreditCard,
  default: MessageSquare,
};

export const EMAIL_TYPE_BADGES: Record<string, string> = {
  welcome: 'bg-green-100 text-green-800',
  password_reset: 'bg-blue-100 text-blue-800',
  notification: 'bg-yellow-100 text-yellow-800',
  invoice: 'bg-purple-100 text-purple-800',
  trial_end: 'bg-orange-100 text-orange-800',
  subscription_end: 'bg-red-100 text-red-800',
  payment_reminder: 'bg-pink-100 text-pink-800',
  page_404: 'bg-gray-100 text-gray-800',
};

export const WHATSAPP_TYPE_BADGES: Record<string, string> = {
  whatsapp_trial_end: 'bg-orange-100 text-orange-800',
  whatsapp_subscription_end: 'bg-red-100 text-red-800',
  whatsapp_payment_reminder: 'bg-pink-100 text-pink-800',
  default: 'bg-gray-100 text-gray-800',
};

export const PAGE_TEMPLATES: PageTemplate[] = [
  { id: '8', name: 'Página 404', type: 'page_404', updated_at: '2024-01-11', active: true, path: '/developer/templates/404' },
  { id: '9', name: 'Fin de Prueba', type: 'trial_end', updated_at: '2024-01-15', active: true, path: '/developer/templates/trial-end' },
  { id: '10', name: 'Fin de Suscripción', type: 'subscription_end', updated_at: '2024-01-14', active: true, path: '/developer/templates/subscription-end' },
  { id: '11', name: 'Recordatorio de Pago', type: 'payment_reminder', updated_at: '2024-01-13', active: true, path: '/developer/templates/payment-reminder' },
];

export const formatLabel = (str: string) => str.replace(/_/g, ' ').replace('whatsapp ', '');
