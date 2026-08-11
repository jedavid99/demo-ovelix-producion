export interface Client {
  id: string;
  nombre_completo?: string;
  dni?: string;
  telefono?: string;
  email?: string;
  fecha_registro?: string;
  estado?: string;
  [key: string]: unknown;
}

export type StatusFilter = 'all' | 'activo' | 'inactivo';
