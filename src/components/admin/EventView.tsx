import React, { FunctionComponent, useMemo } from "react";
import { trpc } from "@/utils/trpc";
import { pluralize } from "@/utils/helpers";
import Stat from "@/components/common/Stat";
import { BsPlus } from "react-icons/bs";
import Link from "next/link";
import { isAfter } from "date-fns";
import EventDataTable from "./EventDataTable";

const EventView: FunctionComponent = () => {
	const events = trpc.events.getAll.useQuery();

	const [upcomingEvents, pastEvents] = useMemo(() => {
		const now = new Date();
		if (events.isFetched) {
			const upcoming = events.data!.filter((e) => isAfter(e.eventStart, now)).length;
			return [upcoming, events.data!.length - upcoming];
		}
		return [null, null];
	}, [events]);

	const triggerDelete = (id: string) => {
		console.log(`Deleting Event ${id}`);
	};

	return (
		<div className="w-full h-full">
			<div className="flex w-full">
				<div className="flex gap-10 justify-start my-2 p-4 bg-white border-zinc-200 border-[1px] rounded-lg">
					{/* TODO: Create truly useful statistics or implement the logic behind these ones. */}
					<Stat label="Total Events" value={events.data?.length} />
					<Stat label="Upcoming Events" value={upcomingEvents} />
					<Stat label="Past Events" value={pastEvents} />
				</div>
			</div>
			<div className="p-4 bg-white rounded-lg border-zinc-200 border-[1px]">
				<div className="w-full pb-2">
					{events.isSuccess ? (
						<div className="flex justify-start font-inter">
							<span className="text-xl tracking-wide text-zinc-800 font-bold my-auto">Events</span>
							<span className="ml-2 px-2 pt-0.5 text-zinc-600 text-sm my-auto overflow-hidden overflow-ellipsis whitespace-nowrap">
								viewing {events.data.length} event{pluralize(events.data.length)}
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
					) : (
						<div className="animate-pulse p-2 h-5 bg-gray-300 rounded-full dark:bg-gray-700 w-48" />
					)}
				</div>
				<div className="overflow-scroll overflow-x-auto border-box">
					<div className="inline-block pb-1 w-full">
						<EventDataTable />
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventView;
