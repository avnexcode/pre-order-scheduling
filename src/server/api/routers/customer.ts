import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  createCustomerRequest,
  updateCustomerRequest,
} from "@/server/validations/customer.validation";

export const customerRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const customers = await ctx.db.customer.findMany();
    return customers;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const customer = await ctx.db.customer.findUnique({ where: { id } });
      return customer;
    }),

  create: publicProcedure
    .input(createCustomerRequest)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.customer.create({
        data: input,
      });
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
      const customer = await db.customer.update({
        where: { id },
        data: request,
      });
      return customer;
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;
      const customer = await db.customer.delete({ where: { id } });
      return customer.id;
    }),
});
