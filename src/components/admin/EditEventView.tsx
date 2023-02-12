import { FunctionComponent, useRef, useState } from "react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import EventForm, {
	InitialEventFormSchema,
	InitialEventFormValues,
} from "@/components/forms/EventForm";
import { AiFillWarning } from "react-icons/ai";
import WarningDialog from "@/components/member/WarningDialog";

type EditEventProps = {
	id: string;
	initialData: InitialEventFormValues;
};

const EditEventView: FunctionComponent<EditEventProps> = ({ id, initialData }) => {
	const updateEvent = trpc.admin.updateEvent.useMutation();
	const deleteEvent = trpc.admin.deleteEvent.useMutation();
	const router = useRouter();

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
								id,
							},
							{
								onSuccess: () => {
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
						<EventForm
							context="modify"
							initialValues={initialData}
							onDelete={() => {
								setDeleteDialog(true);
							}}
							onSubmit={async (data) => {
								if (data == null) return;
								updateEvent.mutate(
									{
										...data,
										id,
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
					</div>
				</div>
			</div>
		</>
	);
};

export default EditEventView;
