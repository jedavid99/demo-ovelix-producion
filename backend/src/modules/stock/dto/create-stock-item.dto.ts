import { z } from 'zod';

const CANALES_VENTA = ['mercado_libre', 'facebook', 'whatsapp', 'pagina_web', 'local'] as const;

export const createStockItemSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  categoria: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  imagen_url: z.string().url().optional().or(z.literal('')),
  proveedor_nombre: z.string().optional(),
  tipo_producto: z.enum(['venta', 'repuesto', 'ambos']).default('repuesto'),
  tipo_precio: z.enum(['mayorista', 'minorista']).default('minorista'),
  canales_venta: z.array(z.enum(CANALES_VENTA)).default([]),
  es_por_encargo: z.boolean().default(false),
  codigo_barra: z.string().optional(),
  stock_actual: z.number().int().default(0),
  stock_minimo: z.number().int().default(0),
  stock_maximo: z.number().int().optional(),
  costo_unitario: z.number().positive('El costo unitario debe ser positivo'),
  precio_venta: z.number().positive('El precio de venta debe ser positivo'),
  proveedor_id: z.string().uuid().optional(),
  ubicacion_almacen: z.string().optional(),
  notas: z.string().optional(),
});

export type CreateStockItemDto = z.infer<typeof createStockItemSchema>;
