import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { customerRouter } from "./routers/customer";
import { productRouter } from "./routers/product";
import { categoryRouter } from "./routers/category";
import { orderRouter } from "./routers/order";
import { transactionRouter } from "./routers/transaction";
import { paymentRecordRouter } from "./routers/payment-record";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  customer: customerRouter,
  category: categoryRouter,
  product: productRouter,
  order: orderRouter,
  transaction: transactionRouter,
  paymentRecord: paymentRecordRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
