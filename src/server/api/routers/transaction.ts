import {
  createCategoryRequest,
  updateCategoryRequest,
} from "../../validations/category.validation";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateSlug } from "@/utils/slug-generator";

export const transactionRouter = createTRPCRouter({
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
        const Categories = await ctx.db.transaction.findMany({
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
                  total_amount: { contains: input.search, mode: "insensitive" },
                },
              ],
            },
          }),
          orderBy: {
            created_at: "desc",
          },
          include: {
            order: true,
          },
        });

        let nextCursor: string | undefined = undefined;

        if (Categories.length > input.limit) {
          const nextItem = Categories.pop();
          nextCursor = nextItem?.id;
        }

        return {
          items: Categories,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch  categories",
          cause: error,
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const transaction = await ctx.db.transaction.findUnique({
          where: { id: input.id },
          include: {
            payment_records: true,
            order: true,
          },
        });

        if (!transaction) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Transaction with ID ${input.id} not found`,
          });
        }

        return transaction;
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
    .input(createCategoryRequest)
    .mutation(async ({ ctx, input }) => {
      try {
        const existingCategory = await ctx.db.category.count({
          where: { name: input.name },
        });

        if (existingCategory !== 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: " category with this name already exists",
          });
        }

        let slug = generateSlug(input.name);

        const existsSlug = await ctx.db.category.count({
          where: {
            slug: {
              startsWith: slug,
            },
          },
        });

        if (existsSlug !== 0) {
          slug = generateSlug(input.name, true);
        }

        const Category = await ctx.db.category.create({
          data: {
            ...input,
            slug,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        return Category;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create  category",
          cause: error,
        });
      }
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
