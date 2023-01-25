import { Event, prisma } from "@/server/db/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { useGlobalContext } from "@/components/common/GlobalContext";
import { NextPage } from "next";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { classNames } from "@/utils/helpers";

interface eventPageParams {
	params: { id: string };
	locales: string[];
	locale: string;
	defaultLocale: string;
}

interface FormValues {
	feedback: string;
}

const CheckinView: NextPage<{ event: Event }> = ({ event }) => {
	const checkin = trpc.useMutation(["member.checkin"]);
	const router = useRouter();
	const [globalState] = useGlobalContext();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: { feedback: "" },
	});

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		if (data == null) return;
		const feedback = (data.feedback ?? "").length > 0 ? data.feedback : null;

		checkin.mutate(
			{ pageID: event!.pageID, feedback },
			{
				onSuccess: async () => {
					// TODO: Add special interaction here, maybe? Set off a serotonin boosting animation?
					await router.push(`/events/${event!.pageID}`);
				},
			}
		);
	};

	if (globalState.ready && !globalState.member) {
		router.push("/login");
		return <div className="page-view bg-darken" />;
	}

	// console.log(errors);
	// console.log({ isValid, feedback: watch("feedback") });
	const maximumCharacters = 300;
	const remainingCharacters = maximumCharacters - watch("feedback").length;

	return (
		<div className="page-view bg-darken">
			<div className="flex mx-auto justify-center">
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
								<textarea
									className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
									rows={4}
									placeholder={`Optional, ${maximumCharacters} characters max`}
									{...register("feedback", {
										validate: (v) => {
											console.log(`Calling validate (${v.length})`);
											return true;
										},
										maxLength: {
											message: "Maximum character limit reached",
											value: maximumCharacters,
										},
										pattern: {
											message: "Letters, numbers & basic punctuation only",
											value: /[A-z\-!@#$%^&*(),;':\[\]~]*/,
										},
									})}
								/>
							</div>
						</div>
						<div className="flex justify-end items-center">
							{errors.feedback != undefined ? <span>{errors.feedback.message}</span> : null}
							<span
								className={classNames(
									"px-2 text-sm flex items-center",
									remainingCharacters / maximumCharacters < 0.15 ? "text-red-500" : "text-zinc-500"
								)}
							>
								{remainingCharacters}
							</span>
							<button className="h-[36px] my-1.5 w-full bg-primary font-inter text-white rounded font-semibold max-w-[12rem]">
								Submit
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export async function getStaticProps(urlParams: eventPageParams) {
	const params = urlParams.params;

	// Limit selection of properties for SSR
	const event = await prisma.event.findUnique({
		where: {
			pageID: params.id.toLowerCase(),
		},
		select: {
			id: true,
			name: true,
			pageID: true,
		},
	});

	if (event == null)
		return {
			notFound: true,
			revalidate: 5,
		};

	return {
		props: {
			event,
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

export default CheckinView;
