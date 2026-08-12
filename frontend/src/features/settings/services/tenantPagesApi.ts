import api from '@/services/api';
import type { TenantPageConfig, TenantPageResponse } from '../types/tenantPage/tenantPage.types';

const unwrap = (res: any) => res.data.data;

export const tenantPagesApi = {
  get: async (): Promise<TenantPageResponse> => {
    const response = await api.get('/tenant-pages');
    return unwrap(response);
  },
  update: async (payload: { config: TenantPageConfig; enabled?: boolean }) => {
    const response = await api.put('/tenant-pages', payload);
    return unwrap(response);
  },
};

export default tenantPagesApi;