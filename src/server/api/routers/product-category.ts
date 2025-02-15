import {
  createProductCategoryRequest,
  updateProductCategoryRequest,
} from "./../../validations/product-category.validation";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateSlug } from "@/utils/slug-generator";

export const productCategoryRouter = createTRPCRouter({
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
        const productCategories = await ctx.db.productCategory.findMany({
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
        const productCategory = await ctx.db.productCategory.findUnique({
          where: { id: input.id },
        });

        if (!productCategory) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Product category with ID ${input.id} not found`,
          });
        }

        return productCategory;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch productCategory",
          cause: error,
        });
      }
    }),

  create: publicProcedure
    .input(createProductCategoryRequest)
    .mutation(async ({ ctx, input }) => {
      try {
        const existingProductCategory = await ctx.db.productCategory.count({
          where: { name: input.name },
        });

        if (existingProductCategory !== 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Product category with this name already exists",
          });
        }

        let slug = generateSlug(input.name);

        const existsSlug = await ctx.db.productCategory.count({
          where: {
            slug: {
              startsWith: slug,
            },
          },
        });

        if (existsSlug !== 0) {
          slug = generateSlug(input.name, true);
        }

        const productCategory = await ctx.db.productCategory.create({
          data: {
            ...input,
            slug,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        return productCategory;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create product category",
          cause: error,
        });
      }
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        request: updateProductCategoryRequest,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingProductCategory = await ctx.db.productCategory.findUnique(
          {
            where: { id: input.id },
          },
        );

        if (!existingProductCategory) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Product category with ID ${input.id} not found`,
          });
        }

        if (
          input.request.name &&
          input.request.name !== existingProductCategory.name
        ) {
          const nameExists = await ctx.db.productCategory.count({
            where: { name: input.request.name },
          });

          if (nameExists !== 0) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Product category with this name already exists",
            });
          }
        }

        const productCategory = await ctx.db.productCategory.update({
          where: { id: input.id },
          data: {
            ...input.request,
            updated_at: new Date(),
          },
        });

        return productCategory;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update product category",
          cause: error,
        });
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existingProductCategory = await ctx.db.productCategory.count({
          where: { id: input.id },
        });

        if (existingProductCategory === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Product category with ID ${input.id} not found`,
          });
        }

        const productCategory = await ctx.db.productCategory.delete({
          where: { id: input.id },
        });

        return productCategory.id;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete product category",
          cause: error,
        });
      }
    }),
});
