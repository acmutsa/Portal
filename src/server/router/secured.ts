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
					shortID: input.shortID.toLowerCase(),
				},
			});
			if (member && member.email == input.email.toLowerCase()) {
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
	.query("getMemberStatus", {
		async resolve({ ctx }) {
			return "Hello!";
		},
	});
