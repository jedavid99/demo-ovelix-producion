import { z } from 'zod';

export const updateBrandSchema = z.object({
  nombre: z.string().min(1, 'El nombre de la marca es requerido').optional(),
});

export type UpdateBrandDto = z.infer<typeof updateBrandSchema>;
