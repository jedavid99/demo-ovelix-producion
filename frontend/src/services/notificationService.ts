import api from './api';

export interface Notification {
  id: string;
  usuario_id: string;
  tipo: 'whatsapp' | 'stock_bajo' | 'reparacion_completada' | 'reparacion_recibida' | 'venta_realizada' | 'cierre_caja' | 'nuevo_presupuesto';
  titulo: string;
  mensaje: string;
  leida: boolean;
  entidad_id?: string;
  entidad_tipo?: string;
  metadata?: unknown;
  created_at: string;
}

export const notificationService = {
  async getAll(unreadOnly = false) {
    const response = await api.get('/notifications', { params: { unreadOnly } });
    const envelope = response.data as { data?: unknown };
    return Array.isArray(envelope?.data) ? envelope.data : (response.data as Notification[]);
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    const envelope = response.data as { data?: { count?: number } };
    return envelope?.data?.count ?? (response.data as { count?: number })?.count ?? 0;
  },

  async markAsRead(id: string) {
    const response = await api.post(`/notifications/mark-read/${id}`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.post('/notifications/mark-all-read');
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};
