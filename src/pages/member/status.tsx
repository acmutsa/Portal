import type { NextPage } from "next";
import { trpc } from "@/utils/trpc";

interface Checkin {
	eventName: string;
	eventDate: Date;
	points: number;
}

const Status: NextPage = () => {
	const requiredPoints = 15;

	const { status, data } = trpc.useQuery(["events.getAll"], { refetchOnWindowFocus: false });

	// Transform the returned data
	const checkins: Checkin[] = (data ?? []).map((event) => ({
		eventName: event.name,
		eventDate: event.createdAt,
		points: Math.floor(Math.random() * 3) + 1,
	}));
	const points: number = checkins.map((event) => event.points).reduce((a, b) => a + b, 0);
	const progress: number = Math.min(1, points / requiredPoints);

	return (
		<div className="page-view flex justify-center py-20">
			<div className="w-[40rem]">
				<div className="p-3 mb-4 bg-white rounded-lg shadow">
					<div className="flex justify-between mb-1">
						<span className="text-[15px] font-medium text-slate-800 text-white">
							{points < requiredPoints
								? `${requiredPoints - points} points remaining`
								: "You are a member!"}
						</span>
						<span className="text-sm font-medium text-slate-800 text-white">
							{(progress * 100).toFixed(0)}%
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
						{status ? (
							<div
								className="bg-blue-600 h-full rounded-full min-w-[1rem]"
								style={{ width: `${(progress * 100).toFixed(0)}%` }}
							/>
						) : null}
					</div>
				</div>
				<div className="p-3 bg-white rounded-lg shadow">
					<span className="text-xl font-inter">Membership Status</span>
					<div className="overflow-x-auto relative">
						<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
							<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
								<tr>
									<th scope="col" className="py-3 px-6">
										Event Name
									</th>
									<th scope="col" className="py-3 px-6">
										Date
									</th>
									<th scope="col" className="py-3 px-6">
										Points
									</th>
								</tr>
							</thead>
							<tbody>
								{checkins.map((checkin) => (
									<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
										<th
											scope="row"
											className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{checkin.eventName}
										</th>
										<td className="py-4 px-6">{checkin.eventDate.toLocaleDateString()}</td>
										<td className="py-4 px-6">{checkin.points}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Status;
