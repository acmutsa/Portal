import { Context, createRouter } from "@/server/router/context";

import { z } from "zod";
import * as trpc from "@trpc/server";
import { validateAdmin } from "@/server/router/admin";
import { getAllMembers } from "@/server/controllers/member";

// Calling this method while passing your request context will ensure member credentials were provided.
export const validateMember = async (ctx: Context) => {
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
	.mutation("checkin", {
		input: z.object({
			eventID: z.string(),
		}),
		async resolve({ ctx }) {
			if (ctx?.id == null) return null;

			let member = await ctx.prisma.member.findUnique({
				where: {
					id: ctx?.id?.toLowerCase(),
				},
			});

			// TODO: Fix this. Something is probably not working right here...
			if (member && member.email == ctx?.email?.toLowerCase()) {
				let eventShortID = ctx?.id?.toLowerCase() || "error";
				let memberID = member?.id || "error";

				let checkin = await ctx.prisma.checkin.findMany({
					where: {
						event: {
							pageID: eventShortID,
						},
						member: {
							id: memberID,
						},
					},
					take: 1,
				});

				if (checkin.length == 0) {
					let record = await ctx.prisma.checkin.create({
						data: {
							event: {
								connect: {
									pageID: eventShortID,
								},
							},
							member: {
								connect: {
									id: memberID,
								},
							},
							isInPerson: true,
						},
					});

					return {
						success: true,
					};
				} else {
					return {
						success: false,
						reason: "",
					};
				}
			}
		},
	})
	.query("me", {
		async resolve({ ctx }) {
			if (ctx?.id == null) return null;

			let member = await ctx.prisma.member.findUnique({
				where: {
					id: ctx?.id?.toLowerCase(),
				},
			});

			if (member && member.email == ctx?.email?.toLowerCase()) return member;
			return null;
		},
	})
	.query("getAll", {
		async resolve({ ctx }) {
			await validateAdmin(ctx);
			return getAllMembers();
		},
	});
