import { NextPage } from "next";
import AdminRootLayout from "@/components/admin/AdminRootLayout";
import NewEventView from "@/components/admin/NewEventView";

const NewEventPage: NextPage = () => {
	return (
		<AdminRootLayout current="new-event">
			<NewEventView />
		</AdminRootLayout>
	);
};

export default NewEventPage;
