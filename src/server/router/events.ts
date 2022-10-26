import { z } from "zod";
import { createRouter } from "@/server/router/context";

export const eventsRouter = createRouter()
	.query("getCurrent", {
		input: z.object({}).nullish(),
		async resolve({ ctx }) {
			return await ctx.prisma.events.findMany({
				where: {
					eventStart: {
						gte: new Date(),
					},
				},
				orderBy: {
					eventStart: "asc",
				},
			});
		},
	})
	.query("getAll", {
		async resolve({ ctx }) {
			return await ctx.prisma.events.findMany({
				orderBy: {
					eventStart: "asc",
				},
			});
		},
	});
