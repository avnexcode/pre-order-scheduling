import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  createCustomerRequest,
  updateCustomerRequest,
} from "@/server/validations/customer.validation";

export const customerRouter = createTRPCRouter({
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
        const customers = await ctx.db.customer.findMany({
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
                { name: { contains: input.search, mode: "insensitive" } },
                { email: { contains: input.search, mode: "insensitive" } },
              ],
            },
          }),
          orderBy: {
            created_at: "desc",
          },
        });

        let nextCursor: string | undefined = undefined;
        if (customers.length > input.limit) {
          const nextItem = customers.pop();
          nextCursor = nextItem?.id;
        }

        return {
          items: customers,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch customers",
          cause: error,
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const customer = await ctx.db.customer.findUnique({
          where: { id: input.id },
        });

        if (!customer) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Customer with ID ${input.id} not found`,
          });
        }

        return customer;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch customer",
          cause: error,
        });
      }
    }),

  create: publicProcedure
    .input(createCustomerRequest)
    .mutation(async ({ ctx, input }) => {
      try {
        const existingCustomer = await ctx.db.customer.count({
          where: { email: input.email },
        });

        if (existingCustomer !== 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Customer with this email already exists",
          });
        }

        const customer = await ctx.db.customer.create({
          data: {
            ...input,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        return customer;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create customer",
          cause: error,
        });
      }
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        request: updateCustomerRequest,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingCustomer = await ctx.db.customer.findUnique({
          where: { id: input.id },
        });

        if (!existingCustomer) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Customer with ID ${input.id} not found`,
          });
        }

        if (
          input.request.email &&
          input.request.email !== existingCustomer.email
        ) {
          const emailExists = await ctx.db.customer.count({
            where: { email: input.request.email },
          });

          if (emailExists !== 0) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Customer with this email already exists",
            });
          }
        }

        const customer = await ctx.db.customer.update({
          where: { id: input.id },
          data: {
            ...input.request,
            updated_at: new Date(),
          },
        });

        return customer;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update customer",
          cause: error,
        });
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existingCustomer = await ctx.db.customer.findUnique({
          where: { id: input.id },
        });

        if (!existingCustomer) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Customer with ID ${input.id} not found`,
          });
        }

        const customer = await ctx.db.customer.delete({
          where: { id: input.id },
        });

        return customer.id;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete customer",
          cause: error,
        });
      }
    }),
});
