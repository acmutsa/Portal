import CustomDisclosure from "@/components/member/CustomDisclosure";
import { FunctionComponent } from "react";
import Detail from "@/components/common/Detail";

const disclosures = [
	[
		"How many points does a given event provide?",
		<span>
			Most events provide one point. Some, like hackathons, will provide more, and some will provide
			less (minimum 0.5 points). Details of the event's points can be found on it's event page.
		</span>,
	],
	[
		"I'm missing points for an event I definitely attended. What do I do?",
		<span>
			Don't worry - simply contact one of our officers on Discord and we can add the attendance to
			your account for you.
		</span>,
	],
];

export interface SimpleCheckin {
	eventName: string;
	eventDate: string;
	points: number;
}

interface StatusProps {
	checkins: SimpleCheckin[];
}

const requiredPoints = 15;
const StatusView: FunctionComponent<StatusProps> = ({ checkins }: StatusProps) => {
	const points: number = checkins.map((event) => event.points).reduce((a, b) => a + b, 0);
	const progress: number = Math.min(1, points / requiredPoints);
	const remainingPoints = Math.max(0, requiredPoints - points);

	return (
		<>
			<div className="px-4 bg-gray-50 sm:px-8 pt-7 pb-5 flex justify-end items-center">
				<div className="w-full bg-gray-200 rounded-full h-[0.9rem] shadow-inner dark:bg-gray-700">
					<div
						className="bg-blue-600 h-full rounded-full min-w-[1rem] max-w-full"
						style={{ width: `${(progress * 100).toFixed(0)}%` }}
					/>
				</div>
				<span className="font-inter text-base text-zinc-600 text-white ml-3">
					{(progress * 100).toFixed(0)}%
				</span>
			</div>
			<dl className="overflow-hidden overflow-y-auto relative">
				<Detail label="Current Points" useButton={false}>
					{points.toFixed(1)}
				</Detail>
				<Detail label="Required Points" useButton={false}>
					{requiredPoints.toFixed(1)}
				</Detail>
				<Detail label="Remaining Points" useButton={false}>
					{remainingPoints.toFixed(1)}
				</Detail>
			</dl>
			<div className="px-3 pb-3">
				{disclosures.map(([title, description]) => CustomDisclosure({ title, description }))}
			</div>
		</>
	);
};

export default StatusView;
