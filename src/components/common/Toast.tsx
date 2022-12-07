import { BsCheckCircle, BsX, BsInfoCircle } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { classNames } from "@/utils/helpers";

export type ToastType = "success" | "error" | "information";

interface ToastProps {
	title: string;
	description: string;
	toastId?: string;
	type?: ToastType;
	visible?: boolean;
}

const iconTypes: Record<ToastType, JSX.Element> = {
	success: <BsCheckCircle className="h-6 w-6 text-green-400" aria-hidden="true" />,
	error: <BiErrorCircle className="h-6 w-6 text-red-400" aria-hidden="true" />,
	information: <BsInfoCircle className="h-6 w-6 text-zinc-400" aria-hidden="true" />,
};

const Toast = ({ title, description, toastId, visible, type }: ToastProps) => {
	visible = visible ?? true;
	return (
		<div
			className={classNames(
				visible ? "animate-enter" : "animate-leave",
				"max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
			)}
		>
			<div className="p-4">
				<div className="flex items-start">
					<div className="flex-shrink-0">{iconTypes[type ?? "information"]}</div>
					<div className="ml-3 w-0 flex-1 pt-0.5">
						<p className="text-sm font-medium text-gray-900">{title}</p>
						<p className="mt-1 text-sm text-gray-500">{description}</p>
					</div>
					<div className="ml-4 flex-shrink-0 flex">
						<button
							className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							onClick={() => {
								if (toastId != undefined) toast.dismiss(toastId);
							}}
						>
							<span className="sr-only">Close</span>
							<BsX className="h-5 w-5" aria-hidden="true" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Toast;
