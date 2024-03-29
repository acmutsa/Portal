import Sidebar from "@/components/admin/Sidebar";
import Breadcrumbs, { Page } from "@/components/admin/common/Breadcrumbs";
import RootLayout from "@/components/layout/RootLayout";
import { FunctionComponent, ReactNode } from "react";

// Used in conjunction with Sidebar to highlight the current page.
export type AdminPageIdentifier =
	| "dashboard"
	| "members"
	| "new-member"
	| "events"
	| "new-event"
	| "logout";

type AdminRootLayoutProps = {
	current?: AdminPageIdentifier;
	children: ReactNode;
	breadcrumbs?: Page[];
};

const AdminRootLayout: FunctionComponent<AdminRootLayoutProps> = ({
	current,
	children,
	breadcrumbs,
}) => {
	return (
		<RootLayout backgroundImage={null} className="flex" footer={false}>
			<Sidebar current={current} />
			<div
				className="flex-grow max-h-full h-full max-w-full w-full overflow-y-auto overflow-x-clip relative bg-zinc-100"
				style={{ minHeight: "calc(100vh - 72px)" }}
			>
				{breadcrumbs != null ? <Breadcrumbs pages={breadcrumbs} /> : null}
				<div className="p-5 pt-[1rem]">
					<div className="col-span-4">{children}</div>
				</div>
			</div>
		</RootLayout>
	);
};

export default AdminRootLayout;
