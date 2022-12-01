import { FunctionComponent } from "react";
import { Switch } from "@headlessui/react";
import { classNames } from "@/utils/helpers";

interface ShortToggleProps {
	screenReaderLabel?: string;
	children?: string | JSX.Element | JSX.Element[];
	onChange?: (checked: boolean) => void;
	checked?: boolean;
}

const ShortToggle: FunctionComponent<ShortToggleProps> = ({
	screenReaderLabel,
	children,
	onChange,
	checked,
}: ShortToggleProps) => {
	return (
		<div className="flex items-center">
			<Switch.Group>
				<Switch
					checked={checked ?? false}
					onChange={onChange}
					className="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					<span className="sr-only">{screenReaderLabel ?? "Use setting"}</span>
					<span
						aria-hidden="true"
						className="pointer-events-none absolute bg-white w-full h-full rounded-md"
					/>
					<span
						aria-hidden="true"
						className={classNames(
							checked ? "bg-indigo-600" : "bg-gray-200",
							"pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200"
						)}
					/>
					<span
						aria-hidden="true"
						className={classNames(
							checked ? "translate-x-5" : "translate-x-0",
							"pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-300 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200"
						)}
					/>
				</Switch>
				<Switch.Label className="ml-2 cursor-pointer">{children}</Switch.Label>
			</Switch.Group>
		</div>
	);
};

export default ShortToggle;
