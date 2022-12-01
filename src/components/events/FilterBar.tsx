import { Dispatch, FunctionComponent, useMemo, useState } from "react";
import ShortToggle from "@/components/common/ShortToggle";
import Filter from "@/components/events/Filter";
import { Menu, Popover } from "@headlessui/react";
import Sort from "@/components/events/Sort";

export type SortOption = "recent" | "rating" | "newest";
const sortOptions: Record<SortOption, string> = {
	recent: "Most Recent",
	rating: "Best Rating",
	newest: "Newest",
};
const organizationOptions = [
	{ value: "acm", label: "ACM" },
	{ value: "acm-w", label: "ACM-W" },
	{ value: "rc", label: "Rowdy Creators" },
	{ value: "icpc", label: "ICPC" },
	{ value: "cic", label: "Coding in Color" },
];
const semesterOptions = [
	{ value: "spring-2022", label: "Spring 2022" },
	{ value: "fall-2022", label: "Fall 2022" },
	{ value: "spring-2023", label: "Spring 2023" },
];

interface Filters {
	sort: SortOption | null;
	past: boolean;
	organizations: Record<string, boolean> | null;
	semesters: Record<string, boolean> | null;
}

interface FilterBarProps {
	onChange?: Dispatch<Filters>;
}

const FilterBar: FunctionComponent<FilterBarProps> = ({ onChange }: FilterBarProps) => {
	const [showPastEvents, setShowPastEvents] = useState(false);
	const [organizationFilter, setOrganizationFilter] = useState<Record<string, boolean> | null>(
		null
	);
	const [semesterFilter, setSemesterFilter] = useState<Record<string, boolean> | null>(null);
	const [sort, setSort] = useState<SortOption>("recent");
	useMemo(() => {
		if (onChange != null)
			onChange({
				sort,
				past: showPastEvents,
				organizations: organizationFilter,
				semesters: semesterFilter,
			});
	}, [onChange, sort, showPastEvents, organizationFilter, semesterFilter]);

	return (
		<div className="h-12 px-5 font-inter bg-zinc-50 shadow rounded-lg flex divide-x-1 flex items-center justify-between">
			<Menu as="div" className="relative z-10 inline-block text-left">
				<div>
					<Sort options={sortOptions} label={sortOptions[sort] ?? "Sort"} onChange={setSort} />
				</div>
			</Menu>
			<div className="flex">
				<div className="mr-8">
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
						options={organizationOptions}
						id="organization"
						name="Organizations"
					/>
					<Filter
						onChange={setSemesterFilter}
						options={semesterOptions}
						id="semester"
						name="Semesters"
					/>
				</Popover.Group>
			</div>
		</div>
	);
};

export default FilterBar;
