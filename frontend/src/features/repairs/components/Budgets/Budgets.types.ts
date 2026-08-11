// Interfaces
export interface BudgetItem {
  id: string;
  deviceType: string;
  device: string;
  price: number;
}

export interface Budget {
  id: string;
  clientName: string;
  clientDni?: string;
  clientPhone: string;
  device: string;
  deviceType: string;
  issue: string;
  total: number;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Completado';
  date: Date;
  technician: string;
  /** venta | reparacion | '' */
  tipo?: string;
  category?: string;
  taxRateId?: string;
  taxRateName?: string;
  taxRatePercent?: number;
  baseTotal?: number;
  items?: BudgetItem[];
}

export interface NewBudget {
  clientName: string;
  clientDni: string;
  clientPhone: string;
  device: string;
  deviceType: string;
  issue: string;
  total: number;
  technician: string;
  /** Tipo del presupuesto: venta o reparación. */
  tipo: string;
  /** Categoría del presupuesto (configurada por el admin). */
  category: string;
  /** Porcentaje (impuesto/recargo) seleccionado. */
  taxRateId: string;
  taxRateName: string;
  taxRatePorct: number;
  /** Total base antes de aplicar el porcentaje. */
  baseTotal: number;
  /** Líneas de producto / servicio cargadas. */
  items: BudgetItem[];
}

export interface BudgetErrors {
  clientName?: string;
  clientDni?: string;
  clientPhone?: string;
  device?: string;
  deviceType?: string;
  issue?: string;
  total?: string;
  technician?: string;
  tipo?: string;
  category?: string;
  taxRateId?: string;
  items?: string;
}

// Constantes
export const STATUS_COLORS = {
  Pendiente: '#f59e0b', // amber
  Aprobado: '#10b981', // green
  Rechazado: '#ef4444', // red
  Completado: '#3b82f6', // blue,
};

export const ITEMS_PER_PAGE = 10;

export const DEVICE_TYPES = ['Celular', 'Tablet', 'Portátil', 'Consola', 'Smartwatch', 'Otro'] as const;
export const TECHNICIANS = ['Carlos López', 'Ana Martínez', 'Pedro Sánchez', 'Laura Díaz'] as const;
export const STATUS_FILTERS = ['all', 'Pendiente', 'Aprobado', 'Rechazado', 'Completado'] as const;

// Funciones auxiliares
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};

export const getStatusBadge = (status: Budget['status']) => {
  const variants = {
    Pendiente: 'warning',
    Aprobado: 'success',
    Rechazado: 'destructive',
    Completado: 'default',
  };
  return variants[status] as 'warning' | 'success' | 'destructive' | 'default';
};

// Estado inicial del formulario nuevo
export const initialNewBudget: NewBudget = {
  clientName: '',
  clientDni: '',
  clientPhone: '',
  device: '',
  deviceType: '',
  issue: '',
  total: 0,
  technician: '',
  tipo: '',
  category: '',
  taxRateId: '',
  taxRateName: '',
  taxRatePorct: 0,
  baseTotal: 0,
  items: [],
};

export const newBudgetItem = (): BudgetItem => ({
  id: `itm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
  deviceType: '',
  device: '',
  price: 0,
});
