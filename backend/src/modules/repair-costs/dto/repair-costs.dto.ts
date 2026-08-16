import { z } from 'zod';

export const createRepairCostSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(150),
  categoria: z.string().min(1, 'La categoría es requerida').max(100),
  tipo_equipo: z.string().max(60).nullable().optional(),
  precio: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  tiempo_estimado: z.string().max(60).nullable().optional(),
  descripcion: z.string().max(500).nullable().optional(),
  notas: z.string().max(1000).nullable().optional(),
  modelo: z.string().max(300).nullable().optional(),
  activo: z.boolean().optional(),
});

export const updateRepairCostSchema = z.object({
  nombre: z.string().min(1, 'El nombre no puede estar vacío').max(150).optional(),
  categoria: z.string().min(1, 'La categoría no puede estar vacía').max(100).optional(),
  tipo_equipo: z.string().max(60).nullable().optional(),
  precio: z.number().min(0, 'El precio debe ser mayor o igual a 0').optional(),
  tiempo_estimado: z.string().max(60).nullable().optional(),
  descripcion: z.string().max(500).nullable().optional(),
  notas: z.string().max(1000).nullable().optional(),
  modelo: z.string().max(300).nullable().optional(),
  activo: z.boolean().optional(),
});

export type CreateRepairCostDto = z.infer<typeof createRepairCostSchema>;
export type UpdateRepairCostDto = z.infer<typeof updateRepairCostSchema>;