import { z } from "zod";
import { nanoid } from "nanoid";
import { env } from "@/env/server.mjs";
import { getUnique } from "@/server/controllers/events";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "@/server/trpc";
import { Context } from "@/server/context";

export const validateAdmin = async (
	ctx: Context | { admin_username: string; admin_password: string }
) => {
	if (ctx.admin_username == null || ctx.admin_password == null)
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message:
				"Admin-level credentials are required for this resource, whereas nothing was provided.",
		});

	if (ctx.admin_username != env.ADMIN_UNAME || ctx.admin_password != env.ADMIN_PASS)
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message:
				"Valid admin-level credentials are required for this resource, whereas nothing was provided.",
		});
};

export const adminRouter = router({
	loggedIn: publicProcedure
		.input(
			z
				.object({
					username: z.string(),
					password: z.string(),
				})
				.nullish()
		)
		.output(z.boolean())
		.mutation(async ({ input, ctx }) => {
			if (input === null)
				// Use context if input is not provided.
				return ctx.admin_username != null && ctx.admin_password != null
					? ctx.admin_username == env.ADMIN_UNAME && ctx.admin_password == env.ADMIN_PASS
					: false;
			return input!.username == env.ADMIN_UNAME && input!.password == env.ADMIN_PASS;
		}),
	createEvent: publicProcedure
		.input(
			z.object({
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
			})
		)
		.mutation(async ({ input, ctx }) => {
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
		}),
	updateEvent: publicProcedure
		.input(
			z
				.object({
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
				})
				.partial()
				.and(
					z.object({
						id: z.string(),
					})
				)
		)
		.mutation(async function ({ input, ctx }) {
			await validateAdmin(ctx);

			// If the form close/open is unspecified, it automatically takes on the values of the event start/end.
			let { formClose, formOpen } = input;
			if (formClose == null || formOpen == null) {
				formOpen = input.eventStart;
				formClose = input.eventEnd;
			}

			return await ctx.prisma.event.update({
				where: {
					id: input.id,
				},
				data: {
					...input,
					formOpen,
					formClose,
				},
			});
		}),
	deleteEvent: publicProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.mutation(async function ({ input, ctx }) {
			await validateAdmin(ctx);

			const event = await getUnique({ id: input.id });

			if (event == null)
				throw new TRPCError({
					message: "The event you tried to delete does not exist.",
					code: "NOT_FOUND",
				});

			await ctx.prisma.event.delete({
				where: {
					id: input.id,
				},
			});
		}),
	massCreateCheckins: publicProcedure
		.input(
			z.object({
				eventID: z.string(),
				memberIDs: z.set(z.string()),
			})
		)
		.mutation(async function ({ input, ctx }) {
			await validateAdmin(ctx);

			const event = await getUnique({ id: input.eventID });

			if (event == null)
				throw new TRPCError({
					message: "The event you tried to add check-ins to does not exist.",
					code: "NOT_FOUND",
				});

			const res = await ctx.prisma.checkin.createMany({
				data: Array.from(input.memberIDs).map((memberID) => ({
					eventID: input.eventID,
					memberID: memberID.toLowerCase(),
					isInPerson: true,
				})),
				skipDuplicates: true,
			});

			return res;
		}),
});
