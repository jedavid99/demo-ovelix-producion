import { z } from 'zod';

export const createExpenseSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es requerida').max(500),
  categoria: z.string().min(1, 'La categoría es requerida').max(100),
  proveedor: z.string().max(200).optional(),
  monto: z.number().positive('El monto debe ser mayor a 0'),
  moneda: z.string().max(10).default('ARS'),
  metodo_pago: z.enum(['efectivo', 'tarjeta', 'transferencia', 'otro']).default('efectivo'),
  estado: z.enum(['completada', 'pendiente', 'anulada']).default('completada'),
  fecha: z.string().datetime().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseDto = z.infer<typeof updateExpenseSchema>;
