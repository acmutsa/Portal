import { z } from "zod";
import { nanoid } from "nanoid";
import { createRouter, Context } from "@/server/router/context";
import * as trpc from "@trpc/server";
import { env } from "@/env/server.mjs";

export const validateAdmin = async (ctx: Context) => {
	if (ctx.admin_username == null || ctx.admin_password == null)
		throw new trpc.TRPCError({
			code: "UNAUTHORIZED",
			message:
				"Admin-level credentials are required for this resource, whereas nothing was provided.",
		});

	if (ctx.admin_username != env.ADMIN_UNAME || ctx.admin_password != env.ADMIN_PASS)
		throw new trpc.TRPCError({
			code: "UNAUTHORIZED",
			message:
				"Valid admin-level credentials are required for this resource, whereas nothing was provided.",
		});
};

export const adminRouter = createRouter().mutation("createEvent", {
	input: z.object({
		eventName: z.string(),
		eventDescription: z.string(),
		eventImage: z.string().optional(),
		eventOrg: z.string(),
		eventLocation: z.string(),
		eventStart: z.date(),
		eventEnd: z.date(),
		formOpen: z.date(),
		formClose: z.date(),
	}),
	async resolve({ input, ctx }) {
		await validateAdmin(ctx);

		let newEvent = await ctx.prisma.event.create({
			data: {
				name: input.eventName,
				description: input.eventDescription,
				headerImage: input.eventImage!,
				organization: input.eventOrg,
				location: input.eventLocation,
				eventStart: input.eventStart,
				eventEnd: input.eventEnd,
				formOpen: input.formOpen,
				formClose: input.formClose,
				pageID: nanoid(7).toLowerCase(),
			},
		});

		return {
			status: "success",
			event: newEvent,
		};
	},
});
