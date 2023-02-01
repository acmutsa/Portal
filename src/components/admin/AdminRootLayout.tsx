import { FunctionComponent, ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";
import RootLayout from "@/components/layout/RootLayout";

export type AdminPageIdentifier =
	| "dashboard"
	| "members"
	| "new-member"
	| "events"
	| "new-event"
	| "logout";

type AdminRootLayoutProps = {
	current: AdminPageIdentifier;
	children: string | ReactNode | ReactNode[];
};

const AdminRootLayout: FunctionComponent<AdminRootLayoutProps> = ({ current, children }) => {
	return (
		<RootLayout background={false} className="flex" footer={false}>
			<Sidebar current={current} />
			<div className="flex-grow p-5 pt-[1rem] max-h-full h-full max-w-full w-full overflow-scroll relative bg-zinc-100">
				<div className="col-span-4">{children}</div>
			</div>
		</RootLayout>
	);
};

export default AdminRootLayout;
