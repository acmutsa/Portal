import Breadcrumbs from "@/components/common/Breadcrumbs";
import OpenGraph from "@/components/common/OpenGraph";
import useOpenGraph from "@/components/common/useOpenGraph";
import RootLayout from "@/components/layout/RootLayout";
import { Event, prisma } from "@/server/db/client";
import { classNames, isCheckinOpen } from "@/utils/helpers";
import { validateMember } from "@/utils/server_helpers";
import { trpc } from "@/utils/trpc";
import { isFuture } from "date-fns";
import {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
	InferGetServerSidePropsType,
	NextPage,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import superjson from "superjson";
import { NotificationType } from ".";

type CheckinPageParams = {
	[key: string]: string;
	id: string;
};

type FormValues = {
	feedback: string;
};

type CheckinServerProps = {
	previous: { feedback: string | null; inPerson: boolean } | null;
	event: Pick<
		Event,
		"id" | "name" | "pageID" | "formClose" | "formOpen" | "eventStart" | "eventEnd" | "forcedIsOpen"
	>;
};

export async function getServerSideProps({
	req,
	res,
	params,
}: GetServerSidePropsContext<CheckinPageParams>): Promise<
	GetServerSidePropsResult<{ json: string }>
> {
	const [valid, member] = await validateMember(req, res, true);
	const eventId = params!.id;

	if (!valid)
		return {
			redirect: { destination: `/login?next=/events/${eventId}/check-in`, permanent: false },
		};

	// Limit selection of properties for SSR
	const event = await prisma.event.findUnique({
		where: {
			pageID: eventId.toLowerCase(),
		},
		select: {
			id: true,
			name: true,
			pageID: true,
			formClose: true,
			formOpen: true,
			eventStart: true,
			eventEnd: true,
			forcedIsOpen: true,
		},
	});

	if (event == null)
		return {
			notFound: true,
		};

	// If the event is not open, redirect to the event page. Use the notify query parameter to display a message about the form being cloed.
	if (!isCheckinOpen(event)) {
		const notifyType: NotificationType = isFuture(event.formOpen) ? "not-open" : "closed";
		return {
			redirect: {
				destination: `/events/${event.pageID}?notify=${notifyType}`,
				permanent: false,
			},
		};
	}
	
	const checkin = await prisma.checkin.findUnique({
		where: {
			eventID_memberID: {
				eventID: event.id,
				memberID: member!.id,
			},
		},
	});

	return {
		props: {
			json: superjson.stringify({
				previous:
					checkin != null
						? {
								feedback: checkin.feedback,
								inPerson: checkin.isInPerson,
						  }
						: null,
				event,
			}),
		},
	};
}

const CheckinView: NextPage<{ json: string }> = ({
    	json,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { event, previous } = superjson.parse<CheckinServerProps>(json);
	const checkin = trpc.member.checkin.useMutation();
	const router = useRouter();

	const ogp = useOpenGraph({
		title: `Check-in to "${event.name}"`,
		description: `Use this page to check-in to "${event.name}"`,
		url: `/events/${event.id}/check-in`,
	});

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: { feedback: previous?.feedback ?? "" },
		mode: "onChange",
	});

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		if (data == null) return;
		const feedback = (data.feedback ?? "").length > 0 ? data.feedback : null;

		checkin.mutate(
			{ pageID: event!.pageID, feedback, inPerson: true },
			{
				onSuccess: async () => {
					await router.push(`/events/${event!.pageID}?notify=success`);
				},
			}
		);
	};

	const maximumCharacters = 300;
	const remainingCharacters = maximumCharacters - watch("feedback").length;

	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<RootLayout innerClassName="justify-center items-start">
				<div className="mt-10 w-full mx-3.5 max-w-[30rem] bg-white rounded-lg">
					<div className="pl-3.5 py-3.5 pr-1">
						<Breadcrumbs
							value={[
								{
									label: event.name,
									href: `/events/${event.pageID}/`,
								},
								{
									label: "Check-in",
									active: true,
								},
							]}
						/>
					</div>
					<form onSubmit={handleSubmit(onSubmit)} className="px-5 my-1.5">
						<div className="w-full">
							<label htmlFor="comment" className="block text-sm font-medium text-gray-700">
								Add your suggestions & comments
							</label>
							<div className="mt-1">
								{/* TODO: Implement inperson/virtual form buttons */}
								<textarea
									className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
									rows={4}
									placeholder={`Optional, ${maximumCharacters} characters max`}
									{...register("feedback", {
										maxLength: {
											message: "Max character limit reached",
											value: maximumCharacters,
										},
										pattern: {
											message: "Letters, numbers & punctuation only",
											value: /^[A-z\-!@#$%^&*(){},\.;':\[\]~\s\/=+0-9|]*$/,
										},
									})}
								/>
							</div>
						</div>
						<div className="flex justify-end items-center">
							{errors.feedback != undefined ? (
								<div className="flex-grow text-sm text-red-500">{errors.feedback.message}</div>
							) : null}
							<span
								className={classNames(
									"px-2 text-sm flex items-center",
									// Make text red when less than 15% of maximum characters remain
									remainingCharacters / maximumCharacters < 0.15 ? "text-red-500" : "text-zinc-500"
								)}
							>
								{remainingCharacters}
							</span>
							<button className="h-[36px] my-1.5 w-full bg-primary font-inter text-white rounded font-semibold max-w-[10rem]">
								{previous == null ? "Submit" : "Save"}
							</button>
						</div>
					</form>
				</div>
			</RootLayout>
		</>
	);
};

// export async function getStaticProps(urlParams: eventPageParams) {}

export default CheckinView;
