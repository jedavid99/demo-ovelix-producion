import { z } from 'zod';

export const generateConfigPdfSchema = z.object({
  companyName: z.string().max(200).optional(),
  companyAddress: z.string().max(300).optional(),
  companyPhone: z.string().max(50).optional(),
  companyEmail: z.string().max(200).optional(),
  orderNumber: z.string().max(50).optional(),
  orderDate: z.string().max(50).optional(),
  clientName: z.string().max(200).optional(),
  clientPhone: z.string().max(50).optional(),
  clientEmail: z.string().max(200).optional(),
  deviceModel: z.string().max(200).optional(),
  deviceImei: z.string().max(50).optional(),
  deviceSerial: z.string().max(50).optional(),
  repairDescription: z.string().max(2000).optional(),
  totalPrice: z.string().max(50).optional(),
  warrantyMonths: z.number().int().min(0).max(600).optional(),
  warrantyTerms: z.string().max(500).optional(),
});

export type GenerateConfigPdfDto = z.infer<typeof generateConfigPdfSchema>;
