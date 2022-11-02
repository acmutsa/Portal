import type { NextPage } from "next";
import { useRouter } from "next/router";
import EventHeader from "@/components/events/AltEventHeader";
import EventDescription from "@/components/events/EventDescription";
import { prisma } from "@/server/db/client";
import Link from "next/link";

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
			<div className="page-view bg-darken pt-[20px]">
				<div className="bg-white max-w-[800px] mx-auto min-h-[400px] rounded-xl text-center flex flex-col items-center justify-center p-[10px]">
					<h1 className="text-5xl font-extrabold font-raleway">Thanks For Attending</h1>
					<h1 className="text-5xl font-extrabold font-raleway">{serverProps.name}!</h1>
					<button className="h-[50px] w-full bg-primary-darker text-white rounded-lg font-semibold mx-[5px] mb-[5px] max-w-[300px] mt-[40px]">
						Check-in
					</button>
					<Link href={`/events/${id}`}>
						<button className="h-[50px] w-full bg-primary-lighter text-white rounded-lg font-semibold mx-[5px] mb-[5px] max-w-[300px] mt-[5px]">
							View Event Details
						</button>
					</Link>
				</div>
			</div>
		);
	} else {
		return <p>Not found</p>;
	}
};

export async function getStaticProps(urlParams: eventPageParams) {
	const params = urlParams.params;
	const revalTime = 2;

	const event = await prisma.event.findUnique({
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
