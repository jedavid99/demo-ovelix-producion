export interface BrandOption {
  id: string;
  nombre: string;
  modelos: { id: string; nombre: string }[];
}

export interface RepairCost {
  id: string;
  empresa_id: string;
  nombre: string;
  categoria: string;
  tipo_equipo: string | null;
  precio: number;
  tiempo_estimado: string | null;
  descripcion: string | null;
  notas: string | null;
  modelo: string | null;
  marcas: { id: string; nombre: string }[];
  modelos: { id: string; nombre: string; marca: { id: string; nombre: string } }[];
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface RepairCostForm {
  nombre: string;
  categoria: string;
  tipo_equipo: string | null;
  precio: number;
  tiempo_estimado: string | null;
  descripcion: string | null;
  notas: string | null;
  modelo: string | null;
  marcas: string[];
  modelos: { marca: string; nombre: string }[];
  activo: boolean;
}

export interface RepairCostPricing {
  id: string;
  nombre: string;
  porcentaje: number;
  finalPrice: number;
}

export interface TaxRate {
  id: string;
  nombre: string;
  porcentaje: number;
  seccion?: string | null;
  descripcion?: string | null;
  activo: boolean;
}