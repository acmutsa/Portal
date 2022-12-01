import type { NextPage } from "next";
import EventCard from "@/components/events/EventCard";
import { prisma, Event } from "@/server/db/client";
import useOpenGraph from "@/components/common/useOpenGraph";
import OpenGraph from "@/components/common/OpenGraph";
import Head from "next/head";
import FilterBar from "@/components/events/FilterBar";

export async function getStaticProps() {
	let results = await prisma.event.findMany({
		orderBy: {
			eventStart: "desc",
		},
	});

	return {
		props: { results },
		revalidate: 60,
	};
}

const Events: NextPage<{ results: Event[] }> = ({ results }) => {
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

			<div className="page-view bg-darken Xbg-zinc-200">
				<div className="w-full w-[90%] mx-auto p-1">
					<div className="mt-6">
						<FilterBar />
					</div>
					<div className="grid pt-4 grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-6">
						{results.map((event) => {
							return <EventCard key={event.id} event={event} />;
						})}
					</div>
				</div>
			</div>
		</>
	);
};

export default Events;
