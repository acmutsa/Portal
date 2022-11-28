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
import { SiGooglecalendar } from "react-icons/si";
import { format, lightFormat } from "date-fns";
import BigEventHeader from "@/components/events/BigEventHeader";
import QRCode from "react-qr-code";
import NoSSR from "@/components/common/NoSSR";
import { env } from "@/env/server.mjs";
import { Event } from "@prisma/client";

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

	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<div className="page-view bg-darken !pt-[100px]">
				<BigEventHeader
					title={event.name || "Error"}
					imageURL={event.headerImage || "Error"}
					hostOrg={event.organization || "ACM"}
					startDate={event.eventEnd}
					endDate={event.eventStart}
					location={event.location || "Error"}
				/>
				<div className="mt-5 bg-white mx-auto max-w-[1200px] min-h-[25rem] rounded-xl p-3">
					<div className="grid grid-cols-4 w-full min-h-[25rem]">
						<div className="col-span-3 pr-4 py-2">
							<div className="mx-3 prose prose-md max-w-none font-raleway font-semibold">
								<h2 className="border-b-2 mb-1">Description</h2>
								{event.description !== null && event.description.length > 0 ? (
									<ReactMarkdown className="ml-3 [&>*]:my-0" remarkPlugins={[remarkGfm]}>
										{event.description!}
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
									academic, and social growth outside the classroom in order to prepare students for
									their career in tech or fuel their interest in the tech field. Anyone who has an
									interest in technology can join ACM.
								</p>
							</div>
						</div>
						<div className="border-l-2">
							<h2 className="text-center font-bold">Actions</h2>
							<Link href={`/events/${id}/check-in`}>
								<button className="h-12 w-full bg-primary text-white rounded-lg font-semibold m-2">
									Check-in
								</button>
							</Link>
							<a href={calendarLink} target="_blank">
								<button className="h-12 w-full bg-secondary text-white rounded-lg font-semibold m-2 flex items-center justify-center">
									<SiGooglecalendar className="mr-2 w-5 h-5" />
									Add To Google Calendar
								</button>
							</a>
							<NoSSR>
								<QRCode className="mx-auto scale-75" value={qrcodeData} />
							</NoSSR>
						</div>
					</div>
				</div>
				<Disclosure />
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
