import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  createOrderRequest,
  updateOrderRequest,
} from "@/server/validations/order.validation";

export const orderRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(50),
        cursor: z.string().optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const orders = await ctx.db.order.findMany({
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
                { label: { contains: input.search, mode: "insensitive" } },
                {
                  customer: {
                    name: { contains: input.search, mode: "insensitive" },
                  },
                  product: {
                    name: { contains: input.search, mode: "insensitive" },
                  },
                },
              ],
            },
          }),
          orderBy: {
            created_at: "desc",
          },
          include: {
            customer: true,
            product: true,
            transaction: true,
          },
        });

        let nextCursor: string | undefined = undefined;
        if (orders.length > input.limit) {
          const nextItem = orders.pop();
          nextCursor = nextItem?.id;
        }

        return {
          items: orders,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch orders",
          cause: error,
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const order = await ctx.db.order.findUnique({
          where: { id: input.id },
        });

        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `order with ID ${input.id} not found`,
          });
        }

        return order;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch order",
          cause: error,
        });
      }
    }),

  create: publicProcedure
    .input(createOrderRequest)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(async (db) => {
        try {
          const existingOrder = await db.order.count({
            where: { label: input.label },
          });

          if (existingOrder !== 0) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Label untuk pesanan ini sudah digunakan",
            });
          }

          let order = await db.order.create({
            data: {
              ...input,
              transaction_id: null,
            },
          });

          const product = await db.product.findUnique({
            where: { id: input.product_id },
            select: {
              price: true,
            },
          });

          const totalAmount = Number(product?.price) * Number(order.total);

          const transaction = await db.transaction.create({
            data: {
              order_id: order.id,
              total_amount: String(totalAmount),
              amount_due: String(totalAmount),
            },
          });

          order = await db.order.update({
            where: { id: order.id },
            data: {
              transaction_id: transaction.id,
            },
          });

          return order;
        } catch (error) {
          console.log("ERROR FROM TRPC CREATE ORDER : ", error);
          if (error instanceof TRPCError) throw error;

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Sebuah kesalahan telah terjadi",
            cause: error,
          });
        }
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        request: updateOrderRequest,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingorder = await ctx.db.order.findUnique({
          where: { id: input.id },
        });

        if (!existingorder) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `order with ID ${input.id} not found`,
          });
        }

        if (
          input.request.label &&
          input.request.label !== existingorder.label
        ) {
          const emailExists = await ctx.db.order.count({
            where: { label: input.request.label },
          });

          if (emailExists !== 0) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "order with this email already exists",
            });
          }
        }

        const order = await ctx.db.order.update({
          where: { id: input.id },
          data: {
            ...input.request,
            updated_at: new Date(),
          },
        });

        return order;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update order",
          cause: error,
        });
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(async (db) => {
        try {
          const existingOrder = await db.order.findUnique({
            where: { id: input.id },
          });

          if (!existingOrder) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Data pesanan tidak ditemukan`,
            });
          }

          await db.transaction.delete({
            where: { id: existingOrder.transaction_id! },
          });

          const order = await db.order.delete({
            where: { id: input.id },
          });

          return order.id;
        } catch (error) {
          if (error instanceof TRPCError) throw error;

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete order",
            cause: error,
          });
        }
      });
    }),
});
