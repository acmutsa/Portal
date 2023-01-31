import { z } from "zod";
import { sum } from "@/utils/helpers";
import { validateAdmin } from "@/server/router/admin";
import { EventFilterSchema, getEvents, getUnique } from "@/server/controllers/events";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "@/server/trpc";
import { getCheckin } from "@/server/controllers/checkin";
import { acquireMember } from "@/server/router/member";

export const eventsRouter = router({
	get: publicProcedure.input(EventFilterSchema).query(async function ({ ctx, input }) {
		return await getEvents(input);
	}),
	getUnique: publicProcedure
		.input(
			z
				.object({
					id: z.string(),
				})
				.or(
					z.object({
						pageID: z.string(),
					})
				)
		)
		.query(async function ({ input }) {
			const event = await getUnique(input);
			if (event == null)
				throw new TRPCError({
					message: "The event you requested could not be found.",
					code: "NOT_FOUND",
				});

			return event;
		}),
	getAll: publicProcedure.query(async function ({ ctx }) {
		return await ctx.prisma.event.findMany({
			orderBy: {
				eventStart: "asc",
			},
		});
	}),
	getGroupedCheckins: publicProcedure
		.input(
			z.object({
				startDate: z.date(),
			})
		)
		.query(async function ({ input, ctx }) {
			await validateAdmin(ctx);

			const events = (
				await ctx.prisma.event.findMany({
					where: {
						eventEnd: {
							gte: input.startDate,
						},
					},
					include: {
						_count: { select: { checkins: true } },
					},
				})
			)
				// .filter((event) => event._count.checkins > 0)
				.map((event) => {
					// Converts the event's end date to the first day of the week (monday)
					const week = event.eventEnd;
					week.setDate(week.getDate() - ((week.getDay() + 6) % 7));

					return {
						// name: event.name,
						// date: event.eventEnd,
						week: `${week.getMonth() + 1}/${week.getDate()}`,
						count: event._count.checkins,
					};
				});

			const now = new Date();
			const orderedWeekKeys = [input.startDate];
			while (1) {
				const nextWeek = new Date(orderedWeekKeys.at(-1)!);
				nextWeek.setDate(nextWeek.getDate() + 7);

				if (nextWeek < now) orderedWeekKeys.push(nextWeek);
				else break;
			}

			const grouped = events.reduce(function (allEvents, event) {
				// Make sure an array is available
				allEvents[event.week] = allEvents[event.week] || [];
				// Add the event to the array with it's group
				allEvents[event.week].push(event);
				return allEvents;
			}, Object.create(null));

			// TODO: Fix the type any on week
			return orderedWeekKeys
				.map((week) => `${week.getMonth() + 1}/${week.getDate()}`)
				.map((week) => ({
					label: week,
					count: (grouped[week] || []).map((week: any) => week.count).reduce(sum, 0),
				}));
		}),
	canCheckin: publicProcedure
		.input(
			z.object({
				eventId: z.string(),
			})
		)
		.query(async function () {
			// TODO: Implement canCheckin query
			return null;
		}),
	checkedIn: publicProcedure
		.input(
			z.object({
				eventId: z.string(),
			})
		)
		.query(async function ({ ctx, input }) {
			const self = await acquireMember(ctx);
			if (self == null) return false;
			return (await getCheckin(self.id, input.eventId)) != null;
		}),
});
