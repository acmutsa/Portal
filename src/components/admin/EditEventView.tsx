import { FunctionComponent, useRef, useState } from "react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import EventForm, {
	InitialEventFormSchema,
	InitialEventFormValues,
} from "@/components/forms/EventForm";
import { AiFillWarning } from "react-icons/ai";
import WarningDialog from "@/components/member/WarningDialog";

const EditEventView: FunctionComponent<{ id: string }> = ({ id }) => {
	const updateEvent = trpc.admin.updateEvent.useMutation();
	const deleteEvent = trpc.admin.deleteEvent.useMutation();
	const router = useRouter();

	// Pull in the event's current data, parsing it in the process.
	const [initialData, setInitialData] = useState<InitialEventFormValues | null>(null);
	const { data: event, isSuccess } = trpc.events.getUnique.useQuery(
		{ pageID: id },
		{
			onSuccess: (newData) => {
				const parsedData = InitialEventFormSchema.safeParse(newData);
				if (parsedData.success) setInitialData(parsedData.data);
			},
		}
	);

	// TODO: Implement ?action= query parameter handling for deletes
	const [deleteDialog, setDeleteDialog] = useState(false);

	return (
		<>
			<WarningDialog
				title="Delete Event"
				description={
					<p>
						Once deleted, the event will not be recovered. <br />
						All checkins associated with this event will also disappear.
					</p>
				}
				onClose={(confirmed: boolean) => {
					if (confirmed) {
						deleteEvent.mutate(
							{
								id: event!.id,
							},
							{
								onSuccess: (res) => {
									router.push("/admin/events");
								},
							}
						);
					}
					setDeleteDialog(false);
				}}
				open={deleteDialog}
				iconParentClass="bg-red-100"
				icon={<AiFillWarning className="h-6 w-6 text-red-600" />}
			/>
			<div className="w-full h-full p-[5px]">
				<div className="max-w-[50rem] mx-auto">
					<div className="sm:px-6 lg:px-0 lg:col-span-9">
						{isSuccess && initialData != null ? (
							<EventForm
								context="modify"
								initialValues={initialData!}
								onDelete={() => {
									setDeleteDialog(true);
								}}
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
		</>
	);
};

export default EditEventView;
