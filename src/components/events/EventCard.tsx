import { FunctionComponent, useEffect, useState } from "react";

import {
	addDays,
	format,
	formatDistanceStrict,
	formatRelative,
	isBefore,
	isPast,
	isSameDay,
	isSameWeek,
	isToday,
} from "date-fns";
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/common/Badge";
import { Event } from "@prisma/client";
import { classNames, isCheckinOpen } from "@/utils/helpers";

interface EventHeaderProps {
	event: Event;
}

const shortOrganizationName: Record<string, string> = {
	ACM: "ACM",
	ACM_W: "ACM-W",
	ROWDY_CREATORS: "RC",
	ICPC: "ICPC",
	CODING_IN_COLOR: "CIC",
};

const ping = (
	<span className="flex relative h-[10px] w-[10px] top-0 left-0 -mr-1">
		<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
		<span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-sky-500" />
	</span>
);

const getTimeText = (now: Date, start: Date, end: Date): string => {
	// Track whether the event is in a different year than right now (i.e. next year)
	const nowYear = now.getUTCFullYear();
	const differentYears = nowYear != start.getUTCFullYear() || nowYear != end.getUTCFullYear();

	const isOngoing = start < now && now < end;
	const isEventSameDay = isSameDay(start, end);
	const isEventInPast = isPast(start);
	// Has the event been over for a while? > 4 days is "a while"
	const isEventFarPast = isBefore(addDays(end, 4), now);

	if (isOngoing) return `ends in ${formatDistanceStrict(now, end)}`;
	if (isEventFarPast) return `ended ${formatRelative(start, now)}`;

	const front = isEventInPast ? "was " : "";
	if (isEventSameDay) {
		const preciseYear = differentYears ? "/yyyy" : "";
		return `${front}${format(start, `EEEE, MM/dd${preciseYear} 'from' h:mma`)} to ${format(
			end,
			"h:mma"
		)}`;
	}
	const preciseDate = !isSameWeek(start, end) ? "MM/dd" : "";
	return `${front}${format(start, "E MM/dd h:mma")} to ${format(end, `EEE ${preciseDate} h:mma`)}`;
};

const EventCard: FunctionComponent<EventHeaderProps> = ({ event }: EventHeaderProps) => {
	const [now, setNow] = useState(new Date()); // Save the current date to be able to trigger an update

	useEffect(() => {
		const timer = setInterval(() => {
			setNow(new Date());
		}, 60 * 1000);
		return () => {
			clearInterval(timer); // Return a function to clear the timer so that it will stop being called on unmount
		};
	}, []);

	const isOpen = isCheckinOpen(event);
	const isOngoing = event.eventStart < now && now < event.eventEnd;
	const timeText = getTimeText(now, event.eventStart, event.eventEnd);
	const isEventPast = isPast(event.eventEnd);
	const isEventToday = isToday(event.eventStart) || isToday(event.eventEnd);

	// TODO: Implement like/notification/etc. system
	// const { value: isLiked, toggle: toggleLiked } = useBoolean(false);
	const eventURL = `/events/${event.pageID}`;
	const checkinURL = `${eventURL}/check-in`;

	const isoString = isOngoing ? event.eventEnd.toISOString() : event.eventStart.toISOString();
	return (
		<div className="[&>*]:shadow-lg rounded-xl col-span-3">
			<Link href={eventURL}>
				<div
					className={classNames(
						isEventPast ? "hover:grayscale-0 grayscale" : null,
						"relative cursor-pointer overflow-hidden h-[10rem] rounded-t-xl bg-slate-400"
					)}
				>
					<Image src={event.headerImage} layout="fill" objectFit="cover" />
				</div>
			</Link>
			<div className="bg-white rounded-b-xl">
				<div className="flex flex-col align-middle p-2 pb-0 justify-between">
					<span className="inline-flex text-xl text-slate-800 font-extrabold font-raleway mb-0.5">
						<Link href={eventURL}>
							<a className="inline-flex cursor-pointer">
								{event.name}
								{isOngoing ? ping : null}
							</a>
						</Link>
						<div className="space-x-2 mx-2">
							<Badge colorClass="bg-sky-100 text-sky-800 my-0.5 font-inter">
								{shortOrganizationName[event.organization] ?? event.organization}
							</Badge>
							{isEventPast ? (
								<Badge colorClass="bg-red-100 text-red-800 my-0.5 font-inter">Past</Badge>
							) : isEventToday ? (
								<Badge colorClass="bg-sky-100 text-sky-800 my-0.5 font-inter">
									{isOngoing ? "Ongoing" : "Today"}
								</Badge>
							) : null}
						</div>
						{/*<div
							className="text-[22px] text-red-600 ml-auto my-auto cursor-pointer p-1"
							onClick={toggleLiked}
						>
							{!isEventPast ? (
								isLiked ? (
									<AiFillBell />
								) : (
									<AiOutlineBell className="text-zinc-900" />
								)
							) : null}
						</div>*/}
					</span>
					<time
						dateTime={isoString}
						title={isoString}
						className="text-sm ml-0.5 -mt-1 justify-self-end font-inter text-slate-700"
					>
						{timeText}
					</time>
					<div className="card-buttongroup divide-x-2 divide-slate-200 flex [&>*]:flex-grow text-center mt-2 text-slate-900 font-medium font-inter">
						<Link href={eventURL}>
							<a>Details</a>
						</Link>
						{isOpen ? (
							<Link href={checkinURL}>
								<a>Check-in</a>
							</Link>
						) : (
							<span className="text-slate-300 hover:text-slate-300 cursor-not-allowed">
								Check-in
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventCard;
