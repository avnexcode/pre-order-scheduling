import { z } from "zod";

export const createCategoryRequest = z.object({
  name: z.string().min(1).max(150),
  description: z.string().optional(),
});

export const updateCategoryRequest = createCategoryRequest.partial();
