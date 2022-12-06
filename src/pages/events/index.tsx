import type { NextPage } from "next";
import EventCard from "@/components/events/EventCard";
import { Event } from "@/server/db/client";
import useOpenGraph from "@/components/common/useOpenGraph";
import OpenGraph from "@/components/common/OpenGraph";
import Head from "next/head";
import FilterBar, { Filters } from "@/components/events/FilterBar";
import { getEvents, getSemesters } from "@/server/controllers/events";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { trpc } from "@/utils/trpc";
import { removeEmpty } from "@/utils/helpers";

export async function getStaticProps() {
	const results = getEvents();
	const semesters = getSemesters(); // Since semester filtering options are only queried here, it's possible for them to not show up in the UI until the page is reloaded.
	await Promise.all([results, semesters]);

	return {
		props: { events: await results, semesters: await semesters },
		revalidate: 60,
	};
}

interface EventsProps {
	events: Event[];
	semesters: string[]
}

const Events: NextPage<EventsProps> = ({ events: staticResults, semesters }: EventsProps) => {
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

	const { data: results, isFetching } = trpc.useQuery(
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
						<FilterBar semesters={semesters} onChange={setFilters} resultCount={results?.length} />
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
