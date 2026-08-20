// Interfaces
export interface BudgetItem {
  id: string;
  deviceType: string;
  device: string;
  price: number;
  /** Si el porcentaje (impuesto/recargo) aplica a este ítem. */
  aplicaPorcentaje: boolean;
}

export interface Budget {
  id: string;
  numero?: string;
  clientName: string;
  clientDni?: string;
  clientPhone: string;
  device: string;
  deviceType: string;
  issue: string;
  total: number;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Completado' | 'Vencido';
  date: Date;
  technician: string;
  /** venta | reparacion | '' */
  tipo?: string;
  category?: string;
  taxRateId?: string;
  taxRateName?: string;
  taxRatePercent?: number;
  taxRatePorct?: number;
  baseTotal?: number;
  items?: BudgetItem[];
  /** Días de vigencia del presupuesto (configurados por el admin). */
  vigenciaDias?: number;
  /** Fecha límite de aprobación. */
  fechaVencimiento?: Date | null;
  /** ID de la reparación creada al aprobarse. */
  repairId?: string;
  repairNumber?: string;
  /** Modo cotización con varias opciones (no suma el total). */
  sumaTotal?: boolean;
  /** Si el presupuesto va dirigido a una aseguradora. */
  esAseguradora?: boolean;
  aseguradoraNombre?: string;
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
  /** Días de vigencia del presupuesto (1-365). */
  vigenciaDias: number;
  /** Modo cotización con varias opciones (no suma el total). */
  sumaTotal: boolean;
  /** Si el presupuesto va dirigido a una aseguradora. */
  esAseguradora: boolean;
  aseguradoraNombre: string;
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
  vigenciaDias?: string;
  aseguradoraNombre?: string;
}

// Constantes
export const STATUS_COLORS = {
  Pendiente: '#f59e0b', // amber
  Aprobado: '#10b981', // green
  Rechazado: '#ef4444', // red
  Completado: '#3b82f6', // blue
  Vencido: '#6b7280', // gray
};

export const ITEMS_PER_PAGE = 10;

export const DEVICE_TYPES = ['Celular', 'Tablet', 'Portátil', 'Consola', 'Smartwatch', 'Otro'] as const;
export const TECHNICIANS = ['Carlos López', 'Ana Martínez', 'Pedro Sánchez', 'Laura Díaz'] as const;
export const STATUS_FILTERS = ['all', 'Pendiente', 'Aprobado', 'Rechazado', 'Completado', 'Vencido'] as const;

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
    Vencido: 'secondary',
  };
  return variants[status] as 'warning' | 'success' | 'destructive' | 'default' | 'secondary';
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
  vigenciaDias: 7,
  sumaTotal: true,
  esAseguradora: false,
  aseguradoraNombre: '',
};

export const newBudgetItem = (): BudgetItem => ({
  id: `itm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
  deviceType: '',
  device: '',
  price: 0,
  aplicaPorcentaje: false,
});
