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

export const createOrderRequest = z.object({
  label: z.string().min(1).max(100),
  description: z.string().optional(),
  total: z.string().min(1).max(50),
  status: z.enum(orderStatus).default("PENDING"),
  category: z.enum(orderCategory).default("WHOLESALE"),
  customer_id: z.string().min(1),
  product_id: z.string().min(1),
});

export const updateOrderRequest = createOrderRequest.partial();
