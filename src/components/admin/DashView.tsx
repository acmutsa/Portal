import React, { FunctionComponent } from "react";
import CheckinChart from "@/components/admin/charts/CheckinChart";

const AdminDashboard: FunctionComponent = () => {
	return (
		<>
			<div className="grid grid-cols-6 xl:grid-cols-12">
				<div className="col-span-6 rounded bg-white p-1 lg:p-4">
					<div className="mx-2">
						<CheckinChart />
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminDashboard;
