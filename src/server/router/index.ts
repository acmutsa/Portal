// src/server/router/index.ts
import superjson from "superjson";

import { createRouter } from "@/server/router/context";
import { adminRouter } from "@/server/router/admin";
import { securedRouter } from "@/server/router/secured";
import { eventsRouter } from "@/server/router/events";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("admin.", adminRouter)
	.merge("secured.", securedRouter)
	.merge("events.", eventsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
