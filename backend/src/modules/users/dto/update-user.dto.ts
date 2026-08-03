import { z } from 'zod';

export const updateUserSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
  dni: z.string().optional(),
  telefono: z.string().optional(),
  rol: z.enum(['ADMIN', 'TECNICO', 'RECEPCIONISTA', 'VENTAS']).optional(),
  activo: z.boolean().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
