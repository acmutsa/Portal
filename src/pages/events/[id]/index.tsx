import type { GetStaticPropsResult, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { prisma } from "@/server/db/client";
import useOpenGraph from "@/components/common/useOpenGraph";
import OpenGraph from "@/components/common/OpenGraph";
import {
	absUrl,
	choice,
	classNames,
	generateGoogleCalendarLink,
	getOrganization,
	isCheckinOpen,
} from "@/utils/helpers";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { SiGooglecalendar, SiTwitch } from "react-icons/si";
import { format, formatRelative, isPast, lightFormat } from "date-fns";
import QRCode from "react-qr-code";
import NoSSR from "@/components/common/NoSSR";
import { env } from "@/env/server.mjs";
import { Event } from "@prisma/client";
import { BsBookmarkPlusFill, BsPencilFill, BsTrashFill } from "react-icons/bs";
import { useGlobalContext } from "@/components/common/GlobalContext";
import { toast } from "react-hot-toast";
import Toast from "@/components/common/Toast";
import { useEffect } from "react";
import { trpc } from "@/utils/trpc";
import RootLayout from "@/components/layout/RootLayout";
import superjson from "superjson";
import { checkin_success_message } from "@/utils/constants";

interface eventPageParams {
	params: { id: string };
	locales: string[];
	locale: string;
	defaultLocale: string;
}

type EventStaticProps = {
	event: Event;
	qrcodeData: string;
	existingCheckin: boolean;
};

const EventView: NextPage<{ json: string }> = ({ json }) => {
	const { event, qrcodeData } = superjson.parse<EventStaticProps>(json);

	const router = useRouter();
	const { id, notify } = router.query;
	const [{ member: isMember }] = useGlobalContext();
	const { data: existingCheckin } = trpc.events.checkedIn.useQuery(
		{ eventId: event.id },
		{
			enabled: isMember ?? false,
		}
	);

	const ogp = useOpenGraph({
		title: event.name,
		description: `Come and join ${event.organization} for ${event.name}!`,
		image: event.headerImage
			? {
					url: event.headerImage,
					alt: "",
					type: "image/png",
			  }
			: null,
		url: `/events/${event.id}`,
		labels: [
			["When", format(event.eventStart, "E, MM/dd/yyyy h:mma")],
			["Where", event.location!],
		],
	});
	const formatString = "h:mmaaaaaa";
	const startString = lightFormat(event.eventStart, formatString);
	const endString = lightFormat(event.eventEnd, formatString);
	const [globalState] = useGlobalContext();

	/**
	 * If any issue crops up where the form toast keeps being shown despite my attempts to ensure it won't,
	 * Check this gist for an alternative solution: https://gist.github.com/Xevion/11ba3c06cd0ca374a11acb18e4d4360b
	 */
	useEffect(() => {
		if (router.isReady) {
			if (notify == "formClosed") {
				toast.custom(
					({ id, visible }) => (
						<Toast
							title="Form Closed"
							description="The form you tried to access is closed."
							type="error"
							toastId={id}
							visible={visible}
						/>
					),
					{ id: "form-closed", duration: 8000 }
				);
			} else if (notify == "checkinSuccess") {
				toast.custom(
					({ id, visible }) => (
						<Toast
							title="Checked-in Successfully!"
							description={choice(checkin_success_message)}
							type="success"
							toastId={id}
							visible={visible}
						/>
					),
					{ id: "checkin-success", duration: 2500 }
				);
			}

			if (notify != undefined) {
				const { notify: _, ...omittedQuery } = router.query;
				router.replace({ query: omittedQuery }, undefined, { shallow: true });
			}
		}
	}, [router]);

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
	const relativeText = `${
		isPast(event.eventStart) ? (isPast(event.eventEnd) ? "ended " : "ends ") : ""
	}${formatRelative(!isPast(event.eventStart) ? event.eventStart : event.eventEnd, now)}`;

	const checkinOpen = isCheckinOpen(event);
	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<RootLayout
				background={"bg-white md:bg-acm"}
				footerClass={"text-gray-800 max-w-[22rem] md:max-w-full md:text-white"}
				innerClassName="justify-center"
			>
				<div className="sm:pt-12">
					<div className="flex justify-center w-full">
						<div className="bg-white z-30 max-w-[1200px] sm:mx-3 md:mx-6 p-5 md:p-2 md:p-3 grid grid-cols-1 md:grid-cols-2 md:min-h-[19rem] lg:min-h-[2rem] md:space-x-6 sm:rounded-lg">
							<div className="flex items-center justify-center overflow-hidden md:ml-3">
								<div
									className="w-full drop-shadow-xl md:drop-shadow-lg max-h-[25rem] aspect-[9/16] bg-top md:bg-center lg:bg-top lg:aspect-video rounded-lg bg-cover hover:bg-contain hover:bg-center bg-no-repeat"
									style={{ backgroundImage: `url(${event.headerImage})` }}
								/>
							</div>
							<div className="flex flex-col font-inter justify-start p-3">
								<div className="text-gray-700">
									<h1 className="text-3xl text-gray-900 font-extrabold font-raleway">
										{event.name}
									</h1>
									<p className="text-sm text-gray-500 ml-2">
										Hosted by {getOrganization(event.organization)?.name ?? "Unknown"} &#8226;{" "}
										{relativeText}
									</p>
									{event.description != null && event.description.length > 0 ? (
										<ReactMarkdown className="mt-3 [&>*]:my-0" remarkPlugins={[remarkGfm]}>
											{event.description!}
										</ReactMarkdown>
									) : (
										<p className="mt-3 text-gray-500">
											No description was provided for this event.
										</p>
									)}
									<NoSSR>
										<dl className="text-base grid grid-cols-1 mt-4 gap-x-4 gap-y-2 lg:gap-y-4 md:grid-cols-2">
											<div className="sm:col-span-1">
												<dt className="text-sm text-gray-500">Start Time</dt>
												<dd className="md:mt-0.5">
													{event.eventStart.toLocaleString("en", {
														dateStyle: "medium",
														timeStyle: "short",
													})}
												</dd>
											</div>
											<div className="sm:col-span-1">
												<dt className="text-sm text-gray-500">End Time</dt>
												<dd className="md:mt-0.5">
													{event.eventEnd.toLocaleString("en", {
														dateStyle: "medium",
														timeStyle: "short",
													})}
												</dd>
											</div>
											<div className="sm:col-span-1">
												<dt className="text-sm text-gray-500">Location</dt>
												<dd className="md:mt-0.5">{event.location}</dd>
											</div>
											<div className="sm:col-span-1">
												<dt className="text-sm text-gray-500">Semester</dt>
												<dd className="md:mt-0.5">{event.semester}</dd>
											</div>
										</dl>
									</NoSSR>
								</div>
								<div className="mt-6 text-base font-medium text-white grid grid-cols-1 [&>*]:mx-auto [&>*]:max-w-[25rem] gap-x-4 gap-y-4 xl:grid-cols-2">
									<Link legacyBehavior href={`/events/${id}/check-in`}>
										<button
											type="button"
											disabled={!checkinOpen}
											className={classNames(
												"w-full border border-transparent rounded-md py-3 px-8 flex items-center justify-center  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500",
												!checkinOpen ? "bg-primary-200" : "bg-primary-500 hover:bg-primary-800"
											)}
										>
											<BsBookmarkPlusFill className="mr-2 w-5 h-5" />
											{checkinOpen
												? existingCheckin
													? "Edit Feedback"
													: "Check-in"
												: "Check-in closed."}
										</button>
									</Link>
									<Link legacyBehavior href={calendarLink} target="_blank">
										<button
											type="button"
											className="w-full bg-secondary hover:bg-secondary-700 border border-transparent rounded-md py-3 px-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
										>
											<SiGooglecalendar className="mr-2 w-5 h-5" />
											Add to Google Calendar
										</button>
									</Link>
									<Link legacyBehavior href={"https://twitch.tv/acmutsa"} target="_blank">
										<button
											type="button"
											className="w-full bg-twitch-light hover:bg-twitch-dark border border-transparent rounded-md py-3 px-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
										>
											<SiTwitch className="mr-2 w-5 h-5" />
											Watch on Twitch
										</button>
									</Link>
									{globalState.admin ? (
										<span className="w-full flex relative z-0 inline-flex shadow-sm rounded-md text-base font-medium text-white">
											<Link legacyBehavior href={`/admin/events/${id}`}>
												<button
													type="button"
													className="grow bg-teal-500 hover:bg-teal-600 relative inline-flex justify-center items-center px-4 py-3 rounded-l-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
												>
													<BsPencilFill className="mr-2 w-4 h-4" />
													Edit
												</button>
											</Link>
											<Link legacyBehavior href={`/admin/events/${id}?action=delete`}>
												<button className="bg-rose-500 hover:bg-rose-600 relative inline-flex items-center px-2 py-3 rounded-r-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
													<span className="sr-only">Open options</span>
													<BsTrashFill className="h-5 w-5" aria-hidden="true" />
												</button>
											</Link>
										</span>
									) : null}
								</div>
							</div>
							{/*<div className="md:block" />*/}
							<div className="px-5 md:pl-0 pb-5 prose prose-md max-w-none font-inter">
								<h2 className="border-b-2 mb-1 mt-2 md:mt-4">About ACM</h2>
								<p className="ml-3 tracking-tight md:tracking-normal">
									ACM is the premier organization on campus for students interested in technology.
									ACM is dedicated to providing members with opportunities for professional,
									academic, and social growth outside the classroom in order to prepare students for
									their career in tech or fuel their interest in the tech field. Anyone who has an
									interest in technology can join ACM.
								</p>
							</div>
							<div className="px-5 md:pl-0 pb-5 prose prose-md max-w-none font-inter">
								<h2 className="border-b-2 mb-1 md:mt-4">Checking In</h2>
								<p className="ml-3 mb-1 tracking-tight md:tracking-normal">
									The membership portal is ACM's new method of tracking member check-ins and
									awarding points. By simply visiting this page during the event and clicking the
									'Check-in' button, you can easily garner points towards your membership for the
									semester.
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
				</div>
			</RootLayout>
		</>
	);
};

const revalidationTime = Math.max(env.EVENT_PAGE_REVALIDATION_TIME, 20);

export async function getStaticProps({
	params,
}: eventPageParams): Promise<GetStaticPropsResult<{ json: string }>> {
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
			json: superjson.stringify({
				event: event,
				qrcodeData: absUrl(`/events/${params.id}/check-in`),
			}),
		},
		revalidate: revalidationTime,
	};
}

export async function getStaticPaths() {
	return { paths: [], fallback: "blocking" };
}

export default EventView;
