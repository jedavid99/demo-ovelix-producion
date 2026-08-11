import api from './api';
import {
  Sale,
  SaleCreate,
  SaleUpdate,
  SaleFilters,
  SaleListResponse,
} from '@/types/sale.types';

export const saleService = {
  // Listar ventas con paginación y filtros
  list: (filters?: SaleFilters): Promise<SaleListResponse> => {
    return api.get('/sales', { params: filters }).then(res => res.data);
  },

  // Obtener una venta por ID
  getById: (id: string): Promise<Sale> => {
    return api.get(`/sales/${id}`).then(res => res.data);
  },

  // Crear una nueva venta
  create: (data: SaleCreate): Promise<Sale> => {
    return api.post('/sales', data).then(res => res.data);
  },

  // Actualizar una venta existente
  update: (id: string, data: SaleUpdate): Promise<Sale> => {
    return api.put(`/sales/${id}`, data).then(res => res.data);
  },

  // Anular una venta
  anular: (id: string): Promise<Sale> => {
    return api.delete(`/sales/${id}/anular`).then(res => res.data);
  },

  // Obtener ventas de una fecha determinada
  getByDate: (date: string, page?: number, limit?: number): Promise<SaleListResponse | Sale[]> => {
    return api.get(`/sales/by-date/${date}`, { params: { page, limit } }).then(res => res.data);
  },
};
