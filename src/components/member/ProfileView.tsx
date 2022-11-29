import majors from "@/utils/majors.json";
import { FunctionComponent } from "react";
import { Member, MemberData } from "@prisma/client";
import Badge from "@/components/common/Badge";
import Detail from "@/components/common/Detail";
import { lightFormat } from "date-fns";
import ModifiableDetail from "@/components/common/ModifiableDetail";
import { z } from "zod";

interface ProfileViewProps {
	member: Member & { data: MemberData };
}

const BadgeStatusColors = {
	success: "bg-green-100 text-green-800",
	in_progress: "bg-yellow-100 text-yellow-800",
	failure: "bg-red-100 text-red-800",
};

const emailParser = z.string().email();

const ProfileView: FunctionComponent<ProfileViewProps> = ({ member }: ProfileViewProps) => {
	const statusColor = BadgeStatusColors.in_progress;
	const statusText = "In Progress";
	const formattedJoinDate = lightFormat(member.joinDate, "MM/dd/yyyy");

	return (
		<>
			<dl className="overflow-scroll overflow-x-auto relative">
				<ModifiableDetail id="name" placeholder="John Doe" label="Name" initialValue={member.name}>
					{member.name}
				</ModifiableDetail>
				<ModifiableDetail
					id="email"
					placeholder="you@example.org"
					label="Email address"
					inputType="email"
					initialValue={member.email}
					rules={{
						email: (email) => {
							if (email == null || email.length == 0) return "Required.";
							return emailParser.safeParse(email).success || "Invalid email address.";
						},
					}}
				>
					{member.email}
				</ModifiableDetail>
				<Detail label="myUTSA ID">{member.id}</Detail>
				<ModifiableDetail
					id="major"
					label="Major"
					choices={majors}
					initialValue={member.data?.major}
				>
					{member.data?.major ?? "Unknown"}
				</ModifiableDetail>
				<Detail label="Join Date">{formattedJoinDate}</Detail>
				<Detail label="Classification">{member.data?.classification ?? "Unknown"}</Detail>
				<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
					<dt className="text-sm font-medium text-gray-500">Membership Status</dt>
					<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						<Badge colorClass={statusColor}>{statusText}</Badge>
					</dd>
				</div>
			</dl>
		</>
	);
};

interface ProfileViewProps {
	name: string;
	id: string;
	email: string;
}

export default ProfileView;
