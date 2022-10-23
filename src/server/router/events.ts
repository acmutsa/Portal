import { z } from "zod";
import { createRouter } from "@/server/router/context";

export const eventsRouter = createRouter().query("getMemberStatus", {
	async resolve({ ctx }) {
		return "Hello!";
	},
});
