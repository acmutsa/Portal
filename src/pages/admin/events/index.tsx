import { NextPage } from "next";
import AdminRootLayout from "@/components/admin/AdminRootLayout";
import EventView from "@/components/admin/EventView";

const Events: NextPage = () => {
	return (
		<AdminRootLayout current="events">
			<EventView />
		</AdminRootLayout>
	);
};

export default Events;
