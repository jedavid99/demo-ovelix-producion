import { z } from 'zod';

export const createSaleSchema = z.object({
  cliente_id: z.string().uuid().optional(),
  items: z.array(z.object({
    producto_id: z.string().uuid('ID de producto inválido'),
    producto_nombre: z.string().min(1, 'El nombre del producto es requerido'),
    cantidad: z.number().int().positive('La cantidad debe ser positiva'),
    precio_unitario: z.number().positive('El precio unitario debe ser positivo'),
    subtotal: z.number().positive('El subtotal debe ser positivo'),
  })).min(1, 'Debe haber al menos un item'),
  total: z.number().positive('El total debe ser positivo'),
  metodo_pago: z.enum(['efectivo', 'tarjeta', 'transferencia', 'multiple']),
  monto_recibido: z.number().positive('El monto recibido debe ser positivo'),
  cambio: z.number().default(0),
  numero_comprobante: z.string().optional(),
  reparacion_id: z.string().uuid().optional(),
});

export type CreateSaleDto = z.infer<typeof createSaleSchema>;
