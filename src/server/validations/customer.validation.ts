import { z } from "zod";

export const createCustomerRequest = z.object({
  name: z.string().min(1).max(150).toLowerCase(),
  email: z.string().email().max(150).optional(),
  address: z.string().min(1).max(255),
  phone: z
    .string()
    .min(1)
    .max(20)
    .regex(/^\d+$/, "Phone number must contain only numbers"),
});

export const updateCustomerRequest = createCustomerRequest.partial();
