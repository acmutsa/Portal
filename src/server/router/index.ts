// src/server/router/index.ts
import superjson from "superjson";

import { createRouter } from "@/server/router/context";
import { adminRouter } from "@/server/router/admin";
import { memberRouter } from "@/server/router/member";
import { eventsRouter } from "@/server/router/events";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("admin.", adminRouter)
	.merge("member.", memberRouter)
	.merge("events.", eventsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
