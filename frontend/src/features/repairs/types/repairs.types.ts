export interface Repair {
  id: string;
  numero_reparacion?: string;
  cliente_nombre?: string;
  dni?: string;
  dispositivo?: string;
  marca?: string;
  modelo?: string;
  categoria_dispositivo?: string;
  problema_reportado?: string;
  diagnosis?: string;
  estado: string;
  prioridad: string;
  total_reparacion?: number;
  fecha_ingreso?: string;
  tecnico_asignado_id?: string;
}

export interface StatusStyle {
  bg: string;
  text: string;
  border: string;
  label: string;
}

export interface PriorityStyle {
  bg: string;
  text: string;
  border: string;
  label: string;
}
