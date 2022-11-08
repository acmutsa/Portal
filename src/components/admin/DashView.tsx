import React, { FunctionComponent } from "react";
import CheckinChart from "@/components/admin/charts/CheckinChart";

const AdminDashboard: FunctionComponent = () => {
	return (
		<>
			<div className="grid grid-cols-4 lg:grid-cols-12">
				<div className="grid-cols-4 lg:col-span-6 rounded bg-white p-4">
					<CheckinChart />
				</div>
			</div>
		</>
	);
};

export default AdminDashboard;
