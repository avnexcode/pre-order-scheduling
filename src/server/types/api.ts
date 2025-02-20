import { type z } from "zod";
import type { queryParams } from "../validations/api.validation";

export type QueryParams = z.infer<typeof queryParams>;
