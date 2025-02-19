import { z } from "zod";

export const createPaymentRecordFormSchema = z.object({
  amount: z.string().min(1),
});

export const updatePaymentRecordFormSchema =
  createPaymentRecordFormSchema.partial();
