import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from "next";
import AdminRootLayout from "@/components/admin/AdminRootLayout";
import Stat from "@/components/common/Stat";
import { pluralize } from "@/utils/helpers";
import Link from "next/link";
import { BsPlus } from "react-icons/bs";
import EventDataTable, { EventWithCount } from "@/components/admin/EventDataTable";
import React, { useMemo } from "react";
import { isAfter } from "date-fns";
import superjson from "superjson";
import { getAllEventsWithCount } from "@/server/controllers/events";

type EventViewProps = {
	events: EventWithCount[];
};

export async function getStaticProps({}: GetStaticPropsContext): Promise<
	GetStaticPropsResult<{ json: string }>
> {
	const events = await getAllEventsWithCount();

	return {
		props: {
			json: superjson.stringify({
				events: events.map((event) => ({
					...event,
					checkinCount: event._count.checkins,
				})),
			}),
		},
		revalidate: 60 * 5,
	};
}

const EventViewPage: NextPage<{ json: string }> = ({ json }) => {
	const { events } = superjson.parse<EventViewProps>(json);

	const [upcomingEvents, pastEvents] = useMemo(() => {
		const now = new Date();
		const upcoming = events.filter((e) => isAfter(e.eventStart, now)).length;
		return [upcoming, events.length - upcoming];
	}, [events]);

	const triggerDelete = (id: string) => {
		console.log(`Deleting Event ${id}`);
	};

	return (
		<AdminRootLayout current="events">
			<div className="w-full h-full">
				<div className="flex w-full">
					<div className="flex gap-10 justify-start my-2 p-4 bg-white border-zinc-200 border-[1px] rounded-lg">
						{/* TODO: Create truly useful statistics or implement the logic behind these ones. */}
						<Stat label="Total Events" value={events.length} />
						<Stat label="Upcoming Events" value={upcomingEvents} />
						<Stat label="Past Events" value={pastEvents} />
					</div>
				</div>
				<div className="p-4 bg-white rounded-lg border-zinc-200 border-[1px]">
					<div className="w-full pb-2">
						<div className="flex justify-start font-inter">
							<span className="text-xl tracking-wide text-zinc-800 font-bold my-auto">Events</span>
							<span className="ml-2 px-2 pt-0.5 text-zinc-600 text-sm my-auto overflow-hidden overflow-ellipsis whitespace-nowrap">
								viewing {events.length} event{pluralize(events.length)}
							</span>
							<div className="grow" />
							<div className="justify-self-end">
								<Link
									href="/admin/events/new"
									className="inline-flex h-8 md:h-9 text-sm whitespace-nowrap md:text-base justify-center items-center align-middle mx-3 p-2 pr-4 bg-indigo-500 hover:bg-indigo-600 shadow-inner hover:shadow-inner-md-2 rounded-lg text-white font-inter font-medium"
								>
									<BsPlus className="h-6 w-6" />
									New Event
								</Link>
								{/* TODO: Use the labels & default value options to disable form open/close & use the human format (not id) */}
							</div>
						</div>
					</div>
					<div className="border-box">
						<div className="inline-block pb-1 w-full">
							<EventDataTable
								data={events.map((item) => ({
									...item,
								}))}
							/>
						</div>
					</div>
				</div>
			</div>
		</AdminRootLayout>
	);
};

export default EventViewPage;
