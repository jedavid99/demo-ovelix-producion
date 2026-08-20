import api from '@/services/api';
import type { Budget, NewBudget } from './Budgets.types';

interface Envelope<T> {
  data: T;
}

const unwrap = <T>(res: { data: unknown }): T => {
  const envelope = res.data as Envelope<T>;
  return envelope?.data ?? (res.data as T);
};

export type StandaloneBudgetStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'EXPIRED';

export interface StandaloneBudgetItemDTO {
  deviceType?: string | null;
  device?: string | null;
  price?: number | null;
}

export interface StandaloneBudgetDTO {
  id: string;
  numero: string;
  empresa_id: string;
  cliente_nombre: string;
  cliente_dni: string | null;
  cliente_telefono: string;
  dispositivo: string;
  tipo_dispositivo: string | null;
  problema: string | null;
  tecnico: string;
  tipo: string | null;
  categoria: string | null;
  tax_rate_id: string | null;
  tax_rate_name: string | null;
  tax_rate_porct: number;
  base_total: number;
  total: number;
  estado: StandaloneBudgetStatus;
  vigencia_dias: number;
  fecha_vencimiento: string | null;
  repair_id: string | null;
  items: StandaloneBudgetItemDTO[];
  notas: string | null;
  fecha_envio: string;
  fecha_respuesta: string | null;
  created_at: string;
  updated_at: string;
  repair?: { id: string; numero_reparacion: string | null; estado: string } | null;
}

export interface StandaloneBudgetListResponse {
  data: StandaloneBudgetDTO[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CreateStandaloneBudgetPayload {
  cliente_nombre: string;
  cliente_dni?: string;
  cliente_telefono: string;
  dispositivo: string;
  tipo_dispositivo?: string;
  problema?: string;
  tecnico?: string;
  tipo?: string;
  categoria?: string;
  tax_rate_id?: string;
  tax_rate_name?: string;
  tax_rate_porct?: number;
  base_total: number;
  total: number;
  vigencia_dias?: number;
  items?: StandaloneBudgetItemDTO[];
  notas?: string;
}

const STATUS_TO_FRONT: Record<StandaloneBudgetStatus, Budget['status']> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  COMPLETED: 'Completado',
  EXPIRED: 'Vencido',
};

export const dtoToBudget = (dto: StandaloneBudgetDTO): Budget => ({
  id: dto.id,
  numero: dto.numero,
  clientName: dto.cliente_nombre,
  clientDni: dto.cliente_dni ?? '',
  clientPhone: dto.cliente_telefono,
  device: dto.dispositivo,
  deviceType: dto.tipo_dispositivo ?? '',
  issue: dto.problema ?? '',
  total: Number(dto.total),
  status: STATUS_TO_FRONT[dto.estado],
  date: new Date(dto.fecha_envio),
  technician: dto.tecnico,
  tipo: dto.tipo ?? '',
  category: dto.categoria ?? '',
  taxRateId: dto.tax_rate_id ?? '',
  taxRateName: dto.tax_rate_name ?? '',
  taxRatePercent: Number(dto.tax_rate_porct),
  taxRatePorct: Number(dto.tax_rate_porct),
  baseTotal: Number(dto.base_total),
  vigenciaDias: Number(dto.vigencia_dias) || 7,
  fechaVencimiento: dto.fecha_vencimiento ? new Date(dto.fecha_vencimiento) : null,
  repairId: dto.repair_id ?? undefined,
  repairNumber: dto.repair?.numero_reparacion ?? undefined,
  items: Array.isArray(dto.items)
    ? dto.items
        .filter((it) => it && (it.device || it.deviceType || (it.price ?? 0) > 0))
        .map((it, index) => ({
          id: `itm-${dto.id}-${index}`,
          deviceType: it.deviceType ?? '',
          device: it.device ?? '',
          price: Number(it.price ?? 0),
        }))
    : [],
});

export const newBudgetToPayload = (nb: NewBudget): CreateStandaloneBudgetPayload => {
  const filledItems = nb.items.filter(
    (it) => it.device.trim() || it.deviceType.trim() || (Number(it.price) || 0) > 0
  );
  return {
    cliente_nombre: nb.clientName,
    cliente_dni: nb.clientDni || undefined,
    cliente_telefono: nb.clientPhone,
    dispositivo: nb.device.trim() || filledItems.map((it) => it.device.trim()).filter(Boolean).join(' · '),
    tipo_dispositivo: nb.deviceType || filledItems[0]?.deviceType || undefined,
    problema: nb.issue || undefined,
    tecnico: nb.technician || undefined,
    tipo: nb.tipo || undefined,
    categoria: nb.category || undefined,
    tax_rate_id: nb.taxRateId || undefined,
    tax_rate_name: nb.taxRateName || undefined,
    tax_rate_porct: Number(nb.taxRatePorct) || 0,
    base_total: nb.baseTotal,
    total: nb.total,
    vigencia_dias: nb.vigenciaDias || 7,
    items: filledItems.map((it) => ({
      deviceType: it.deviceType,
      device: it.device,
      price: it.price,
    })),
  };
};

export const budgetToNewBudget = (b: Budget): NewBudget => ({
  clientName: b.clientName,
  clientDni: b.clientDni ?? '',
  clientPhone: b.clientPhone,
  device: b.device,
  deviceType: b.deviceType,
  issue: b.issue,
  total: b.total,
  technician: b.technician,
  tipo: b.tipo ?? '',
  category: b.category ?? '',
  taxRateId: b.taxRateId ?? '',
  taxRateName: b.taxRateName ?? '',
  taxRatePorct: b.taxRatePorct ?? 0,
  baseTotal: b.baseTotal ?? b.total,
  vigenciaDias: b.vigenciaDias ?? 7,
  items: b.items && b.items.length > 0 ? b.items : [],
});

export const budgetsApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    estado?: string;
    search?: string;
  }): Promise<StandaloneBudgetListResponse> => {
    const response = await api.get('/standalone-budgets', { params });
    const { data, meta } = unwrap<StandaloneBudgetListResponse>(response);
    return { data: Array.isArray(data) ? data : [], meta };
  },

  get: async (id: string): Promise<StandaloneBudgetDTO> => {
    const response = await api.get(`/standalone-budgets/${id}`);
    return unwrap<StandaloneBudgetDTO>(response);
  },

  create: async (payload: CreateStandaloneBudgetPayload): Promise<StandaloneBudgetDTO> => {
    const response = await api.post('/standalone-budgets', payload);
    return unwrap<StandaloneBudgetDTO>(response);
  },

  update: async (
    id: string,
    payload: Partial<CreateStandaloneBudgetPayload>
  ): Promise<StandaloneBudgetDTO> => {
    const response = await api.put(`/standalone-budgets/${id}`, payload);
    return unwrap<StandaloneBudgetDTO>(response);
  },

  approve: async (id: string): Promise<StandaloneBudgetDTO> => {
    const response = await api.post(`/standalone-budgets/${id}/approve`);
    return unwrap<StandaloneBudgetDTO>(response);
  },

  reject: async (id: string, notas?: string): Promise<StandaloneBudgetDTO> => {
    const response = await api.post(`/standalone-budgets/${id}/reject`, { notas });
    return unwrap<StandaloneBudgetDTO>(response);
  },

  remove: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/standalone-budgets/${id}`);
    return unwrap<{ message: string }>(response);
  },
};

export default budgetsApi;