import { z } from 'zod';

export const updateBusinessInfoSchema = z.object({
  nombre_negocio: z.string().min(2).optional(),
  propietario_nombre: z.string().min(2).optional(),
  telefono: z.string().min(1).optional(),
  email: z.string().email().optional(),
  direccion: z.string().min(1).optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  codigo_postal: z.string().optional(),
  sitio_web: z.string().url().optional().or(z.literal('')),
  logo_url: z.string().optional(),
  descripcion: z.string().optional(),
  horarios: z.any().optional(),
  moneda: z.string().optional(),
  formato_fecha: z.string().optional(),
  zona_horaria: z.string().optional(),
});

export type UpdateBusinessInfoDto = z.infer<typeof updateBusinessInfoSchema>;
