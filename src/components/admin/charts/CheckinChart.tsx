import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { trpc } from "@/utils/trpc";
import { moveToNearestWeekday } from "@/utils/helpers";
import React, { FunctionComponent } from "react";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

let startDate = new Date();
moveToNearestWeekday(startDate, "monday");
const weekRange = 10;
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

const CheckinChart: FunctionComponent = () => {
	const weeks = trpc.useQuery(["events.getGroupedCheckins", { startDate }], {
		refetchOnWindowFocus: false,
		retry: false,
		enabled: false
	});

	const data = weeks.isSuccess
		? {
			labels: weeks.data!.map((week) => week.label),
			datasets: [
				{
					label: "Checkins",
					data: weeks.data!.map((week) => week.count),
					backgroundColor: "#2D728F",
					borderRadius: 5,
				},
			],
		}
		: {
			datasets: [
			] };

	return <>
		{weeks.isSuccess ? <span className="p-2 tracking-wide text-zinc-800 font-medium font-inter">Checkins</span> :
			<div className="p-2 h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-48" />}
		<Bar className="pt-2" data={data} options={options} />
	</>
}

export default CheckinChart;