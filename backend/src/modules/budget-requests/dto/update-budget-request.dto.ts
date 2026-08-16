import { z } from 'zod';

export const updateBudgetRequestSchema = z.object({
  precio_ajustado: z.number().positive('El precio ajustado debe ser positivo').optional(),
  notas_admin: z.string().max(1200).optional().or(z.literal('')),
  estado: z.enum(['PENDIENTE', 'CONFIRMADO', 'CONVERTIDO', 'RECHAZADO']).optional(),
});

export type UpdateBudgetRequestDto = z.infer<typeof updateBudgetRequestSchema>;