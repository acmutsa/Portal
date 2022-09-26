import type { NextPage } from "next";
import { useRouter } from "next/router";
import EventHeader from "../../components/events/EventHeader";
import EventDescription from "../../components/events/EventDescription";

const EventView: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;

	return (
		<div className="page-view pt-[20px]">
			<EventHeader
				title="Intro To Tech"
				imageURL="https://se-images.campuslabs.com/clink/images/fed0a19f-b07f-48af-945f-a87da0b33e109d180e36-1f7b-4c58-b1e7-b2a57fc1cf9f.png?preset=large-w"
				hostOrg="ACM"
				startDate={new Date("Sun Sep 28 2022 04:15:04 GMT-0500 (Central Daylight Time)")}
				endDate={new Date("Sun Sep 30 2022 04:15:04 GMT-0500 (Central Daylight Time)")}
				location="Retama SU"
			/>
			<br />
			<EventDescription
				description="This is a event! It has some other data around it."
				calanderLink="https://acmutsa.org/"
			/>
		</div>
	);
};

export default EventView;
