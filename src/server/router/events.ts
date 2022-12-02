import { z } from "zod";
import { createRouter } from "@/server/router/context";
import { sum } from "@/utils/helpers";
import { validateAdmin } from "@/server/router/admin";
import { EventFilterSchema, getEvents } from "@/server/controllers/events";

export const eventsRouter = createRouter()
	.query("get", {
		input: EventFilterSchema,
		async resolve({ ctx, input }) {
			return await getEvents(input);
		},
	})
	.query("getAll", {
		async resolve({ ctx }) {
			return await ctx.prisma.event.findMany({
				orderBy: {
					eventStart: "asc",
				},
			});
		},
	})
	.query("getGroupedCheckins", {
		input: z.object({
			startDate: z.date(),
		}),
		async resolve({ input, ctx }) {
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
		},
	})
	.query("canCheckin", {
		input: z.object({
			eventId: z.string(),
		}),
		async resolve({ input, ctx }) {},
	});
