import { DataTable } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode, FilterOperator, FilterService } from "primereact/api";
import React, { useMemo, useState } from "react";
import { trpc } from "@/utils/trpc";
import {
	EthnicityType,
	IdentityType,
	OrganizationType,
	PrettyMemberData,
	toPrettyMemberData,
} from "@/utils/transform";
import type { Member, MemberData } from "@prisma/client";
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

FilterService.register("MATCH_ORGANIZATION", (a: Set<OrganizationType>, b?: string) => {
	if (b == undefined) return true;
	if (OrganizationByName[b] != undefined) return a.has(OrganizationByName[b] as OrganizationType);
	return false;
});

FilterService.register("MATCH_ETHNICITY", (a: Set<EthnicityType>, b?: string) => {
	if (b == undefined) return true;
	if (EthnicityByName[b] != undefined) return a.has(EthnicityByName[b] as EthnicityType);
	return false;
});

FilterService.register("MATCH_IDENTITY", (a: Set<IdentityType>, b?: string) => {
	if (b == undefined) return true;
	if (IdentityByName[b] != undefined) return a.has(IdentityByName[b] as IdentityType);
	return false;
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
		<div className="flex items-center flex-wrap !max-w-[12rem] overflow-x-hidden scrollbar-hide">
			{Array.from(ethnicities).map((ethnicity) => {
				return (
					<Badge
						colorClass={classNames(
							"m-0.5 overflow-hidden overflow-ellipsis whitespace-nowrap",
							EthnicityBadgeClasses[ethnicity]
						)}
					>
						{EthnicityById[ethnicity] ?? ethnicity}
					</Badge>
				);
			})}
		</div>
	);
};

const identityCell = ({ prettyMemberData: { identity: identities } }: MemberTableItem) => {
	if (identities == null || identities.size == 0) return null;
	return (
		<div
			onWheel={wheelHandler}
			className="flex items-center flex-wrap !max-w-[150px] overflow-x-hidden scrollbar-hide"
		>
			{Array.from(identities).map((identity) => {
				if (IdentityType.safeParse(identity).success)
					return (
						<Badge
							colorClass={classNames(
								"text-white m-0.5",
								IdentityBadgeClasses[identity as IdentityType]
							)}
						>
							{IdentityByName[identity]!}
						</Badge>
					);
				return <Badge>{identity}</Badge>;
			})}
		</div>
	);
};

function getFilterElement<ItemType>(placeholder: string, options: string[]) {
	return ({ value, filterCallback }: ColumnFilterElementTemplateOptions) => {
		return (
			<Dropdown
				value={value}
				options={options}
				onChange={(e: any) => {
					filterCallback(e.value);
				}}
				placeholder={placeholder}
				className="p-column-filter"
				showClear
			/>
		);
	};
}

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
				filter
				field="prettyMemberData.organizations"
				header="Organizations"
				body={organizationCell}
				filterElement={getFilterElement("Select a Organization", Object.keys(OrganizationByName))}
				filterMatchModeOptions={[{ label: "Match", value: "MATCH_ORGANIZATION" }]}
				filterMatchMode="custom"
			/>
			<Column
				filter
				field="prettyMemberData.ethnicity"
				header="Ethnicity"
				body={ethnicityCell}
				filterElement={getFilterElement("Select a Ethnicity", Object.keys(EthnicityByName))}
				filterMatchModeOptions={[{ label: "Match", value: "MATCH_ETHNICITY" }]}
				filterMatchMode="custom"
			/>
			<Column
				field="prettyMemberData.identity"
				header="Identity"
				body={identityCell}
				filter
				filterElement={getFilterElement("Select a Identity", Object.keys(EthnicityByName))}
				filterMatchModeOptions={[{ label: "Match", value: "MATCH_IDENTITY" }]}
				filterMatchMode="custom"
			/>
			<Column filter field="member.data.address" header="Address"></Column>
		</DataTable>
	);
};

export default DataTableDemo;
