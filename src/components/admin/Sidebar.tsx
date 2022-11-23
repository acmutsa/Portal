import { FunctionComponent, ReactNode, useState } from "react";
import { classNames } from "@/utils/helpers";
import { IconType } from "react-icons";

interface SidebarOption {
	id: number;
	label: string;
	icon: IconType;
	countLabel?: number | string | ReactNode;
}

interface SidebarProps {
	options: SidebarOption[];
	defaultOptionId?: number | null;
	onChange?: (_: number) => void;
}

const Sidebar: FunctionComponent<SidebarProps> = ({
	options,
	defaultOptionId,
	onChange,
}: SidebarProps) => {
	const [currentOption, setCurrentOption] = useState(defaultOptionId ?? options[0]?.id);

	return (
		<>
			<div className="flex-1 flex-shrink flex flex-col min-h-full bg-primary-500 md:min-w-[13rem] z-10">
				<div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto w-full">
					<nav className="mt-5 flex flex-col w-min-full px-2 space-y-1" aria-label="Sidebar">
						{options.map((option) => (
							<a
								key={option.id}
								onClick={() => {
									setCurrentOption(option.id);
									if (onChange != null) onChange(option.id);
								}}
								className={classNames(
									option.id == currentOption
										? "bg-primary-600 text-white"
										: "text-gray-300 hover:bg-primary-600 hover:text-white",
									"cursor-pointer group md:w-full flex items-center p-2 text-sm font-medium rounded-md"
								)}
							>
								<option.icon
									className={classNames(
										option.id == currentOption
											? "text-gray-300"
											: "text-gray-400 group-hover:text-gray-300",
										"md:mr-3 flex-shrink-0 h-6 w-6"
									)}
									aria-hidden="true"
								/>
								<span className="flex-1 hidden md:inline">{option.label}</span>
								{option.countLabel ? (
									<span
										className={classNames(
											option.id == currentOption
												? "bg-primary-800"
												: "bg-gray-900 group-hover:bg-primary-400",
											"hidden ml-3 md:inline-block py-0.5 px-3 text-xs font-medium rounded-full"
										)}
									>
										{option.countLabel}
									</span>
								) : null}
							</a>
						))}
					</nav>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
