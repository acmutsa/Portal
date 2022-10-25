import { createRouter } from "@/server/router/context";

import { z } from "zod";

export const memberRouter = createRouter()
	.mutation("validateLogin", {
		input: z.object({
			email: z.string(),
			shortID: z.string(),
		}),
		async resolve({ input, ctx }) {
			let member = await ctx.prisma.member.findUnique({
				where: {
					shortID: input.shortID.toLowerCase(),
				},
			});

			return member && member.email == input.email.toLowerCase();
		},
	})
	.query("me", {
		async resolve({ ctx }) {
			let member = await ctx.prisma.member.findUnique({
				where: {
					shortID: ctx?.shortID?.toLowerCase(),
				},
			});

			if (member && member.email == ctx?.email?.toLowerCase()) return member;
			return null;
		},
	});
