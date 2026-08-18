import api from './api';
import { Client, ClientCreate, ClientUpdate, ClientFilters, PaginatedResponse, ClientPurchase } from '@/types/client.types';

export const clientService = {
  // Listar clientes con paginación y filtros
  list: (filters?: ClientFilters): Promise<PaginatedResponse<Client>> => {
    return api.get('/clients', { params: filters }).then(res => res.data);
  },

  // Obtener un cliente por ID
  getById: (id: string): Promise<Client> => {
    return api.get(`/clients/${id}`).then(res => res.data);
  },

  // Crear un nuevo cliente
  create: (data: ClientCreate): Promise<Client> => {
    return api.post('/clients', data).then(res => {
      return res.data;
    }).catch(err => {
      console.error('clientService.create - Error completo:', err);
      console.error('clientService.create - Response data:', err.response?.data);
      console.error('clientService.create - Errors array:', err.response?.data?.errors);
      throw err;
    });
  },

  // Actualizar un cliente
  update: (id: string, data: ClientUpdate): Promise<Client> => {
    return api.put(`/clients/${id}`, data).then(res => res.data);
  },

  // Eliminar un cliente
  delete: (id: string): Promise<void> => {
    return api.delete(`/clients/${id}`).then(res => res.data);
  },

  // Obtener historial de compras de un cliente
  getCompras: (id: string): Promise<ClientPurchase[]> => {
    return api.get(`/clients/${id}/compras`).then(res => res.data);
  },

  // Activar un cliente
  activate: (id: string): Promise<Client> => {
    return api.patch(`/clients/${id}/activate`).then(res => res.data);
  },

  // Desactivar un cliente
  deactivate: (id: string): Promise<Client> => {
    return api.patch(`/clients/${id}/deactivate`).then(res => res.data);
  }
};
