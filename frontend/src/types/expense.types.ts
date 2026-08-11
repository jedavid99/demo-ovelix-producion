// Tipos para el módulo de Gastos

export type MetodoPagoGasto = 'efectivo' | 'tarjeta' | 'transferencia' | 'otro';

export type EstadoGasto = 'completada' | 'pendiente' | 'anulada';

export interface Expense {
  id: string;
  descripcion: string;
  categoria: string;
  proveedor?: string | null;
  monto: number | string;
  moneda: string;
  metodo_pago: MetodoPagoGasto | string;
  estado: EstadoGasto | string;
  fecha: string;
  empresa_id: string;
  usuario_id?: string | null;
  created_at: string;
  updated_at: string;
  usuario?: {
    id: string;
    nombre: string;
    apellido: string;
  } | null;
}

export interface ExpenseCreate {
  descripcion: string;
  categoria: string;
  proveedor?: string;
  monto: number;
  moneda?: string;
  metodo_pago?: MetodoPagoGasto;
  estado?: EstadoGasto;
  fecha?: string;
}

export interface ExpenseUpdate extends Partial<ExpenseCreate> {}

export interface ExpenseFilters {
  page?: number;
  limit?: number;
  categoria?: string;
  estado?: string;
  metodo_pago?: string;
  search?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface ExpenseListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExpenseListResponse {
  data: Expense[];
  meta: ExpenseListMeta;
}

export interface ExpenseSummary {
  totalMonth: number;
  pendingCount: number;
  totalAnulado: number;
  totalSpent: number;
  categoryTotals: Record<string, number>;
  topCategory: { categoria: string; monto: number } | null;
}
