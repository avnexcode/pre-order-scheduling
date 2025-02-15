import { z } from "zod";

export const createProductCategoryFormSchema = z.object({
  name: z.string().min(1).max(150),
  description: z.string().min(1).optional(),
});

export const updateProductCategoryFormSchema =
  createProductCategoryFormSchema.partial();
