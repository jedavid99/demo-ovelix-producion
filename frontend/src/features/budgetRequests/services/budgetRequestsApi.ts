import api from '@/services/api';
import type { BudgetRequest, BudgetRequestListResponse } from '../types/budgetRequests.types';

interface Envelope<T> {
  data: T;
}

const unwrap = <T>(res: { data: unknown }): T => {
  const envelope = res.data as Envelope<T>;
  return envelope?.data ?? (res.data as T);
};

export const budgetRequestsApi = {
  getRequests: async (params?: { page?: number; limit?: number; estado?: string }): Promise<BudgetRequestListResponse> => {
    const response = await api.get('/budget-requests', { params });
    const { data, meta } = unwrap<BudgetRequestListResponse>(response);
    return { data: Array.isArray(data) ? data : [], meta };
  },

  getRequest: async (id: string): Promise<BudgetRequest> => {
    const response = await api.get(`/budget-requests/${id}`);
    return unwrap<BudgetRequest>(response);
  },

  updateRequest: async (
    id: string,
    body: { precio_ajustado?: number | null; notas_admin?: string; estado?: string },
  ): Promise<BudgetRequest> => {
    const response = await api.put(`/budget-requests/${id}`, body);
    return unwrap<BudgetRequest>(response);
  },

  convertToRepair: async (id: string): Promise<{ request: BudgetRequest; repair: unknown }> => {
    const response = await api.post(`/budget-requests/${id}/convert`);
    return unwrap<{ request: BudgetRequest; repair: unknown }>(response);
  },

  deleteRequest: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/budget-requests/${id}`);
    return unwrap<{ message: string }>(response);
  },
};

export default budgetRequestsApi;