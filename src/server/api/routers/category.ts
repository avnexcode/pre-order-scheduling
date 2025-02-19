import {
  createCategoryRequest,
  updateCategoryRequest,
} from "../../validations/category.validation";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateSlug } from "@/utils/slug-generator";

export const categoryRouter = createTRPCRouter({
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
        const categories = await ctx.db.category.findMany({
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

        if (categories.length > input.limit) {
          const nextItem = categories.pop();
          nextCursor = nextItem?.id;
        }

        return {
          items: categories,
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
        const category = await ctx.db.category.findUnique({
          where: { id: input.id },
        });

        if (!category) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: ` category with ID ${input.id} not found`,
          });
        }

        return category;
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

        const category = await ctx.db.category.create({
          data: {
            ...input,
            slug,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        return category;
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

        const category = await ctx.db.category.update({
          where: { id: input.id },
          data: {
            ...input.request,
            updated_at: new Date(),
          },
        });

        return category;
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

        const category = await ctx.db.category.delete({
          where: { id: input.id },
        });

        return category.id;
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
