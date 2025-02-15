import { z } from "zod";

export const createCustomerFormSchema = z.object({
  name: z.string().min(1).max(150),
  email: z.string().email().min(1).max(150).optional(),
  address: z.string().min(1).max(255),
  phone: z.string().min(1).max(20),
});

export const updateCustomerFormSchema = createCustomerFormSchema.partial();
