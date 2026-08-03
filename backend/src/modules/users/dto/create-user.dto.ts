import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  dni: z.string().optional(),
  telefono: z.string().optional(),
  rol: z.enum(['DESARROLLADOR', 'ADMIN', 'TECNICO', 'RECEPCIONISTA', 'VENTAS']),
  empresa_id: z.string().uuid().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
