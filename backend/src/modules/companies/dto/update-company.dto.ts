import { z } from 'zod';

export const updateCompanySchema = z.object({
  codigo_empresa: z.string().min(2).optional(),
  razon_social: z.string().min(2).optional(),
  email: z.string().email().optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  codigo_postal: z.string().optional(),
  activo: z.boolean().optional(),
});

export type UpdateCompanyDto = z.infer<typeof updateCompanySchema>;
