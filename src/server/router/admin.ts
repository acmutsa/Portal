import { createRouter } from "./context";
import { z } from "zod";

export const adminRouter = createRouter()
	.mutation("createEvent", {
		input: z.object({
			eventName: z.string(),
			eventDescription: z.string(),
			eventImage: z.string().optional(),
			eventOrg: z.string(),
			eventStart: z.date(),
			eventEnd: z.date(),
			formOpen: z.date(),
			formClose: z.date(),
		}),
		resolve({ input, ctx }) {
			console.log(ctx);
			return {
				status: "completed",
				eventID: "TBD",
			};
		},
	})
	.query("getAll", {
		async resolve({ ctx }) {
			return "Hello world";
		},
	});

// .query("hello", {
//   input: z
//     .object({
//       text: z.string().nullish(),
//     })
//     .nullish(),
//   resolve({ input }) {
//     return {
//       greeting: `Hello ${input?.text ?? "world"}`,
//     };
//   },
// })
