import { NextPage } from "next";
import AdminRootLayout from "@/components/admin/AdminRootLayout";
import MemberView from "@/components/admin/MemberView";

const MembersView: NextPage = () => {
	return (
		<AdminRootLayout current="members">
			<MemberView />
		</AdminRootLayout>
	);
};

export default MembersView;
