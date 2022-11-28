import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode, FilterOperator, FilterService } from "primereact/api";
import { useEffect, useState, useRef } from "react";
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
		case "White":
			enumName = "WHITE";
			break;
		case "Black or African American":
			enumName = "BLACK_OR_AFRICAN_AMERICAN";
			break;
		case "Native American / Alaskan Native":
			enumName = "NATIVE_AMERICAN_ALASKAN_NATIVE";
			break;
		case "Asian":
			enumName = "ASIAN";
			break;
		case "Native Hawaiian / Pacific Islander":
			enumName = "NATIVE_HAWAIIAN_PACIFIC_ISLANDER";
			break;
		case "Hispanic or Latino":
			enumName = "HISPANIC_OR_LATINO";
			break;
		case "Male":
			enumName = "MALE";
			break;
		case "Female":
			enumName = "FEMALE";
			break;
		case "Non-binary":
			enumName = "NON_BINARY";
			break;
		case "Transgender":
			enumName = "TRANSGENDER";
			break;
		case "Intersex":
			enumName = "INTERSEX";
			break;
		case "Does Not Identify":
			enumName = "DOES_NOT_IDENTIFY";
			break;
		case "Other":
			enumName = "OTHER";
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
	const orgTags: JSX.Element[] = [];
	if (rowData.prettyMemberData.organizations?.has("ACM"))
		orgTags.push(<span className="p-tag m-[2px] rounded !bg-secondary">ACM</span>);
	if (rowData.prettyMemberData.organizations?.has("ACM_W"))
		orgTags.push(<span className="p-tag m-[2px] rounded !bg-[#F2751B]">ACM W</span>);
	if (rowData.prettyMemberData.organizations?.has("ICPC"))
		orgTags.push(<span className="p-tag m-[2px] rounded !bg-[#FFD51E]">ICPC</span>);
	if (rowData.prettyMemberData.organizations?.has("CODING_IN_COLOR"))
		orgTags.push(<span className="p-tag m-[2px] rounded !bg-[#000000]">CIC</span>);
	if (rowData.prettyMemberData.organizations?.has("ROWDY_CREATORS"))
		orgTags.push(<span className="p-tag m-[2px] rounded !bg-[#2EC4EF]">Rowdy Creators</span>);
	return <div>{orgTags}</div>;
};

const ethnicityBodyTemplate = (rowData: any) => {
	const ref = useRef<any>();

	useEffect(() => {
		const handleScroll = (e: any) => {
			if (e.deltaY > 0) e.currentTarget.scrollLeft += 10;
			else e.currentTarget.scrollLeft -= 10;
		};

		const ele = ref.current;
		if (ele) {
			ele.addEventListener("wheel", handleScroll);
		} else {
			console.log("ele is null");
		}
	}, []);

	const ethTags: JSX.Element[] = [];
	if (rowData.prettyMemberData.ethnicity?.has("WHITE"))
		ethTags.push(
			<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-emerald-800">White</span>
		);
	if (rowData.prettyMemberData.ethnicity?.has("BLACK_OR_AFRICAN_AMERICAN"))
		ethTags.push(
			<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-blue-800">
				Black or African American
			</span>
		);
	if (rowData.prettyMemberData.ethnicity?.has("NATIVE_AMERICAN_ALASKAN_NATIVE"))
		ethTags.push(
			<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-red-600">
				Native American / Alaskan Native
			</span>
		);
	if (rowData.prettyMemberData.ethnicity?.has("ASIAN"))
		ethTags.push(
			<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-pink-500">Asian</span>
		);
	if (rowData.prettyMemberData.ethnicity?.has("NATIVE_HAWAIIAN_PACIFIC_ISLANDER"))
		ethTags.push(
			<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-teal-500">
				Native Hawaiian / Pacific Islander
			</span>
		);
	if (rowData.prettyMemberData.ethnicity?.has("HISPANIC_OR_LATINO"))
		ethTags.push(
			<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-[#A020F0]">
				Hispanic or Latino
			</span>
		);
	return (
		<div ref={ref} className="flex items-center !max-w-[150px] overflow-x-hidden scrollbar-hide">
			{ethTags}
		</div>
	);
};

const identityBodyTemplate = (rowData: any) => {
	const ref = useRef<any>();

	useEffect(() => {
		const handleScroll = (e: any) => {
			if (e.deltaY > 0) e.currentTarget.scrollLeft += 10;
			else e.currentTarget.scrollLeft -= 10;
		};

		const ele = ref.current;
		if (ele) {
			ele.addEventListener("wheel", handleScroll);
		} else {
			console.log("ele is null");
		}
	}, []);

	const idenTags: JSX.Element[] = [];
	if (rowData.prettyMemberData.identity?.has("MALE"))
		idenTags.push(
			<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-orange-700">Male</span>
		);
	if (rowData.prettyMemberData.identity?.has("FEMALE")) {
		idenTags.push(
			<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-blue-900">Female</span>
		);
		if (rowData.prettyMemberData.identity?.has("NON_BINARY"))
			idenTags.push(
				<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-red-500">Non-binary</span>
			);
		if (rowData.prettyMemberData.identity?.has("TRANSGENDER"))
			idenTags.push(
				<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-violet-500">Transgender</span>
			);
		if (rowData.prettyMemberData.identity?.has("INTERSEX"))
			idenTags.push(
				<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-fuchsia-700">Intersex</span>
			);
		if (rowData.prettyMemberData.identity?.has("DOES_NOT_IDENTIFY"))
			idenTags.push(
				<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-blue-500">
					Does Not Identify
				</span>
			);
		if (rowData.prettyMemberData.identity?.has("OTHER"))
			idenTags.push(
				<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-[#A020F0]">Other</span>
			);
	}

	return (
		<div ref={ref} className="flex items-center !max-w-[150px] overflow-x-hidden scrollbar-hide">
			{idenTags}
		</div>
	);
};

const identityItemTemplate = (option: string) => {
	switch (option) {
		case "Male":
			return <span className="p-tag m-[2px] rounded whitespace-nowrap !bg-orange-700">Male</span>;
		case "Female":
			return <span className="p-tag m-[2px] rounded whitespace-nowrap !bg-blue-900">Female</span>;
		case "Non-binary":
			return (
				<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-red-500">Non-binary</span>
			);
		case "Transgender":
			return (
				<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-violet-500">Transgender</span>
			);
		case "Intersex":
			return (
				<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-fuchsia-700">Intersex</span>
			);
		case "Does Not Identify":
			return (
				<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-blue-500">
					Does Not Identify
				</span>
			);
		case "Other":
			return <span className="p-tag m-[2px] rounded whitespace-nowrap !bg-[#A020F0]">Other</span>;
	}
};

const ethnicityItemTemplate = (option: string) => {
	switch (option) {
		case "White":
			return <span className="p-tag m-[2px] rounded whitespace-nowrap !bg-emerald-800">White</span>;
		case "Black or African American":
			return (
				<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-blue-800">
					Black or African American
				</span>
			);
		case "Native American / Alaskan Native":
			return (
				<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-red-600">
					Native American / Alaskan Native
				</span>
			);
		case "Asian":
			return <span className="p-tag m-[2px] rounded whitespace-nowrap !bg-pink-500">Asian</span>;
		case "Native Hawaiian / Pacific Islander":
			return (
				<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-teal-500">
					Native Hawaiian / Pacific Islander
				</span>
			);
		case "Hispanic or Latino":
			return (
				<span className="p-tag m-[2px] rounded whitespace-nowrap !bg-[#A020F0]">
					Hispanic or Latino
				</span>
			);
	}
};

const identityFilterTemplate = (options: any) => {
	return (
		<Dropdown
			value={options.value}
			options={[
				"Male",
				"Female",
				"Non-binary",
				"Transgender",
				"Intersex",
				"Does Not Identify",
				"Other",
			]}
			onChange={(e: any) => {
				options.filterCallback(e.value);
			}}
			itemTemplate={identityItemTemplate}
			placeholder="Select a Identity"
			className="p-column-filter"
			showClear
		/>
	);
};

const ethnicityFilterTemplate = (options: any) => {
	return (
		<Dropdown
			value={options.value}
			options={[
				"White",
				"Black or African American",
				"Native Hawaiian / Pacific Islander",
				"Asian",
				"Native American / Alaskan Native",
				"Hispanic or Latino",
			]}
			onChange={(e: any) => {
				options.filterCallback(e.value);
			}}
			itemTemplate={ethnicityItemTemplate}
			placeholder="Select a Ethnicity"
			className="p-column-filter"
			showClear
		/>
	);
};

const orgFilterTemplate = (options: any) => {
	return (
		<Dropdown
			value={options.value}
			options={["ACM", "ACM W", "ICPC", "Rowdy Creators", "CIC"]}
			onChange={(e: any) => {
				options.filterCallback(e.value);
			}}
			itemTemplate={orgItemTemplate}
			placeholder="Select a Organization"
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
		"prettyMemberData.ethnicity": {
			operator: FilterOperator.OR,
			constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
		},
		"prettyMemberData.identity": {
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
			currentPageReportTemplate="Showing {first} through {last} of {totalRecords} total members"
			paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
		>
			<Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
			<Column sortable filter field="member.name" header="Name"></Column>
			<Column filter field="member.email" header="Email"></Column>
			<Column filter field="member.id" header="ABC123"></Column>
			<Column sortable filter field="member.data.major" header="Major"></Column>
			<Column sortable filter field="member.data.classification" header="Classification"></Column>
			<Column
				field="prettyMemberData.organizations"
				header="Organizations"
				body={orgBodyTemplate}
				filter
				filterElement={orgFilterTemplate}
				filterMatchModeOptions={[{ label: "Match Tag", value: "MATCH_TAG" }]}
				filterMatchMode="custom"
			></Column>
			<Column
				field="prettyMemberData.ethnicity"
				header="Ethnicity"
				body={ethnicityBodyTemplate}
				filter
				filterElement={ethnicityFilterTemplate}
				filterMatchModeOptions={[{ label: "Match Tag", value: "MATCH_TAG" }]}
				filterMatchMode="custom"
			></Column>
			<Column
				field="prettyMemberData.identity"
				header="Identity"
				body={identityBodyTemplate}
				filter
				filterElement={identityFilterTemplate}
				filterMatchModeOptions={[{ label: "Match Tag", value: "MATCH_TAG" }]}
				filterMatchMode="custom"
			></Column>
			<Column filter field="prettyMemberData.identity.address" header="ABC123"></Column>
		</DataTable>
	);
};

export default DataTableDemo;
