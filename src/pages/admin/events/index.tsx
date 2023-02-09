import { NextPage } from "next";
import AdminRootLayout from "@/components/admin/AdminRootLayout";
import EventView from "@/components/admin/EventView";

const EventViewPage: NextPage = () => {
	return (
		<AdminRootLayout current="events">
			<EventView />
		</AdminRootLayout>
	);
};

export default EventViewPage;
