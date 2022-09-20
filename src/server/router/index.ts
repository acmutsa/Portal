// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { adminRouter } from "./admin";

export const appRouter = createRouter().transformer(superjson).merge("admin.", adminRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
