// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { adminRouter } from "./admin";
import { securedRouter } from "./secured";
import { eventsRouter } from "./events";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("admin.", adminRouter)
	.merge("secured.", securedRouter)
	.merge("events.", eventsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
