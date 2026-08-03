import { z } from 'zod';

export const createCashClosingSchema = z.object({
  date: z.string().optional(),
  expected_balance: z.number().positive('El balance esperado debe ser positivo'),
  actual_balance: z.number().positive('El balance actual debe ser positivo'),
  bills_count: z.record(z.number()).optional(),
  notes: z.string().optional(),
});

export type CreateCashClosingDto = z.infer<typeof createCashClosingSchema>;
