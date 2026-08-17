export type BudgetRequestEstado = 'PENDIENTE' | 'CONFIRMADO' | 'CONVERTIDO' | 'RECHAZADO';

export interface BudgetRequestRepairRef {
  id: string;
  numero_reparacion: string | null;
  estado: string | null;
}

export interface BudgetRequest {
  id: string;
  empresa_id: string;
  numero: string;
  estado: BudgetRequestEstado;
  nombre: string;
  whatsapp: string;
  email: string | null;
  dni: string | null;
  categoria: string | null;
  dispositivo: string;
  modelo: string | null;
  problema: string | null;
  descripcion: string | null;
  tiempo_estimado: string | null;
  precio_ofertado: string | number | null;
  precio_ajustado: string | number | null;
  plan_pago: string | null;
  sena_monto: string | number | null;
  sena_metodo: string | null;
  comprobante: string | null;
  resto_metodo: string | null;
  delivery_metodo: string | null;
  delivery_direccion: string | null;
  delivery_costo: string | number | null;
  turno_fecha: string | null;
  turno_horario: string | null;
  notas_admin: string | null;
  repair_id: string | null;
  repair?: BudgetRequestRepairRef | null;
  created_at: string;
  updated_at: string;
}

export interface BudgetRequestMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BudgetRequestListResponse {
  data: BudgetRequest[];
  meta: BudgetRequestMeta;
}