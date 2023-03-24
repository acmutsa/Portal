import { DataTable } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode, FilterOperator, FilterService } from "primereact/api";
import React, { FunctionComponent, useMemo, useState } from "react";
import { trpc } from "@/utils/trpc";
import {
	EthnicityType,
	IdentityType,
	OrganizationType,
	PrettyMemberDataType,
	toPrettyMemberData,
} from "@/utils/transform";
import type { Member, MemberData } from "@prisma/client";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import Badge from "@/components/common/Badge";
import { classNames } from "@/utils/helpers";
import {
	EthnicityBadgeClasses,
	EthnicityById,
	EthnicityByName,
	IdentityBadgeClasses,
	IdentityById,
	IdentityByName,
	OrganizationBadgeClasses,
	OrganizationById,
	OrganizationByName,
} from "@/components/util/EnumerationData";
import { MemberWithData } from "@/server/controllers/member";

const preventDefault = (e: Event) => e.preventDefault();
const mouseLeaveHandler = (e: React.MouseEvent<HTMLDivElement>) => {
	document.removeEventListener("wheel", preventDefault, false);
};
const mouseEnterHandler = (e: React.MouseEvent<HTMLDivElement>) => {
	document.addEventListener("wheel", preventDefault, {
		passive: false,
	});
};
const wheelHandler = (e: React.WheelEvent<HTMLDivElement>) => {
	if (e.deltaY > 0 || e.deltaX > 0) e.currentTarget.scrollLeft += 10;
	else e.currentTarget.scrollLeft -= 10;
	e.preventDefault();
};

const scrollHandlers = {
	onWheel: wheelHandler,
	onMouseEnter: mouseEnterHandler,
	onMouseLeave: mouseLeaveHandler,
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
	member: MemberWithData;
	prettyMemberData: PrettyMemberDataType;
}

const organizationCell = ({ prettyMemberData: { organizations } }: MemberTableItem) => {
	if (organizations == null || organizations.size == 0) return null;
	return (
		<div {...scrollHandlers} className="badges">
			{Array.from(organizations).map((organization, index) => {
				const badgeClass = OrganizationBadgeClasses[organization];

				const isCIC = organization == "CODING_IN_COLOR";
				return (
					<Badge
						key={index}
						parentClass={isCIC ? "bg-primary-700 !font-semibold m-0.5 rounded" : undefined}
						colorClass={classNames(isCIC ? null : "m-0.5", badgeClass)}
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
		<div {...scrollHandlers} className="badges">
			{Array.from(ethnicities).map((ethnicity, index) => {
				return (
					<Badge
						key={index}
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
		<div {...scrollHandlers} className="badges">
			{Array.from(identities).map((identity, index) => {
				if (IdentityType.safeParse(identity).success)
					return (
						<Badge
							key={index}
							colorClass={classNames(
								"text-white m-0.5 whitespace-nowrap",
								IdentityBadgeClasses[identity as IdentityType]
							)}
						>
							{IdentityById[identity as IdentityType]}
						</Badge>
					);
				return (
					<Badge colorClass="text-gray-800 bg-gray-100 whitespace-nowrap m-0.5">{identity}</Badge>
				);
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

const MemberDataTable: FunctionComponent<{ data: MemberTableItem[] }> = ({ data }) => {
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

	return (
		<DataTable
			id="members"
			rowHover
			onSelectionChange={(e) => setSelectedCustomers(e.value)}
			selection={selectedCustomers}
			responsiveLayout="scroll"
			value={data}
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
			<Column sortable filter field="member.name" header="Name" className="name"></Column>
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
				filterElement={getFilterElement("Select a Identity", Object.keys(IdentityByName))}
				filterMatchModeOptions={[{ label: "Match", value: "MATCH_IDENTITY" }]}
				filterMatchMode="custom"
			/>
			<Column
				filter
				field="member.data.address"
				header="Address"
				className="address"
				body={({ member: { data } }: MemberTableItem) => <div>{data?.address}</div>}
			/>
		</DataTable>
	);
};

export default MemberDataTable;
