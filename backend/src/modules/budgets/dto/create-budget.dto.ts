import { z } from 'zod';

export const createBudgetSchema = z.object({
  reparacion_id: z.string().uuid('ID de reparación inválido'),
  items: z.array(z.object({
    descripcion: z.string().min(1, 'La descripción es requerida'),
    precio: z.number().positive('El precio debe ser positivo'),
  })),
  total: z.number().positive('El total debe ser positivo'),
  notas: z.string().optional(),
});

export type CreateBudgetDto = z.infer<typeof createBudgetSchema>;
