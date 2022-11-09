import { createRouter } from "@/server/router/context";
import { resolve } from "path";

import { z } from "zod";

export const memberRouter = createRouter()
	.mutation("loggedIn", {
		input: z
			.object({
				email: z.string(),
				shortID: z.string(),
			})
			.nullish(),
		async resolve({ input, ctx }) {
			let email = ctx.email;
			let shortID = ctx.shortID;

			// If input is specified, use those automatically. Both won't be null/undefined by schema.
			if (input) {
				email = input.email;
				shortID = input.shortID;
			} else {
				// If either are nullish from context, we can't verify a login.
				if (!email || !shortID) return false;
			}

			let member = await ctx.prisma.member.findUnique({
				where: {
					shortID: shortID.toLowerCase(),
				},
			});

			return member && member.email == email.toLowerCase();
		},
	})
	.mutation("checkin", {
		input: z.object({
			eventID: z.string(),
		}),
		async resolve({ ctx }) {
			if (ctx?.shortID == null) return null;

			let member = await ctx.prisma.member.findUnique({
				where: {
					shortID: ctx?.shortID?.toLowerCase(),
				},
			});

			if (member && member.email == ctx?.email?.toLowerCase()) {
				let eventShortID = ctx?.shortID?.toLowerCase() || "error";
				let memberID = member?.id || "error";

				let checkin = await ctx.prisma.checkin.findMany({
					where: {
						event: {
							pageID: eventShortID,
						},
						member: {
							shortID: memberID,
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
				}
			}
		},
	})
	.query("me", {
		async resolve({ ctx }) {
			if (ctx?.shortID == null) return null;

			let member = await ctx.prisma.member.findUnique({
				where: {
					shortID: ctx?.shortID?.toLowerCase(),
				},
			});

			if (member && member.email == ctx?.email?.toLowerCase()) return member;
			return null;
		},
	});
