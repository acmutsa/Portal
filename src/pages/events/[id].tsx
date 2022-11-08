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
import QRCode from "react-qr-code";

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

	const ogp = useOpenGraph({
		title: props.name ?? "Something",
		description: `Come and join ${props.organization} for ${props.name}!`,
		image: props.headerImage ? {
			url: props.headerImage,
			alt: "",
			type: "image/png"
		} : null,
		url: `/events/${id}`,
	});

	if (props.found) {
		// The location option has to be a concrete location on Google Maps.
		// Thus, while available, it is not included in the link.
		// TODO: Improve description to include where/what/when details.
		const calendarLink = generateGoogleCalendarLink(
			new Date(props.startDate!),
			new Date(props.endDate!),
			props.name!,
			props.description ?? `Come join us for ${props.name}`
		);

		return (
			<>
				<Head>
					<title>{ogp.title}</title>
					<OpenGraph properties={ogp} />
				</Head>
				<div className="page-view bg-darken pt-5">
					<div
						className="bg-white mx-auto min-h-[400px] rounded-xl max-w-[1200px]"
					>
						<div
							className="flex items-center justify-center overflow-hidden rounded-l-xl bg-cover bg-no-repeat"
							style={{ backgroundImage: `url(${props.headerImage})` }}
						/>
					</div>
					<div className="mt-5 bg-white mx-auto max-w-[1200px] min-h-[25rem] rounded-xl p-3">
						<div className="grid grid-cols-4 w-full min-h-[25rem]">
							<div className="col-span-3 pr-4 py-5">
								<div className="prose prose-md max-w-none font-raleway font-semibold">
									<h2 className="border-b-2 mb-1">Description</h2>
									<ReactMarkdown remarkPlugins={[remarkGfm]}>{props.description ?? ""}</ReactMarkdown>
									<h2 className="border-b-2 mb-1">About ACM</h2>
									<p>
										ACM is the premier organization on campus for students interested in technology. ACM
										is dedicated to providing members with opportunities for professional, academic, and
										social growth outside the classroom in order to prepare students for their career in
										tech or fuel their interest in the tech field. Anyone who has an interest in
										technology can join ACM.
									</p>
								</div>
							</div>
							<div className="border-l-2">
								<h2 className="text-center font-bold">Actions</h2>
								<Link href={`/check-in/${id}`}>
									<button className="h-12 w-full bg-primary-darker text-white rounded-lg font-semibold m-2">
										Check-in
									</button>
								</Link>
								<a href={calendarLink} target="_blank">
									<button className="h-12 w-full bg-primary-lighter text-white rounded-lg font-semibold m-2 flex items-center justify-center">
										<SiGooglecalendar className="mr-2 w-5 h-5" />
										Add To Google Calendar
									</button>
								</a>
								<QRCode
									className="mx-auto scale-75"
									value={props.qrcodeData}
								/>
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

const revalidationTime = 2;
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
			qrcodeData: absUrl(`/check-in/${params.id}`)
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
