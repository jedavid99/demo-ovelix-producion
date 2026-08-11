import { repairService } from '@/services/repairService';
import { stockService } from '@/services/stockService';

export const financialApi = {
  getRepairs: async (limit = 1000) => {
    const response = await repairService.list({ limit }) as any;
    const array = response?.data?.data?.data || response?.data?.data?.reparaciones || response?.data?.data || [];
    return Array.isArray(array) ? array : [];
  },

  getStockMovements: async (limit = 1000) => {
    const response = await stockService.getMovements(undefined, { limit }) as any;
    const array = response?.data?.data?.movements || response?.data?.data || [];
    return Array.isArray(array) ? array : [];
  },
};
export default financialApi;
