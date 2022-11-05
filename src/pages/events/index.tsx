import type { NextPage } from "next";
import EventCard from "@/components/events/EventCard";
import { prisma } from "@/server/db/client";
import useOpenGraph from "@/components/common/useOpenGraph";
import OpenGraph from "@/components/common/OpenGraph";
import Head from "next/head";

// TODO: Clean up types, and make this less awful to read. I'm sorry.

interface SerializedEvent {
	id: string;
	title: string;
	imageURL: string;
	eventHost: string;
	eventDescription?: string;
	eventStart: string;
	eventEnd: string;
	location: string;
}

interface EventServerProps {
	results: Array<SerializedEvent>;
}

export async function getStaticProps() {
	let results = await prisma.event.findMany({
		orderBy: {
			eventStart: "desc",
		},
	});

	return {
		props: {
			results: results.map((result) => ({
				id: result.id,
				title: result.name,
				imageURL: result.headerImage,
				location: result.location,
				eventStart: result.eventStart.toString(),
				eventEnd: result.eventEnd.toString(),
			})),
		},
		revalidate: 60,
	};
}

const Events: NextPage<EventServerProps> = ({ results }) => {
	const ogp = useOpenGraph({
		description: "Find all the latest events hosted by ACM-UTSA!",
		title: "Events",
		url: "/events",
	});

	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<div className="page-view bg-darken">
				<div className="grid grid-cols-9 p-3 lg:p-[4rem] w-full lg:w-[85%] mx-auto">
					{results.map((event) => {
						return (
							<EventCard
								key={event.id}
								title={event.title}
								startDate={new Date(event.eventStart)}
								endDate={new Date(event.eventEnd)}
								eventHost={event.eventHost}
								imageURL={event.imageURL}
								location={event.location}
							/>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default Events;
