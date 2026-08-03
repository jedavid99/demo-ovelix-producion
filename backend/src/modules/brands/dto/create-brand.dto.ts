import { z } from 'zod';

export const createBrandSchema = z.object({
  nombre: z.string().min(1, 'El nombre de la marca es requerido'),
});

export type CreateBrandDto = z.infer<typeof createBrandSchema>;
