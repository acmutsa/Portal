import { z } from "zod";
import { prisma } from "@/server/db/client";
import { OrganizationEnum } from "@/utils/transform";

export const SortOptionEnum = z.enum(["recent", "attendance"]);
export type SortOption = z.TypeOf<typeof SortOptionEnum>;

export const EventFilterSchema = z
	.object({
		past: z.boolean().or(z.date()),
		sort: SortOptionEnum,
		organizations: OrganizationEnum.array(),
		semesters: z.string().array(),
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

		// TODO: Semester filtering logic
		filters.past = filters.past ?? false;
		filters.organizations = filters.organizations ?? [];

		const whereObject = {
			AND: [
				filters.past !== true
					? { eventEnd: { gte: filters.past === false ? new Date() : filters.past } }
					: null,
				filters.organizations.length > 0
					? {
							OR: filters.organizations?.map((organizationName) => ({
								organization: { equals: organizationName },
							})),
					  }
					: null,
			],
		};

		// Remove any null filters from composition
		whereObject.AND = whereObject.AND.filter((v) => v != null);

		// Development only:
		// console.log(inspect(whereObject, { showHidden: false, depth: null, colors: true }));

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
