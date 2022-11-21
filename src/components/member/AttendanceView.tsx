import { FunctionComponent } from "react";
import { SimpleCheckin } from "@/components/member/StatusView";

interface AttendanceProps {
	checkins: SimpleCheckin[];
}

const AttendanceView: FunctionComponent<AttendanceProps> = ({ checkins }: AttendanceProps) => {
	return (
		<div className="overflow-x-auto relative p-4 my-2">
			<table className="w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr className="[&>*]:py-2 [&>*]:px-3 [&>*]:md:py-4 [&>*]:md:px-6">
						<th scope="col">Event Name</th>
						<th scope="col">Date</th>
						<th scope="col" className="text-center">
							Points
						</th>
					</tr>
				</thead>
				<tbody>
					{checkins.length > 0 ? (
						checkins.map((checkin, index) => (
							<tr
								key={index}
								className="[&>*]:py-2 [&>*]:px-3 [&>*]:md:py-4 [&>*]:md:px-6 bg-white border-b dark:bg-gray-800 dark:border-gray-700"
							>
								<td
									scope="row"
									className="font-medium text-gray-900 whitespace-nowrap dark:text-white"
								>
									{checkin.eventName}
								</td>
								<td className="py-4 px-6">{checkin.eventDate}</td>
								<td className="py-4 px-6 text-semibold text-center">
									+{checkin.points.toFixed(1)}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={3}>You have not checked in to any events yet.</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default AttendanceView;
