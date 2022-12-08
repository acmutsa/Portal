import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Disclosure from "@/components/util/Disclosure";
import { prisma } from "@/server/db/client";
import useOpenGraph from "@/components/common/useOpenGraph";
import OpenGraph from "@/components/common/OpenGraph";
import { absUrl, generateGoogleCalendarLink, getOrganization } from "@/utils/helpers";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { SiGooglecalendar, SiTwitch } from "react-icons/si";
import { format, formatRelative, isPast, lightFormat } from "date-fns";
import QRCode from "react-qr-code";
import NoSSR from "@/components/common/NoSSR";
import { env } from "@/env/server.mjs";
import { Event } from "@prisma/client";
import { BsBookmarkPlusFill } from "react-icons/bs";

interface eventPageParams {
	params: { id: string };
	locales: string[];
	locale: string;
	defaultLocale: string;
}

const EventView: NextPage<{ event: Event; qrcodeData: string }> = ({ event, qrcodeData }) => {
	const router = useRouter();
	const { id } = router.query;

	const ogp = useOpenGraph({
		title: (event.name ?? "Something") + " | ACM",
		description: `Come and join ${event.organization} for ${event.name}!`,
		image: event.headerImage
			? {
					url: event.headerImage,
					alt: "",
					type: "image/png",
			  }
			: null,
		url: `/events/${id}`,
		labels: [
			["When", format(event.eventStart, "E, MM/dd/yyyy h:mma")],
			["Where", event.location!],
		],
	});
	const formatString = "h:mmaaaaaa";
	const startString = lightFormat(event.eventStart, formatString);
	const endString = lightFormat(event.eventEnd, formatString);

	const calendarLink = generateGoogleCalendarLink(
		event.eventStart,
		event.eventEnd,
		event.name,
		`Location: ${event.location}\nWhen: ${startString} to ${endString}\n\n${
			event.description ?? `Come join us for ${event.name}`
		}`,
		event.location
	);

	const now = new Date();
	const relativeText = formatRelative(
		now,
		!isPast(event.eventStart) ? event.eventStart : event.eventEnd
	);

	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<div className="page-view bg-white sm:bg-darken sm:!pt-[100px]">
				<div className="flex justify-center w-full">
					<div className="bg-white z-30 max-w-[1200px] sm:mx-3 md:mx-6 p-5 md:p-2 lg:p-3 grid grid-cols-1 md:grid-cols-2 md:min-h-[19rem] lg:min-h-[2rem] md:space-x-6 sm:rounded-lg">
						<div className="flex items-center justify-center overflow-hidden md:ml-3">
							<div
								className="w-full drop-shadow-xl md:drop-shadow-lg max-h-[25rem] aspect-[9/16] bg-top md:bg-center lg:bg-top lg:aspect-video rounded-lg bg-cover hover:bg-contain hover:bg-center bg-no-repeat"
								style={{ backgroundImage: `url(${event.headerImage})` }}
							/>
						</div>
						<div className="flex flex-col font-inter justify-start p-3">
							<div className="text-gray-700">
								<h1 className="text-3xl text-gray-900 font-extrabold font-raleway">{event.name}</h1>
								<p className="text-sm text-gray-500 ml-2">
									Hosted by {getOrganization(event.organization)?.name ?? "Unknown"} &#8226;{" "}
									{relativeText}
								</p>
								{event.description != null && event.description.length > 0 ? (
									<ReactMarkdown className="mt-3 [&>*]:my-0" remarkPlugins={[remarkGfm]}>
										{event.description!}
									</ReactMarkdown>
								) : (
									<p className="mt-3 text-gray-500">No description was provided for this event.</p>
								)}
								<dl className="text-base grid grid-cols-1 mt-4 gap-x-4 gap-y-4 md:grid-cols-2">
									<div className="sm:col-span-1">
										<dt className="text-sm text-gray-500">Start Time</dt>
										<dd className="mt-0.5">
											{event.eventStart.toLocaleString("en", {
												dateStyle: "medium",
												timeStyle: "short",
											})}
										</dd>
									</div>
									<div className="sm:col-span-1">
										<dt className="text-sm text-gray-500">End Time</dt>
										<dd className="mt-0.5">
											{event.eventEnd.toLocaleString("en", {
												dateStyle: "medium",
												timeStyle: "short",
											})}
										</dd>
									</div>
									<div className="sm:col-span-1">
										<dt className="text-sm text-gray-500">Location</dt>
										<dd className="mt-0.5">{event.location}</dd>
									</div>
									<div className="sm:col-span-1">
										<dt className="text-sm text-gray-500">Semester</dt>
										<dd className="mt-0.5">{event.semester}</dd>
									</div>
								</dl>
							</div>
							<div className="mt-6 text-base font-medium text-white grid grid-cols-1 [&>*]:mx-auto [&>*]:max-w-[25rem] gap-x-4 gap-y-4 xl:grid-cols-2">
								<Link href={`/events/${id}/check-in`}>
									<button
										type="button"
										className="w-full bg-primary-500 hover:bg-primary-800 border border-transparent rounded-md py-3 px-8 flex items-center justify-center  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
									>
										<BsBookmarkPlusFill className="mr-2 w-5 h-5" />
										Check-in
									</button>
								</Link>
								<Link href={calendarLink} target="_blank">
									<button
										type="button"
										className="w-full bg-secondary hover:bg-secondary-700 border border-transparent rounded-md py-3 px-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
									>
										<SiGooglecalendar className="mr-2 w-5 h-5" />
										Add to Google Calendar
									</button>
								</Link>
								<Link href={"https://twitch.tv/acmutsa"} target="_blank">
									<button
										type="button"
										className="w-full bg-twitch border border-transparent rounded-md py-3 px-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
									>
										<SiTwitch className="mr-2 w-5 h-5" />
										Watch on Twitch
									</button>
								</Link>
							</div>
						</div>
						{/*<div className="md:block" />*/}
						<div className="px-5 md:pl-0 pb-5 prose prose-md max-w-none font-inter">
							<h2 className="border-b-2 mb-1 mt-2 md:mt-4">About ACM</h2>
							<p className="ml-3 tracking-tight md:tracking-normal">
								ACM is the premier organization on campus for students interested in technology. ACM
								is dedicated to providing members with opportunities for professional, academic, and
								social growth outside the classroom in order to prepare students for their career in
								tech or fuel their interest in the tech field. Anyone who has an interest in
								technology can join ACM.
							</p>
						</div>
						<div className="px-5 md:pl-0 pb-5 prose prose-md max-w-none font-inter">
							<h2 className="border-b-2 mb-1 md:mt-4">Checking In</h2>
							<p className="ml-3 mb-1 tracking-tight md:tracking-normal">
								The membership portal is ACM's new method of tracking member check-ins and awarding
								points. By simply visiting this page during the event and clicking the 'Check-in'
								button, you can easily garner points towards your membership for the semester.
							</p>
							<p className="ml-3 my-0 tracking-tight md:tracking-normal">
								Share this event's check-in page quickly using this QR Code:
							</p>
							<div className="w-48 h-48 mx-auto my-3 mb-3">
								<NoSSR>
									<div
										style={{ height: "auto", margin: "0 auto", maxWidth: "100%", width: "100%" }}
									>
										<QRCode
											size={256}
											style={{ height: "auto", maxWidth: "100%", width: "100%" }}
											value={qrcodeData}
											viewBox="0 0 256 256"
										/>
									</div>
								</NoSSR>
							</div>
						</div>
					</div>
				</div>
				<Disclosure className="!pt-0 text-gray-700" />
			</div>
		</>
	);
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
			notFound: true,
			revalidate: revalidationTime,
		};
	}

	return {
		props: {
			event: event,
			qrcodeData: absUrl(`/events/${params.id}/check-in`),
		},
		revalidate: revalidationTime,
	};
}

export async function getStaticPaths() {
	return { paths: [], fallback: "blocking" };
}

export default EventView;
