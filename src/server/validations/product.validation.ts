import { z } from "zod";

export const createProductRequest = z.object({
  name: z.string().min(1).max(150),
  price: z.string().min(1).max(50),
  description: z.string().optional(),
  category_id: z.string(),
});

export const updateProductRequest = createProductRequest.partial();
