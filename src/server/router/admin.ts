import { z } from "zod";
import { nanoid } from "nanoid";
import { Context, createRouter } from "@/server/router/context";
import * as trpc from "@trpc/server";
import { env } from "@/env/server.mjs";

export const validateAdmin = async (
	ctx: Context | { admin_username: string; admin_password: string }
) => {
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

export const adminRouter = createRouter()
	.mutation("loggedIn", {
		input: z
			.object({
				username: z.string(),
				password: z.string(),
			})
			.nullish(),
		output: z.boolean(),
		async resolve({ input, ctx }) {
			if (input === null)
				// Use context if input is not provided.
				return ctx.admin_username != null && ctx.admin_password != null
					? ctx.admin_username == env.ADMIN_UNAME && ctx.admin_password == env.ADMIN_PASS
					: false;
			return input!.username == env.ADMIN_UNAME && input!.password == env.ADMIN_PASS;
		},
	})
	.mutation("createEvent", {
		input: z.object({
			name: z.string(),
			description: z.string(),
			headerImage: z.string(),
			organization: z.string(),
			semester: z.string().regex(/(?:Fall|Spring|Summer) 20\d{2}/),
			location: z.string(),
			eventStart: z.date(),
			eventEnd: z.date(),
			formOpen: z.date().nullish(),
			formClose: z.date().nullish(),
		}),
		async resolve({ input, ctx }) {
			await validateAdmin(ctx);

			// If the form close/open is unspecified, it automatically takes on the values of the event start/end.
			let { formClose, formOpen } = input;
			if (formClose == null || formOpen == null) {
				formOpen = input.eventStart;
				formClose = input.eventEnd;
			}

			return await ctx.prisma.event.create({
				data: {
					...input,
					formOpen,
					formClose,
					pageID: nanoid(7).toLowerCase(),
				},
			});
		},
	});
