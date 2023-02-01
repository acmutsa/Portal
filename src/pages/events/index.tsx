import type { NextPage } from "next";
import EventCard from "@/components/events/EventCard";
import { Event } from "@/server/db/client";
import useOpenGraph from "@/components/common/useOpenGraph";
import OpenGraph from "@/components/common/OpenGraph";
import Head from "next/head";
import FilterBar, { Filters } from "@/components/events/FilterBar";
import { getEvents, getSemesters } from "@/server/controllers/events";
import { useRef, useState } from "react";
import { trpc } from "@/utils/trpc";
import { removeEmpty } from "@/utils/helpers";
import RootLayout from "@/components/layout/RootLayout";
import type { GetStaticPropsResult } from "next";
import superjson from "superjson";

interface EventsProps {
	events: Event[];
	semesters: string[];
}

export async function getStaticProps(): Promise<GetStaticPropsResult<{ json: string }>> {
	const results = getEvents();
	const semesters = getSemesters(); // Since semester filtering options are only queried here, it's possible for them to not show up in the UI until the page is reloaded.
	await Promise.all([results, semesters]);

	return {
		props: { json: superjson.stringify({ events: await results, semesters: await semesters }) },
		revalidate: 60,
	};
}

const Events: NextPage<{ json: string }> = ({ json }) => {
	const { events: staticResults, semesters } = superjson.parse<EventsProps>(json);
	const [filters, setFilters] = useState<Filters | null>(null);
	const allowChangeRef = useRef(true);

	const { data: results, isFetching } = trpc.events.get.useQuery(removeEmpty({ ...filters }), {
		initialData: staticResults,
		enabled: filters != null,
		onSettled: () => {},
		staleTime: 1,
	});

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
			<RootLayout>
				<div className="w-full w-[90%] mx-auto p-1">
					<div className="mt-6">
						<FilterBar
							semesters={semesters}
							onChange={(value) => {
								setFilters(() => value);
							}}
							allowChangeRef={allowChangeRef}
							resultCount={results?.length}
						/>
					</div>
					<div className="grid pt-4 grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-6">
						{isFetching
							? results.map((_, index) => (
									<div
										key={index}
										className="shadow-lg rounded-xl bg-white w-full h-60 block col-span-3"
									>
										<div className="rounded-t-xl bg-zinc-300 animate-pulse w-full h-36"></div>
									</div>
							  ))
							: results.map((event) => {
									return <EventCard key={event.id} event={event} />;
							  })}
					</div>
				</div>
			</RootLayout>
		</>
	);
};

export default Events;
