import { z } from 'zod';

export const updateStockItemSchema = z.object({
  codigo: z.string().min(1).optional(),
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional(),
  categoria: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
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
