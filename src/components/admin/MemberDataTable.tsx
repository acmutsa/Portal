import { DataTable } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
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
	EthnicityBadgeClasses,
	EthnicityById,
	EthnicityByName,
	IdentityBadgeClasses,
	IdentityByName,
	OrganizationBadgeClasses,
	OrganizationById,
	OrganizationByName,
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

const organizationCell = ({ prettyMemberData: { organizations } }: MemberTableItem) => {
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

const ethnicityCell = ({ prettyMemberData: { ethnicity: ethnicities } }: MemberTableItem) => {
	if (ethnicities == null || ethnicities.size == 0) return null;
	return (
		<div>
			{Array.from(ethnicities).map((ethnicity) => {
				const badgeClass = EthnicityBadgeClasses[ethnicity];
				return (
					<Badge colorClass={classNames("m-0.5", badgeClass)}>
						{EthnicityById[ethnicity] ?? ethnicity}
					</Badge>
				);
			})}
		</div>
	);
};

const identityCell = ({ prettyMemberData: { identity } }: MemberTableItem) => {
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
				body={organizationCell}
				filter
				filterElement={({ value, filterCallback }) => (
					<Dropdown
						value={value}
						options={Object.keys(OrganizationByName)}
						onChange={(e) => {
							filterCallback(e.value);
						}}
						placeholder="Select a Organization"
						className="p-column-filter"
						showClear
					/>
				)}
				filterMatchModeOptions={[{ label: "Match Tag", value: "MATCH_TAG" }]}
				filterMatchMode="custom"
			></Column>
			<Column
				field="prettyMemberData.ethnicity"
				header="Ethnicity"
				body={ethnicityCell}
				filter
				filterElement={({ value, filterCallback }) => (
					<Dropdown
						value={value}
						options={Object.keys(EthnicityByName)}
						onChange={(e) => {
							filterCallback(e.value);
						}}
						placeholder="Select a Ethnicity"
						className="p-column-filter"
						showClear
					/>
				)}
				filterMatchModeOptions={[{ label: "Match Tag", value: "MATCH_TAG" }]}
				filterMatchMode="custom"
			/>
			<Column
				field="prettyMemberData.identity"
				header="Identity"
				body={identityCell}
				filter
				filterElement={({ value, filterCallback }: ColumnFilterElementTemplateOptions) => {
					return (
						<Dropdown
							value={value}
							options={Object.keys(IdentityByName)}
							onChange={(e: any) => {
								filterCallback(e.value);
							}}
							placeholder="Select a Identity"
							className="p-column-filter"
							showClear
						/>
					);
				}}
				filterMatchModeOptions={[{ label: "Match Tag", value: "MATCH_TAG" }]}
				filterMatchMode="custom"
			/>
			<Column filter field="member.data.address" header="Address"></Column>
		</DataTable>
	);
};

export default DataTableDemo;
