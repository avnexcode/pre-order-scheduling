import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { queryParams } from "@/server/validations/api.validation";
import {
  createCustomerRequest,
  updateCustomerRequest,
} from "@/server/validations/customer.validation";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const customerRouter = createTRPCRouter({
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

        const totalCount = await db.customer.count({
          ...(search && {
            where: {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            },
          }),
        });

        const customers = await db.customer.findMany({
          take: limit,
          skip,
          ...(search && {
            where: {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            },
          }),
          orderBy: {
            [sort]: order,
          },
        });

        const lastPage = Math.ceil(totalCount / limit);

        return {
          data: customers,
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
          message: "Failed to fetch customers",
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
        const customer = await db.customer.findUnique({
          where: { id: id },
        });

        if (!customer) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Data pelanggan dengan id : ${id} tidak ditemukan`,
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
      const { db } = ctx;
      const { email, phone, name } = input;
      try {
        const existingCustomerEmail = await db.customer.count({
          where: { email },
        });

        if (existingCustomerEmail !== 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Alamat email sudah digunakan pelanggan lain",
          });
        }

        const existingCustomerPhone = await db.customer.count({
          where: { phone },
        });

        if (existingCustomerPhone !== 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Nomor HP sudah digunakan pelanggan lain",
          });
        }

        const existingCustomerName = await db.customer.count({
          where: { name },
        });

        if (existingCustomerName !== 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Nama pelanggan sudah digunakan",
          });
        }

        const customer = await db.customer.create({
          data: input,
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
        id: z.string(),
        request: updateCustomerRequest,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, request } = input;
      const { email, phone, name } = request;
      try {
        const existingCustomer = await ctx.db.customer.findUnique({
          where: { id },
        });

        if (!existingCustomer) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Data pelanggan dengan id : ${id} tidak ditemukan`,
          });
        }

        if (email && email !== existingCustomer.email) {
          const emailExists = await db.customer.count({
            where: { email },
          });

          if (emailExists !== 0) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Alamat email sudah digunakan pelanggan lain",
            });
          }
        }

        if (phone && phone !== existingCustomer.phone) {
          const phoneExists = await db.customer.count({ where: { phone } });
          if (phoneExists !== 0) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Nomor HP sudah digunakan pelanggan lain",
            });
          }
        }

        if (name && name !== existingCustomer.name) {
          const nameExists = await db.customer.count({ where: { name } });
          if (nameExists !== 0) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Nama pelanggan sudah digunakan",
            });
          }
        }

        const customer = await ctx.db.customer.update({
          where: { id },
          data: request,
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
      const { db } = ctx;
      const { id } = input;
      try {
        const existingCustomer = await db.customer.count({
          where: { id },
        });

        if (existingCustomer === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Data pelanggan dengan id : ${id} tidak ditemukan`,
          });
        }

        const customer = await db.customer.delete({
          where: { id },
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
