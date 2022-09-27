import type { NextPage } from "next";
import { useRouter } from "next/router";
import EventHeader from "../../components/events/EventHeader";
import EventDescription from "../../components/events/EventDescription";
import { prisma } from "../../server/db/client";

interface eventPageParams {
	params: { id: string };
	locales: string[];
	locale: string;
	defaultLocale: string;
}

interface eventPageServerProps {
	found: boolean;
	name: string | null;
	description: string | null;
	organization: string | null;
	location: string | null;
	headerImage: string | null;
	startDate: string | null;
	endDate: string | null;
}

const EventView: NextPage<eventPageServerProps> = (serverProps) => {
	const router = useRouter();
	const { id } = router.query;
	if (serverProps.found) {
		return (
			<div className="page-view pt-[20px]">
				<EventHeader
					title={serverProps.name || ""}
					imageURL={serverProps.headerImage || ""}
					hostOrg={serverProps.organization || ""}
					startDate={new Date("Sun Sep 28 2022 04:15:04 GMT-0500 (Central Daylight Time)")}
					endDate={new Date("Sun Sep 30 2022 04:15:04 GMT-0500 (Central Daylight Time)")}
					location={serverProps.location || ""}
				/>
				<br />
				<EventDescription
					description={
						serverProps.description || `Come and join us for ${serverProps.description}!`
					}
					calanderLink="https://acmutsa.org/"
				/>
			</div>
		);
	} else {
		return <p>Not found</p>;
	}
};

export async function getStaticProps(urlParams: eventPageParams) {
	const params = urlParams.params;
	const revalTime = 10;

	const event = await prisma.events.findUnique({
		where: {
			pageID: params.id.toLowerCase(),
		},
	});

	if (event == null) {
		return {
			props: {
				found: false,
			},
			revalidate: revalTime,
		};
	}

	return {
		props: {
			found: true,
			name: event.name,
			description: event.description,
			organization: event.organization,
			headerImage: event.headerImage,
			location: event.location,
			startDate: event.eventStart.toString(),
			endDate: event.eventEnd.toString(),
		},
		// Next.js will attempt to re-generate the page:
		// - When a request comes in
		// - At most once every 10 seconds
		revalidate: revalTime, // In seconds
	};
}

export async function getStaticPaths() {
	// const res = await fetch('https://.../posts')
	// const posts = await res.json()

	// Get the paths we want to pre-render based on posts
	// const paths = posts.map((post) => ({
	//   params: { id: post.id },
	// }))

	// We'll pre-render only these paths at build time.
	// { fallback: blocking } will server-render pages
	// on-demand if the path doesn't exist.
	return { paths: [], fallback: "blocking" };
}

export default EventView;
