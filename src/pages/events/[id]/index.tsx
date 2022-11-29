import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Disclosure from "@/components/util/Disclosure";
import { prisma } from "@/server/db/client";
import useOpenGraph from "@/components/common/useOpenGraph";
import OpenGraph from "@/components/common/OpenGraph";
import { absUrl, generateGoogleCalendarLink } from "@/utils/helpers";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { SiGooglecalendar, SiTwitch } from "react-icons/si";
import { format, lightFormat } from "date-fns";
import BigEventHeader from "@/components/events/BigEventHeader";
import QRCode from "react-qr-code";
import NoSSR from "@/components/common/NoSSR";
import { env } from "@/env/server.mjs";

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
	qrcodeData: string;
}

const EventView: NextPage<eventPageServerProps> = (props) => {
	const router = useRouter();
	const { id } = router.query;

	const startDate = props.startDate ? new Date(props.startDate) : null;
	const endDate = props.endDate ? new Date(props.endDate) : null;

	const ogp = useOpenGraph({
		title: (props.name ?? "Something") + " | ACM",
		description: `Come and join ${props.organization} for ${props.name}!`,
		image: props.headerImage
			? {
					url: props.headerImage,
					alt: "",
					type: "image/png",
			  }
			: null,
		url: `/events/${id}`,
		labels: props.found
			? [
					["When", format(startDate!, "E, MM/dd/yyyy h:mma")],
					["Where", props.location!],
			  ]
			: undefined,
	});

	if (props.found) {
		const formatString = "h:mmaaaaaa";
		const startString = lightFormat(startDate!, formatString);
		const endString = lightFormat(endDate!, formatString);
		const calendarLink = generateGoogleCalendarLink(
			new Date(props.startDate!),
			new Date(props.endDate!),
			props.name,
			`Location: ${props.location}\nWhen: ${startString} to ${endString}\n\n${
				props.description ?? `Come join us for ${props.name}`
			}`,
			props.location
		);

		return (
			<>
				<Head>
					<title>{ogp.title}</title>
					<OpenGraph properties={ogp} />
				</Head>
				<div className="page-view bg-darken !pt-[100px]">
					<BigEventHeader
						title={props.name || "Error"}
						imageURL={props.headerImage || "Error"}
						hostOrg={props.organization || "ACM"}
						startDate={new Date(props.startDate!) || new Date()}
						endDate={new Date(props.endDate!) || new Date()}
						location={props.location || "Error"}
					/>
					<div className="mt-5 bg-white mx-auto max-w-[1200px] min-h-[25rem] rounded-xl p-3">
						<div className="grid grid-cols-4 w-full min-h-[25rem]">
							<div className="col-span-3 pr-4 py-2">
								<div className="mx-3 prose prose-md max-w-none font-raleway font-semibold">
									<h2 className="border-b-2 mb-1">Description</h2>
									{props.description !== null && props.description.length > 0 ? (
										<ReactMarkdown className="ml-3 [&>*]:my-0" remarkPlugins={[remarkGfm]}>
											{props.description!}
										</ReactMarkdown>
									) : (
										<p className="ml-3 text-zinc-500 font-medium">
											No description was provided for this event.
										</p>
									)}
									<h2 className="border-b-2 mb-1 mt-4">About ACM</h2>
									<p className="ml-3">
										ACM is the premier organization on campus for students interested in technology.
										ACM is dedicated to providing members with opportunities for professional,
										academic, and social growth outside the classroom in order to prepare students
										for their career in tech or fuel their interest in the tech field. Anyone who
										has an interest in technology can join ACM.
									</p>
								</div>
							</div>
							<div className="border-l-2">
								<h2 className="text-center font-bold">Actions</h2>
								<Link href={`/events/${id}/check-in`}>
									<button className="h-12 w-full bg-primary text-white rounded-lg font-semibold mx-2 flex items-center justify-center mb-2">
										Check-in
									</button>
								</Link>
								<Link href={calendarLink} target="_blank">
									<button className="h-12 w-full bg-secondary text-white rounded-lg font-semibold mx-2 flex items-center justify-center mb-2">
										<SiGooglecalendar className="mr-2 w-5 h-5" />
										Add To Google Calendar
									</button>
								</Link>
								<Link href={"https://twitch.tv/acmutsa"} target="_blank">
									<button className="h-12 w-full bg-[#9146FF] text-white rounded-lg font-semibold mx-2 flex items-center justify-center">
										<SiTwitch className="mr-2 w-5 h-5" />
										Watch on Twitch
									</button>
								</Link>
								<br />
								<NoSSR>
									<QRCode className="mx-auto scale-75" value={props.qrcodeData} />
								</NoSSR>
							</div>
						</div>
					</div>
					<Disclosure />
				</div>
			</>
		);
	} else {
		return <p>Not found</p>;
	}
};

const revalidationTime = Math.max(env.EVENT_PAGE_REVALIDATION_TIME, 20);

export async function getStaticProps({ params }: eventPageParams) {
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
			revalidate: revalidationTime,
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
			qrcodeData: absUrl(`/events/${params.id}/check-in`),
		},
		// Next.js will attempt to re-generate the page:
		// - When a request comes in
		// - At most once every 10 seconds
		revalidate: revalidationTime, // In seconds
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
