import { z } from 'zod';

export const updateBudgetSchema = z.object({
  items: z.array(z.object({
    descripcion: z.string().min(1),
    precio: z.number().positive(),
  })).optional(),
  total: z.number().positive().optional(),
  notas: z.string().optional(),
});

export type UpdateBudgetDto = z.infer<typeof updateBudgetSchema>;
