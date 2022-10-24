import type { NextPage } from "next";
import EventHeader from "@/components/events/EventHeader";

const eventResults = [
	{
		title: "Intro to Tech",
		imageURL:
			"https://se-images.campuslabs.com/clink/images/fed0a19f-b07f-48af-945f-a87da0b33e109d180e36-1f7b-4c58-b1e7-b2a57fc1cf9f.png?preset=large-w",
		eventHost: "ACM",
		eventDescription:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dignissim urna ut pellentesque molestie. Curabitur non diam dictum, maximus est commodo, tempus nunc. Vestibulum ac aliquam libero, eget sodales urna. Nam pulvinar varius erat. Sed magna nibh, tempor porta nisi et, lobortis facilisis dui. ",
		startDate: new Date("Sun Sep 28 2022 04:15:04 GMT-0500 (Central Daylight Time)"),
		endDate: new Date("Sun Sep 30 2022 04:15:04 GMT-0500 (Central Daylight Time)"),
		location: "Retama SU",
	},
	{
		title: "Game Night",
		imageURL:
			"https://cdn.discordapp.com/attachments/747935348079984671/1030858082986766427/IMG_5507.webp",
		eventHost: "ACM",
		startDate: new Date("Oct 15 2022 20:00:00 GMT-0500 (Central Daylight Time)"),
		endDate: new Date("Oct 15 2022 21:00:00 GMT-0500 (Central Daylight Time)"),
		location: "ACM-UTSA Discord",
	},
	{
		title: "PyNight",
		imageURL:
			"https://cdn.discordapp.com/attachments/749323785324331038/1029096940836761751/BAHPynight.png",
		eventHost: "Booz-Allen",
		startDate: new Date("Sun Sep 28 2022 04:15:04 GMT-0500 (Central Daylight Time)"),
		endDate: new Date("Sun Sep 30 2022 04:15:04 GMT-0500 (Central Daylight Time)"),
		location: "NPB 5.140",
	},
	{
		title: "Midterm Unwind",
		imageURL:
			"https://cdn.discordapp.com/attachments/747935348079984671/1026940390957395968/IMG_4772.jpg",
		eventHost: "ACM & IEEE",
		startDate: new Date("Wed Oct 5 2022 17:30:04 GMT-0500 (Central Daylight Time)"),
		endDate: new Date("Wed Oct 5 2022 18:00:04 GMT-0500 (Central Daylight Time)"),
		location: "BSE 1st Floor",
	},
];

const Events: NextPage = () => {
	return (
		<div className="page-view pt-10">
			{eventResults.map((event) => (
				<EventHeader key={event.title} {...event} />
			))}
		</div>
	);
};

export default Events;
