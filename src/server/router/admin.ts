import { createRouter } from "./context";
import { z } from "zod";

export const adminRouter = createRouter()
	.query("createEvent", {
		input: z.object({
			user: z.object({}),
		}),
		resolve({ input }) {
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
