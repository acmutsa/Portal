import { Fragment, FunctionComponent, useState } from "react";
import ShortToggle from "@/components/common/ShortToggle";
import Filter from "@/components/events/Filter";
import { Popover, Menu, Transition } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";
import { classNames } from "@/utils/helpers";
import Sort from "@/components/events/Sort";

interface FilterBarProps {}

const sortOptions = [
	{ label: "Most Recent", id: "recent" },
	{ label: "Best Rating", id: "rating" },
	{ label: "Newest", id: "newest" },
];

const filters = [
	{
		id: "organization",
		name: "Organizations",
		options: [
			{ value: "acm", label: "ACM" },
			{ value: "acm-w", label: "ACM-W" },
			{ value: "rc", label: "Rowdy Creators" },
			{ value: "icpc", label: "ICPC" },
			{ value: "cic", label: "Coding in Color" },
		],
	},
	{
		id: "semester",
		name: "Semesters",
		options: [
			{ value: "spring-2022", label: "Spring 2022" },
			{ value: "fall-2022", label: "Fall 2022" },
			{ value: "spring-2023", label: "Spring 2023" },
		],
	},
];

const FilterBar: FunctionComponent<FilterBarProps> = ({}: FilterBarProps) => {
	// TODO: Organizations Filter
	// TODO: Semester Filter
	const [pastEvents, setPastEvents] = useState(false);

	return (
		<div className="h-12 px-5 font-inter bg-zinc-50 shadow rounded-lg flex divide-x-1 flex items-center justify-between">
			<Menu as="div" className="relative z-10 inline-block text-left">
				<div>
					<Sort options={sortOptions} />
				</div>
			</Menu>
			<div className="flex">
				<div className="mr-8">
					<ShortToggle
						screenReaderLabel="Show Past Events"
						checked={pastEvents}
						onChange={setPastEvents}
					>
						<span className="font-medium text-sm text-gray-700">Show Past Events</span>
					</ShortToggle>
				</div>
				<Popover.Group className="hidden sm:flex sm:items-baseline sm:space-x-8">
					{filters.map((filter) => {
						return <Filter {...filter} />;
					})}
				</Popover.Group>
			</div>
		</div>
	);
};

export default FilterBar;
