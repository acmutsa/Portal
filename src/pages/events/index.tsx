import type { NextPage } from "next";
import EventHeader from "../../components/events/EventHeader";

const Events: NextPage = () => {
	return (
		<div className="page-view">
			<h1 className="text-white text-center text-5xl font-bold font-raleway m-[20px]">
				Up Next at <span className="text-primary-lighter bg-white rounded p-[5px]">ACM</span>
			</h1>
			<EventHeader
				title="Intro To Tech"
				imageURL="https://se-images.campuslabs.com/clink/images/fed0a19f-b07f-48af-945f-a87da0b33e109d180e36-1f7b-4c58-b1e7-b2a57fc1cf9f.png?preset=large-w"
				hostOrg="ACM"
				startDate={new Date("Sun Sep 28 2022 04:15:04 GMT-0500 (Central Daylight Time)")}
				endDate={new Date("Sun Sep 30 2022 04:15:04 GMT-0500 (Central Daylight Time)")}
				location="Retama SU"
			/>
		</div>
	);
};

export default Events;
