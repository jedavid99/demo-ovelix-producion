import { z } from 'zod';

export const createCompanySchema = z.object({
  codigo_empresa: z.string().min(2, 'El código de empresa debe tener al menos 2 caracteres'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug solo admite minúsculas, números y guiones')
    .transform((s) => s.toLowerCase())
    .optional(),
  razon_social: z.string().min(2, 'La razón social es requerida'),
  email: z.string().email('Email inválido').optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  codigo_postal: z.string().optional(),
  // Datos del primer administrador
  admin_email: z.string().email('Email del administrador inválido'),
  admin_password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  admin_nombre: z.string().min(2, 'El nombre es requerido'),
  admin_apellido: z.string().min(2, 'El apellido es requerido'),
  admin_dni: z.string().optional(),
  admin_telefono: z.string().optional(),
});

export type CreateCompanyDto = z.infer<typeof createCompanySchema>;
