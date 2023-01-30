import { adminRouter } from "@/server/router/admin";
import { memberRouter } from "@/server/router/member";
import { eventsRouter } from "@/server/router/events";
import { router } from "@/server/trpc";

// export type definition of API
export const appRouter = router({
	admin: adminRouter,
	events: eventsRouter,
	member: memberRouter,
});

export type AppRouter = typeof appRouter;
