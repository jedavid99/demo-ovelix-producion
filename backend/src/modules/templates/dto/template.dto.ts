import { z } from 'zod';

export const createEmailTemplateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  subject: z.string().min(1, 'El asunto es requerido').max(300),
  body: z.string().min(1, 'El cuerpo es requerido'),
  type: z.string().max(50).optional(),
  variables: z.array(z.string()).optional(),
});

export const updateEmailTemplateSchema = createEmailTemplateSchema.partial();

export const createWhatsAppTemplateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  message: z.string().min(1, 'El mensaje es requerido'),
  type: z.string().max(50).optional(),
  variables: z.array(z.string()).optional(),
});

export const updateWhatsAppTemplateSchema = createWhatsAppTemplateSchema.partial();

export const sendTemplateSchema = z.object({
  templateId: z.string().uuid('templateId debe ser un UUID válido'),
  userIds: z.array(z.string().uuid('userIds deben ser UUIDs válidos')).min(1, 'Debe seleccionar al menos un usuario'),
  companyId: z.string().uuid('companyId debe ser un UUID válido'),
});

export type CreateEmailTemplateDto = z.infer<typeof createEmailTemplateSchema>;
export type UpdateEmailTemplateDto = z.infer<typeof updateEmailTemplateSchema>;
export type CreateWhatsAppTemplateDto = z.infer<typeof createWhatsAppTemplateSchema>;
export type UpdateWhatsAppTemplateDto = z.infer<typeof updateWhatsAppTemplateSchema>;
export type SendTemplateDto = z.infer<typeof sendTemplateSchema>;
