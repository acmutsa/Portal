import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { BsCheck, BsExclamationCircle } from "react-icons/bs";
import { HiOutlineSelector } from "react-icons/hi";
import { ControllerFieldState } from "react-hook-form";
import { ControllerRenderProps } from "react-hook-form/dist/types/controller";
import { classNames } from "@/utils/helpers";

interface Choice {
	id: string;
	name: string;
}

interface CustomSelectProps<TFormValues> {
	field: ControllerRenderProps<TFormValues, any>;
	fieldState: ControllerFieldState;
	label: string;
	labelFor?: string;
	choices: Choice[];
	unselectedText?: string;
	buttonClass?: string;
}

export default function CustomSelect<TFormValues>(props: CustomSelectProps<TFormValues>) {
	const {
		choices,
		unselectedText,
		buttonClass,
		label,
		labelFor,
		field: { onChange, value, name },
		fieldState: { error },
	} = props;

	return (
		<Listbox value={value} onChange={onChange}>
			{({ open }) => (
				<>
					<Listbox.Label htmlFor={labelFor} className="block text-sm font-medium text-gray-700">
						{label}
					</Listbox.Label>
					<div className="mt-1 relative">
						<Listbox.Button
							className={`${buttonClass} bg-white relative w-full border ${
								error
									? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-400 focus:border-red-400"
									: "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
							} rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 sm:text-sm`}
						>
							<span className="block truncate">
								{value ? (
									(value as Choice).name
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
												active ? "text-white bg-primary-light" : "text-gray-900",
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
