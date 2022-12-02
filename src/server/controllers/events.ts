import { z } from "zod";
import { prisma } from "@/server/db/client";
import { setProperty } from "dot-prop";

export const SortOptionEnum = z.enum(["recent", "attendance"]);
export type SortOption = z.TypeOf<typeof SortOptionEnum>;

export const EventFilterSchema = z
	.object({
		past: z.boolean().or(z.date()),
		sort: SortOptionEnum,
		organizations: z.record(z.string(), z.boolean()),
		semesters: z.record(z.string(), z.boolean()),
	})
	.partial()
	.nullish();
export type EventFilter = z.infer<typeof EventFilterSchema>;

export async function getEvents(filters?: EventFilter) {
	if (filters != null) {
		// TODO: Add order reversing option
		const sort: SortOption = filters.sort ?? SortOptionEnum.enum.recent;
		let orderObject = {};
		if (sort == SortOptionEnum.enum.recent) orderObject = { eventEnd: "asc" };
		if (sort == SortOptionEnum.enum.attendance) orderObject = { checkins: { _count: "desc" } };

		// TODO: Organization filtering logic
		// TODO: Semester filtering logic
		let whereObject = {};
		if (filters.past !== true)
			if (filters.past === false)
				whereObject = setProperty(whereObject, "eventEnd.gte", new Date());
			else whereObject = setProperty(whereObject, "eventEnd.gte", filters.past);

		return await prisma.event.findMany({
			orderBy: orderObject,
			where: whereObject,
		});
	}

	return await prisma.event.findMany({
		where: {
			eventEnd: {
				gte: new Date(),
			},
		},
		orderBy: {
			eventEnd: "asc",
		},
	});
}
