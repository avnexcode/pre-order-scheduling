import { TransactionStatus } from "@prisma/client";
import { z } from "zod";

const transactionStatus = Object.values(TransactionStatus) as [
  TransactionStatus,
  ...TransactionStatus[],
];

export const createTransactionRequest = z.object({
  total_amount: z.string().min(1),
  amount_paid: z.string().min(1),
  amount_due: z.string().min(1),
  order_id: z.string().min(1),
  status: z.enum(transactionStatus).default("UNPAID"),
});

export const updateTransactionRequest = createTransactionRequest.partial();
