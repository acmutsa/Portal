import { FunctionComponent } from "react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import EventForm from "@/components/forms/EventForm";

const NewEventView: FunctionComponent = () => {
	const router = useRouter();
	const now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

	let createEvent = trpc.useMutation(["admin.createEvent"]);

	return (
		<div className="w-full h-full p-[5px]">
			<div className="max-w-[50rem] mx-auto">
				<div className="sm:px-6 lg:px-0 lg:col-span-9">
					<EventForm
						context="create"
						onSubmit={async (data) => {
							if (data == null) return;
							createEvent.mutate(
								{ ...data, organization: data.organization.id, semester: data.semester.id },
								{
									onSuccess: (res) => {
										router.push(`/admin/events/${res.id}`);
										window.open(`/events/${res.pageID}`, "_blank");
									},
								}
							);
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default NewEventView;
