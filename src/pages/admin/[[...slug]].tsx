import type { NextPage } from "next";
import { AiOutlineDashboard } from "react-icons/ai";
import { BsCalendarRange } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { BiLogOut } from "react-icons/bi";
import EventView from "@/components/admin/EventView";
import MemberView from "@/components/admin/MemberView";
import DashView from "@/components/admin/DashView";
import NewEventView from "@/components/admin/NewEventView";
import NewMemberView from "@/components/admin/NewMemberView";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import EditEventView from "@/components/admin/EditEventView";
import EditMemberView from "@/components/admin/EditMemberView";
import Head from "next/head";
import Sidebar from "@/components/admin/Sidebar";
import { deleteCookie } from "cookies-next";
import { useGlobalContext } from "@/components/common/GlobalContext";
import { cookies } from "@/utils/constants";

enum AdminView {
	dashboard,
	members,
	events,
	newEvent,
	newMember,
	editEvent,
	editMember,
	logout,
}

const navigationOptions = [
	{
		icon: AiOutlineDashboard,
		id: AdminView.dashboard,
		label: "Dashboard",
	},
	{
		icon: CgProfile,
		id: AdminView.members,
		label: "Members",
	},
	{
		icon: BsCalendarRange,
		id: AdminView.events,
		label: "Events",
	},
	{
		icon: BiLogOut,
		id: AdminView.logout,
		label: "Logout",
	},
];

const inferFromPath = (path: string): [FunctionComponent | null, AdminView | null] => {
	if (path.startsWith("/admin/events/")) {
		if (path.endsWith("/new/")) return [NewEventView, AdminView.newEvent];
		if (path.endsWith("/admin/events/")) return [EventView, AdminView.events];
		return [EditEventView, AdminView.editEvent];
	}
	if (path.startsWith("/admin/members/")) {
		if (path.endsWith("/new/")) return [NewMemberView, AdminView.newMember];
		if (path.endsWith("/admin/members/")) return [MemberView, AdminView.members];
		return [EditMemberView, AdminView.editMember];
	}
	if (path.endsWith("/admin/")) return [DashView, AdminView.dashboard];

	return [null, null];
};

const Admin: NextPage = () => {
	const router = useRouter();
	const [globalState, setGlobalState] = useGlobalContext();
	let path =
		router.asPath.charAt(router.asPath.length - 1) != "/" ? router.asPath + "/" : router.asPath;

	const swapPage = (view: AdminView) => {
		CurrentPage = view;
		switch (view) {
			case AdminView.dashboard:
				router.push("/admin/", undefined, { shallow: true });
				break;
			case AdminView.members:
				router.push("/admin/members/", undefined, { shallow: true });
				break;
			case AdminView.events:
				router.push("/admin/events/", undefined, { shallow: true });
				break;
			case AdminView.newEvent:
				router.push("/admin/events/new/", undefined, { shallow: true });
				break;
			case AdminView.newMember:
				router.push("/admin/members/new/", undefined, { shallow: true });
				break;
			case AdminView.logout:
				deleteCookie(cookies.admin_username);
				deleteCookie(cookies.admin_password);
				router.replace("/admin/login");
				setGlobalState({ ...globalState, admin: false });
		}
	};

	let [ElementToShow, CurrentPage] = inferFromPath(path);

	return (
		<>
			<Head>
				<title>Administrative Panel</title>
			</Head>
			<div className="page-view bg-white flex w-[100vw]">
				<Sidebar options={navigationOptions} onChange={(id) => swapPage(id as AdminView)} />
				<div className="flex-grow p-5 pt-[1rem] max-h-full h-full max-w-full w-full overflow-scroll relative bg-zinc-100">
					<div className="col-span-4">{ElementToShow ? <ElementToShow /> : null}</div>
				</div>
			</div>
		</>
	);
};

export default Admin;
