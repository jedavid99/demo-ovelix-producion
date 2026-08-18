export interface GeneralForm {
  nombre_negocio: string;
  direccion: string;
  moneda: string;
  formato_fecha: string;
  zona_horaria: string;
}

export type SectionGroup = 'negocio' | 'operacion' | 'sistema';

export interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
  group: SectionGroup;
  description: string;
}

export interface PaymentMethod {
  id: string;
  empresa_id: string;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaxRate {
  id: string;
  empresa_id: string;
  nombre: string;
  porcentaje: number;
  seccion?: string | null;
  descripcion?: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface BankAccount {
  id: string;
  empresa_id: string;
  alias?: string | null;
  cbu?: string | null;
  numero_cuenta?: string | null;
  banco?: string | null;
  titular?: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreference {
  id: string;
  empresa_id: string;
  evento: string;
  titulo: string;
  descripcion?: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Integration {
  id: string;
  empresa_id: string;
  nombre: string;
  descripcion?: string | null;
  conectado: boolean;
  estado_real?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlanSubscription {
  id: string;
  empresa_id: string;
  plan: string;
  meses: number;
  fecha_inicio: string;
  fecha_vencimiento: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface RepairStateRequest {
  id: string;
  empresa_id: string;
  usuario_id?: string | null;
  estado_nombre: string;
  mensaje?: string | null;
  estado: string;
  created_at: string;
  updated_at: string;
  usuario?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  } | null;
}

export interface StockCategory {
  id: string;
  nombre: string;
  descripcion?: string | null;
  empresa_id?: string | null;
  created_at: string;
  updated_at: string;
}

export const PLAN_LABELS: Record<string, string> = {
  DEMO: 'Demo',
  BASICO: 'Básico',
  PRO: 'Pro',
  PLATINO: 'Platino',
};

export const PLAN_MONTHS_OPTIONS = [1, 3, 6, 12];
