import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { queryParams } from "@/server/validations/api.validation";
import {
  createOrderRequest,
  updateOrderRequest,
} from "@/server/validations/order.validation";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const orderRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        params: queryParams,
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { params } = input;
      const { page, limit, search, sort, order } = params;
      try {
        const skip = (page - 1) * limit;

        const totalCount = await db.order.count({
          ...(search && {
            where: {
              OR: [
                { label: { contains: search, mode: "insensitive" } },
                {
                  customer: {
                    name: { contains: search, mode: "insensitive" },
                  },
                  product: {
                    name: { contains: search, mode: "insensitive" },
                  },
                },
              ],
            },
          }),
        });

        const orders = await db.order.findMany({
          take: limit,
          skip,
          ...(search && {
            where: {
              OR: [
                { label: { contains: search, mode: "insensitive" } },
                {
                  customer: {
                    name: { contains: search, mode: "insensitive" },
                  },
                  product: {
                    name: { contains: search, mode: "insensitive" },
                  },
                },
              ],
            },
          }),
          orderBy: {
            [sort]: order,
          },
          include: {
            customer: {
              select: {
                name: true,
                phone: true,
                email: true,
                address: true,
              },
            },
            product: {
              select: {
                name: true,
              },
            },
            transaction: {
              select: {
                total_amount: true,
              },
            },
          },
        });

        const lastPage = Math.ceil(totalCount / limit);

        return {
          data: orders,
          meta: {
            total: totalCount,
            limit,
            page,
            last_page: lastPage,
          },
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
      const { db } = ctx;
      const { id } = input;
      try {
        const order = await db.order.findUnique({
          where: { id },
        });

        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Data pesanan dengan id : ${id} tidak ditemukan`,
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
