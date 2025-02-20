import { z } from "zod";

export const queryParams = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).default(10),
  search: z.string().optional(),
  sort: z.string().optional().default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
});
