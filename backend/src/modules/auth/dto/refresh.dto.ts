import { z } from 'zod';

export const refreshSchema = z.object({
  refresh_token: z.string().min(1, 'El refresh token es requerido'),
});

export type RefreshDto = z.infer<typeof refreshSchema>;
