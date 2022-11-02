import React, { FunctionComponent } from "react";
import { Bar } from "react-chartjs-2";
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from "chart.js";
import { trpc } from "@/utils/trpc";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function getMonday() {
	var previousMonday = new Date();
	previousMonday.setDate(previousMonday.getDate() - ((previousMonday.getDay() + 6) % 7));
	return previousMonday;
}

const weekRange = 10;
let startDate = getMonday();
startDate.setDate(startDate.getDate() - 7 * weekRange);

export const options = {
	plugins: {
		title: {
			display: false,
		},
		legend: {
			display: false,
		},
	},
	responsive: true,
	scales: {
		x: {
			stacked: true,
		},
		y: {
			stacked: true,
			ticks: {
				min: 0,
				stepSize: 1,
			},
		},
	},
};

interface Event {
	name: string;
	week: string;
	date: Date;
	count: number;
}

const colors = ["#2D728F", "#AB3428", "#A63D40"];

const AdminDashboard: FunctionComponent = () => {
	const weeks = trpc.useQuery(["events.getGroupedCheckins", { startDate }], {
		refetchOnWindowFocus: false,
		retry: false,
	});

	const data = weeks.isSuccess
		? {
				labels: weeks.data.map((week) => week.label),
				datasets: [
					{
						label: "Checkins",
						data: weeks.data.map((week) => week.count),
						backgroundColor: "#2D728F",
						borderRadius: 5,
					},
				],
		  }
		: { datasets: [] };

	return (
		<>
			<div className="grid grid-cols-4 lg:grid-cols-12">
				<div className="grid-cols-4 lg:col-span-6 rounded bg-white p-4">
					<span className="p-2 tracking-wide text-zinc-800 font-medium font-inter">Checkins</span>
					<Bar className="pt-2" data={data} options={options} />
				</div>
			</div>
		</>
	);
};

export default AdminDashboard;
