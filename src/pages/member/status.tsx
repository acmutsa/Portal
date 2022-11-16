import type { GetServerSidePropsContext, NextPage } from "next";
import { Disclosure, Transition } from "@headlessui/react";
import { BsChevronDown } from "react-icons/bs";
import { ReactNode } from "react";
import { prisma } from "@/server/db/client";
import OpenGraph from "@/components/common/OpenGraph";
import Head from "next/head";
import useOpenGraph from "@/components/common/useOpenGraph";
import { validateMember } from "@/utils/server_helpers";

const getDisclosure = (title: ReactNode | string, description: ReactNode | string) => {
	return (
		<div className="my-2 text-xs md:text-sm">
			<Disclosure>
				{({ open }) => (
					<>
						<Disclosure.Button
							className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left
								font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring
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
							<Disclosure.Panel className="px-3 md:px-4 py-2 md:pt-4 text-gray-500">
								{description}
							</Disclosure.Panel>
						</Transition>
					</>
				)}
			</Disclosure>
		</div>
	);
};

interface SimpleCheckin {
	eventName: string;
	eventDate: string;
	points: number;
}

interface ServerSideProps {
	checkins: string;
}

const login_redirect_response = {
	redirect: {
		destination: "/login",
	},
};

export async function getServerSideProps<ServerSideProps>({ req, res }: GetServerSidePropsContext) {
	const [valid, member] = await validateMember(req, res);
	if (!valid) return login_redirect_response;

	const checkins = await prisma.checkin.findMany({
		where: {
			member: member!,
		},
		select: {
			event: {
				select: {
					// Select ONLY the checkins name and start time.
					name: true,
					eventStart: true,
				},
			},
		},
	});

	return {
		props: {
			checkins: JSON.stringify(
				checkins.map((checkin) => ({
					eventName: checkin.event.name,
					eventDate: checkin.event.eventStart.toLocaleDateString(),
					points: 1,
				}))
			),
		},
	};
}

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

const Status: NextPage<ServerSideProps> = ({ checkins: checkinsJSON }) => {
	const checkins: SimpleCheckin[] = JSON.parse(checkinsJSON);
	const requiredPoints = 15;

	const ogp = useOpenGraph({
		title: "Member Status",
		description: "View your current membership status & check-in data.",
		url: "/member/status",
	});

	// Transform the returned data
	const points: number = checkins.map((event) => event.points).reduce((a, b) => a + b, 0);
	const progress: number = Math.min(1, points / requiredPoints);

	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<div className="page-view bg-darken flex justify-center py-8 md:py-20">
				<div className="w-[90%] md:w-[40rem]">
					<div className="p-3 my-4 bg-white rounded-lg shadow">
						<div className="flex justify-between mb-1">
							<span className="text-[15px] font-inter text-slate-800 text-white">
								{points < requiredPoints
									? `${requiredPoints - points} points remaining`
									: "You are a member!"}
							</span>
							<span className="text-sm font-inter text-slate-800 tracking-widest text-white">
								{(progress * 100).toFixed(0)}%
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
							<div
								className="bg-blue-600 h-full rounded-full min-w-[1rem] max-w-full"
								style={{ width: `${(progress * 100).toFixed(0)}%` }}
							/>
						</div>
					</div>
					<div className="p-3 my-4 bg-white rounded-lg shadow">
						<div className="md:text-xl font-inter px-1 pb-2">Membership Status</div>
						<div className="overflow-x-auto relative px-1">
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
					</div>
					<div className="p-3 my-4 bg-white rounded-lg shadow">
						{disclosures.map(([title, description]) => getDisclosure(title, description))}
					</div>
				</div>
			</div>
		</>
	);
};

export default Status;
