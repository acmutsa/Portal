import type { NextPage } from "next";
import EventHeader from "@/components/events/EventHeader";
import { prisma } from "@/server/db/client";
import useOpenGraph from "@/components/common/useOpenGraph";
import OpenGraph from "@/components/common/OpenGraph";
import Head from "next/head";

// TODO: Clean up types, and make this less awful to read. I'm sorry.

interface SerializedEvent {
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
	let results = await prisma.event.findMany();

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
			<div className="page-view pt-10">
				{results.map((event) => {
					return (
						<EventHeader
							key={event.title}
							startDate={new Date(event.eventStart)}
							endDate={new Date(event.eventEnd)}
							eventHost={event.eventHost}
							title={event.title}
							imageURL={event.imageURL}
							location={event.location}
						/>
					);
				})}
			</div>
		</>
	);
};

export default Events;
