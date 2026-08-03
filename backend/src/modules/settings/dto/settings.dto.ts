import { z } from 'zod';

export const createRepairStateRequestSchema = z.object({
  estado_nombre: z.string().min(1, 'El nombre del estado es requerido').max(100),
  mensaje: z.string().max(500).optional(),
});

export const updateRepairStateRequestSchema = z.object({
  estado: z.string().min(1, 'El estado es requerido'),
});

export const createPaymentMethodSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100),
  descripcion: z.string().max(300).optional(),
  activo: z.boolean().optional(),
});

export const updatePaymentMethodSchema = z.object({
  nombre: z.string().min(1, 'El nombre no puede estar vacío').max(100).optional(),
  descripcion: z.string().max(300).optional(),
  activo: z.boolean().optional(),
});

export const createTaxRateSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100),
  porcentaje: z.number().min(0).max(100),
  seccion: z.string().max(100).optional(),
  descripcion: z.string().max(300).optional(),
  activo: z.boolean().optional(),
});

export const updateTaxRateSchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
  porcentaje: z.number().min(0).max(100).optional(),
  seccion: z.string().max(100).optional(),
  descripcion: z.string().max(300).optional(),
  activo: z.boolean().optional(),
});

export const createBankAccountSchema = z.object({
  alias: z.string().max(100).optional(),
  cbu: z.string().max(50).optional(),
  numero_cuenta: z.string().max(50).optional(),
  banco: z.string().max(100).optional(),
  titular: z.string().max(150).optional(),
});

export const updateBankAccountSchema = z.object({
  alias: z.string().max(100).optional(),
  cbu: z.string().max(50).optional(),
  numero_cuenta: z.string().max(50).optional(),
  banco: z.string().max(100).optional(),
  titular: z.string().max(150).optional(),
  activo: z.boolean().optional(),
});

export const updateNotificationPreferenceSchema = z.object({
  activo: z.boolean(),
});

export const updateIntegrationSchema = z.object({
  conectado: z.boolean(),
});

export const updatePlanSchema = z.object({
  plan: z.string().optional(),
  meses: z.number().int().min(1).optional(),
  activo: z.boolean().optional(),
});

export const createCategorySchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100),
  descripcion: z.string().max(300).optional(),
});

export const updateCategorySchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
  descripcion: z.string().max(300).optional(),
});

export type CreateRepairStateRequestDto = z.infer<typeof createRepairStateRequestSchema>;
export type UpdateRepairStateRequestDto = z.infer<typeof updateRepairStateRequestSchema>;
export type CreatePaymentMethodDto = z.infer<typeof createPaymentMethodSchema>;
export type UpdatePaymentMethodDto = z.infer<typeof updatePaymentMethodSchema>;
export type CreateTaxRateDto = z.infer<typeof createTaxRateSchema>;
export type UpdateTaxRateDto = z.infer<typeof updateTaxRateSchema>;
export type CreateBankAccountDto = z.infer<typeof createBankAccountSchema>;
export type UpdateBankAccountDto = z.infer<typeof updateBankAccountSchema>;
export type UpdateNotificationPreferenceDto = z.infer<typeof updateNotificationPreferenceSchema>;
export type UpdateIntegrationDto = z.infer<typeof updateIntegrationSchema>;
export type UpdatePlanDto = z.infer<typeof updatePlanSchema>;
export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
