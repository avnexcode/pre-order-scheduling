import { type z } from "zod";
import type {
  createCategoryFormSchema,
  updateCategoryFormSchema,
} from "../schemas";

export type CreateCategoryFormSchema = z.infer<typeof createCategoryFormSchema>;
export type UpdateCategoryFormSchema = z.infer<typeof updateCategoryFormSchema>;
