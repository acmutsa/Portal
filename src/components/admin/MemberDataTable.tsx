import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode, FilterOperator, FilterService } from "primereact/api";
import { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import { toPrettyMemberData, PrettyMemberData } from "@/utils/transform";
import type { Member, MemberData } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Fragment } from "react";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";

FilterService.register("MATCH_TAG", (a, b) => {
	let enumName = "";
	switch (b) {
		case "ACM":
			enumName = "ACM";
			break;
		case "ACM W":
			enumName = "ACM_W";
			break;
		case "Rowdy Creators":
			enumName = "ROWDY_CREATORS";
			break;
		case "ICPC":
			enumName = "ICPC";
			break;
		case "CIC":
			enumName = "CODING_IN_COLOR";
			break;
	}

	return a.has(enumName);
});

interface MemberTableItem {
	member: Member;
	prettyMemberData: PrettyMemberData;
}

type MemberWithData = Prisma.MemberGetPayload<{ include: { data: true } }>;

// TODO: Try to make this all typed? AFAIK there is a way to type the PrimeReact rowData. In the meantime going to YOLO it.

const orgBodyTemplate = (rowData: any) => {
	console.log("rowData: ", rowData);
	const orgTags: JSX.Element[] = [];
	if (rowData.prettyMemberData.organizations?.has("ACM"))
		orgTags.push(<span className="p-tag m-[2px] rounded !bg-secondary">ACM</span>);
	if (rowData.prettyMemberData.organizations?.has("ACM_W"))
		orgTags.push(<span className="p-tag m-[2px] rounded !bg-[#F2751B]">ACM W</span>);
	if (rowData.prettyMemberData.organizations?.has("ICPC"))
		orgTags.push(<span className="p-tag m-[2px] rounded !bg-[#FFD51E]">ICPC</span>);
	if (rowData.prettyMemberData.organizations?.has("ROWDY_CREATORS"))
		orgTags.push(<span className="p-tag m-[2px] rounded !bg-[#2EC4EF]">Rowdy Creators</span>);
	if (rowData.prettyMemberData.organizations?.has("CODING_IN_COLOR"))
		orgTags.push(<span className="p-tag m-[2px] rounded !bg-[#000000]">CIC</span>);
	return <div>{orgTags}</div>;
};

const orgFilterTemplate = (options: any) => {
	return (
		<Dropdown
			value={options.value}
			options={["ACM", "ACM W", "ICPC", "Rowdy Creators", "CIC"]}
			onChange={(e: any) => {
				console.log("val: ", e.value);
				options.filterCallback(e.value);
			}}
			itemTemplate={orgItemTemplate}
			placeholder="Select a Status"
			className="p-column-filter"
			showClear
		/>
	);
};

const orgItemTemplate = (option: string) => {
	switch (option) {
		case "ACM":
			return <span className="p-tag m-[2px] rounded !bg-secondary">ACM</span>;
		case "ACM W":
			return <span className="p-tag m-[2px] rounded !bg-[#F2751B]">ACM W</span>;
		case "ICPC":
			return <span className="p-tag m-[2px] rounded !bg-[#FFD51E]">ICPC</span>;
		case "Rowdy Creators":
			return <span className="p-tag m-[2px] rounded !bg-[#2EC4EF]">Rowdy Creators</span>;
		case "CIC":
			return <span className="p-tag m-[2px] rounded !bg-[#000000]">CIC</span>;
	}
};

const DataTableDemo = () => {
	const [selectedCustomers, setSelectedCustomers] = useState(null);
	const [memberTableItems, setMemberTableItem] = useState<MemberTableItem[]>([]);
	const [filters, setFilters] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		"member.name": {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
		"member.email": {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
		"member.id": {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
		"member.data.major": {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
		"member.data.classification": {
			operator: FilterOperator.OR,
			constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
		},
		"prettyMemberData.organizations": {
			operator: FilterOperator.OR,
			constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
		},
	});

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
			globalFilterFields={[
				"member.name",
				"member.email",
				"member.id",
				"member.data.major",
				"member.data.classification",
				"prettyMemberData.organizations",
			]}
			filterDisplay="menu"
			filters={filters}
			dataKey="member.id"
		>
			<Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
			<Column filter field="member.name" header="Name"></Column>
			<Column filter field="member.email" header="Email"></Column>
			<Column filter field="member.id" header="ABC123"></Column>
			<Column filter field="member.data.major" header="Major"></Column>
			<Column filter field="member.data.classification" header="Classification"></Column>
			<Column
				field="prettyMemberData.organizations"
				header="Organizations"
				body={orgBodyTemplate}
				filter
				filterElement={orgFilterTemplate}
				filterMatchModeOptions={[{ label: "Match Tag", value: "MATCH_TAG" }]}
				filterMatchMode="custom"
			></Column>
		</DataTable>
	);
};

export default DataTableDemo;
