import { type z } from "zod";
import type {
  createCustomerFormSchema,
  updateCustomerFormSchema,
} from "../schemas";

export type CreateCustomerFormSchema = z.infer<typeof createCustomerFormSchema>;
export type UpdateCustomerFormSchema = z.infer<typeof updateCustomerFormSchema>;
