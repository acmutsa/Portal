import { Dispatch, FunctionComponent, useEffect, useState } from "react";
import organizations from "@/config/organizations.json";
import ShortToggle from "@/components/common/ShortToggle";
import Filter from "@/components/events/Filter";
import { Menu, Popover } from "@headlessui/react";
import Sort from "@/components/events/Sort";
import { SortOption } from "@/server/controllers/events";
import { Choice } from "@/components/forms/CustomSelect";
import { pluralize } from "@/utils/helpers";

const sortOptions: Record<SortOption, string> = {
	recent: "Most Recent",
	attendance: "Most Popular",
};

const semesterOptions: Choice[] = [
	{ id: "spring-2022", name: "Spring 2022" },
	{ id: "fall-2022", name: "Fall 2022" },
	{ id: "spring-2023", name: "Spring 2023" },
];

export interface Filters {
	sort: SortOption | null;
	past: boolean;
	organizations: string[] | null;
	semesters: string[] | null;
}

interface FilterBarProps {
	onChange?: Dispatch<Filters>;
	resultCount?: number;
	semesters: string[];
}

const getValue = ([, v]: [string, boolean]): boolean => v;
const getKey = ([k]: [string, boolean]): string => k;

const FilterBar: FunctionComponent<FilterBarProps> = ({
	onChange,
	resultCount,
	semesters,
}: FilterBarProps) => {
	const [showPastEvents, setShowPastEvents] = useState(false);
	const [organizationFilter, setOrganizationFilter] = useState<Record<string, boolean>>({});
	const [semesterFilter, setSemesterFilter] = useState<Record<string, boolean>>({});
	const [sort, setSort] = useState<SortOption>("recent");
	useEffect(() => {
		if (onChange != null)
			onChange({
				sort,
				past: showPastEvents,
				organizations: Object.entries(organizationFilter).filter(getValue).map(getKey),
				semesters: Object.entries(semesterFilter).filter(getValue).map(getKey),
			});
	}, [onChange, sort, showPastEvents, organizationFilter, semesterFilter]);

	return (
		<div className="h-12 px-5 font-inter bg-zinc-50 shadow rounded-lg flex divide-x-1 flex items-center justify-between">
			<div className="mr-3">
				<Menu as="div" className="relative z-10 inline-block text-left">
					<div>
						<Sort options={sortOptions} label={sortOptions[sort] ?? "Sort"} onChange={setSort} />
					</div>
				</Menu>
				{resultCount != undefined ? (
					<span className="px-3 font-sm font-inter text-gray-700">
						{resultCount} result{pluralize(resultCount)}
					</span>
				) : null}
			</div>
			<div className="flex">
				<div className="sm:mr-8">
					<ShortToggle
						screenReaderLabel="Show Past Events"
						checked={showPastEvents}
						onChange={setShowPastEvents}
					>
						<span className="text-gray-700">Show Past Events</span>
					</ShortToggle>
				</div>
				<Popover.Group className="hidden sm:flex sm:items-baseline sm:space-x-8">
					<Filter
						onChange={setOrganizationFilter}
						options={organizations}
						id="organization"
						name="Organizations"
					/>
					<Filter
						onChange={setSemesterFilter}
						options={semesters.map((s) => ({ id: s, name: s }))}
						id="semester"
						name="Semesters"
					/>
				</Popover.Group>
			</div>
		</div>
	);
};

export default FilterBar;
