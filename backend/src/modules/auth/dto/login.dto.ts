import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  codigo_empresa: z.string().min(2, 'El código de empresa debe tener al menos 2 caracteres').optional(),
});

export type LoginDto = z.infer<typeof loginSchema>;
