import { z } from 'zod';

export const createBudgetRequestSchema = z.object({
  slug: z.string().min(1, 'Slug de empresa requerido').max(120),
  nombre: z.string().min(1, 'El nombre es requerido').max(200),
  whatsapp: z.string().min(1, 'El WhatsApp es requerido').max(40),
  email: z.string().email('Correo electrónico inválido').max(200).optional().or(z.literal('')),

  categoria: z.string().max(120).optional(),
  dispositivo: z.string().min(1, 'El dispositivo es requerido').max(200),
  modelo: z.string().max(200).optional(),
  problema: z.string().max(600).optional(),
  descripcion: z.string().max(1200).optional(),
  tiempo_estimado: z.string().max(80).optional(),
  precio_ofertado: z.number().positive('El precio ofertado debe ser positivo').optional(),

  plan_pago: z.enum(['half', 'full']).optional(),
  sena_monto: z.number().nonnegative().optional(),
  sena_metodo: z.enum(['qr', 'transferencia']).optional(),
  comprobante: z.string().max(120).optional(),
  resto_metodo: z.enum(['qr', 'transferencia', 'efectivo']).optional(),

  delivery_metodo: z.enum(['llevar', 'retirar']).optional(),
  delivery_direccion: z.string().max(400).optional(),
  delivery_costo: z.number().nonnegative().optional(),

  turno_fecha: z.string().max(80).optional(),
  turno_horario: z.string().max(20).optional(),
});

export type CreateBudgetRequestDto = z.infer<typeof createBudgetRequestSchema>;
