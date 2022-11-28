import { FunctionComponent } from "react";
import { useForm, Controller, Validate } from "react-hook-form";
import Detail from "@/components/common/Detail";
import { useToggle } from "usehooks-ts";
import { classNames } from "@/utils/helpers";
import CustomSelect, { Choice } from "@/components/forms/CustomSelect";
import majors from "@/utils/majors.json";
import { BsExclamationCircle } from "react-icons/bs";

interface ModifiableDetailProps {
	id: string;
	label: string;
	initialValue?: string | null;
	children: string | number | JSX.Element;
	striped?: boolean;
	choices?: Choice[];
	autoComplete?: string;
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
}) => {
	striped = striped ?? true;
	const [isModifying, toggleModifying, setModifying] = useToggle();

	// TODO: Add defaultValue handler for Choice based input box
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues: { [id]: initialValue } });

	const onCancel = () => {
		setModifying(false);
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
				"bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:px-6 sm:gap-4 items-center"
			)}
		>
			<dt className="text-sm font-medium text-gray-500">{label}</dt>
			<dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2 items-center">
				<span className="flex-grow pr-8">
					{choices != null ? (
						<Controller
							name={id as "id"}
							control={control}
							render={({ field, fieldState }) => (
								<CustomSelect
									field={field}
									fieldState={fieldState}
									choices={majors}
									unselectedText="Computer Science"
								/>
							)}
						/>
					) : (
						<input
							type="text"
							id={id}
							autoComplete={autoComplete}
							placeholder={placeholder}
							className={classNames(
								errors[id as "id"]
									? "border-red-300 focus:border-red-300 focus:ring-red-300"
									: "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500",

								"block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
							)}
							{...register(id as "id", {
								required: { value: true, message: "Required." },
								validate: rules,
							})}
						/>
					)}
					{errors[id as "id"] ? (
						<p
							className="absolute inline-flex mt-1 text-sm text-red-600"
							id="name-error"
							role="alert"
						>
							<BsExclamationCircle className="mx-1 mt-1" />
							{errors[id as "id"]!.message as string}
						</p>
					) : null}
				</span>
				<span className="ml-4 space-x-4 flex-shrink-0 font-semibold text-secondary-500">
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
