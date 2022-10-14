import type { NextPage } from "next";
import { AiOutlineDashboard } from "react-icons/ai";
import { BsCalendarRange, BsReplyAll } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import EventView from "../../components/admin/EventView";
import MemberView from "../../components/admin/MemberView";
import DashView from "../../components/admin/DashView";
import NewEventView from "../../components/admin/NewEventView";
import NewMemberView from "../../components/admin/NewMemberView";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";

enum viewType {
	dashboard = "dashboard",
	members = "members",
	events = "events",
	newEvent = "newEvent",
	newMember = "newMember",
}

const Admin: NextPage = () => {
	const router = useRouter();
	let path =
		router.asPath.charAt(router.asPath.length - 1) != "/" ? router.asPath + "/" : router.asPath;

	const swapPage = (view: viewType) => {
		switch (view) {
			case viewType.dashboard:
				router.push("/admin/", undefined, { shallow: true });
				break;
			case viewType.members:
				router.push("/admin/members/", undefined, { shallow: true });
				break;
			case viewType.events:
				router.push("/admin/events/", undefined, { shallow: true });
				break;
			case viewType.newEvent:
				router.push("/admin/events/new/", undefined, { shallow: true });
				break;
			case viewType.newMember:
				router.push("/admin/members/new/", undefined, { shallow: true });
				break;
		}
	};

	let ElementToShow: FunctionComponent | null = null;

	switch (path) {
		case "/admin/events/":
			ElementToShow = EventView;
			break;
		case "/admin/members/":
			ElementToShow = MemberView;
			break;
		case "/admin/":
			ElementToShow = DashView;
			break;
		case "/admin/events/new/":
			ElementToShow = NewEventView;
			break;
		case "/admin/members/new/":
			ElementToShow = NewMemberView;
			break;
	}

	return (
		<div className="page-view flex items-center justify-center">
			<div className="bg-white w-full max-w-[2000px] h-[90%] rounded-none mx-[5px] grid grid-cols-5 overflow-x-hidden">
				<div className="bg-zinc-100 font-opensans text-lg font-semibold m-[5px] ">
					<div className="w-full h-[50px] grid md:grid-cols-2 grid-cols-1 gap-1 text-base mb-[0.25rem] px-[5px]">
						<button
							className="flex items-center justify-center w-full h-full rounded-sm bg-primary-lighter text-white"
							onClick={() => swapPage(viewType.newEvent)}
						>
							<BsCalendarRange className="mr-[5px]" />
							New Event
						</button>{" "}
						<button
							className="flex items-center justify-center w-full h-full rounded-sm bg-primary-lighter text-white"
							onClick={() => swapPage(viewType.newMember)}
						>
							<CgProfile className="mr-[5px]" />
							New Member
						</button>
					</div>
					<button
						className="flex items-center justify-center w-full h-[4em]  hover:bg-zinc-200"
						onClick={() => swapPage(viewType.dashboard)}
					>
						<AiOutlineDashboard className="mr-[5px]" />
						Dashboard
					</button>
					<button
						className="flex items-center justify-center w-full h-[4em] hover:bg-zinc-200"
						onClick={() => swapPage(viewType.members)}
					>
						<CgProfile className="mr-[5px]" />
						Members
					</button>
					<button
						className="flex items-center justify-center w-full h-[4em] hover:bg-zinc-200"
						onClick={() => swapPage(viewType.events)}
					>
						<BsCalendarRange className="mr-[5px]" />
						Events
					</button>
				</div>
				<div className="col-span-4">{ElementToShow ? <ElementToShow /> : null}</div>
			</div>
		</div>
	);
};

export default Admin;
