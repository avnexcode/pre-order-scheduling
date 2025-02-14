import { z } from "zod";

export const createProductCategoryRequest = z.object({
  name: z.string().min(1).max(150),
  description: z.string().optional(),
});

export const updateProductCategoryRequest = createProductCategoryRequest
  .partial()
  .extend({
    slug: z.string(),
  });
