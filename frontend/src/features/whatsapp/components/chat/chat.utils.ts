export const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (date: Date) => {
  const now = new Date();
  const msgDate = new Date(date);
  const diffDays = Math.floor((now.getTime() - msgDate.getTime()) / 86400000);

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return msgDate.toLocaleDateString('es', { weekday: 'long' });
  return msgDate.toLocaleDateString('es', { day: 'numeric', month: 'short' });
};

export const getStatusColor = (contactStatus: 'online' | 'offline' | 'last_seen') => {
  if (contactStatus === 'online') return 'bg-green-500';
  if (contactStatus === 'offline') return 'bg-gray-400';
  return 'bg-yellow-500';
};

export const getStatusText = (contactStatus: 'online' | 'offline' | 'last_seen', lastSeen?: Date) => {
  if (contactStatus === 'online') return 'En línea';
  if (contactStatus === 'offline') return 'Desconectado';
  if (contactStatus === 'last_seen' && lastSeen) {
    const diff = Math.floor((Date.now() - new Date(lastSeen).getTime()) / 60000);
    if (diff < 1) return 'Visto ahora';
    if (diff < 60) return `Visto hace ${diff}m`;
    return `Visto hace ${Math.floor(diff / 60)}h`;
  }
  return 'Desconectado';
};
