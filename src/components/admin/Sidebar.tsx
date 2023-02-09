import { FunctionComponent, ReactNode, useState } from "react";
import { classNames } from "@/utils/helpers";
import { IconType } from "react-icons";
import { AiOutlineDashboard } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BsCalendarRange } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { AdminPageIdentifier } from "@/components/admin/AdminRootLayout";
import Link from "next/link";

interface SidebarItem {
	id: AdminPageIdentifier;
	link: string;
	label: string;
	icon: IconType;
	countLabel?: number | string | ReactNode;
}

const sidebarItems: SidebarItem[] = [
	{
		id: "dashboard",
		icon: AiOutlineDashboard,
		link: "/admin",
		label: "Dashboard",
	},
	{
		id: "members",
		icon: CgProfile,
		link: "/admin/members",
		label: "Members",
	},
	{
		id: "events",
		icon: BsCalendarRange,
		link: "/admin/events",
		label: "Events",
	},
	{
		id: "logout",
		icon: BiLogOut,
		link: "/admin/logout",
		label: "Logout",
	},
];

type SidebarProps = {
	current?: AdminPageIdentifier;
};

const Sidebar: FunctionComponent<SidebarProps> = ({ current }: SidebarProps) => {
	return (
		<>
			<div className="flex-1 flex-shrink flex flex-col min-h-full bg-primary-500 md:min-w-[13rem] z-10">
				<div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto w-full">
					<nav className="mt-5 flex flex-col w-min-full px-2 space-y-1" aria-label="Sidebar">
						{sidebarItems.map((item) => (
							<Link
								href={item.link}
								key={item.id}
								className={classNames(
									item.id == current
										? "bg-primary-600 text-white"
										: "text-gray-300 hover:bg-primary-600 hover:text-white",
									"cursor-pointer group md:w-full flex items-center p-2 text-sm font-medium rounded-md"
								)}
							>
								<item.icon
									className={classNames(
										item.id == current
											? "text-gray-300"
											: "text-gray-400 group-hover:text-gray-300",
										"md:mr-3 flex-shrink-0 h-6 w-6"
									)}
									aria-hidden="true"
								/>
								<span className="flex-1 hidden md:inline">{item.label}</span>
								{item.countLabel != undefined ? (
									<span
										className={classNames(
											item.id == current
												? "bg-primary-800"
												: "bg-gray-900 group-hover:bg-primary-400",
											"hidden ml-3 md:inline-block py-0.5 px-3 text-xs font-medium rounded-full"
										)}
									>
										{item.countLabel}
									</span>
								) : null}
							</Link>
						))}
					</nav>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
