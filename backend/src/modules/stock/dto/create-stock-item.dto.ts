import { z } from 'zod';

export const createStockItemSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  categoria: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
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
