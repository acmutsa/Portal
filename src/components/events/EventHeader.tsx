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
			<div className="flex items-center justify-center overflow-hidden rounded-l-xl bg-cover bg-no-repeat bg-[url('https://se-images.campuslabs.com/clink/images/fed0a19f-b07f-48af-945f-a87da0b33e109d180e36-1f7b-4c58-b1e7-b2a57fc1cf9f.png?preset=large-w')]"></div>
			<div className="flex flex-col justify-center p-[5px]">
				<h1 className="text-5xl font-extrabold font-raleway">{title}</h1>
				<p className="font-opensans font-bold">Hosted by {hostOrg}</p>
				<br></br>
				<br></br>
				<p className="font-semibold flex items-center">
					<BsFillCalendarEventFill className="mr-[5px]" />
					{startDate.toLocaleDateString()}
				</p>
				<p className="font-semibold flex items-center">
					<BsClockFill className="mr-[5px]" />
					9:00am - 10:00am
				</p>
				<p className="font-semibold flex items-center">
					<BsPinMapFill className="mr-[5px]" />
					Retama SU
				</p>
			</div>
		</div>
	);
};

export default EventHeader;
