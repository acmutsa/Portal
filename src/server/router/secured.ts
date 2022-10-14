import { createRouter } from "./context";
import { z } from "zod";

export const securedRouter = createRouter()
	.mutation("validateLoginMatch", {
		input: z.object({
			email: z.string(),
			shortID: z.string(),
		}),
		async resolve({ input, ctx }) {
			let member = await ctx.prisma.member.findUnique({
				where: {
					email: input.email.toLowerCase(),
					shortID: input.shortID.toLowerCase(),
				},
			});

			if (member) {
				return {
					isMember: true,
				};
			} else {
				return {
					isMember: false,
				};
			}
		},
	})
	.query("getAll", {
		async resolve({ ctx }) {
			return "Hello world";
		},
	});
