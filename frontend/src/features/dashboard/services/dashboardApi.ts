import { repairService } from '@/services/repairService';
import { clientService } from '@/services/clientService';
import { stockService } from '@/services/stockService';
import { whatsappApi } from '@/services/api';

function extractArray(data: any, ...paths: string[]): any[] {
  for (const path of paths) {
    const keys = path.split('.');
    let current = data;
    for (const key of keys) {
      if (current == null) break;
      current = current[key];
    }
    if (Array.isArray(current)) return current;
  }
  return [];
}

export const dashboardApi = {
  getRepairs: async () => {
    const response = await repairService.list({ limit: 100 }) as any;
    return extractArray(response, 'data.data.data', 'data.data.reparaciones', 'data.data');
  },

  getStockMovements: async () => {
    const response = await stockService.getMovements(undefined, { limit: 100 }) as any;
    return extractArray(response, 'data.data.movements', 'data.data');
  },

  getStockItems: async () => {
    const response = await stockService.list({ limit: 100 }) as any;
    return extractArray(response, 'data.data.products', 'data.data');
  },

  getClients: async () => {
    const response = await clientService.list({ limit: 50, sort: 'createdAt', order: 'desc' } as any) as any;
    return extractArray(response, 'data.data.data', 'data.data.clients', 'data.data');
  },

  getWhatsAppActivity: async (selectedDate: string): Promise<any[]> => {
    try {
      const clients = await whatsappApi.getClients() as any;
      const clientList = clients?.data?.data || [];
      const limited = clientList.slice(0, 5);
      const results = await Promise.allSettled(
        limited.map(async (client: any) => {
          const messages = await whatsappApi.getClientMessages(client.id, 1, 50) as any;
          const msgs = extractArray(messages, 'data.data.data', 'data.data');
          return msgs
            .filter((m: any) => m.direccion === 'received')
            .map((m: any) => ({
              id: m.id, type: 'WhatsApp',
              description: `Mensaje de ${client.nombre_completo}: ${m.mensaje?.substring(0, 30)}${m.mensaje?.length > 30 ? '...' : ''}`,
              quantity: 1,
              time: m.fecha_envio ? new Date(m.fecha_envio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '\u2014',
            }));
        })
      );
      return results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
    } catch {
      return [];
    }
  },
};

export default dashboardApi;