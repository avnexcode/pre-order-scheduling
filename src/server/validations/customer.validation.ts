import { z } from "zod";

export const createCustomerRequest = z.object({
  name: z.string().min(1).max(150).toLowerCase(),
  email: z
    .string()
    .max(150)
    .optional()
    .refine((email) => !email || /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)),
  address: z.string().min(1).max(255),
  phone: z
    .string()
    .min(1)
    .max(20)
    .regex(/^\d+$/, "Phone number must contain only numbers"),
});

export const updateCustomerRequest = createCustomerRequest.partial();
