import { Search, Wrench, Clock, CheckCircle, Shield, XCircle } from 'lucide-react';

// Interfaces
export interface RepairPart {
  id: string;
  nombre: string;
  cantidad: number;
  costo_unitario: number;
}

export interface RepairData {
  id: string;
  numero_reparacion?: string;
  cliente_nombre?: string;
  cliente_telefono?: string;
  cliente_dni?: string;
  dispositivo: string;
  marca?: string;
  modelo?: string;
  problema_reportado: string;
  diagnosis?: string;
  reparacion_realizada?: string;
  estado: string;
  prioridad: string;
  fecha_ingreso: string;
  fecha_estimada_entrega?: string;
  total_reparacion?: number;
  notas?: string;
  foto_evidencia?: string;
  repuestos?: RepairPart[];

}

export interface FormData {
  problema_reportado: string;
  diagnosis: string;
  reparacion_realizada: string;
  estado: string;
  costo_piezas: number;
  costo_mano_obra: number;
  total_reparacion: number;
  notas: string;
  foto_evidencia: string;
  tecnico_asignado_id: string;
  fecha_estimada_entrega: string;
  categoria_dispositivo: string;
  dispositivo: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  condicion_estetica: string;
  accesorios_incluidos: string;
  tiempo_estimado_minutos: number;
  pagado: boolean;
  metodo_pago: string;
  monto_pagado: number;
  tipo_seguridad: string;
  pin_acceso: string;
  patron_puntos: string;
  secuencia_patron: string;
  chequeo_hardware: string;
}

export interface EstadoOption {
  value: string;
  label: string;
  icon: any;
}

// Opciones de estado
export const estadoOptions: EstadoOption[] = [
  { value: 'pending', label: 'Pendiente', icon: Search },
  { value: 'diagnostic', label: 'Diagnóstico', icon: Search },
  { value: 'in_progress', label: 'En Progreso', icon: Wrench },
  { value: 'waiting_parts', label: 'Esperando Repuestos', icon: Clock },
  { value: 'ready', label: 'Listo', icon: CheckCircle },
  { value: 'delivered', label: 'Entregado', icon: CheckCircle },
  { value: 'cancelled', label: 'Cancelado', icon: XCircle },
];

// Funciones auxiliares
export const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'diagnostic': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'in_progress': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'waiting_parts': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'ready': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
};

// Estado inicial del formulario
export const initialFormData: FormData = {
  problema_reportado: '',
  diagnosis: '',
  reparacion_realizada: '',
  estado: 'diagnostic',
  costo_piezas: 0,
  costo_mano_obra: 0,
  total_reparacion: 0,
  notas: '',
  foto_evidencia: '',
  tecnico_asignado_id: '',
  fecha_estimada_entrega: '',
  categoria_dispositivo: '',
  dispositivo: '',
  marca: '',
  modelo: '',
  numero_serie: '',
  condicion_estetica: '',
  accesorios_incluidos: '',
  tiempo_estimado_minutos: 0,
  pagado: false,
  metodo_pago: '',
  monto_pagado: 0,
  tipo_seguridad: 'none',
  pin_acceso: '',
  patron_puntos: '',
  secuencia_patron: '',
  chequeo_hardware: '',
};
