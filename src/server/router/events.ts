import { createRouter } from "./context";
import { z } from "zod";

export const eventsRouter = createRouter().query("getMemberStatus", {
	async resolve({ ctx }) {
		return "Hello!";
	},
});
