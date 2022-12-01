import { Controller, useForm, Validate } from "react-hook-form";
import Detail from "@/components/common/Detail";
import { useToggle } from "usehooks-ts";
import { classNames } from "@/utils/helpers";
import CustomSelect, { Choice } from "@/components/forms/CustomSelect";
import majors from "@/utils/majors.json";
import { BsExclamationCircle } from "react-icons/bs";
import { FunctionComponent, useState } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
import { CgSpinnerTwoAlt } from "react-icons/cg"; //icons

export interface ModifiableDetailFormValues {
	value: string | null;
}

interface ModifiableDetailProps {
	id: string;
	label: string;
	initialValue?: string | null;
	// The displayed element when the detail is not currently being modified.
	children: string | number | JSX.Element;
	/**
	 * If true, the detail box will have a different background for each 'even' child of the parent element.
	 */
	striped?: boolean;
	/**
	 * If provided, the element is backed by a Controller and CustomSelect component. All properties
	 * relating to text input only will not be used if this is set.
	 * While objects are passed in, only the
	 */
	choices?: Choice[];
	/**
	 * The autocomplete accessibility property for the input box. Text input only.
	 */
	autoComplete?: string;
	/**
	 * The inputType accessibility property for the input box. Text input only.
	 */
	inputType?: string;
	/**
	 * The default text when the input box is empty. Text input only.
	 */
	placeholder?: string;
	/**
	 * A place for optional validation rules. Can receive either a function or a object, where the values
	 * are the validation functions. Must return either a boolean or a string message (only true is considered a "passing" rule).
	 */
	rules?: Validate<string | null | undefined> | Record<string, Validate<string | null | undefined>>;
	/**
	 * @param values The values of the form when submitted.
	 * @return {boolean} Returns a boolean, if true, the submit was a success and the detail and quit. Otherwise,
	 * an error occurred and the ModifiableDetail will stay open.
	 */
	onSubmit?: (values: ModifiableDetailFormValues) => Promise<boolean>;
}

const ModifiableDetail: FunctionComponent<ModifiableDetailProps> = ({
	id,
	label,
	initialValue,
	children,
	striped,
	choices,
	autoComplete,
	placeholder,
	rules,
	inputType,
	onSubmit,
}: ModifiableDetailProps) => {
	striped = striped ?? true;
	const [isModifying, toggleModifying, setModifying] = useToggle();
	const [loading, setLoading] = useState(false);

	// Delete the initial value if it cannot be found within the given choices.
	if (choices != null && choices.find((choice) => choice.name == initialValue) == null)
		initialValue = null;

	const {
		register,
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<ModifiableDetailFormValues>({
		defaultValues: {
			value: initialValue,
		},
	});

	const onCancel = () => {
		setModifying(false);
		// Erase any changes when cancel is clicked.
		setValue("value", initialValue ?? null);
	};

	const onSubmitHandler = async (values: any) => {
		let response: boolean = false;
		if (onSubmit != null) {
			setLoading(true);
			response = await onSubmit(values);
			setLoading(false);
		}

		if (response) {
			setModifying(false);
			return;
		}
	};

	return !isModifying ? (
		<>
			<Detail label={label} useButton={true} buttonAction={toggleModifying}>
				{children}
			</Detail>
		</>
	) : (
		<>
			<div
				className={classNames(
					striped ? "even:bg-gray-50" : null,
					isModifying ? "px-4 pt-4 pb-8" : "px-4 py-3",
					"bg-white sm:grid sm:grid-cols-3 sm:px-6 sm:gap-4 items-center"
				)}
			>
				<dt className="text-sm font-medium text-gray-500">{label}</dt>
				<dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2 items-center">
					<span className="flex-grow">
						{choices != null ? (
							<Controller
								name="value"
								control={control}
								render={({ field, fieldState }) => (
									<CustomSelect
										field={field}
										fieldState={fieldState}
										choices={majors}
										unselectedText="Computer Science"
										flattenedValues={true}
									/>
								)}
							/>
						) : (
							<input
								type={inputType ?? "text"}
								id={id}
								autoComplete={autoComplete}
								placeholder={placeholder}
								className={classNames(
									errors.value
										? "border-red-300 focus:border-red-300 focus:ring-red-300"
										: "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500",

									"block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
								)}
								{...register("value", {
									required: { value: true, message: "Required." },
									validate: rules,
								})}
							/>
						)}
						{errors.value ? (
							<p
								className="absolute inline-flex mt-1 text-sm text-red-600"
								id="name-error"
								role="alert"
							>
								<BsExclamationCircle className="mx-1 mt-1" />
								{errors.value!.message as string}
							</p>
						) : null}
					</span>
					<span className="text-secondary-800 m-1 mx-2">
						<CgSpinnerTwoAlt
							className={classNames("w-5 h-5 animate-spin", loading ? null : "invisible")}
						/>
					</span>
					<span className="ml-3 sm:ml-4 space-x-3 sm:space-x-4 flex-shrink-0 font-semibold text-secondary-500">
						<button
							onClick={handleSubmit(onSubmitHandler)}
							type="button"
							className="hover:text-secondary-600 focus:outline-none focus:ring-[1.5px] focus:ring-offset-4 focus:ring-blue-500"
						>
							Save
						</button>
						<button
							onClick={onCancel}
							type="button"
							className="hover:text-secondary-600 focus:outline-none focus:ring-[1.5px] focus:ring-offset-4 focus:ring-blue-500"
						>
							Cancel
						</button>
					</span>
				</dd>
			</div>
		</>
	);
};

export default ModifiableDetail;
