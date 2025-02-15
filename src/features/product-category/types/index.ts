import { type z } from "zod";
import type {
  createProductCategoryFormSchema,
  updateProductCategoryFormSchema,
} from "../schemas";

export type CreateProductCategoryFormSchema = z.infer<
  typeof createProductCategoryFormSchema
>;
export type UpdateProductCategoryFormSchema = z.infer<
  typeof updateProductCategoryFormSchema
>;
