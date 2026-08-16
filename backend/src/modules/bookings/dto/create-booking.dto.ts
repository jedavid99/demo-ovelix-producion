import { z } from 'zod';

export const createBookingSchema = z.object({
  slug: z.string().min(1, 'Slug de empresa requerido').max(120),
  nombre: z.string().min(1, 'El nombre es requerido').max(200),
  email: z.string().email('Correo electrónico inválido').max(200),
  whatsapp: z.string().max(40).optional(),
  dispositivo: z.string().max(200).optional(),
  servicio: z.string().max(200).optional(),
  fecha: z.string().min(1, 'La fecha es requerida'),
  horario: z.string().max(20).optional(),
  notas: z.string().max(1000).optional(),
});

export const updateBookingEstadoSchema = z.object({
  estado: z.enum(['pendiente', 'confirmada', 'cancelada', 'completada']),
  notas: z.string().max(1000).optional(),
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;
export type UpdateBookingEstadoDto = z.infer<typeof updateBookingEstadoSchema>;
