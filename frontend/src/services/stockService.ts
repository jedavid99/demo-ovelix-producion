import api from './api';
import { StockItem, StockItemCreate, StockItemUpdate, StockFilters, PaginatedResponse, StockAdjustment, StockMovement } from '@/types/stock.types';

const unwrap = <T>(res: any): T => res?.data?.data ?? res?.data ?? res;

export const stockService = {
  list: (filters?: StockFilters): Promise<PaginatedResponse<StockItem>> =>
    api.get('/stock', { params: filters }).then(res => unwrap(res)),

  getById: (id: string): Promise<StockItem> =>
    api.get(`/stock/${id}`).then(res => unwrap(res)),

  create: (data: StockItemCreate): Promise<StockItem> =>
    api.post('/stock', data).then(res => unwrap(res)),

  update: (id: string, data: StockItemUpdate): Promise<StockItem> =>
    api.put(`/stock/${id}`, data).then(res => unwrap(res)),

  delete: (id: string): Promise<void> =>
    api.delete(`/stock/${id}`).then(res => unwrap(res)),

  adjust: (data: StockAdjustment): Promise<StockItem> =>
    api.post('/stock/adjust', data).then(res => unwrap(res)),

  getLowStock: (limit?: number): Promise<StockItem[]> =>
    api.get('/stock/low', { params: { limit } }).then(res => unwrap(res)),

  getMovements: (item_id?: string, filters?: { page?: number; limit?: number }): Promise<PaginatedResponse<StockMovement>> =>
    api.get('/stock/movements', { params: { item_id, ...filters } }).then(res => unwrap(res)),

  activate: (id: string): Promise<StockItem> =>
    api.patch(`/stock/${id}/activate`).then(res => unwrap(res)),

  deactivate: (id: string): Promise<StockItem> =>
    api.patch(`/stock/${id}/deactivate`).then(res => unwrap(res)),

  getCategories: (): Promise<string[]> =>
    api.get('/stock/categories').then(res => unwrap(res)),
};
