import type { NextPage } from "next";
import { trpc } from "@/utils/trpc";
import { Disclosure, Transition } from "@headlessui/react";
import { BsChevronDown } from "react-icons/bs";
import { ReactNode } from "react";

interface Checkin {
	eventName: string;
	eventDate: Date;
	points: number;
}

const getDisclosure = (title: ReactNode | string, description: ReactNode | string) => {
	return (
		<Disclosure>
			{({ open }) => (
				<>
					<Disclosure.Button
						className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left
								text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring
								focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
					>
						<span>{title}</span>
						<BsChevronDown
							className={`ease-in-out transform transition-transform ${
								open ? "rotate-180" : ""
							} h-5 w-5 text-blue-500`}
						/>
					</Disclosure.Button>
					<Transition
						enter="transition duration-100 ease-out"
						enterFrom="transform scale-95 opacity-0"
						enterTo="transform scale-100 opacity-100"
						leave="transition duration-75 ease-out"
						leaveFrom="transform scale-100 opacity-100"
						leaveTo="transform scale-95 opacity-0"
					>
						<Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
							{description}
						</Disclosure.Panel>
					</Transition>
				</>
			)}
		</Disclosure>
	);
};

const Status: NextPage = () => {
	const requiredPoints = 15;

	const { status: eventsStatus, data: events } = trpc.useQuery(["events.getAll"], {
		refetchOnWindowFocus: false,
	});

	// Transform the returned data
	const checkins: Checkin[] = (events ?? []).map((event) => ({
		eventName: event.name,
		eventDate: event.createdAt,
		points: Math.floor(Math.random() * 3) + 1,
	}));
	const points: number = checkins.map((event) => event.points).reduce((a, b) => a + b, 0);
	const progress: number = Math.min(1, points / requiredPoints);

	const disclosures = [
		[
			"How many points does a given event provide?",
			<span>
				Most events provide one point. Some will provide more (hackathons), some will provide less
				(minimum 0.5 points). Details of the event's points can be found on it's event page.
			</span>,
		],
		[
			"I'm missing points for an event I definitely attended. What do I do?",
			"Don't worry, simply contact one of our officers on Discord and we can add the point to your account for you.",
		],
	];

	return (
		<div className="page-view flex justify-center py-20">
			<div className="w-[40rem]">
				<div className="p-3 my-4 bg-white rounded-lg shadow">
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
						{eventsStatus ? (
							<div
								className="bg-blue-600 h-full rounded-full min-w-[1rem]"
								style={{ width: `${(progress * 100).toFixed(0)}%` }}
							/>
						) : null}
					</div>
				</div>
				<div className="p-3 my-4 bg-white rounded-lg shadow">
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
				<div className="p-3 my-4 bg-white rounded-lg shadow">
					{disclosures.map(([title, description]) => getDisclosure(title, description))}
				</div>
			</div>
		</div>
	);
};

export default Status;
