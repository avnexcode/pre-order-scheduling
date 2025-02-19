import type { Prisma } from "@prisma/client";
import { type z } from "zod";
import type {
  createPaymentRecordFormSchema,
  updatePaymentRecordFormSchema,
} from "../schemas";

export type CreatePaymentRecordFormSchema = z.infer<
  typeof createPaymentRecordFormSchema
>;

export type UpdatePaymentRecordFormSchema = z.infer<
  typeof updatePaymentRecordFormSchema
>;

export type PaymentRecordWithRelations = Prisma.PaymentRecordGetPayload<{
  include: {
    transaction: true;
  };
}>;
