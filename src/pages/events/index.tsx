import type { NextPage } from "next";
import EventCard from "@/components/events/EventCard";
import { Event } from "@/server/db/client";
import useOpenGraph from "@/components/common/useOpenGraph";
import OpenGraph from "@/components/common/OpenGraph";
import Head from "next/head";
import FilterBar, { Filters } from "@/components/events/FilterBar";
import { getEvents } from "@/server/controllers/events";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { trpc } from "@/utils/trpc";
import { removeEmpty } from "@/utils/helpers";

export async function getStaticProps() {
	const results = await getEvents();

	return {
		props: { results },
		revalidate: 60,
	};
}

interface EventsProps {
	results: Event[];
}

const Events: NextPage<EventsProps> = ({ results: staticResults }: EventsProps) => {
	const [filters, setFilters] = useState<Filters | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const debouncedFilters = useDebounce(filters, 800);

	// TODO: Tune so this doesn't fire a query until a control has changed.
	// TODO: Tune so this doesn't fire randomly.

	useEffect(() => {
		setLoading(true);
	}, [filters]);
	useEffect(() => {
		setLoading(false);
	}, [debouncedFilters]);

	const { data: filteredEvents, isFetching } = trpc.useQuery(
		[
			"events.get",
			useMemo(() => {
				return removeEmpty({ ...debouncedFilters });
			}, [debouncedFilters]),
		],
		{
			refetchOnWindowFocus: false,
			initialData: staticResults,
			enabled: debouncedFilters != null,
			onSettled: () => {
				setLoading(false);
			},
		}
	);

	const results = useMemo(() => {
		return filteredEvents;
	}, [filteredEvents]);

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
				<div className="w-full w-[90%] mx-auto p-1">
					<div className="mt-6">
						<FilterBar onChange={setFilters} resultCount={results?.length} />
					</div>
					<div className="grid pt-4 grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-6">
						{loading || isFetching
							? results!.map(() => (
									<div className="shadow-lg rounded-xl bg-white w-full h-60 block col-span-3">
										<div className="rounded-t-xl bg-zinc-300 animate-pulse w-full h-36"></div>
									</div>
							  ))
							: results!.map((event) => {
									return <EventCard key={event.id} event={event} />;
							  })}
					</div>
				</div>
			</div>
		</>
	);
};

export default Events;
