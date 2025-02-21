import type { Prisma } from "@prisma/client";

export type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: {
    order: true;
    payment_records: true;
  };
}>;
