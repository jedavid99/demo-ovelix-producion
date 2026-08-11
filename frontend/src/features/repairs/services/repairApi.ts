import { repairService } from '@/services/repairService';
import { clientService } from '@/services/clientService';

export const repairApi = {
  getRepairs: async (limit = 1000, sort = 'updated_at:desc') => {
    const response = await repairService.list({ limit, sort }) as any;
    const rawArray =
      response?.data?.data?.reparaciones ||
      response?.data?.reparaciones ||
      response?.reparaciones ||
      response?.data?.data?.data ||
      response?.data?.data ||
      response?.data ||
      [];
    return Array.isArray(rawArray) ? rawArray : [];
  },

  getRepairById: async (id: string) => {
    const response = await repairService.getById(id) as any;
    return response?.data?.data || response?.data || response;
  },

  deleteRepair: async (id: string) => {
    await repairService.delete(id);
  },

  updateRepairStatus: async (id: string, data: { estado: string }) => {
    await repairService.updateStatus(id, data as any);
  },

  getClients: async (limit = 1000) => {
    const response = await clientService.list({ limit: 1000, sort: 'createdAt', order: 'desc' } as any) as any;
    return response?.data?.data?.data || response?.data?.data?.clients || response?.data?.data || [];
  },
};
export default repairApi;
