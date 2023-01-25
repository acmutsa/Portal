import { FunctionComponent, useState } from "react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import EventForm, {
	InitialEventFormSchema,
	InitialEventFormValues,
} from "@/components/forms/EventForm";

const EditEventView: FunctionComponent = () => {
	const router = useRouter();

	// Slug property of query contains the pageID we want
	const slug = router?.query?.slug;
	if (slug == undefined || slug[1] == undefined) return <>Bad event ID.</>;

	let updateEvent = trpc.useMutation(["admin.updateEvent"]);

	// Pull in the event's current data, parsing it in the process.
	const [initialData, setInitialData] = useState<InitialEventFormValues | null>(null);
	const { data: event, isSuccess } = trpc.useQuery(["events.getUnique", { pageID: slug[1] }], {
		onSuccess: (newData) => {
			const parsedData = InitialEventFormSchema.safeParse(newData);
			if (parsedData.success) setInitialData(parsedData.data);
		},
	});

	return (
		<div className="w-full h-full p-[5px]">
			<div className="max-w-[50rem] mx-auto">
				<div className="sm:px-6 lg:px-0 lg:col-span-9">
					{isSuccess && initialData != null ? (
						<EventForm
							context="modify"
							initialValues={initialData!}
							onSubmit={async (data) => {
								if (data == null) return;
								updateEvent.mutate(
									{
										id: event.id,
										...data,
										organization: data.organization.id,
										semester: data.semester.id,
									},
									{
										onSuccess: (res) => {
											router.push(`/events/${res.pageID}`);
										},
									}
								);
							}}
						/>
					) : (
						<p>Loading...</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default EditEventView;
