import { z } from 'zod';

export const createReviewSchema = z.object({
  cliente_id: z.string().uuid('cliente_id debe ser un UUID válido'),
  entidad: z.string().min(1, 'La entidad es requerida').max(50),
  entidad_id: z.string().min(1, 'entidad_id es requerido'),
  puntuacion: z
    .number({ invalid_type_error: 'La puntuación debe ser un número' })
    .int('La puntuación debe ser un número entero')
    .min(1, 'La puntuación mínima es 1')
    .max(5, 'La puntuación máxima es 5'),
  comentario: z.string().max(1000).optional(),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;
