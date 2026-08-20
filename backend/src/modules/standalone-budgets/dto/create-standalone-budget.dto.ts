import { z } from 'zod';

export const createStandaloneBudgetSchema = z.object({
  cliente_nombre: z.string().min(1, 'El nombre del cliente es obligatorio'),
  cliente_dni: z.string().optional(),
  cliente_telefono: z.string().min(1, 'El teléfono es obligatorio'),
  dispositivo: z.string().min(1, 'El dispositivo es obligatorio'),
  tipo_dispositivo: z.string().optional(),
  problema: z.string().optional(),
  tecnico: z.string().optional(),
  tipo: z.string().optional(),
  categoria: z.string().optional(),
  tax_rate_id: z.string().optional(),
  tax_rate_name: z.string().optional(),
  tax_rate_porct: z.number().min(0).optional(),
  base_total: z.number().min(0, 'El total base debe ser mayor o igual a 0'),
  total: z.number().min(0, 'El total debe ser mayor o igual a 0'),
  suma_total: z.boolean().optional(),
  es_aseguradora: z.boolean().optional(),
  aseguradora_nombre: z.string().optional(),
  vigencia_dias: z.number().int().min(1, 'La vigencia debe ser de al menos 1 día').max(365, 'La vigencia no puede superar los 365 días').optional(),
  items: z
    .array(
      z.object({
        deviceType: z.string().optional(),
        device: z.string().optional(),
        price: z.number().min(0).optional(),
        aplica_porcentaje: z.boolean().optional(),
      }),
    )
    .optional(),
  notas: z.string().optional(),
});

export type CreateStandaloneBudgetDto = z.infer<typeof createStandaloneBudgetSchema>;