export interface RepairDetail {
  id: string;
  numero_reparacion: string;
  dispositivo: string;
  marca?: string;
  imei?: string;
  numero_serie?: string;
  categoria_dispositivo?: string;
  modelo_dispositivo?: string;
  modelo?: string;
  problema: string;
  problema_reportado?: string;
  diagnostico?: string;
  estado: string;
  prioridad?: string;
  fecha_ingreso: string;
  fecha_estimada_entrega: string;
  total_reparacion: number;
  metodo_pago?: string;
  forma_pago?: string;
  pago_completo?: boolean;
  pago_parcial?: boolean;
  garantia_activa?: boolean;
  tiene_garantia?: boolean;
  garantia_duracion?: number;
  garantia_unidad?: string;
  fecha_inicio_garantia?: string;
  fecha_fin_garantia?: string;
  cliente: {
    nombre_completo?: string;
    nombre?: string;
    telefono: string;
    email?: string;
    direccion?: string;
    dni?: string;
    documento?: string;
    dni_cuit?: string;
    cuit?: string;
    numero_documento?: string;
  };
  tecnico?: {
    nombre?: string;
    name?: string;
  } | string;
  tecnico_nombre?: string;
  tecnico_asignado?: string;
  dni_cliente?: string;
  seguridad_telefono?: {
    pin?: string;
    patron?: string;
    password?: string;
    face_id?: boolean;
    touch_id?: boolean;
    notas?: string;
  };
  repuestos_usados?: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
  }>;
  accesorios_incluidos?: string[];
  notas?: string;
  fotos_antes?: string[];
  fotos_despues?: string[];
}
