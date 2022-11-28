import { Event, prisma } from "@/server/db/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { useGlobalContext } from "@/components/common/GlobalContext";
import { NextPage } from "next";

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

	const { register, handleSubmit } = useForm({
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

	return (
		<div className="page-view bg-darken">
			<div className="mt-10 max-w-[30rem] mx-auto bg-white rounded-lg text-center flex flex-col items-center justify-center">
				<h1 className="text-2xl p-1.5 font-inter font-bold text-primary">
					Thanks for attending <span className="text-secondary">{event.name}</span>?
				</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="px-4 mb-4 w-full max-w-[30rem] m-1">
						<textarea
							className="w-full font-roboto h-full min-h-[5rem] rounded ring-1 ring-zinc-300 resize-y placeholder:mx-2"
							placeholder="  Leave your feedback here..."
							{...register("feedback", { pattern: /^[\w.+\-!@#$%^&*(),;':\[\]~]*$/ })}
						/>
					</div>

					<h1 className="text-5xl font-extrabold font-inter"></h1>
					<button className="h-[40px] mb-3 w-full bg-primary font-inter text-white rounded font-semibold max-w-[15rem]">
						Submit
					</button>
				</form>{" "}
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
