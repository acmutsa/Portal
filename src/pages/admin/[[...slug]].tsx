import type { NextPage } from "next";
import { AiOutlineDashboard } from "react-icons/ai";
import { BsCalendarRange } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import EventView from "../../components/admin/EventView";
import MemberView from "../../components/admin/MemberView";
import DashView from "../../components/admin/DashView";
import NewEventView from "../../components/admin/NewEventView";
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
				router.push("/admin/events/new", undefined, { shallow: true });
				break;
		}
	};

	let ElementToShow: FunctionComponent | null = null;

	if (path == "/admin/events/") {
		ElementToShow = EventView;
	} else if (path == "/admin/members/") {
		ElementToShow = MemberView;
	} else if (path == "/admin/") {
		ElementToShow = DashView;
	} else if (path == "/admin/events/new/") {
		ElementToShow = NewEventView;
	}

	return (
		<div className="page-view flex items-center justify-center">
			<div className="bg-white w-full max-w-[2000px] h-[90%] rounded-lg mx-[5px] grid grid-cols-5 overflow-x-hidden">
				<div className="bg-zinc-200 font-opensans text-lg font-semibold p-[5px]">
					<div className="w-full h-[50px] grid md:grid-cols-2 grid-cols-1 gap-1 mb-[0.25rem]">
						<button
							className="flex items-center justify-center w-full h-full rounded-xl bg-primary-lighter text-white"
							onClick={() => swapPage(viewType.newEvent)}
						>
							<BsCalendarRange className="mr-[5px]" />
							New Event
						</button>{" "}
						<button
							className="flex items-center justify-center w-full h-full rounded-xl bg-primary-lighter text-white"
							onClick={() => swapPage(viewType.dashboard)}
						>
							<CgProfile className="mr-[5px]" />
							New Member
						</button>
					</div>
					<button
						className="flex items-center justify-center w-full h-[100px] rounded-xl hover:bg-zinc-100"
						onClick={() => swapPage(viewType.dashboard)}
					>
						<AiOutlineDashboard className="mr-[5px]" />
						Dashboard
					</button>
					<button
						className="flex items-center justify-center w-full h-[100px] rounded-xl hover:bg-zinc-100"
						onClick={() => swapPage(viewType.members)}
					>
						<CgProfile className="mr-[5px]" />
						Members
					</button>
					<button
						className="flex items-center justify-center w-full h-[100px] rounded-xl hover:bg-zinc-100"
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
