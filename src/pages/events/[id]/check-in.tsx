import type { NextPage } from "next";
import { prisma } from "@/server/db/client";

interface eventPageParams {
	params: { id: string };
	locales: string[];
	locale: string;
	defaultLocale: string;
}

interface Event {
	name: string | null;
	description: string | null;
	organization: string | null;
	location: string | null;
	headerImage: string | null;
	startDate: string | null;
	endDate: string | null;
}

const EventView: NextPage<{ event: Event | null }> = ({ event }) => {
	if (event) {
		return (
			<div className="page-view bg-darken">
				<div className="mt-10 max-w-[30rem] mx-auto bg-white rounded-lg text-center flex flex-col items-center justify-center">
					<h1 className="text-2xl p-1.5 font-inter font-bold text-primary-darker">
						Thanks for attending <span className="text-primary-lighter">{event.name}</span>?
					</h1>
					<div className="px-4 mb-4 w-full max-w-[30rem] m-1">
						<textarea
							className="w-full font-roboto h-full min-h-[5rem] rounded ring-1 ring-zinc-300 resize-y placeholder:mx-2"
							placeholder="  Leave your feedback here..."
						/>
					</div>

					<h1 className="text-5xl font-extrabold font-inter"></h1>
					<button className="h-[40px] mb-3 w-full bg-primary-darker font-inter text-white rounded font-semibold max-w-[15rem]">
						Submit
					</button>
				</div>
			</div>
		);
	} else {
		return <p>Not found</p>;
	}
};

export async function getStaticProps(urlParams: eventPageParams) {
	const params = urlParams.params;
	const event = await prisma.event.findUnique({
		where: {
			pageID: params.id.toLowerCase(),
		},
	});

	if (event == null)
		return {
			props: {
				event: null,
			},
			revalidate: 5,
		};

	return {
		props: {
			event: {
				name: event.name,
				description: event.description,
				organization: event.organization,
				headerImage: event.headerImage,
				location: event.location,
				startDate: event.eventStart.toString(),
				endDate: event.eventEnd.toString(),
			},
		},
		// Next.js will attempt to re-generate the page:
		// - When a request comes in
		// - At most once every 10 seconds
		revalidate: 2, // In seconds
	};
}

export async function getStaticPaths() {
	return { paths: [], fallback: "blocking" };
}

export default EventView;
