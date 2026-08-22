// Tipos para el módulo de Stock de Repuestos

export type TipoProducto = 'venta' | 'repuesto' | 'ambos';
export type TipoPrecio = 'mayorista' | 'minorista';
export type CanalVenta = 'mercado_libre' | 'facebook' | 'whatsapp' | 'pagina_web' | 'local';

export const CANALES_VENTA_LABELS: Record<CanalVenta, string> = {
  mercado_libre: 'Mercado Libre',
  facebook: 'Facebook',
  whatsapp: 'WhatsApp',
  pagina_web: 'Página web',
  local: 'Local',
};

export const CANALES_VENTA_COLORS: Record<CanalVenta, string> = {
  mercado_libre: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  facebook: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  whatsapp: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  pagina_web: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  local: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
};

export interface StockItem {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  marca?: string;
  modelo?: string;
  imagen_url?: string;
  proveedor_nombre?: string;
  tipo_producto: TipoProducto;
  tipo_precio: TipoPrecio;
  canales_venta: CanalVenta[];
  es_por_encargo: boolean;
  codigo_barra?: string;
  stock_actual: number;
  stock_minimo: number;
  stock_maximo?: number;
  costo_unitario: number;
  precio_venta: number;
  proveedor_id?: string;
  proveedor_nombre_rel?: string;
  ubicacion_almacen?: string;
  estado: 'activo' | 'inactivo';
  fecha_ingreso: string;
  fecha_actualizacion?: string;
  ultima_compra?: string;
  notas?: string;
}

export interface StockItemCreate {
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  marca?: string;
  modelo?: string;
  imagen_url?: string;
  proveedor_nombre?: string;
  tipo_producto?: TipoProducto;
  tipo_precio?: TipoPrecio;
  canales_venta?: CanalVenta[];
  es_por_encargo?: boolean;
  codigo_barra?: string;
  stock_actual: number;
  stock_minimo: number;
  stock_maximo?: number;
  costo_unitario: number;
  precio_venta: number;
  proveedor_id?: string;
  ubicacion_almacen?: string;
  notas?: string;
}

export interface StockItemUpdate extends Partial<StockItemCreate> {
  estado?: 'activo' | 'inactivo';
}

export interface StockFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoria?: string;
  estado?: 'activo' | 'inactivo';
  stock_bajo?: boolean;
  proveedor_id?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StockAdjustment {
  item_id: string;
  cantidad: number;
  tipo: 'entrada' | 'salida' | 'ajuste';
  motivo: string;
  referencia_id?: string;
}

export interface StockMovement {
  id: string;
  item_id: string;
  item_nombre: string;
  cantidad: number;
  tipo: 'entrada' | 'salida' | 'ajuste';
  motivo: string;
  referencia_id?: string;
  usuario_id?: string;
  fecha: string;
}
