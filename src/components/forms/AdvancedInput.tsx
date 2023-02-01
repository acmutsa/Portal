import { BsExclamationCircle, BsImage } from "react-icons/bs";
import { createElement, HTMLInputTypeAttribute } from "react";
import { FieldErrorsImpl, UseFormRegisterReturn } from "react-hook-form";
import { IconType } from "react-icons";
import { classNames } from "@/utils/helpers";

interface AdvancedInputProps {
	id?: string;
	label: string;
	type: HTMLInputTypeAttribute;
	as?: "input" | "textarea";
	rows?: number;
	register: UseFormRegisterReturn;
	errors: FieldErrorsImpl<{ [p: string]: any }>;
	placeholder?: string;
	autocomplete?: string;
	errorIcon?: IconType;
	InlineIcon?: IconType;
	controlClass?: string;
}

const AdvancedInput = ({
	id,
	type,
	as,
	label,
	rows,
	errors,
	register,
	placeholder,
	errorIcon,
	InlineIcon,
	controlClass,
}: AdvancedInputProps) => {
	errorIcon = errorIcon ?? BsExclamationCircle;
	id = id ?? register.name;
	// the identifier used by the aria accessibility labels
	const ariaErrorIdentifier = `${id}-error`;
	const invalid: boolean = Boolean(errors[id]);
	const enabled: boolean = !(register.disabled ?? false);

	// All properties shared by all control elements available are managed here
	const sharedControlProperties = {
		id,
		placeholder,
		"aria-invalid": enabled && invalid,
		"aria-describedby": ariaErrorIdentifier,
		className: classNames(
			invalid
				? "border-red-300 focus:border-red-300 focus:ring-red-400"
				: "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500",
			!enabled ? "bg-gray-50 text-gray-500" : null,
			"mt-1 block w-full border rounded-md shadow-sm focus:ring-1 py-2 px-3 focus:outline-none sm:text-sm",
			InlineIcon != undefined ? "pl-10" : null,
			controlClass ?? null
		),
	};

	// Creates the primary control element, whether it's a standard input, a textarea, or an input with an icon inlined
	const controlElement =
		(as ?? "input") === "input" ? (
			InlineIcon == undefined ? (
				<input type={type} {...register} {...sharedControlProperties} />
			) : (
				<div className="mt-1 relative rounded-md shadow-sm">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<InlineIcon className="h-[18px] w-[18px] text-gray-400" aria-hidden="true" />
					</div>
					<input type={type} {...register} {...sharedControlProperties} />
				</div>
			)
		) : (
			<div className="mt-1">
				<textarea rows={rows ?? 4} {...register} {...sharedControlProperties} />
			</div>
		);

	return (
		<>
			<label htmlFor={id} className="block text-sm font-medium text-gray-700">
				{label}
			</label>
			{controlElement}
			{enabled && invalid ? (
				<p
					className="absolute inline-flex mt-1 text-sm text-red-600"
					id={ariaErrorIdentifier}
					role="alert"
				>
					{createElement(errorIcon, { className: "mx-1 mt-1" })}
					{(errors[id]?.message as string) ?? "Invalid."}
				</p>
			) : null}
		</>
	);
};

export default AdvancedInput;
