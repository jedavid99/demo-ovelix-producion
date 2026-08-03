import { z } from 'zod';

export const updateClientSchema = z.object({
  nombre_completo: z.string().min(2).optional(),
  email: z.string().email().optional(),
  telefono: z.string().min(1).optional(),
  dni: z.string().optional(),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  codigo_postal: z.string().optional(),
  estado: z.string().optional(),
  notas: z.string().optional(),
  limite_credito: z.number().optional(),
});

export type UpdateClientDto = z.infer<typeof updateClientSchema>;
