import { NextPage } from "next";
import AdminRootLayout from "@/components/admin/AdminRootLayout";
import NewEventView from "@/components/admin/NewEventView";

const NewEventPage: NextPage = () => {
	return (
		<AdminRootLayout
			current="new-event"
			breadcrumbs={[
				{ name: "Events", href: "/admin/events" },
				{
					name: "Create",
					href: "/admin/events/new",
					current: true,
				},
			]}
		>
			<div className="w-full h-full p-[5px]">
				<div className="max-w-[50rem] mx-auto">
					<div className="sm:px-6 lg:px-0 lg:col-span-9">
						<NewEventView />
					</div>
				</div>
			</div>
		</AdminRootLayout>
	);
};

export default NewEventPage;
