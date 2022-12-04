import { Fragment, useEffect, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { BsCheck, BsExclamationCircle } from "react-icons/bs";
import { HiOutlineSelector } from "react-icons/hi";
import { ControllerFieldState } from "react-hook-form";
import { ControllerRenderProps } from "react-hook-form/dist/types/controller";
import { classNames } from "@/utils/helpers";

export interface Choice {
	id: string;
	name: string;
}

export type SelectValueType = "name" | "id" | "object";

interface CustomSelectProps<TFormValues> {
	field: ControllerRenderProps<TFormValues, any>;
	fieldState: ControllerFieldState;
	label?: string | null | undefined;
	labelFor?: string;
	choices: Choice[];
	unselectedText?: string;
	buttonClass?: string;
	flattenedValues?: boolean;
	selectType?: SelectValueType | undefined;
}

export default function CustomSelect<TFormValues>({
	choices,
	unselectedText,
	buttonClass,
	label,
	labelFor,
	selectType,
	field: { onChange, value, name },
	fieldState: { error },
}: CustomSelectProps<TFormValues>) {
	const [internalValue, setInternalValue] = useState<Choice | null>(null);
// TODO: Instead of providing properties for changing which property of Choice is sent, perhaps using a simple mapper function.
	// Depending on the value we export, we need to use the correct property on Choice.
	const choicePredicate = useMemo(
		() => (selectType === "name" ? (c: Choice) => c.name === value : (c: Choice) => c.id),
		[selectType]
	);

	useEffect(() => {
		// If we don't use the object as the property to export, we won't get an object. So we find it here.
		if (selectType != undefined && selectType !== "object") {
			setInternalValue(choices.find(choicePredicate) ?? null);
		} else setInternalValue(value as Choice);
	}, [value]);

	return (
		<Listbox
			value={internalValue}
			onChange={(value) => {
				if (selectType == undefined || selectType === "object") onChange(value);
				else onChange(selectType === "name" ? value?.name : value?.id);
			}}
		>
			{({ open }) => (
				<>
					{label != null ? (
						<Listbox.Label htmlFor={labelFor} className="block text-sm font-medium text-gray-700">
							{label}
						</Listbox.Label>
					) : null}
					<div className="mt-1 relative">
						<Listbox.Button
							className={classNames(
								buttonClass,
								error
									? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-400 focus:border-red-400"
									: "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500",
								"bg-white relative w-full border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 sm:text-sm"
							)}
						>
							<span className="block truncate">
								{internalValue != null ? (
									internalValue.name
								) : (
									<span className="text-gray-300">{unselectedText ?? "Nothing selected"}</span>
								)}
							</span>
							<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
								<HiOutlineSelector className="h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</Listbox.Button>

						{error ? (
							<p className="absolute flex mt-1 text-sm text-red-600" id={`${name}-error`}>
								<BsExclamationCircle className="mx-1 mt-1" />
								Required.
							</p>
						) : null}

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
								{choices.map((choice) => (
									<Listbox.Option
										key={choice.id}
										className={({ active }) =>
											classNames(
												active ? "text-white bg-secondary" : "text-gray-900",
												"cursor-default select-none relative py-2 pl-3 pr-9"
											)
										}
										value={choice}
									>
										{({ selected, active }) => (
											<>
												<span
													className={classNames(
														selected ? "font-semibold" : "font-normal",
														"block truncate"
													)}
												>
													{choice.name}
												</span>

												{selected ? (
													<span
														className={classNames(
															active ? "text-white" : "text-indigo-600",
															"absolute inset-y-0 right-0 flex items-center pr-4"
														)}
													>
														<BsCheck className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
}
