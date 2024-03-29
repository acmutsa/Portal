import { GetStaticPropsResult, NextPage } from "next";
import AdminRootLayout from "@/components/admin/AdminRootLayout";
import Stat from "@/components/common/Stat";
import { pluralize } from "@/utils/helpers";
import Link from "next/link";
import { BsPlus } from "react-icons/bs";
import { TbTableExport } from "react-icons/tb";
import MemberDataTable from "@/components/admin/MemberDataTable";
import { useMemo, useRef } from "react";
import { toPrettyMemberData } from "@/utils/transform";
import { MemberData, Prisma } from "@prisma/client";
import superjson from "superjson";
import {
	countActiveMembers,
	countMembers,
	getAllMembers,
	MemberWithData,
	MemberWithDataAndCheckins,
} from "@/server/controllers/member";
import { DataTable } from "primereact/datatable";

type MemberViewProps = {
	activeCount: {
		active: number;
		inactive: number;
	};
	members: MemberWithDataAndCheckins[];
};

export async function getStaticProps(): Promise<GetStaticPropsResult<{ json: string }>> {
	const members = getAllMembers(true, true);
	const activeCount = countActiveMembers();
	const memberCount = countMembers();

	// Wait until both of them are complete simultaneously
	await Promise.all([members, memberCount, activeCount]);

	// I am unsure if awaiting them in tandem is best like this, but it's an attempt at a design pattern.
	return {
		props: {
			json: superjson.stringify({
				activeCount: {
					active: await activeCount,
					inactive: (await memberCount) - (await activeCount),
				},
				members: await members,
			}),
		},
		revalidate: 60,
	};
}

const MembersView: NextPage<{ json: string }> = ({ json }) => {
	const { members, activeCount } = superjson.parse<MemberViewProps>(json);
	type checkinsWithEvents = Prisma.CheckinGetPayload<{ include: { event: true } }>;

	const prettyData = useMemo(() => {
		return (
			members?.map((member) => ({
				member: member,
				prettyMemberData: toPrettyMemberData(
					member,
					member.data || ({} as MemberData),
					member.checkins || ([] as Prisma.CheckinGetPayload<{ include: { event: true } }>[])
				),
			})) ?? []
		);
	}, [members]);

	const dataTableRef = useRef<DataTable>(null);

	return (
		<AdminRootLayout
			current="members"
			breadcrumbs={[{ name: "Members", href: "/admin/members", current: true }]}
		>
			<div className="w-full h-full">
				<div className="flex w-full">
					<div className="flex gap-10 justify-start my-2 p-4 bg-white border-zinc-200 border-[1px] rounded-lg">
						<Stat label="Total Members" value={members?.length} />
						<Stat label="Active Members" value={activeCount.active} />
						<Stat label="Inactive Members" value={activeCount.inactive} />
					</div>
				</div>
				<div className="p-4 bg-white rounded-lg border-zinc-200 border-[1px]">
					<div className="w-full pb-2">
						<div className="flex justify-start font-inter">
							<span className="text-xl tracking-wide text-zinc-800 font-bold my-auto">Members</span>
							<span className="ml-2 px-2 pt-0.5 text-zinc-600 text-sm my-auto overflow-hidden overflow-ellipsis whitespace-nowrap">
								viewing {members.length} member{pluralize(members.length)}
							</span>
							<div className="grow" />
							<div className="justify-self-end">
								<button
									onClick={() => dataTableRef.current?.exportCSV()}
									className="inline-flex h-8 md:h-9 text-sm whitespace-nowrap md:text-base justify-center items-center align-middle mx-3 p-2 pr-4 bg-indigo-500 hover:bg-indigo-600 shadow-inner hover:shadow-inner-md-2 rounded-lg text-white font-inter font-medium"
								>
									<TbTableExport className="h-6 w-6 p-1" />
									Export
								</button>
							</div>
							<div className="justify-self-end">
								<Link href="/admin/members/new">
									<button className="inline-flex h-8 md:h-9 text-sm whitespace-nowrap md:text-base justify-center items-center align-middle mx-3 p-2 pr-4 bg-indigo-500 hover:bg-indigo-600 shadow-inner hover:shadow-inner-md-2 rounded-lg text-white font-inter font-medium">
										<BsPlus className="h-6 w-6" />
										New Member
									</button>
								</Link>
							</div>
						</div>
					</div>
					<div className="border-box">
						<div className="inline-block pb-1 w-full">
							<MemberDataTable data={prettyData} ref={dataTableRef} />
						</div>
					</div>
				</div>
			</div>
		</AdminRootLayout>
	);
};

export default MembersView;
