import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import { toPrettyMemberData, PrettyMemberData } from "@/utils/transform";
import type { Member, MemberData } from "@prisma/client";
import { Prisma } from "@prisma/client";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";

interface MemberTableItem {
	member: Member;
	prettyMemberData: PrettyMemberData;
}

type MemberWithData = Prisma.MemberGetPayload<{ include: { data: true } }>;

// TODO: Try to make this all typed? AFAIK there is a way to type the PrimeReact rowData. In the meantime going to YOLO it.

const orgBodyTemplate = (rowData: any) => {
	const orgTags: JSX.Element[] = [];
	if (rowData.prettyMemberData.organizations?.has("ACM"))
		orgTags.push(<span className="p-tag p-tag-rounded p-tag-info">ACM</span>);
	if (rowData.prettyMemberData.organizations?.has("ACM_W"))
		orgTags.push(<span className="p-tag p-tag-rounded p-tag-info">ACM W</span>);
	if (rowData.prettyMemberData.organizations?.has("ICPC"))
		orgTags.push(<span className="p-tag p-tag-rounded p-tag-info">ICPC</span>);
	if (rowData.prettyMemberData.organizations?.has("ROWDY_CREATORS"))
		orgTags.push(<span className="p-tag p-tag-rounded p-tag-info">Rowdy Creators</span>);
	if (rowData.prettyMemberData.organizations?.has("CODING_IN_COLOR"))
		orgTags.push(<span className="p-tag p-tag-rounded p-tag-info">CIC</span>);
	return <div>{orgTags}</div>;
};

const DataTableDemo = () => {
	const [selectedCustomers, setSelectedCustomers] = useState(null);
	const [memberTableItems, setMemberTableItem] = useState<MemberTableItem[]>([]);

	const memberTableItemsStaging: MemberTableItem[] = [];

	const { isSuccess, data: members } = trpc.useQuery(["member.getAll"], {
		refetchOnWindowFocus: false,
	});

	// TODO: make this less gross

	useEffect(() => {
		if (members) {
			for (let member of members as MemberWithData[]) {
				memberTableItemsStaging.push({
					member: member,
					prettyMemberData: toPrettyMemberData(member, member.data || ({} as MemberData)),
				});
			}
			setMemberTableItem(memberTableItemsStaging);
		}
	}, [members]);

	return (
		<DataTable
			rowHover
			onSelectionChange={(e) => setSelectedCustomers(e.value)}
			selection={selectedCustomers}
			responsiveLayout="scroll"
			value={memberTableItems}
			selectionAriaLabel="name"
			paginator
			rows={10}
			rowsPerPageOptions={[10, 25, 50, 100]}
		>
			<Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
			<Column field="member.name" header="Name"></Column>
			<Column field="member.email" header="Email"></Column>
			<Column field="member.id" header="ABC123"></Column>
			<Column field="member.data.major" header="Major"></Column>
			<Column field="member.data.classification" header="Classification"></Column>
			<Column
				field="prettyMemberData.organizations"
				header="Organizations"
				body={orgBodyTemplate}
			></Column>
		</DataTable>
	);
};

export default DataTableDemo;
