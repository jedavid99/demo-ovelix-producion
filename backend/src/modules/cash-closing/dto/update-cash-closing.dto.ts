import { z } from 'zod';

export const updateCashClosingSchema = z.object({
  expected_balance: z.number().positive().optional(),
  actual_balance: z.number().positive().optional(),
  bills_count: z.record(z.number()).optional(),
  notes: z.string().optional(),
  estado: z.string().optional(),
});

export type UpdateCashClosingDto = z.infer<typeof updateCashClosingSchema>;
