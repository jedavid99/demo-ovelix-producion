// Tipos para el módulo de Reparaciones

export interface Repair {
  id: string;
  numero_reparacion?: string;
  empresa_id?: string;
  cliente_id: string;
  cliente_nombre?: string;
  cliente_telefono?: string;
  cliente_email?: string;
  
  // Datos del dispositivo
  categoria_dispositivo?: 'phone' | 'pc' | 'laptop' | 'console' | 'tablet';
  dispositivo: string;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  
  // Estado del equipo
  condicion_estetica?: string;
  accesorios_incluidos?: string[];
  
  // Seguridad
  tipo_seguridad?: 'pin' | 'pattern' | 'fingerprint' | 'face' | 'none';
  pin_acceso?: string;
  patron_puntos?: string[];
  secuencia_patron?: string;
  
  // Diagnóstico
  problema_reportado: string;
  diagnosis?: string;
  reparacion_realizada?: string;
  chequeo_hardware?: Record<string, boolean>;
  
  // Estados
  estado?: 'pending' | 'diagnostic' | 'in_progress' | 'waiting_parts' | 'ready' | 'delivered' | 'cancelled' | 'irreparable' | 'entregado';
  prioridad?: 'low' | 'medium' | 'high' | 'critical';
  tecnico_asignado_id?: string;
  tecnico_nombre?: string;
  
  // Fechas
  fecha_ingreso?: string;
  hora_ingreso?: string;
  fecha_estimada_entrega?: string;
  tiempo_estimado_minutos?: number;
  fecha_entrega?: string;
  
  // Financiero
  total_reparacion?: number;
  metodo_pago_id?: string;
  pagado?: boolean;
  costo_piezas?: number;
  costo_mano_obra?: number;
  garantia_meses?: number;
  
  // Notas
  notas?: string;
  
  // Repuestos
  repuestos_usados?: RepairPart[];
}

export interface RepairPart {
  repuesto_id: string;
  nombre: string;
  cantidad: number;
  costo_unitario: number;
}

export interface RepairCreate {
  // === CAMPOS REQUERIDOS ===
  cliente_id: string;
  dispositivo: string;
  problema_reportado: string;
  fecha_ingreso: string;
  
  // === CAMPOS OPCIONALES - DISPOSITIVO ===
  categoria_dispositivo?: 'phone' | 'laptop' | 'tablet' | 'watch' | 'console' | 'other';
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  condicion_estetica?: string;
  accesorios_incluidos?: string[];
  
  // === CAMPOS OPCIONALES - ASIGNACIÓN ===
  prioridad?: 'low' | 'medium' | 'high' | 'critical';
  tecnico_asignado_id?: string;
  fecha_estimada_entrega?: string;
  tiempo_estimado_minutos?: number;
  
  // === CAMPOS OPCIONALES - COSTOS ===
  total_reparacion?: number;
  pagado?: boolean;
  metodo_pago_id?: string;
  
  // === CAMPOS OPCIONALES - NOTAS ===
  notas?: string;
  
  // === CAMPOS OPCIONALES - SEGURIDAD ===
  tipo_seguridad?: 'none' | 'pin' | 'pattern' | 'fingerprint' | 'face';
  pin_acceso?: string;
  patron_puntos?: number[];
  secuencia_patron?: number[];
  
  // === CAMPOS OPCIONALES - HARDWARE ===
  chequeo_hardware?: {
    audio?: string;
    boton_power?: string;
    camara_frontal?: string;
    camara_trasera?: string;
    pantalla?: string;
    bateria?: string;
    senal_wifi?: string;
    bluetooth?: string;
    altavoces?: string;
    microfono?: string;
    puerto_carga?: string;
    botones_volumen?: string;
    sensor_huellas?: string;
  };
}

export interface RepairUpdate extends Partial<RepairCreate> {
  estado?: 'pending' | 'diagnostic' | 'in_progress' | 'waiting_parts' | 'ready' | 'delivered' | 'cancelled' | 'irreparable' | 'entregado';
  costo_final?: number;
  fecha_entrega?: string;
  repuestos_usados?: RepairPart[];
}

export interface RepairFilters {
  page?: number;
  limit?: number;
  search?: string;
  estado?: 'pending' | 'diagnostic' | 'in_progress' | 'waiting_parts' | 'ready' | 'delivered' | 'cancelled' | 'irreparable' | 'entregado';
  prioridad?: 'low' | 'medium' | 'high' | 'critical';
  tecnico_id?: string;
  cliente_id?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  sort?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RepairStatusUpdate {
  estado: 'pending' | 'diagnostic' | 'in_progress' | 'waiting_parts' | 'ready' | 'delivered' | 'cancelled' | 'irreparable' | 'entregado';
  notas?: string;
}
