import AdminRootLayout from "@/components/admin/AdminRootLayout";
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next";
import { Member } from "@prisma/client";
import superjson from "superjson";
import { getMember } from "@/server/controllers/member";
import { z } from "zod";

type ViewMemberProps = {
	member: Member;
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

	return {
		props: {
			json: superjson.stringify({
				member,
			}),
		},
	};
}

const ViewMemberPage: NextPage<{ json: string }> = ({ json }) => {
	const { member } = superjson.parse<ViewMemberProps>(json);

	return (
		<AdminRootLayout>
			Member Name: {member.name}
			<br />
			This page only has a simple scaffold & member validation implemented.
			<pre className="p-2 bg-zinc-200 rounded border border-zinc-300 max-w-[35rem] my-4 break-words whitespace-pre-wrap">
				{JSON.stringify(member, null, 4)}
			</pre>
		</AdminRootLayout>
	);
};

export default ViewMemberPage;
