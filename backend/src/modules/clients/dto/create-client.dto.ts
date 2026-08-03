import { z } from 'zod';

export const createClientSchema = z.object({
  nombre_completo: z.string().min(2, 'El nombre completo es requerido'),
  email: z.string().email('Email inválido').optional(),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  dni: z.string().optional(),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  codigo_postal: z.string().optional(),
  notas: z.string().optional(),
  limite_credito: z.number().min(0, 'El límite de crédito no puede ser negativo').optional(),
  empresa_id: z.string().uuid('ID de empresa inválido').optional(),
});

export type CreateClientDto = z.infer<typeof createClientSchema>;
