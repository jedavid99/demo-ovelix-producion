import { z } from 'zod';

export const updateSaleSchema = z.object({
  metodo_pago: z.enum(['efectivo', 'tarjeta', 'transferencia', 'multiple']).optional(),
  monto_recibido: z.number().positive().optional(),
  cambio: z.number().optional(),
  numero_comprobante: z.string().optional(),
  notas: z.string().optional(),
});

export type UpdateSaleDto = z.infer<typeof updateSaleSchema>;
