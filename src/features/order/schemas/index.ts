import { OrderCategory, OrderStatus } from "@prisma/client";
import { z } from "zod";

const orderStatus = Object.values(OrderStatus) as [
  OrderStatus,
  ...OrderStatus[],
];

const orderCategory = Object.values(OrderCategory) as [
  OrderCategory,
  ...OrderCategory[],
];

export const createOrderFormSchema = z.object({
  label: z.string().min(1).max(100),
  description: z.string().optional(),
  total: z.string().min(1).max(50),
  status: z.enum(orderStatus).default("PENDING"),
  category: z.enum(orderCategory).default("WHOLESALE"),
  product_id: z.string().min(1),
  customer_id: z.string().min(1),
});

export const updateOrderFormSchema = createOrderFormSchema.partial();
