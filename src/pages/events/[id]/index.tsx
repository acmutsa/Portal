import DeactivatableLink from "@/components/common/DeactivatableLink";
import { useGlobalContext } from "@/components/common/GlobalContext";
import NoSSR from "@/components/common/NoSSR";
import OpenGraph from "@/components/common/OpenGraph";
import Toast, { ToastType } from "@/components/common/Toast";
import useOpenGraph from "@/components/common/useOpenGraph";
import RootLayout from "@/components/layout/RootLayout";
import { env } from "@/env/server.mjs";
import { prisma } from "@/server/db/client";
import { checkin_success_message } from "@/utils/constants";
import {
	absUrl,
	choice,
	classNames,
	generateGoogleCalendarLink,
	getOrganization,
	isCheckinOpen,
} from "@/utils/helpers";
import { trpc } from "@/utils/trpc";
import { Event } from "@prisma/client";
import { format, formatRelative, isPast, lightFormat } from "date-fns";
import type { GetStaticPropsResult, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { BsBookmarkPlusFill, BsPencilFill, BsTrashFill } from "react-icons/bs";
import { SiGooglecalendar, SiTwitch } from "react-icons/si";
import ReactMarkdown from "react-markdown";
import QRCode from "react-qr-code";
import remarkGfm from "remark-gfm";
import superjson from "superjson";
import { z } from "zod";

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

const NotificationEnum = z.enum(["closed", "success", "not-open"]);
export type NotificationType = z.infer<typeof NotificationEnum>;

const EventView: NextPage<{ json: string }> = ({ json }) => {
	// Decode the ISR-generated JSON data.
	const { event, qrcodeData } = superjson.parse<EventStaticProps>(json);

	const router = useRouter();
	const { id } = router.query;
	const [globalState] = useGlobalContext();

	// Query whether or not the member is already checked in for this event.
	// Since this is a ISR page, we can't fetch this server-side, a query is required.
	const { data: existingCheckin } = trpc.events.checkedIn.useQuery(
		{ eventId: event.id },
		{
			enabled: globalState.member ?? false,
		}
	);

	// Create the OpenGraph metadata for this page.
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

	/**
	 * If any issue crops up where the form toast keeps being shown despite my attempts to ensure it won't,
	 * Check this gist for an alternative solution: https://gist.github.com/Xevion/11ba3c06cd0ca374a11acb18e4d4360b
	 */
	useEffect(() => {
		// If you remove the 'router.query.notify' check, make sure to add a check for the router.replace call below!
		if (router.isReady && router.query.notify != undefined) {
			let notify = NotificationEnum.safeParse(router.query.notify);

			// Only display a toast if the notify query parameter was valid.
			if (notify.success) {
				// Figure out the title and description we want to display.
				let toastData: { title: string; description: string; type: ToastType };
				switch (notify.data) {
					case "closed":
						toastData = {
							title: "Form Closed",
							description: "The form you tried to access is closed.",
							type: "error",
						};
						break;
					case "success":
						toastData = {
							title: "Checked-in Successfully!",
							description: choice(checkin_success_message),
							type: "success",
						};
						break;
					case "not-open":
						toastData = {
							title: "Check-in Not Open",
							description: "The check-in period for this event has not yet started.",
							type: "error",
						};
						break;
				}

				// Display it!
				toast.custom(
					({ id, visible }) => (
						<Toast
							title={toastData.title}
							description={toastData.description}
							type={toastData.type}
							toastId={id}
							visible={visible}
						/>
					),
					{ id: notify.data, duration: 8000 }
				);
			}

			// Remove the notify query parameter from the URL while preserving the rest of the query.
			const { notify: _, ...remaining } = router.query;

			// Replace (don't add to history), shallow (prevent data fetch, )
			router.replace({ query: remaining }, undefined, { shallow: true });
		}
	}, [router]);

	const formatString = "h:mmaaaaa"; // Formats like 1:04pm
	const startString = lightFormat(event.eventStart, formatString);
	const endString = lightFormat(event.eventEnd, formatString);
	const calendarLink = generateGoogleCalendarLink(
		event.eventStart,
		event.eventEnd,
		event.name,
		// TODO: Create a description length limit, as all of this is passed in as query parameters. There is a theoretical limit. Ideal implementation would use newline delimiters and only limit the dynamic description portion.
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
	const disableCheckin = !(checkinOpen && globalState.member);

	const eventButtons = (
		<div className="mt-6 text-base font-medium text-white grid grid-cols-1 [&>*]:mx-auto [&>*]:max-w-[25rem] gap-x-4 gap-y-4 xl:grid-cols-2">
			<DeactivatableLink
				href={`/events/${id}/check-in`}
				disabled={disableCheckin}
				className={classNames(
					"w-full border border-transparent rounded-md py-3 px-8 flex items-center justify-center",
					!disableCheckin &&
						"focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500",
					!checkinOpen ? "bg-primary-200" : "bg-primary-500 hover:bg-primary-800"
				)}
			>
				<BsBookmarkPlusFill className="mr-2 w-5 h-5" />
				{checkinOpen ? (existingCheckin ? "Edit Feedback" : "Check-in") : "Check-in closed."}
			</DeactivatableLink>
			<Link
				href={calendarLink}
				target="_blank"
				className="w-full bg-secondary hover:bg-secondary-700 border border-transparent rounded-md py-3 px-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
			>
				<SiGooglecalendar className="mr-2 w-5 h-5" />
				Add to Google Calendar
			</Link>
			<Link
				href={"https://twitch.tv/acmutsa"}
				as="button"
				target="_blank"
				className="w-full bg-twitch-light hover:bg-twitch-dark border border-transparent rounded-md py-3 px-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
			>
				<SiTwitch className="mr-2 w-5 h-5" />
				Watch on Twitch
			</Link>
			{globalState.admin ? (
				<span className="w-full flex relative z-0 shadow-sm rounded-md text-base font-medium text-white">
					<Link
						href={`/admin/events/${id}`}
						className="grow bg-teal-500 hover:bg-teal-600 relative inline-flex h-full justify-center items-center px-4 py-3 rounded-l-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
					>
						<BsPencilFill className="mr-2 w-4 h-4" />
						Edit
					</Link>
					<Link href={`/admin/events/${id}?action=delete`}>
						<button className="bg-rose-500 hover:bg-rose-600 relative h-full inline-flex items-center px-2 py-3 rounded-r-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
							<span className="sr-only">Delete Event</span>
							<BsTrashFill className="h-5 w-5" aria-hidden="true" />
						</button>
					</Link>
				</span>
			) : null}
		</div>
	);

	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<RootLayout
				className="bg-white md:bg-transparent"
				footerClass={"text-gray-800 max-w-[22rem] md:max-w-full md:text-white"}
				innerClassName="justify-center"
			>
				<div className="sm:pt-12">
					<div className="flex justify-center w-full">
						<div className="bg-white z-30 max-w-[1200px] sm:mx-3 md:mx-6 p-5 md:p-2 grid grid-cols-1 md:grid-cols-2 md:min-h-[19rem] lg:min-h-[2rem] md:space-x-6 sm:rounded-lg">
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
										<ReactMarkdown className="mt-3 [&>*]:my-0 markdown" remarkPlugins={[remarkGfm]}>
											{event.description!}
										</ReactMarkdown>
									) : (
										<p className="mt-3 text-gray-500">
											No description was provided for this event.
										</p>
									)}
									{/*
										This section can't be rendered on the server as it uses .toLocaleString.
										If I remember correctly, this causes a hydration mismatch error at minimum, and even if bypassed, it
										won't render a user-locale accurate datetime string.
										It's possible a custom formatter could be used to get around this, but I'm not sure it's necessary.
										If switching off NoSSR, use date-fns as the server date formatter.
									*/}
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
								{eventButtons}
							</div>
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

	// If the event doesn't exist, return a 404.
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
	// TODO: This isn't generating any paths at build-time. Did we simply not complete this, or is there a reason?
	return { paths: [], fallback: "blocking" };
}

export default EventView;
