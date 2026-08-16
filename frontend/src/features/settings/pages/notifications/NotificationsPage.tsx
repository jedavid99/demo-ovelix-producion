import React, { useState, useEffect, FormEvent, useCallback } from 'react';
import { TeamPanel } from '../../components/notifications/TeamPanel';
import { ChatPanel } from '../../components/notifications/ChatPanel';
import { NotificationsPanel } from '../../components/notifications/NotificationsPanel';
import { initialChat, tickets } from '../../constants/notifications/notifications.constants';
import { notificationService } from '@/services/notificationService';
import { getAllUsers } from '@/services/users.service';
import type { NotificationItem, ChatMessage, NotificationFilter, ActiveTab, TeamMember } from '../../types/notifications/notifications.types';

interface BackendNotification {
  id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  created_at: string;
}

function mapTipoToUi(tipo: string): NotificationItem['type'] {
  switch (tipo) {
    case 'stock_bajo': return 'urgent';
    case 'venta_realizada': return 'sale';
    case 'whatsapp':
    case 'nuevo_presupuesto': return 'general';
    case 'reparacion_completada':
    case 'reparacion_recibida':
    case 'cierre_caja':
    default: return 'system';
  }
}

function mapTipoToIcon(tipo: string): string {
  switch (tipo) {
    case 'stock_bajo': return 'warning';
    case 'venta_realizada': return 'check_circle';
    case 'whatsapp':
    case 'nuevo_presupuesto': return 'schedule';
    case 'reparacion_completada':
    case 'reparacion_recibida':
    case 'cierre_caja':
    default: return 'hardware';
  }
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'ahora';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} d`;
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(initialChat);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('equipo');
  const [selectedTicket, setSelectedTicket] = useState('#TK-8842');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [notifResponse, usersResponse] = await Promise.all([
        notificationService.getAll(false),
        getAllUsers(),
      ]);
      const notifPayload = notifResponse?.data ?? notifResponse;
      const notifArray = Array.isArray(notifPayload) ? notifPayload : Array.isArray(notifPayload?.data) ? notifPayload.data : [];
      const mappedNotifs: NotificationItem[] = (notifArray as BackendNotification[]).map(n => ({
        id: n.id,
        type: mapTipoToUi(n.tipo),
        title: n.titulo,
        time: formatTime(n.created_at),
        message: n.mensaje,
        action: 'Ver',
        icon: mapTipoToIcon(n.tipo),
        read: n.leida,
      }));
      setNotifications(mappedNotifs);

      const usersPayload = usersResponse?.data?.data ?? usersResponse?.data ?? usersResponse;
      const usersArray = Array.isArray(usersPayload) ? usersPayload : [];
      const mappedUsers: TeamMember[] = (usersArray as Array<{ nombre: string; apellido: string; rol?: { name?: string } }>)
        .filter(u => u && (u.nombre || u.apellido))
        .map(u => ({
          name: `${u.nombre || ''} ${u.apellido || ''}`.trim(),
          role: u.rol?.name || 'Usuario',
          avatar: '',
          online: true,
          status: '',
        }));
      setTeamMembers(mappedUsers);
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
      setNotifications([]);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'urgent') return n.type === 'urgent';
    if (filter === 'system') return n.type === 'system';
    return true;
  });

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessage: ChatMessage = {
      id: `m${messages.length + 1}`,
      author: 'You',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      self: true,
      content: input,
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.error('Error marcando notificación como leída:', err);
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await notificationService.markAllAsRead();
    } catch (err) {
      console.error('Error marcando todas como leídas:', err);
    }
  };

  return (
    <div className="space-y-6">
      {loading && notifications.length === 0 ? (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <TeamPanel activeTab={activeTab} onTabChange={(t) => setActiveTab(t)} teamMembers={teamMembers} tickets={tickets} selectedTicket={selectedTicket} onTicketSelect={(id) => setSelectedTicket(id)} />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <ChatPanel messages={messages} input={input} onInputChange={(v) => setInput(v)} onSend={sendMessage} />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <NotificationsPanel notifications={filteredNotifications} filter={filter} onFilterChange={(f) => setFilter(f)} onMarkAsRead={markAsRead} onMarkAll={markAllAsRead} />
          </div>
        </div>
      )}
    </div>
  );
}
