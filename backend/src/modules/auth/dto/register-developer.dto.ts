import { z } from 'zod';

export const registerDeveloperSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'El nombre es requerido'),
  apellido: z.string().min(2, 'El apellido es requerido'),
  dni: z.string().optional(),
  telefono: z.string().optional(),
  inviteToken: z.string().min(1, 'El token de invitación es requerido'),
});

export type RegisterDeveloperDto = z.infer<typeof registerDeveloperSchema>;
