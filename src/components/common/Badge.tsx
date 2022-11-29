import { FunctionComponent } from "react";
import { classNames } from "@/utils/helpers";

interface BadgeProps {
	colorClass?: string;
	spacingClass?: string;
	children: string | JSX.Element;
}

const Badge: FunctionComponent<BadgeProps> = ({
	children,
	colorClass,
	spacingClass,
}: BadgeProps) => {
	return (
		<span
			className={classNames(
				colorClass ?? "bg-gray-100 text-gray-800",
				spacingClass ?? "px-2.5 py-0.5",
				"inline-flex items-center rounded-md text-sm font-medium"
			)}
		>
			{children}
		</span>
	);
};
export default Badge;
