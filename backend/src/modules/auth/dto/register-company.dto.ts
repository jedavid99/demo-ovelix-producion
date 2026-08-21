import { z } from 'zod';

export const registerCompanySchema = z.object({
  // Datos de la empresa
  razon_social: z.string().min(2, 'La razón social es requerida'),
  nombre_fantasia: z.string().min(2, 'El nombre del taller es requerido'),
  email: z.string().email('Email de empresa inválido'),
  telefono: z.string().min(6, 'Teléfono inválido').optional().or(z.literal('')),
  direccion: z.string().min(5, 'Dirección requerida').optional().or(z.literal('')),
  ciudad: z.string().optional().or(z.literal('')),
  provincia: z.string().optional().or(z.literal('')),
  codigo_postal: z.string().optional().or(z.literal('')),

  // Código de activación (opcional, generado por developer)
  activationCode: z.string().optional(),

  // Datos del primer administrador
  admin_email: z.string().email('Email del administrador inválido'),
  admin_password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  admin_nombre: z.string().min(1, 'El nombre es requerido'),
  admin_apellido: z.string().min(1, 'El apellido es requerido'),
  admin_dni: z.string().optional().or(z.literal('')),
  admin_telefono: z.string().optional().or(z.literal('')),
});

export type RegisterCompanyDto = z.infer<typeof registerCompanySchema>;