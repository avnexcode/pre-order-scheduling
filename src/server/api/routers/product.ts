import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateSlug } from "@/utils/slug-generator";
import {
  createProductRequest,
  updateProductRequest,
} from "@/server/validations/product.validation";

export const productRouter = createTRPCRouter({
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
        const productCategories = await ctx.db.product.findMany({
          take: input.limit + 1,
          ...(input.cursor && {
            cursor: {
              id: input.cursor,
            },
            skip: 1,
          }),
          ...(input.search && {
            where: {
              OR: [{ name: { contains: input.search, mode: "insensitive" } }],
            },
          }),
          orderBy: {
            created_at: "desc",
          },
        });

        let nextCursor: string | undefined = undefined;

        if (productCategories.length > input.limit) {
          const nextItem = productCategories.pop();
          nextCursor = nextItem?.id;
        }

        return {
          items: productCategories,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch product categories",
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
