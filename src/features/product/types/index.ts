import { type z } from "zod";
import type {
  createProductFormSchema,
  updateProductFormSchema,
} from "../schemas";
import type { Prisma } from "@prisma/client";

export type CreateProductFormSchema = z.infer<typeof createProductFormSchema>;
export type UpdateProductFormSchema = z.infer<typeof updateProductFormSchema>;

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: {
      select: {
        name: true;
      };
    };
  };
}>;
