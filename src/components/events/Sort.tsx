import { Menu, Transition } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";
import { Dispatch, Fragment, useMemo } from "react";
import { classNames } from "@/utils/helpers";
import { SortOption } from "@/server/controllers/events";

interface SortProps {
	label?: string;
	options: Record<SortOption, string>;
	onChange?: Dispatch<SortOption>;
}

const Sort = ({ label, options, onChange }: SortProps) => {
	const onChangeHandler = useMemo(() => {
		return (value: SortOption) => {
			return () => {
				if (onChange != null) onChange(value);
			};
		};
	}, [onChange]);

	return (
		<>
			<Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
				{label ?? "Sort"}
				<BiChevronDown
					className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
					aria-hidden="true"
				/>
			</Menu.Button>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="origin-top-left absolute left-0 z-10 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						{Object.entries(options).map(([id, label]) => (
							<Menu.Item key={id}>
								{({ active }) => (
									<button
										onClick={onChangeHandler(id as SortOption)}
										className={classNames(
											active ? "bg-gray-100" : null,
											"block w-full text-left px-4 py-2 text-sm font-medium text-gray-900"
										)}
									>
										{label}
									</button>
								)}
							</Menu.Item>
						))}
					</div>
				</Menu.Items>
			</Transition>
		</>
	);
};
export default Sort;
