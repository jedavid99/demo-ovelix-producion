import api from '@/services/api';
import type { BrandOption, RepairCost, RepairCostForm } from '../types/repairCosts.types';

interface Envelope<T> {
  data: T;
}

const unwrap = <T>(res: { data: unknown }): T => (res.data as Envelope<T>).data;

const mapCost = (c: RepairCost): RepairCost => ({
  ...c,
  precio: Number(c.precio) || 0,
  tiempo_estimado: c.tiempo_estimado ?? '',
  descripcion: c.descripcion ?? '',
  notas: c.notas ?? '',
  modelo: c.modelo ?? '',
  tipo_equipo: c.tipo_equipo ?? '',
  marcas: Array.isArray(c.marcas) ? c.marcas : [],
  modelos: Array.isArray(c.modelos) ? c.modelos : [],
});

/** Catálogo de marcas (con sus modelos) de la empresa, para el selector del formulario. */
export const loadBrandCatalog = async (): Promise<BrandOption[]> => {
  const response = await api.get('/brands');
  const list = (response.data?.data || response.data || []) as BrandOption[];
  return Array.isArray(list) ? list : [];
};

export const repairCostsApi = {
  getRepairCosts: async (params?: { search?: string; categoria?: string; tipo_equipo?: string }): Promise<RepairCost[]> => {
    const response = await api.get('/repair-costs', { params });
    const data = unwrap<unknown>(response);
    const list = Array.isArray(data) ? data : (data as { data?: unknown })?.data;
    return (Array.isArray(list) ? list : []).map((c) => mapCost(c as RepairCost));
  },

  createRepairCost: async (body: RepairCostForm): Promise<RepairCost> => {
    const response = await api.post('/repair-costs', body);
    return mapCost(unwrap<RepairCost>(response));
  },

  updateRepairCost: async (id: string, body: Partial<RepairCostForm>): Promise<RepairCost> => {
    const response = await api.put(`/repair-costs/${id}`, body);
    return mapCost(unwrap<RepairCost>(response));
  },

  deleteRepairCost: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/repair-costs/${id}`);
    return unwrap<{ message: string }>(response);
  },
};

export default repairCostsApi;