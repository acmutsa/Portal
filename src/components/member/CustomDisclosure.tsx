import { ReactNode } from "react";
import { BsChevronDown } from "react-icons/bs";
import { Disclosure, Transition } from "@headlessui/react";
import { classNames } from "@/utils/helpers";

interface DisclosureProps {
	title: ReactNode | string;
	description: ReactNode | string;
}

function CustomDisclosure({ title, description }: DisclosureProps): JSX.Element {
	return (
		<>
			<div className="my-2 text-xs md:text-sm">
				<Disclosure>
					{({ open }) => (
						<>
							<Disclosure.Button
								className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left
								font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring
								focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
							>
								<span>{title}</span>
								<BsChevronDown
									className={classNames(
										open ? "rotate-180" : null,
										"ease-in-out transform transition-transform h-5 w-5 text-blue-500"
									)}
								/>
							</Disclosure.Button>
							<Transition
								enter="transition duration-100 ease-out"
								enterFrom="transform scale-95 opacity-0"
								enterTo="transform scale-100 opacity-100"
								leave="transition duration-75 ease-out"
								leaveFrom="transform scale-100 opacity-100"
								leaveTo="transform scale-95 opacity-0"
							>
								<Disclosure.Panel className="px-3 md:px-4 py-2 md:pt-4 text-gray-500">
									{description}
								</Disclosure.Panel>
							</Transition>
						</>
					)}
				</Disclosure>
			</div>
		</>
	);
}

export default CustomDisclosure;
