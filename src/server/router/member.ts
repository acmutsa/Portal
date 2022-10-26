import { createRouter } from "@/server/router/context";

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
