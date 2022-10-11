import { createRouter } from "./context";
import { z } from "zod";
import { nanoid } from "nanoid";

export const securedRouter = createRouter()
	.mutation("checkinToEvent", {
		input: z.object({
			eventID: z.string(),
		}),
		async resolve({ input, ctx }) {
			// TODO: add cookie validation here
			// let newEvent = await ctx.prisma.events.create({
			// 	data: {
			// 		name: input.eventName,
			// 		description: input.eventDescription,
			// 		headerImage: input.eventImage!,
			// 		organization: input.eventOrg,
			// 		location: input.eventLocation,
			// 		eventStart: input.eventStart,
			// 		eventEnd: input.eventEnd,
			// 		formOpen: input.formOpen,
			// 		formClose: input.formClose,
			// 		pageID: nanoid(7).toLowerCase(),
			// 	},
			// });

			return {
				status: "success",
			};
		},
	})
	.query("getAll", {
		async resolve({ ctx }) {
			return "Hello world";
		},
	});
