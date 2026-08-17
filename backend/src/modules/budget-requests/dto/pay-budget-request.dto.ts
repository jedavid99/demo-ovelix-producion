import { z } from 'zod';

export const payBudgetRequestSchema = z.object({
  plan_pago: z.enum(['half', 'full']).optional(),
  sena_metodo: z.enum(['qr', 'transferencia']).optional(),
  comprobante: z.string().max(120).optional(),
  resto_metodo: z.enum(['qr', 'transferencia', 'efectivo']).optional(),
  delivery_metodo: z.enum(['llevar', 'retirar']).optional(),
  delivery_direccion: z.string().max(400).optional(),
  turno_fecha: z.string().max(80).optional(),
  turno_horario: z.string().max(20).optional(),
});

export type PayBudgetRequestDto = z.infer<typeof payBudgetRequestSchema>;
