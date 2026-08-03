import { z } from 'zod';

export const adjustStockSchema = z.object({
  item_id: z.string().uuid('ID de item inválido'),
  cantidad: z.number().int().positive('La cantidad debe ser un entero positivo'),
  tipo: z.enum(['entrada', 'salida', 'ajuste']),
  motivo: z.string().min(1, 'El motivo es requerido'),
});

export type AdjustStockDto = z.infer<typeof adjustStockSchema>;
