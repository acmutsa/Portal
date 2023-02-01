import { NextPage } from "next";
import AdminRootLayout from "@/components/admin/AdminRootLayout";
import NewMemberView from "@/components/admin/NewMemberView";

const NewMember: NextPage = () => {
	return (
		<AdminRootLayout current="new-member">
			<NewMemberView />
		</AdminRootLayout>
	);
};

export default NewMember;
