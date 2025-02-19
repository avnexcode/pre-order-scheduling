import { z } from "zod";

export const createCategoryFormSchema = z.object({
  name: z.string().min(1).max(150),
  description: z.string().optional(),
});

export const updateCategoryFormSchema = createCategoryFormSchema.partial();
