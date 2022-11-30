import { GetServerSidePropsContext, NextPage } from "next";
import { classNames } from "@/utils/helpers";
import { useState } from "react";
import OpenGraph from "@/components/common/OpenGraph";
import Head from "next/head";
import useOpenGraph from "@/components/common/useOpenGraph";
import { validateMember } from "@/utils/server_helpers";
import { prisma } from "@/server/db/client";
import ProfileView from "@/components/member/ProfileView";
import AttendanceView from "@/components/member/AttendanceView";
import StatusView, { SimpleCheckin } from "@/components/member/StatusView";
import { Member, MemberData } from "@prisma/client";

interface ServerSideProps {
	member: Member & { data: MemberData };
	checkins: SimpleCheckin[];
}

export async function getServerSideProps<ServerSideProps>({ req, res }: GetServerSidePropsContext) {
	const [valid, member] = await validateMember(req, res, true);
	if (!valid)
		return {
			redirect: {
				destination: "/login",
			},
		};

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
			member,
			checkins: checkins.map((checkin) => ({
				eventName: checkin.event.name,
				eventDate: checkin.event.eventStart.toLocaleDateString(),
				points: 1,
			})),
		},
	};
}

const MeView: NextPage<ServerSideProps> = ({ member, checkins }: ServerSideProps) => {
	const [currentTabId, setCurrentTabId] = useState("profile");

	const tabs: { [k: string]: { label: string; content: any; props: any } } = {
		profile: { label: "Profile", content: ProfileView, props: { member } },
		status: { label: "Status", content: StatusView, props: { checkins } },
		attendance: { label: "Attendance", content: AttendanceView, props: { checkins } },
	};

	const changeTab = (id: string) => {
		if (tabs.hasOwnProperty(id)) {
			setCurrentTabId(id);
		}
	};

	const ogp = useOpenGraph({
		title: "Membership Profile",
		description: "Login to view your membership status, attendance and view/update your profile!",
		url: "/me",
	});

	const currentTab = tabs[currentTabId];
	const [CurrentElement, CurrentProps] = [currentTab?.content, currentTab?.props];

	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<div className="page-view bg-zinc-100 flex justify-center py-8 md:py-20">
				<div className="w-[90%] max-w-[40rem]">
					<div className="overflow-hidden bg-white shadow sm:rounded-lg my-4">
						<div className="px-4 pt-4 border-b border-gray-200 shadow z-10 relative">
							<div className="sm:flex sm:items-baseline">
								<h3 className="text-lg leading-6 font-medium text-gray-900">Membership</h3>
								<div className="mt-4 sm:mt-0 sm:ml-10">
									<nav className="-mb-px flex space-x-8">
										{Object.entries(tabs).map(([tabId, tab]) => (
											<button
												key={tabId}
												onClick={() => changeTab(tabId)}
												className={classNames(
													tabId == currentTabId
														? "border-secondary-400 hover:border-secondary-500 text-secondary-500 hover:text-secondary-600"
														: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
													"whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
												)}
												aria-current={tabId == currentTabId ? "page" : undefined}
											>
												{tab.label}
											</button>
										))}
									</nav>
								</div>
							</div>
						</div>
						<div className="border-t border-gray-200">
							<CurrentElement {...CurrentProps} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MeView;
