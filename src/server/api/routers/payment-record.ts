import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { createPaymentRecordRequest } from "@/server/validations/payment-record.validation";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { updateCategoryRequest } from "../../validations/category.validation";
import { type TransactionStatus } from "@prisma/client";

export const paymentRecordRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(50),
        cursor: z.string().optional(),
        search: z.string().optional(),
        transaction_id: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        if (!input.transaction_id) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Data transaksi tidak ditemukan",
          });
        }

        const paymentRecords = await ctx.db.paymentRecord.findMany({
          where: { transaction_id: input.transaction_id },
          take: input.limit + 1,
          ...(input.cursor && {
            cursor: {
              id: input.cursor,
            },
            skip: 1,
          }),
          ...(input.search && {
            where: {
              OR: [
                {
                  amount: { contains: input.search, mode: "insensitive" },
                },
              ],
            },
          }),
          orderBy: {
            created_at: "desc",
          },
        });

        let nextCursor: string | undefined = undefined;

        if (paymentRecords.length > input.limit) {
          const nextItem = paymentRecords.pop();
          nextCursor = nextItem?.id;
        }

        return {
          items: paymentRecords,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch  payment records",
          cause: error,
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const Category = await ctx.db.category.findUnique({
          where: { id: input.id },
        });

        if (!Category) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: ` category with ID ${input.id} not found`,
          });
        }

        return Category;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch Category",
          cause: error,
        });
      }
    }),

  create: publicProcedure
    .input(createPaymentRecordRequest)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(async (db) => {
        try {
          const paymentRecord = await ctx.db.paymentRecord.create({
            data: input,
          });

          const transactionExists = await db.transaction.findUnique({
            where: { id: input.transaction_id },
          });

          if (!transactionExists) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Data transaksi tidak ditemukan",
            });
          }

          const amountPaid =
            Number(transactionExists.amount_paid) + Number(input.amount);

          const amountDue = Number(transactionExists.total_amount) - amountPaid;

          let transactionStatus: TransactionStatus;

          if (amountDue === 0) {
            transactionStatus = "PAID";
          } else {
            transactionStatus = "PARTIALLY_PAID";
          }

          await db.transaction.update({
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
            message: "Failed to create  category",
            cause: error,
          });
        }
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        request: updateCategoryRequest,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingCategory = await ctx.db.category.findUnique({
          where: { id: input.id },
        });

        if (!existingCategory) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: ` category with ID ${input.id} not found`,
          });
        }

        if (
          input.request.name &&
          input.request.name !== existingCategory.name
        ) {
          const nameExists = await ctx.db.category.count({
            where: { name: input.request.name },
          });

          if (nameExists !== 0) {
            throw new TRPCError({
              code: "CONFLICT",
              message: " category with this name already exists",
            });
          }
        }

        const Category = await ctx.db.category.update({
          where: { id: input.id },
          data: {
            ...input.request,
            updated_at: new Date(),
          },
        });

        return Category;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update  category",
          cause: error,
        });
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existingCategory = await ctx.db.category.count({
          where: { id: input.id },
        });

        if (existingCategory === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: ` category with ID ${input.id} not found`,
          });
        }

        const Category = await ctx.db.category.delete({
          where: { id: input.id },
        });

        return Category.id;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete  category",
          cause: error,
        });
      }
    }),
});
