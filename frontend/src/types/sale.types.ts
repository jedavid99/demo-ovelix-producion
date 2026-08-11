// Tipos para el módulo de Ventas

export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'multiple';

export type SaleEstado = 'completada' | 'anulada';

export interface SaleItem {
  id: string;
  sale_id: string;
  producto_id: string;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number | string;
  subtotal: number | string;
}

export interface SaleClienteRef {
  id: string;
  nombre_completo: string;
  telefono?: string;
}

export interface SaleVendedorRef {
  id: string;
  nombre: string;
  apellido: string;
}

export interface Sale {
  id: string;
  fecha: string;
  cliente_id?: string | null;
  total: number | string;
  metodo_pago: MetodoPago;
  monto_recibido: number | string;
  cambio: number | string;
  numero_comprobante?: string | null;
  vendedor_id: string;
  estado: SaleEstado | string;
  reparacion_id?: string | null;
  cierre_id?: string | null;
  created_at: string;
  cliente?: SaleClienteRef | null;
  vendedor?: SaleVendedorRef | null;
  items?: SaleItem[];
}

export interface SaleCreateItem {
  producto_id: string;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface SaleCreate {
  cliente_id?: string;
  items: SaleCreateItem[];
  total: number;
  metodo_pago: MetodoPago;
  monto_recibido: number;
  cambio?: number;
  numero_comprobante?: string;
  reparacion_id?: string;
}

export interface SaleUpdate extends Partial<SaleCreate> {}

export interface SaleFilters {
  page?: number;
  limit?: number;
  cliente_id?: string;
  vendedor_id?: string;
  estado?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  metodo_pago?: string;
}

export interface SaleListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SaleListResponse {
  data: Sale[];
  meta: SaleListMeta;
}
