import { useState } from "react";
import { Listbox } from "@headlessui/react";
import { HiOutlineSelector } from "react-icons/hi";
import { ImCheckmark } from "react-icons/im";

interface VisibilityProps {
	columns: { id: string, label?: string, default?: boolean }[];
	onColumnChange: (state: Record<string, boolean>) => void;
}

const VisibilityDropdown = ({ columns, onColumnChange }: VisibilityProps) => {
	const [baseColumnEntries] = useState(Object.fromEntries(columns.map(col => ([col.id, false]))));
	const [visibleColumns, setVisibleColumns] = useState(columns.filter(col => (col?.default ?? true)).map(col => col.id));

	const onChangeHandler = (curVisibleColumns: string[]) => {
		onColumnChange({ ...baseColumnEntries, ...Object.fromEntries(curVisibleColumns.map(id => ([id, true]))) });
		setVisibleColumns(curVisibleColumns);
	};

	return <Listbox value={visibleColumns} onChange={onChangeHandler} as="div" multiple className="relative inline-block">
		<div>
			<Listbox.Button
				className="px-3 py-1.5 text-[15px] justify-center inline-flex shadow rounded-md bg-slate-100 hover:bg-slate-200
				 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-opacity-75">
				Columns
				<HiOutlineSelector
					className="ml-1.5 -mr-1 mt-0.5 py-[1px] h-5 w-5"
					aria-hidden="true"
				/>
			</Listbox.Button>
		</div>
		<Listbox.Options
			className="absolute right-0 z-10 mt-2 min-w-[10rem] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-xl ring-2 ring-black ring-opacity-5 focus:outline-none">
			{columns.map(({ id, label }) =>
				<Listbox.Option key={id} value={id}
												className={({ active }) => `relative p-1.5 cursor-pointer select-none ${
													active ? "bg-blue-50 text-zinc-900" : "text-zinc-800"
												}`}>
					{({ selected }) => (
						<div className="flex justify-between">
							<ImCheckmark
								className={`mx-1 mr-2 my-auto p-[0.5px] transition-all duration-300 ${selected ? "text-blue-500" : "scale-0 text-zinc-500"}`} />
							{label ?? id}
						</div>
					)}
				</Listbox.Option>
			)}
		</Listbox.Options>
	</Listbox>;
};

export default VisibilityDropdown;