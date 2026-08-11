import { repairService } from '@/services/repairService';

export const fetchRepairByOrder = async (order: string) => {
  const response = await repairService.list({ limit: 1000 }) as any;
  const repairsArray = response?.data?.data?.data || response?.data?.data?.reparaciones || response?.data?.data || [];
  const validRepairsArray = Array.isArray(repairsArray) ? repairsArray : [];

  return validRepairsArray.find((r: any) =>
    r.numero_reparacion === order || r.id === order
  );
};
