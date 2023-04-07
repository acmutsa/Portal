import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next";
import AdminRootLayout from "@/components/admin/AdminRootLayout";
import EditEventView from "@/components/admin/EditEventView";
import { z } from "zod";
import { InitialEventFormValues } from "@/components/forms/EventForm";
import superjson from "superjson";
import { getUnique } from "@/server/controllers/events";

type EditEventProps = {
	event: InitialEventFormValues;
	id: string;
};

export async function getServerSideProps({
	query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{ json: string }>> {
	const parsedId = z.string().min(1).safeParse(query.id);
	if (!parsedId.success)
		return {
			redirect: {
				destination: "/admin/events",
				permanent: false,
			},
		};

	const event = await getUnique({ pageID: parsedId.data });
	if (event == null)
		return {
			redirect: {
				destination: "/admin/events",
				permanent: false,
			},
		};

	return {
		props: {
			json: superjson.stringify({
				id: event.id,
				event: event,
			}),
		},
	};
}

const EditEventPage: NextPage<{ json: string }> = ({ json }) => {
	const { id, event } = superjson.parse<EditEventProps>(json);
	return (
		<AdminRootLayout>
			<div className="w-full h-full p-[5px]">
				<div className="max-w-[50rem] mx-auto">
					<div className="text-lg text-bold">{event.name}</div>
					<div className="sm:px-6 lg:px-0 lg:col-span-9">
						<EditEventView id={id} initialData={event} />
					</div>
				</div>
			</div>
		</AdminRootLayout>
	);
};

export default EditEventPage;
