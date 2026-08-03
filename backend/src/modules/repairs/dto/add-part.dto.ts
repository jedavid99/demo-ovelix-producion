import { z } from 'zod';

export const addPartSchema = z.object({
  repuesto_id: z.string().uuid('ID de repuesto inválido'),
  nombre: z.string().min(1, 'El nombre del repuesto es requerido'),
  cantidad: z.number().int().positive('La cantidad debe ser positiva'),
  costo_unitario: z.number().positive('El costo unitario debe ser positivo'),
});

export type AddPartDto = z.infer<typeof addPartSchema>;
