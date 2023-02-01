import { Event, prisma } from "@/server/db/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { useGlobalContext } from "@/components/common/GlobalContext";
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { classNames, isCheckinOpen } from "@/utils/helpers";
import { validateMember } from "@/utils/server_helpers";
import { useEffect } from "react";
import useOpenGraph from "@/components/common/useOpenGraph";
import OpenGraph from "@/components/common/OpenGraph";
import Head from "next/head";
import superjson from "superjson";
import RootLayout from "@/components/layout/RootLayout";

interface CheckinPageParams {
	[key: string]: string;

	id: string;
}

interface FormValues {
	feedback: string;
}

type CheckinServerProps = {
	form: { feedback: string | null; inPerson: boolean } | null;
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
	const idParam = params!.id;

	if (!valid)
		return {
			redirect: { destination: `/login?next=/events/${idParam}/check-in`, permanent: false },
		};

	// Limit selection of properties for SSR
	const event = await prisma.event.findUnique({
		where: {
			pageID: idParam.toLowerCase(),
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

	const checkin = await prisma.checkin.findUnique({
		where: {
			eventID_memberID: {
				eventID: event.id,
				memberID: member!.id,
			},
		},
	});

	if (!isCheckinOpen(event))
		return {
			redirect: {
				destination: `/events/${event.pageID}?notify=formClosed`,
				permanent: false,
			},
		};

	return {
		props: {
			json: superjson.stringify({
				form:
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

const CheckinView: NextPage<{ json: string }> = ({ json }) => {
	const { event, form } = superjson.parse<CheckinServerProps>(json);
	const checkin = trpc.member.checkin.useMutation();
	const router = useRouter();
	const [globalState] = useGlobalContext();

	const ogp = useOpenGraph({
		title: `Check-in to "${event.name}"`,
		description: `Use this page to check-in to "${event.name}"`,
		url: `/events/${event.id}/check-in`,
	});

	useEffect(() => {
		return () => {
			console.log(form);
		};
	}, []);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: { feedback: form?.feedback ?? "" },
		mode: "onChange",
	});

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		if (data == null) return;
		const feedback = (data.feedback ?? "").length > 0 ? data.feedback : null;

		checkin.mutate(
			{ pageID: event!.pageID, feedback, inPerson: true },
			{
				onSuccess: async () => {
					await router.push(`/events/${event!.pageID}?notify=checkinSuccess`);
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
											value: /^[A-z\-!@#$%^&*(),;':\[\]~\s]*$/,
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
									remainingCharacters / maximumCharacters < 0.15 ? "text-red-500" : "text-zinc-500"
								)}
							>
								{remainingCharacters}
							</span>
							<button className="h-[36px] my-1.5 w-full bg-primary font-inter text-white rounded font-semibold max-w-[10rem]">
								{form == null ? "Submit" : "Save"}
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
