import { FunctionComponent } from "react";

interface BadgeProps {
	colorClass?: string;
	children: string | JSX.Element;
}

const Badge: FunctionComponent<BadgeProps> = ({ children, colorClass }: BadgeProps) => {
	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${
				colorClass ?? "bg-gray-100 text-gray-800"
			}`}
		>
			{children}
		</span>
	);
};
export default Badge;
