import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { queryParams } from "@/server/validations/api.validation";
import {
  createProductRequest,
  updateProductRequest,
} from "@/server/validations/product.validation";
import { generateSlug } from "@/utils/slug-generator";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const productRouter = createTRPCRouter({
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

        const totalCount = await db.product.count({
          ...(search && {
            where: {
              OR: [{ name: { contains: search, mode: "insensitive" } }],
            },
          }),
        });

        const products = await db.product.findMany({
          take: limit,
          skip,
          ...(search && {
            where: {
              OR: [{ name: { contains: search, mode: "insensitive" } }],
            },
          }),
          orderBy: {
            [sort]: order,
          },
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        });

        const lastPage = Math.ceil(totalCount / limit);

        return {
          data: products,
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
          message: "Failed to fetch products",
          cause: error,
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const product = await ctx.db.product.findUnique({
          where: { id: input.id },
        });

        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Product  with ID ${input.id} not found`,
          });
        }

        return product;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch product",
          cause: error,
        });
      }
    }),

  create: publicProcedure
    .input(createProductRequest)
    .mutation(async ({ ctx, input }) => {
      try {
        const existingProduct = await ctx.db.product.count({
          where: { name: input.name },
        });

        if (existingProduct !== 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Product  with this name already exists",
          });
        }

        let slug = generateSlug(input.name);

        const existsSlug = await ctx.db.product.count({
          where: {
            slug: {
              startsWith: slug,
            },
          },
        });

        if (existsSlug !== 0) {
          slug = generateSlug(input.name, true);
        }

        const product = await ctx.db.product.create({
          data: {
            ...input,
            slug,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        return product;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create product ",
          cause: error,
        });
      }
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        request: updateProductRequest,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingProduct = await ctx.db.product.findUnique({
          where: { id: input.id },
        });

        if (!existingProduct) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Product  with ID ${input.id} not found`,
          });
        }

        if (input.request.name && input.request.name !== existingProduct.name) {
          const nameExists = await ctx.db.product.count({
            where: { name: input.request.name },
          });

          if (nameExists !== 0) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Product  with this name already exists",
            });
          }
        }

        const product = await ctx.db.product.update({
          where: { id: input.id },
          data: {
            ...input.request,
            updated_at: new Date(),
          },
        });

        return product;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update product ",
          cause: error,
        });
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existingProduct = await ctx.db.product.count({
          where: { id: input.id },
        });

        if (existingProduct === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Product  with ID ${input.id} not found`,
          });
        }

        const product = await ctx.db.product.delete({
          where: { id: input.id },
        });

        return product.id;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete product ",
          cause: error,
        });
      }
    }),
});
