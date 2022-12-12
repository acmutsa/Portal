import { FunctionComponent } from "react";
import { classNames } from "@/utils/helpers";

interface BadgeProps {
	colorClass?: string;
	spacingClass?: string;
	parentClass?: string;
	children: string | JSX.Element;
}

/**
 * A highly customizable badge component.
 *
 * @param children The inner elements of the Badge component.
 * @param colorClass Place your color CSS properties here. Defaults to gray text/gray background.
 * @param parentClass Add a parent element upon which the span-based Badge will reside.
 * @param spacingClass Override the default padding CSS properties with this parameter.
 * @constructor
 */
const Badge: FunctionComponent<BadgeProps> = ({
	children,
	colorClass,
	parentClass,
	spacingClass,
}: BadgeProps) => {
	const outerClass = "text-sm font-medium";
	const innerClass = classNames(
		colorClass ?? "bg-gray-100 text-gray-800",
		spacingClass ?? "px-2.5 py-0.5",
		"inline-flex items-center rounded-sm"
	);

	return parentClass != undefined ? (
		<div className={classNames("inline-block", outerClass, parentClass)}>
			<span className={innerClass}>{children}</span>
		</div>
	) : (
		<span className={classNames(outerClass, innerClass)}>{children}</span>
	);
};
export default Badge;
