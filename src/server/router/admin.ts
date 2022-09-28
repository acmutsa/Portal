import { createRouter } from "./context";
import { z } from "zod";
import { nanoid } from "nanoid";

export const adminRouter = createRouter()
	.mutation("createEvent", {
		input: z.object({
			eventName: z.string(),
			eventDescription: z.string(),
			eventImage: z.string().optional(),
			eventOrg: z.string(),
			eventLocation: z.string(),
			eventStart: z.date(),
			eventEnd: z.date(),
			formOpen: z.date(),
			formClose: z.date(),
		}),
		async resolve({ input, ctx }) {
			TODO: "add cookie validation here";
			let newEvent = await ctx.prisma.events.create({
				data: {
					name: input.eventName,
					description: input.eventDescription,
					headerImage: input.eventImage!,
					organization: input.eventOrg,
					location: input.eventLocation,
					eventStart: input.eventStart,
					eventEnd: input.eventEnd,
					formOpen: input.formOpen,
					formClose: input.formClose,
					pageID: nanoid(7).toLowerCase(),
				},
			});

			return {
				status: "success",
				event: newEvent,
			};
		},
	})
	.query("getAll", {
		async resolve({ ctx }) {
			return "Hello world";
		},
	});
