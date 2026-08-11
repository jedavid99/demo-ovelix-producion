export interface RepairData {
  numero_reparacion: string;
  estado: string;
  dispositivo: string;
  marca?: string;
  modelo?: string;
  problema_reportado: string;
  diagnosis?: string;
  reparacion_realizada?: string;
  fecha_ingreso: string;
  fecha_estimada_entrega?: string;
  fecha_entrega?: string;
  total_reparacion?: number;
  garantia_meses?: number;
  tiene_garantia?: boolean;
  garantia_duracion?: number;
  garantia_unidad?: string;
  fecha_inicio_garantia?: string;
  fecha_fin_garantia?: string;
  tecnico_asignado?: {
    nombre: string;
    apellido: string;
  };
}

import type { ComponentType } from 'react';

export interface StatusConfig {
  icon: ComponentType<{ className?: string }>;
  color: string;
  label: string;
  description: string;
}
