import { z } from 'zod';

export const updateStandaloneBudgetSchema = z.object({
  cliente_nombre: z.string().min(1).optional(),
  cliente_dni: z.string().optional(),
  cliente_telefono: z.string().min(1).optional(),
  dispositivo: z.string().min(1).optional(),
  tipo_dispositivo: z.string().optional(),
  problema: z.string().optional(),
  tecnico: z.string().optional(),
  tipo: z.string().optional(),
  categoria: z.string().optional(),
  tax_rate_id: z.string().optional(),
  tax_rate_name: z.string().optional(),
  tax_rate_porct: z.number().min(0).optional(),
  base_total: z.number().min(0).optional(),
  total: z.number().min(0).optional(),
  suma_total: z.boolean().optional(),
  es_aseguradora: z.boolean().optional(),
  aseguradora_nombre: z.string().optional(),
  vigencia_dias: z.number().int().min(1).max(365).optional(),
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

export type UpdateStandaloneBudgetDto = z.infer<typeof updateStandaloneBudgetSchema>;