import { z } from "zod";
import { prisma, Event } from "@/server/db/client";
import { OrganizationType } from "@/utils/transform";
import { removeEmptyItems } from "@/utils/helpers";

export const SortOptionEnum = z.enum(["recent", "attendance"]);
export type SortOption = z.TypeOf<typeof SortOptionEnum>;

export const EventFilterSchema = z
	.object({
		past: z.boolean().or(z.date()),
		sort: SortOptionEnum,
		organizations: OrganizationType.array(),
		semesters: z.string().array(),
	})
	.partial()
	.nullish();
export type EventFilter = z.infer<typeof EventFilterSchema>;

export async function getUnique(input: { id: string } | { pageID: string }): Promise<Event | null> {
	return await prisma.event.findUnique({
		where: input,
	});
}

export async function getEvents(filters?: EventFilter) {
	if (filters != null) {
		// TODO: Add order reversing option
		const sort: SortOption = filters.sort ?? SortOptionEnum.enum.recent;
		let orderObject = {};
		if (sort == SortOptionEnum.enum.recent) orderObject = { eventEnd: "asc" };
		if (sort == SortOptionEnum.enum.attendance) orderObject = { checkins: { _count: "desc" } };

		filters.past = filters.past ?? false;
		filters.organizations = filters.organizations ?? [];
		filters.semesters = filters.semesters ?? [];

		const pastEventFilter =
			(filters.past ?? false) !== true
				? { eventEnd: { gte: filters.past === false ? new Date() : filters.past } }
				: null;

		const organizationsFilter =
			filters.organizations.length > 0
				? {
						OR: filters.organizations?.map((organizationName) => ({
							organization: { equals: organizationName },
						})),
				  }
				: null;
		const semestersFilter =
			filters.semesters.length > 0
				? {
						OR: filters.semesters.map((semesterName) => ({
							semester: { equals: semesterName },
						})),
				  }
				: null;

		const whereObject = {
			AND: removeEmptyItems([pastEventFilter, organizationsFilter, semestersFilter]),
		};

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

/**
 * Returns all distinct Semester values
 */
export async function getSemesters() {
	const events = await prisma.event.findMany({
		select: {
			semester: true,
		},
		distinct: ["semester"],
	});
	return events.map((e) => e.semester);
}
