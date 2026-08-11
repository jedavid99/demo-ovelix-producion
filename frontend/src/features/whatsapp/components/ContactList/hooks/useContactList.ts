import { useState } from 'react';

export function useContactList(searchTerm: string, onSearchChange: (term: string) => void) {
  const [isFocused, setIsFocused] = useState(false);

  const clearSearch = () => onSearchChange('');

  const formatLastInteraction = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) {
      if (diffMins < 1) return 'Ahora';
      if (diffMins < 60) return `${diffMins}m`;
      return messageDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) {
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      return days[messageDate.getDay()];
    }
    return messageDate.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  return { isFocused, setIsFocused, clearSearch, formatLastInteraction };
}
