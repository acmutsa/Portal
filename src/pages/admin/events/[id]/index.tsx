import AdminRootLayout from "@/components/admin/AdminRootLayout";
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next";
import superjson from "superjson";
import { z } from "zod";
import { Event } from "@prisma/client";
import { getUnique } from "@/server/controllers/events";
import { CheckinWithMember, getEventCheckins } from "@/server/controllers/checkin";
import EventDetails from "@/components/admin/events/EventDetails";
import { Column } from "primereact/column";
import { format } from "date-fns";
import { DataTable } from "primereact/datatable";
import { absUrl } from "@/utils/helpers";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";

type ViewEventProps = {
	event: Event;
	checkins: CheckinWithMember[];
	qrCodeValue: string;
};

export async function getServerSideProps({
	query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{ json: string }>> {
	const parsedId = z.string().safeParse(query.id);

	if (!parsedId.success)
		return {
			redirect: {
				destination: "/admin/events/",
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

	const checkins = await getEventCheckins(event.id);
	return {
		props: {
			json: superjson.stringify({
				event,
				checkins,
				qrCodeValue: absUrl(`/events/${event.pageID}/check-in`),
			}),
		},
	};
}

const ViewMemberPage: NextPage<{ json: string }> = ({ json }) => {
	const { event, checkins, qrCodeValue } = superjson.parse<ViewEventProps>(json);

	return (
		<AdminRootLayout
			breadcrumbs={[
				{ name: "Events", href: "/admin/events" },
				{
					name: event.name,
					href: `/admin/events/${event.pageID}`,
					current: true,
				},
			]}
		>
			<div className="grid grid-cols-12 space-y-2">
				<div className="col-span-6 mb-6">
					<div className="max-w-screen-md">
						<EventDetails qrCodeValue={qrCodeValue} event={event} />
					</div>
				</div>
				<div className="col-span-8">
					<div className="max-w-screen-lg">
						<DataTable
							id="checkins"
							rowHover
							dataKey="id"
							className="shadow"
							sortField="time"
							stripedRows
							sortOrder={1}
							scrollable
							scrollHeight="20rem"
							value={checkins.map((checkin) => ({
								id: checkin.member.id,
								email: checkin.member.email,
								name: checkin.member.name,
								time: checkin.timestamp,
								feedback: checkin.feedback,
							}))}
						>
							<Column
								sortable
								field="id"
								header="ID"
								bodyClassName="whitespace-nowrap pl-5"
								headerClassName="pl-5"
							/>
							<Column sortable field="name" header="Name" bodyClassName="whitespace-nowrap" />
							<Column
								bodyClassName="whitespace-nowrap"
								sortable
								field="time"
								header="Time"
								body={({ time }) => format(time, "MM/dd hh:mm:ss a")}
							/>
							<Column field="feedback" header="Feedback" />
						</DataTable>
					</div>
				</div>
			</div>
		</AdminRootLayout>
	);
};

export default ViewMemberPage;
