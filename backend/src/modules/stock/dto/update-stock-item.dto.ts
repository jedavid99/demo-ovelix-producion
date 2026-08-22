import { z } from 'zod';

const CANALES_VENTA = ['mercado_libre', 'facebook', 'whatsapp', 'pagina_web', 'local'] as const;

export const updateStockItemSchema = z.object({
  codigo: z.string().min(1).optional(),
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional(),
  categoria: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  imagen_url: z.string().url().optional().or(z.literal('')),
  proveedor_nombre: z.string().optional(),
  tipo_producto: z.enum(['venta', 'repuesto', 'ambos']).optional(),
  tipo_precio: z.enum(['mayorista', 'minorista']).optional(),
  canales_venta: z.array(z.enum(CANALES_VENTA)).optional(),
  es_por_encargo: z.boolean().optional(),
  codigo_barra: z.string().optional(),
  stock_actual: z.number().int().optional(),
  stock_minimo: z.number().int().optional(),
  stock_maximo: z.number().int().optional(),
  costo_unitario: z.number().positive().optional(),
  precio_venta: z.number().positive().optional(),
  proveedor_id: z.string().uuid().optional(),
  ubicacion_almacen: z.string().optional(),
  estado: z.string().optional(),
  notas: z.string().optional(),
});

export type UpdateStockItemDto = z.infer<typeof updateStockItemSchema>;
