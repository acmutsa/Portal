import { Context, createRouter } from "@/server/router/context";

import { z } from "zod";
import * as trpc from "@trpc/server";
import { validateAdmin } from "@/server/router/admin";
import { getAllMembers } from "@/server/controllers/member";
import { isCheckinOpen, getCheckin } from "@/server/controllers/checkin";
import { Member } from "@prisma/client";
import { TRPCError } from "@trpc/server";

// Calling this method while passing your request context will ensure member credentials were provided.
export const validateMember = async (ctx: Context): Promise<Member> => {
	if (ctx.email == null || ctx.id == null)
		throw new trpc.TRPCError({
			code: "UNAUTHORIZED",
			message:
				"Member-level credentials are required for this resource, whereas nothing was provided.",
		});

	let member = await ctx.prisma.member.findUnique({
		where: {
			id: ctx.id.toLowerCase(),
		},
	});

	if (member == null || member.email != ctx.email.toLowerCase())
		throw new trpc.TRPCError({
			code: "UNAUTHORIZED",
			message:
				"Valid member-level credentials are required for this resource; what was provided was invalid.",
		});

	return member;
};

export const memberRouter = createRouter()
	.mutation("loggedIn", {
		input: z
			.object({
				email: z.string(),
				id: z.string(),
			})
			.nullish(),
		output: z.boolean(),
		async resolve({ input, ctx }) {
			let email = ctx.email;
			let id = ctx.id;

			// If input is specified, use those automatically. Both won't be null/undefined by schema.
			if (input) {
				email = input.email;
				id = input.id;
			} else {
				// If either are nullish from context, we can't verify a login.
				if (!email || !id) return false;
			}

			let member = await ctx.prisma.member.findUnique({
				where: {
					id: id.toLowerCase(),
				},
			});

			return member != null && member.email == email.toLowerCase();
		},
	})
	/**
	 * Checks if the given form is available to check-in to.
	 * Requires member login.
	 * Provide either the event pageID or full ID.
	 */
	.query("checkinOpen", {
		input: z
			.object({
				pageID: z.string().min(1),
				id: z.string().min(1),
			})
			.partial()
			.refine(
				(data) => data.pageID != undefined || data.id != undefined,
				"Either pageID or id should be specified"
			),
		async resolve({ ctx, input }) {
			if (input.pageID === undefined && input.id === undefined) await validateMember(ctx);
			const event = await ctx.prisma.event.findUnique({
				where: input.pageID != undefined ? { pageID: input.pageID } : { id: input.id },
			});

			if (event == null)
				throw new TRPCError({
					message: "The event you are looking for does not exist.",
					code: "NOT_FOUND",
				});

			return isCheckinOpen(event);
		},
	})
	.mutation("checkin", {
		input: z
			.object({
				pageID: z.string(),
				id: z.string(),
				feedback: z.string().nullish(),
			})
			.partial()
			.refine(
				(data) => data.pageID !== undefined || data.id !== undefined,
				"Either pageID or id should be specified"
			),
		async resolve({ ctx, input }) {
			const self = await validateMember(ctx);
			const event = await ctx.prisma.event.findUnique({
				where: input.pageID != undefined ? { pageID: input.pageID } : { id: input.id },
			});

			if (event == null)
				throw new TRPCError({
					message: "The event you are trying to check into does not exist.",
					code: "NOT_FOUND",
				});

			const existing_checkin = await getCheckin(self.id, event.id);
			if (existing_checkin != null)
				throw new TRPCError({
					message: "You have already checked in for this event.",
					code: "CONFLICT",
				});

			if (!isCheckinOpen(event))
				throw new TRPCError({
					message: "You cannot checkin to this event anymore, the form has closed.",
					code: "PRECONDITION_FAILED",
				});

			await ctx.prisma.checkin.create({
				data: {
					event: {
						connect: {
							id: event.id,
						},
					},
					member: {
						connect: {
							id: self.id,
						},
					},
					isInPerson: true,
					feedback: input.feedback,
				},
			});
		},
	})
	.query("me", {
		async resolve({ ctx }) {
			return await validateMember(ctx);
		},
	})
	.query("getAll", {
		async resolve({ ctx }) {
			await validateAdmin(ctx);
			return getAllMembers(true);
		},
	});
