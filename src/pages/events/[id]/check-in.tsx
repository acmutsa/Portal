import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import type { FunctionComponent } from "react";
import { prisma } from "@/server/db/client";
import OpenGraph from "@/components/common/OpenGraph";
import useOpenGraph from "@/components/common/useOpenGraph";

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
	eventID: string | null;
}

interface DoCheckInProps {
	eventID: string;
}

const DoCheckIn: FunctionComponent<DoCheckInProps> = ({ eventID }) => {
	return (
		<div className="w-full p-2 text-white font-semibold max-w-[400px]">
			<button className="h-12 my-2 w-full justify-self-center bg-primary-dark hover:bg-primary-dark-hover rounded transition ease-in">
				Check-in
			</button>
			<p className="text-black">or</p>
			<Link href={"/events/" + eventID}>
				<button className="h-12 my-2 w-full justify-self-center bg-primary-light hover:bg-primary-light-hover rounded transition ease-in">
					View Event Details
				</button>
			</Link>
		</div>
	);
};

const AddFeedhack: FunctionComponent = () => {
	return (
		<>
			<div className="px-4 mb-4 w-full max-w-[30rem] m-1">
				<textarea
					className="w-full font-roboto h-full min-h-[5rem] rounded ring-1 ring-zinc-300 resize-y placeholder:mx-2"
					placeholder="  Leave your feedback here..."
				/>
			</div>

			<h1 className="text-5xl font-extrabold font-inter"></h1>
			<button className="h-[40px] mb-3 w-full bg-primary-dark font-inter text-white rounded font-semibold max-w-[15rem]">
				Submit
			</button>
		</>
	);
};

const EventView: NextPage<{ event: Event | null }> = ({ event }) => {
	const ogp = useOpenGraph({
		description: "The premier Computer Science organization at UTSA",
		title: "Check-in | ACM",
		suffix: false,
		url: "/",
	});

	if (event) {
		return (
			<>
				<Head>
					<title>{ogp.title}</title>
					<OpenGraph properties={ogp} />
				</Head>
				<div className="page-view bg-darken">
					<div className="mt-10 max-w-[35rem] mx-auto bg-white rounded-lg text-center flex flex-col items-center justify-center py-5">
						<h1 className="text-2xl pt-1.5 font-inter font-extrabold text-primary-dark">
							Thanks for attending
						</h1>
						<h1 className="text-5xl p-1.5 font-inter font-extrabold text-primary-dark pt-0 mb-5">
							<span className="text-primary-light">{event.name}</span>!
						</h1>
						<DoCheckIn eventID={event.eventID || "error"} />
					</div>
				</div>
			</>
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
				eventID: params.id.toLowerCase(),
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
