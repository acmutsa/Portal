import { Popover, Transition } from "@headlessui/react";
import { Dispatch, Fragment, FunctionComponent, useMemo } from "react";
import { BiChevronDown } from "react-icons/bi";
import { useForm } from "react-hook-form";

interface FilterOption {
	value: string;
	label: string;
}

interface FilterProps {
	id: string;
	name: string;
	options: FilterOption[];
	count?: number | string;
	onChange?: Dispatch<Record<string, boolean>>;
}

const Filter: FunctionComponent<FilterProps> = ({
	id,
	name,
	options,
	count,
	onChange,
}: FilterProps) => {
	const { register, getValues } = useForm({ mode: "onBlur" });

	const changeHandler = useMemo(() => {
		return () => {
			if (onChange != null) onChange(getValues());
		};
	}, [getValues]);

	return (
		<Popover as="div" key={name} id="desktop-menu" className="relative z-10 inline-block text-left">
			<Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
				<span>{name}</span>
				{count != null ? (
					<span className="ml-1.5 rounded py-0.5 px-1.5 bg-gray-200 text-xs font-semibold text-gray-700 tabular-nums">
						{count}
					</span>
				) : null}
				<BiChevronDown
					className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
					aria-hidden="true"
				/>
			</Popover.Button>
			<Popover.Overlay className="fixed inset-0 bg-black opacity-20" />
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Popover.Panel className="origin-top-right absolute right-0 mt-2 bg-white rounded-md shadow-2xl p-4 ring-1 ring-black ring-opacity-5 focus:outline-none">
					<form className="space-y-4">
						{options.map((option, optionIdx) => (
							<div key={option.value} className="flex items-center">
								<input
									id={`filter-${id}-${optionIdx}`}
									type="checkbox"
									className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
									{...register(option.value, { onChange: changeHandler })}
								/>
								<label
									htmlFor={`filter-${id}-${optionIdx}`}
									className="ml-3 pr-6 text-sm font-medium text-gray-900 whitespace-nowrap cursor-pointer select-none"
								>
									{option.label}
								</label>
							</div>
						))}
					</form>
				</Popover.Panel>
			</Transition>
		</Popover>
	);
};

export default Filter;
