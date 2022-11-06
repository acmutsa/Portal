import { FunctionComponent, useEffect, useState } from "react";
import { AiOutlineBell, AiFillBell } from "react-icons/ai";

import {
	addDays,
	format,
	formatDistanceStrict,
	formatRelative,
	isBefore,
	isPast,
	isSameDay,
} from "date-fns";
import { useBoolean } from "usehooks-ts";

interface EventHeaderProps {
	title: string;
	imageURL: string;
	eventHost: string;
	startDate: Date;
	endDate: Date;
	location: string;
}

const ping = (
	<span className="flex relative h-[10px] w-[10px] top-0 left-0 -mr-1">
		<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
		<span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-sky-500" />
	</span>
);

const getTimeText = (now: Date, start: Date, end: Date): string => {
	const isOngoing = start < now && now < end;
	const isEventSameDay = isSameDay(start, end);
	const isEventInPast = isPast(start);
	// Has the event been over for a while? > 4 days is "a while"
	const isEventFarPast = isBefore(addDays(end, 4), now);

	if (isOngoing) return `ends in ${formatDistanceStrict(now, end)}`;
	if (isEventFarPast) return `ended ${formatRelative(start, now)}`;

	const front = isEventInPast ? "was " : "";
	if (isEventSameDay) {
		return `${front}${format(start, "EEEE, MM/dd 'from' h:mma")} to ${format(end, "h:mma")}`;
	}
	return `${front}${format(start, "E h:mma")} to ${format(end, "EEE h:mma")}`;
};

const EventHeader: FunctionComponent<EventHeaderProps> = ({
	title,
	imageURL,
	eventHost,
	startDate,
	endDate,
	location,
}) => {
	const [now, setDate] = useState(new Date()); // Save the current date to be able to trigger an update

	useEffect(() => {
		const timer = setInterval(() => {
			setDate(new Date());
		}, 60 * 1000);
		return () => {
			clearInterval(timer); // Return a function to clear the timer so that it will stop being called on unmount
		};
	}, []);

	const isOngoing = startDate < now && now < endDate;
	const timeText = getTimeText(now, startDate, endDate);
	const isEventPast = isPast(endDate);
	const { value: isLiked, toggle: toggleLiked } = useBoolean(false);

	return (
		<div className="rounded-xl col-span-3 m-3">
			<div
				className={`overflow-hidden h-[10rem] rounded-t-xl bg-slate-400 bg-center bg-cover bg-no-repeat ${
					isEventPast ? "hover:grayscale-0 grayscale" : ""
				}`}
				style={{ backgroundImage: `url(${imageURL})` }}
			/>
			<div className="bg-white rounded-b-xl">
				<div className="flex flex-col align-middle p-2 pb-0 justify-between">
					<span className="inline-flex text-xl text-slate-800 font-extrabold font-raleway">
						{title}
						{isOngoing ? ping : null}
						<div
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
						</div>
					</span>
					<time
						dateTime={startDate.toISOString()}
						className="text-sm ml-0.5 -mt-1 justify-self-end font-inter text-slate-700"
					>
						{timeText}
					</time>
					<div className="grid grid-cols-3 text-center mt-2 [&>*]:pb-2 text-slate-900 font-inter">
						<div className="p-1">
							<a href="/thing1">RSVP</a>
						</div>
						<div className="border-slate-200 border-x-2 p-1">
							<a href="/thing2">Details</a>
						</div>
						<div className="p-1">
							<a href="/thing3">Check-in</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventHeader;
