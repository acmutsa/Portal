import { NextPage } from "next";
import AdminRootLayout from "@/components/admin/AdminRootLayout";
import DashView from "@/components/admin/DashView";

const Dashboard: NextPage = () => {
	return (
		<AdminRootLayout current="dashboard">
			<DashView />
		</AdminRootLayout>
	);
};

export default Dashboard;
