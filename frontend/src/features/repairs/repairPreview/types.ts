export interface RepairPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  repairId: string;
}

export interface RepairData {
  id: string;
  numero_reparacion?: string;
  cliente?: {
    nombre_completo?: string;
    telefono?: string;
    email?: string;
  };
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
  total_reparacion?: number | string;
  notas?: string;
  foto_evidencia?: string;
  repuestos?: Array<{
    nombre: string;
    cantidad: number;
    costo_unitario: number | string;
  }>;
  tiene_garantia?: boolean;
  garantia_duracion?: number;
  garantia_unidad?: string;
  fecha_inicio_garantia?: string;
  fecha_fin_garantia?: string;
}
