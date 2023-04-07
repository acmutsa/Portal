import { NextPage } from "next";
import AdminRootLayout from "@/components/admin/AdminRootLayout";
import DashView from "@/components/admin/DashView";

const Dashboard: NextPage = () => {
	return (
		<AdminRootLayout
			current="dashboard"
			breadcrumbs={[{ name: "Dashboard", href: "/admin", current: true }]}
		>
			<DashView />
		</AdminRootLayout>
	);
};

export default Dashboard;
