import { FunctionComponent } from "react";
import { BsFillCalendarEventFill, BsClockFill, BsPinMapFill } from "react-icons/bs";

interface EventHeaderProps {
	title: string;
	imageURL: string;
	eventHost: string;
	eventDescription: string;
	startDate: Date;
	endDate: Date;
	location: string;
}

const EventHeader: FunctionComponent<EventHeaderProps> = ({
	title,
	imageURL,
	eventHost,
	eventDescription,
	startDate,
	endDate,
	location,
}) => {
	const dateString =
		startDate.toLocaleDateString() == endDate.toLocaleDateString()
			? startDate.toLocaleDateString()
			: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

	const localeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };
	const endDateString = endDate.toLocaleTimeString([], localeOptions);
	const startDateString = startDate.toLocaleTimeString([], localeOptions);

	return (
		<div className="flex bg-white mx-auto max-h-[10rem] min-h-[7rem] rounded-xl m-3 w-full max-w-[60rem]">
			<div
				className="overflow-hidden rounded-l-xl bg-cover bg-no-repeat min-w-[15rem]"
				style={{ backgroundImage: `url(${imageURL})` }}
			/>
			<div className="flex flex-col mx-5 p-[0.3rem] w-full min-h-full">
				<h1 className="text-3xl font-extrabold font-raleway">{title}</h1>
				<p className="ml-2 italic font-opensans font-semibold">Hosted by {eventHost}</p>
				<p className="ml-2 text-sm overflow-ellipsis max-h-[4rem]">{eventDescription}</p>
				<div className="justify-self-end columns-3 w-full">
					<p className="ml-2 flex items-center">
						<BsFillCalendarEventFill className="mr-[0.3rem]" />
						{dateString}
					</p>
					<p className="ml-2 flex items-center">
						<BsClockFill className="mr-[0.3rem]" />
						{`${startDateString} - ${endDateString}`}
					</p>
					<p className="ml-2 flex items-center">
						<BsPinMapFill className="mr-[0.3rem]" />
						{location}
					</p>
				</div>
			</div>
		</div>
	);
};

export default EventHeader;
