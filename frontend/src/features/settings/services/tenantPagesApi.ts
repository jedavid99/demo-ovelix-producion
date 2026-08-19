import api from '@/services/api';
import type { TenantPageConfig, TenantPageResponse } from '../types/tenantPage/tenantPage.types';

const unwrap = <T,>(res: { data: { data: T } }): T => res.data.data;

export const tenantPagesApi = {
  get: async (empresaId?: string): Promise<TenantPageResponse> => {
    const response = await api.get('/tenant-pages', {
      params: empresaId ? { empresa_id: empresaId } : undefined,
    });
    return unwrap<TenantPageResponse>(response);
  },
  update: async (payload: { config: TenantPageConfig; enabled?: boolean }, empresaId?: string) => {
    const response = await api.put('/tenant-pages', payload, {
      params: empresaId ? { empresa_id: empresaId } : undefined,
    });
    return unwrap<TenantPageResponse>(response);
  },
};

export default tenantPagesApi;