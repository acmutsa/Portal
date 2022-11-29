import { Controller, useForm, Validate } from "react-hook-form";
import Detail from "@/components/common/Detail";
import { useToggle } from "usehooks-ts";
import { classNames } from "@/utils/helpers";
import CustomSelect, { Choice } from "@/components/forms/CustomSelect";
import majors from "@/utils/majors.json";
import { BsExclamationCircle } from "react-icons/bs";
import { FunctionComponent } from "react";

interface FormValues {
	value: string | null;
}

interface ModifiableDetailProps {
	id: string;
	label: string;
	initialValue?: string | null;
	children: string | number | JSX.Element;
	striped?: boolean;
	choices?: Choice[];
	autoComplete?: string;
	inputType?: string;
	placeholder?: string;
	rules?: Validate<string | null | undefined> | Record<string, Validate<string | null | undefined>>;
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
}: ModifiableDetailProps) => {
	striped = striped ?? true;
	const [isModifying, toggleModifying, setModifying] = useToggle();

	// Delete the initial value if it cannot be found within the given choices.
	if (choices != null && choices.find((choice) => choice.name == initialValue) == null)
		initialValue = null;

	const {
		register,
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			value: initialValue,
		},
	});

	const onCancel = () => {
		setModifying(false);
		// Erase any changes when cancel is clicked.
		setValue("value", initialValue ?? null);
	};

	const onSubmit = (data: any) => {
		console.log(data);
		setModifying(false);
	};

	return !isModifying ? (
		<Detail label={label} useButton={true} buttonAction={toggleModifying}>
			{children}
		</Detail>
	) : (
		<div
			className={classNames(
				striped ? "even:bg-gray-50" : null,
				isModifying ? "px-4 pt-4 pb-8" : "px-4 py-3",
				"bg-white sm:grid sm:grid-cols-3 sm:px-6 sm:gap-4 items-center"
			)}
		>
			<dt className="text-sm font-medium text-gray-500">{label}</dt>
			<dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2 items-center">
				<span className="flex-grow md:pr-8">
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
				<span className="ml-3 sm:ml-4 space-x-3 sm:space-x-4 flex-shrink-0 font-semibold text-secondary-500">
					<button
						onClick={handleSubmit(onSubmit)}
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
	);
};

export default ModifiableDetail;
