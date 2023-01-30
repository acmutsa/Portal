import MemberDataTable from "@/components/admin/MemberDataTable";
import Stat from "@/components/common/Stat";
import { pluralize } from "@/utils/helpers";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { BsPlus } from "react-icons/bs";

const EventView: FunctionComponent = () => {
	const { isSuccess, data: members } = trpc.member.getAll.useQuery();

	const { isSuccess: activityLoaded, data: memberCount } = trpc.member.countActive.useQuery();

	return (
		<div className="w-full h-full">
			<div className="flex w-full">
				<div className="flex gap-10 justify-start my-2 p-4 bg-white border-zinc-200 border-[1px] rounded-lg">
					{/* TODO: Create truly useful statistics or implement the logic behind these ones. */}
					<Stat label="Total Members" loading={!isSuccess} value={members?.length} />
					<Stat label="Active Members" loading={!activityLoaded} value={memberCount?.active} />
					<Stat label="Inactive Members" loading={!activityLoaded} value={memberCount?.inactive} />
				</div>
			</div>
			<div className="p-4 bg-white rounded-lg border-zinc-200 border-[1px]">
				<div className="w-full pb-2">
					{isSuccess ? (
						<div className="flex justify-start font-inter">
							<span className="text-xl tracking-wide text-zinc-800 font-bold my-auto">Members</span>
							<span className="ml-2 px-2 pt-0.5 text-zinc-600 text-sm my-auto overflow-hidden overflow-ellipsis whitespace-nowrap">
								viewing {members.length} member{pluralize(members.length)}
							</span>
							<div className="grow" />
							<div className="justify-self-end">
								<Link href="/admin/members/new">
									<button className="inline-flex h-8 md:h-9 text-sm whitespace-nowrap md:text-base justify-center items-center align-middle mx-3 p-2 pr-4 bg-indigo-500 hover:bg-indigo-600 shadow-inner hover:shadow-inner-md-2 rounded-lg text-white font-inter font-medium">
										<BsPlus className="h-6 w-6" />
										New Member
									</button>
								</Link>
								{/* TODO: Use the labels & default value options & use the human format (not id) */}
							</div>
						</div>
					) : (
						<div className="animate-pulse p-2 h-5 bg-gray-300 rounded-full dark:bg-gray-700 w-48" />
					)}
				</div>
				<div className="overflow-scroll overflow-x-auto border-box">
					<div className="inline-block pb-1 w-full">
						<MemberDataTable />
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventView;
