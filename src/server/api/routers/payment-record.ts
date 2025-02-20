import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  createPaymentRecordRequest,
  updatePaymentRecordRequest,
} from "@/server/validations/payment-record.validation";
import { type TransactionStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const paymentRecordRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;
      try {
        const paymentRecord = await db.paymentRecord.findUnique({
          where: { id },
        });

        if (!paymentRecord) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Riwayat pembayaran dengan id : ${id} tidak ditemukan`,
          });
        }

        return paymentRecord;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch payment record",
          cause: error,
        });
      }
    }),
  create: publicProcedure
    .input(createPaymentRecordRequest)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      await db.$transaction(async (tx) => {
        try {
          const transactionExists = await tx.transaction.findUnique({
            where: { id: input.transaction_id },
          });

          if (!transactionExists) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Data transaksi tidak ditemukan",
            });
          }

          if (Number(input.amount) > Number(transactionExists.amount_due)) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Nominal pembayaran terlalu besar",
            });
          }
          const paymentRecord = await tx.paymentRecord.create({
            data: input,
          });

          const amountPaid =
            Number(transactionExists.amount_paid) + Number(input.amount);

          const amountDue = Number(transactionExists.total_amount) - amountPaid;

          let transactionStatus: TransactionStatus;

          if (amountDue === 0) {
            transactionStatus = "PAID";
          } else {
            transactionStatus = "PARTIALLY_PAID";
          }

          await tx.transaction.update({
            where: { id: input.transaction_id },
            data: {
              amount_paid: String(amountPaid),
              amount_due: String(amountDue),
              status: transactionStatus,
            },
          });

          return paymentRecord;
        } catch (error) {
          if (error instanceof TRPCError) throw error;

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create payment record",
            cause: error,
          });
        }
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        request: updatePaymentRecordRequest,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, request } = input;

      return await db.$transaction(async (tx) => {
        try {
          const existingPaymentRecord = await tx.paymentRecord.findUnique({
            where: { id },
            include: {
              transaction: true,
            },
          });

          if (!existingPaymentRecord) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Riwayat pembayaran dengan id : ${id} tidak ditemukan`,
            });
          }

          const amountDifference =
            Number(request.amount) - Number(existingPaymentRecord.amount);

          const transaction = existingPaymentRecord.transaction;
          const newAmountPaid =
            Number(transaction.amount_paid) + amountDifference;
          const newAmountDue = Number(transaction.total_amount) - newAmountPaid;

          if (newAmountDue < 0) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Nominal pembayaran terlalu besar",
            });
          }

          let transactionStatus: TransactionStatus;
          if (newAmountDue === 0) {
            transactionStatus = "PAID";
          } else {
            transactionStatus = "PARTIALLY_PAID";
          }

          const updatedPaymentRecord = await tx.paymentRecord.update({
            where: { id },
            data: request,
          });

          await tx.transaction.update({
            where: { id: existingPaymentRecord.transaction_id },
            data: {
              amount_paid: String(newAmountPaid),
              amount_due: String(newAmountDue),
              status: transactionStatus,
            },
          });

          return updatedPaymentRecord;
        } catch (error) {
          if (error instanceof TRPCError) throw error;

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update payment record",
            cause: error,
          });
        }
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;

      return await db.$transaction(async (tx) => {
        try {
          const paymentRecordExists = await tx.paymentRecord.findUnique({
            where: { id },
            include: {
              transaction: true,
            },
          });

          if (!paymentRecordExists) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Riwayat pembayaran dengan ID: ${id} tidak ditemukan`,
            });
          }

          const transaction = paymentRecordExists.transaction;
          const newAmountPaid =
            Number(transaction.amount_paid) -
            Number(paymentRecordExists.amount);
          const newAmountDue = Number(transaction.total_amount) - newAmountPaid;

          let transactionStatus: TransactionStatus;
          if (newAmountPaid === 0) {
            transactionStatus = "UNPAID";
          } else if (newAmountDue === 0) {
            transactionStatus = "PAID";
          } else {
            transactionStatus = "PARTIALLY_PAID";
          }

          await tx.transaction.update({
            where: { id: paymentRecordExists.transaction_id },
            data: {
              amount_paid: String(newAmountPaid),
              amount_due: String(newAmountDue),
              status: transactionStatus,
            },
          });

          const paymentRecord = await tx.paymentRecord.delete({
            where: { id },
          });

          return paymentRecord.id;
        } catch (error) {
          if (error instanceof TRPCError) throw error;

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete payment record",
            cause: error,
          });
        }
      });
    }),
});
