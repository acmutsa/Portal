import { FunctionComponent } from "react";
import { BsFillCalendarEventFill, BsClockFill, BsPinMapFill } from "react-icons/bs";

interface EventHeaderProps {
	title: string;
	imageURL: string;
	hostOrg: string;
	startDate: Date;
	endDate: Date;
	location: string;
}

const EventHeader: FunctionComponent<EventHeaderProps> = ({
	title,
	imageURL,
	hostOrg,
	startDate,
	endDate,
	location,
}) => {
	return (
		<div className="bg-white mx-auto max-w-[1200px] grid grid-cols-2 min-h-[400px] rounded-xl">
			<div
				className="flex items-center justify-center overflow-hidden rounded-l-xl bg-cover bg-no-repeat"
				style={{ backgroundImage: `url(${imageURL})` }}
			></div>
			<div className="flex flex-col justify-center p-[5px]">
				<h1 className="text-5xl font-extrabold font-raleway">{title}</h1>
				<p className="font-opensans font-bold">Hosted by {hostOrg}</p>
				<br></br>
				<br></br>
				<p className="font-semibold flex items-center">
					<BsFillCalendarEventFill className="mr-[5px]" />
					{startDate.toLocaleDateString() == endDate.toLocaleDateString()
						? startDate.toLocaleDateString()
						: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
				</p>
				<p className="font-semibold flex items-center">
					<BsClockFill className="mr-[5px]" />
					{`${startDate.toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})} - ${endDate.toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}`}
				</p>
				<p className="font-semibold flex items-center">
					<BsPinMapFill className="mr-[5px]" />
					{location}
				</p>
			</div>
		</div>
	);
};

export default EventHeader;
