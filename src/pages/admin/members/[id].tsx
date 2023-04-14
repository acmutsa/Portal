import AdminRootLayout from "@/components/admin/AdminRootLayout";
import { getPreciseSemester } from "@/utils/helpers";
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next";
import { Member } from "@prisma/client";
import superjson from "superjson";
import { getMember } from "@/server/controllers/member";
import { z } from "zod";
import { format, formatDistanceToNow } from "date-fns";
import { prisma } from "@/server/db/client";
import { type SimpleCheckin } from "@/components/member/StatusView";

type ViewMemberProps = {
	member: Member;
	checkIns: SimpleCheckin[];
	currentSemester: string;
};

export async function getServerSideProps({
	query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{ json: string }>> {
	const parsedId = z.string().safeParse(query.id);

	if (!parsedId.success)
		return {
			redirect: {
				destination: "/admin/members/",
				permanent: false,
			},
		};

	const member = await getMember(parsedId.data);

	const checkins = (
		await prisma.checkin.findMany({
			where: {
				memberID: parsedId.data,
				event: {
					semester: getPreciseSemester(),
				},
			},
			select: {
				event: {
					select: {
						// Select ONLY the checkins name and start time.
						name: true,
						eventStart: true,
						points: true,
					},
				},
			},
		})
	).map((checkin) => ({
		eventName: checkin.event.name,
		eventDate: checkin.event.eventStart.toDateString(),
		points: checkin.event.points,
	}));

	return {
		props: {
			json: superjson.stringify({
				member,
				currentSemester: getPreciseSemester(),
				checkIns: checkins,
			}),
		},
	};
}

const ViewMemberPage: NextPage<{ json: string }> = ({ json }) => {
	const { member, currentSemester, checkIns } = superjson.parse<ViewMemberProps>(json);
	const details = [
		["Name", member.name],
		["Join Date", format(member.joinDate, "MMMM do, yyyy h:mma")],
		["myUTSA ID", member.id],
		["Email", member.email],
		[`Member Points (${currentSemester})`, checkIns.length],
		[
			"Last Seen",
			member.lastSeen != null ? (
				<time title={member.lastSeen.toISOString()} dateTime={member.lastSeen.toISOString()}>
					{formatDistanceToNow(member.lastSeen, { addSuffix: true })}
				</time>
			) : (
				"Unknown"
			),
		],
	];

	return (
		<AdminRootLayout
			breadcrumbs={[
				{ name: "Members", href: "/admin/members" },
				{
					name: member.name,
					href: `/admin/members/${member.id}`,
					current: true,
				},
			]}
		>
			<div className="flex items-center space-x-5">
				<div className="pl-5 flex-shrink-0">
					<div className="relative">
						<img
							className="h-16 w-16 rounded-full"
							src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
							alt=""
						/>
						<span className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
					</div>
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
					<p className="text-sm font-medium text-gray-500">
						Joined on{" "}
						<time dateTime={member.joinDate.toISOString()} title={member.joinDate.toISOString()}>
							{format(member.joinDate, "MMMM do, yyyy")}
						</time>
						.
					</p>
				</div>
			</div>
			<div className="mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2 lg:col-start-1">
					<section aria-labelledby="applicant-information-title">
						<div className="bg-white shadow sm:rounded-lg">
							<div className="px-4 py-5 sm:px-6">
								<h2
									id="applicant-information-title"
									className="text-lg font-medium leading-6 text-gray-900"
								>
									Member Information
								</h2>
								<p className="mt-1 max-w-2xl text-sm text-gray-500">Essential member details</p>
							</div>
							<div className="border-t border-gray-200 px-4 py-5 sm:px-6">
								<dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
									{details.map(([label, value]) => {
										return (
											<div className="sm:col-span-1">
												<dt className="text-sm font-medium text-gray-500">{label}</dt>
												<dd className="mt-1 text-sm text-gray-900">{value}</dd>
											</div>
										);
									})}
								</dl>
							</div>
						</div>
					</section>
				</div>
			</div>
		</AdminRootLayout>
	);
};

export default ViewMemberPage;
