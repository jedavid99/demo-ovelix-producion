import type { Contact } from '../../whatsapp.types';

export function getContactStatus(contact: Contact): 'online' | 'offline' | 'last_seen' {
  if (!contact.lastInteraction) return 'offline';

  const now = new Date();
  const lastInteraction = new Date(contact.lastInteraction);
  const diffMinutes = Math.floor((now.getTime() - lastInteraction.getTime()) / 60000);

  if (diffMinutes < 5) return 'online';
  if (diffMinutes < 60) return 'last_seen';
  return 'offline';
}

export function getLastSeenText(contact: Contact): string {
  if (!contact.lastInteraction) return 'Desconectado';

  const now = new Date();
  const lastInteraction = new Date(contact.lastInteraction);
  const diffMinutes = Math.floor((now.getTime() - lastInteraction.getTime()) / 60000);

  if (diffMinutes < 1) return 'En l\u00EDnea';
  if (diffMinutes < 60) return `\u00DAltima vez hace ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `\u00DAltima vez hace ${diffHours} h`;
  const diffDays = Math.floor(diffMinutes / 1440);
  return `\u00DAltima vez hace ${diffDays} d`;
}
