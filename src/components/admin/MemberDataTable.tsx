import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode, FilterOperator, FilterService } from "primereact/api";
import React, { useMemo, useState } from "react";
import { trpc } from "@/utils/trpc";
import { IdentityType, PrettyMemberData, toPrettyMemberData } from "@/utils/transform";
import type { Member, MemberData } from "@prisma/client";
import identities from "@/utils/identities.json";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import Badge from "@/components/common/Badge";
import { Choice } from "@/components/forms/CustomSelect";
import { classNames } from "@/utils/helpers";
import {
	IdentityBadgeClasses,
	OrganizationBadgeClasses,
	OrganizationById,
} from "@/components/util/EnumerationData";
import { MemberWithData } from "@/server/controllers/member";

const wheelHandler = (e: React.WheelEvent<HTMLDivElement>) => {
	if (e.deltaY > 0) e.currentTarget.scrollLeft += 10;
	else e.currentTarget.scrollLeft -= 10;
};

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

const organizationBody = ({ prettyMemberData: { organizations } }: MemberTableItem) => {
	if (organizations == null || organizations.size == 0) return null;
	return (
		<div>
			{Array.from(organizations).map((organization) => {
				const badgeClass = OrganizationBadgeClasses[organization];

				return (
					<Badge
						parentClass={
							organization == "CODING_IN_COLOR"
								? "bg-primary-700 !font-semibold m-0.5 rounded"
								: undefined
						}
						colorClass={classNames("m-0.5", badgeClass)}
					>
						{OrganizationById[organization]}
					</Badge>
				);
			})}
		</div>
	);
};

const ethnicityBodyTemplate = (rowData: any) => {
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
		<div
			onWheel={wheelHandler}
			className="flex items-center flex-wrap !max-w-[150px] overflow-x-hidden scrollbar-hide"
		>
			{ethTags}
		</div>
	);
};

const identityBodyTemplate = ({ prettyMemberData: { identity } }: MemberTableItem) => {
	if (identity == null || identity.size == 0) return null;
	return (
		<div
			onWheel={wheelHandler}
			className="flex items-center flex-wrap !max-w-[150px] overflow-x-hidden scrollbar-hide"
		>
			{identities
				.filter((i): i is Choice<IdentityType> => identity.has(i.id))
				.map((i: Choice<IdentityType>) => {
					return (
						<Badge colorClass={classNames("text-white m-0.5", IdentityBadgeClasses[i.id])}>
							{i.name}
						</Badge>
					);
				})}
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
	const [filters] = useState({
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

	const { data: members } = trpc.useQuery(["member.getAll"], {
		refetchOnWindowFocus: false,
	});

	// TODO: make this less gross

	const memberTableItems = useMemo<MemberTableItem[]>(() => {
		const items: MemberTableItem[] = [];
		if (members)
			for (let member of members as MemberWithData[]) {
				items.push({
					member: member,
					prettyMemberData: toPrettyMemberData(member, member.data || ({} as MemberData)),
				});
			}

		return items;
	}, [members]);

	return (
		<DataTable
			id="members"
			rowHover
			onSelectionChange={(e) => setSelectedCustomers(e.value)}
			selection={selectedCustomers}
			responsiveLayout="scroll"
			value={memberTableItems}
			selectionAriaLabel="name"
			size="small"
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
				body={organizationBody}
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
			<Column filter field="member.data.address" header="Address"></Column>
		</DataTable>
	);
};

export default DataTableDemo;
