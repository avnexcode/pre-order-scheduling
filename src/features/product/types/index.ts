import { type z } from "zod";
import type {
  createProductFormSchema,
  updateProductFormSchema,
} from "../schemas";

export type CreateProductFormSchema = z.infer<typeof createProductFormSchema>;
export type UpdateProductFormSchema = z.infer<typeof updateProductFormSchema>;
