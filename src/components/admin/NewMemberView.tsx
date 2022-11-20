import { FunctionComponent } from "react";
import { useForm, Controller } from "react-hook-form";
import CustomSelect from "@/components/forms/CustomSelect";
import majors from "@/utils/majors.json";
import classifications from "@/utils/classifications.json";
import identities from "@/utils/identities.json";
import months from "@/utils/months.json";
import ethnicities from "@/utils/ethnicities.json";
import { range } from "@/utils/helpers";
import { BsExclamationCircle } from "react-icons/bs";
import { PrettyMemberDataSchema, toMemberData } from "@/utils/transform";
import { addMinutes } from "date-fns";

const currentYear = new Date().getFullYear();
const years = range(currentYear - 4, currentYear + 4).map((year) => ({
	id: year.toString(),
	name: year.toString(),
}));

// TODO: Add shirt size, organizations, and address data
// TODO: Refine all aria labels, make sure accessibility is fully supported.
// TODO: Use AdvancedInput for all relevant forms

const NewMemberView: FunctionComponent = () => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm();
	const didSubmit = async (data: any) => {
		// Birthday may be invalid/NaN when form submits.
		// date-fns will format as UTC, but it will be in CST, thus -6 hours behind for Texas/CST.
		// The result is all dates by users will be rendered 1 day off by date-fns.
		const birthday = isNaN(data.birthday.getTime())
			? undefined
			: addMinutes(data.birthday, data.birthday.getTimezoneOffset());

		const identity = data.identity?.id;
		console.log(identity);
		const classification = data.classification?.id;
		const ethnicity = data.ethnicity?.id;
		const major = data.major?.id;
		const graduationDate =
			data?.graduationMonth != null && data?.graduationYear != null
				? {
						month: parseInt(data.graduationMonth.id),
						year: parseInt(data.graduationYear.id),
				  }
				: null;

		const parsed = PrettyMemberDataSchema.parse({
			id: data.id,
			classification,
			major,
			graduationDate,
			identity,
			ethnicity,
			birthday,
		});
		console.log(toMemberData(parsed));
	};

	return (
		<div className="w-full h-full p-[5px]">
			<div className="max-w-[50rem] mx-auto">
				<div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
					<form onSubmit={handleSubmit(didSubmit)}>
						<div className="shadow rounded-md">
							<div className="bg-white py-6 px-4 space-y-6 sm:p-6">
								<div>
									<h3 className="text-lg leading-6 font-medium text-gray-900">Create New Member</h3>
									<p className="mt-1 text-sm text-gray-500">
										If possible, users should register themselves.
									</p>
								</div>

								<div className="grid grid-cols-10 gap-6">
									<div className="col-span-12 sm:col-span-4">
										<label htmlFor="name" className="block text-sm font-medium text-gray-700">
											Name
										</label>
										<input
											type="text"
											id="name"
											placeholder="John Doe"
											autoComplete="name"
											aria-invalid={errors.name ? "true" : "false"}
											aria-describedby="name-error"
											className={`${
												errors.name
													? "border-red-300 focus:border-red-300 focus:ring-red-300"
													: "border-gray-300"
											} mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
											{...register("name", {
												required: { value: true, message: "Required." },
												minLength: { value: 2, message: "At least 2 characters required." },
												maxLength: { value: 30, message: "Maximum 30 characters allowed." },
											})}
										/>
										{errors.name ? (
											<p
												className="absolute inline-flex mt-1 text-sm text-red-600"
												id="name-error"
												role="alert"
											>
												<BsExclamationCircle className="mx-1 mt-1" />
												{errors.name.message as string}
											</p>
										) : null}
									</div>
									<div className="col-span-6 sm:col-span-2">
										<label htmlFor="id" className="block text-sm font-medium text-gray-700">
											myUTSA ID
										</label>
										<input
											type="text"
											id="id"
											placeholder="abc123"
											className={`${
												errors.id
													? "border-red-300 focus:border-red-300 focus:ring-red-300"
													: "border-gray-300"
											} mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
											{...register("id", {
												required: { value: true, message: "Required." },
												pattern: { value: /[a-z]{3}\d{3}/, message: "Invalid abc123." },
											})}
										/>
										{errors.id ? (
											<p
												className="absolute inline-flex mt-1 text-sm text-red-600"
												id="id-error"
												role="alert"
											>
												<BsExclamationCircle className="mx-1 mt-1" />
												{errors.id.message as string}
											</p>
										) : null}
									</div>
									<div className="col-span-12 sm:col-span-4">
										<label htmlFor="email" className="block text-sm font-medium text-gray-700">
											Email address
										</label>
										<input
											type="email"
											placeholder="you@example.org"
											id="email"
											autoComplete="email"
											aria-describedby="email-error"
											className={`${
												errors.email
													? "border-red-300 focus:border-red-300 focus:ring-red-300"
													: "border-gray-300"
											} mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
											{...register("email", { required: { value: true, message: "Required." } })}
										/>
										{errors.email ? (
											<p
												className="absolute inline-flex mt-1 text-sm text-red-600"
												id="email-error"
												role="alert"
											>
												<BsExclamationCircle className="mx-1 mt-1" />
												{errors.email.message as string}
											</p>
										) : null}
									</div>
									<div className="col-span-12 sm:col-span-3">
										<Controller
											name={"major" as string}
											control={control}
											render={({ field, fieldState }) => (
												<CustomSelect
													field={field}
													fieldState={fieldState}
													label="Major"
													choices={majors}
													unselectedText="Computer Science"
												/>
											)}
										/>
									</div>
									<div className="col-span-6 sm:col-span-3">
										<Controller
											name={"classification" as string}
											control={control}
											render={({ field, fieldState }) => (
												<CustomSelect
													field={field}
													fieldState={fieldState}
													label="Classification"
													choices={classifications}
													unselectedText="Senior"
												/>
											)}
										/>
									</div>
									<div className="col-span-12 sm:col-span-4">
										<label htmlFor="gradMonth" className="block text-sm font-medium text-gray-700">
											Graduation Date
										</label>
										<div className="grid grid-cols-2">
											<div className="col-span-1">
												<Controller
													name={"graduationMonth" as string}
													control={control}
													render={({ field, fieldState }) => (
														<CustomSelect
															field={field}
															fieldState={fieldState}
															label=""
															buttonClass="rounded-r-none border-r-0"
															choices={months}
															unselectedText="August"
														/>
													)}
												/>
											</div>
											<div className="col-span-1">
												<Controller
													name={"graduationYear" as string}
													control={control}
													render={({ field, fieldState }) => (
														<CustomSelect
															field={field}
															fieldState={fieldState}
															label=""
															buttonClass="rounded-l-none border-l-0"
															choices={years}
															unselectedText="2025"
														/>
													)}
												/>
											</div>
										</div>
									</div>
									<div className="col-span-6 sm:col-span-3">
										<Controller
											name={"identity" as string}
											control={control}
											render={({ field, fieldState }) => (
												<CustomSelect
													field={field}
													fieldState={fieldState}
													label="Gender Identity"
													choices={identities}
													unselectedText="Transgender"
												/>
											)}
										/>
									</div>
									<div className="col-span-6 sm:col-span-4">
										<Controller
											name={"ethnicity" as string}
											control={control}
											render={({ field, fieldState }) => (
												<CustomSelect
													field={field}
													fieldState={fieldState}
													label="Ethnicity"
													choices={ethnicities}
													unselectedText="White"
												/>
											)}
										/>
									</div>
									<div className="col-span-12 sm:col-span-3">
										<label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
											Birthday
										</label>
										<input
											type="date"
											id="birthday"
											autoComplete="birthday"
											aria-invalid={errors.birthday ? "true" : "false"}
											aria-describedby="birthday-error"
											className={`${
												errors.birthday
													? "border-red-300 focus:border-red-300 focus:ring-red-300"
													: "border-gray-300"
											} mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
											{...register("birthday", {
												valueAsDate: true,
											})}
										/>
										{errors.birthday ? (
											<p
												className="absolute inline-flex mt-1 text-sm text-red-600"
												id="birthday-error"
												role="alert"
											>
												<BsExclamationCircle className="mx-1 mt-1" />
												{errors.birthday.message as string}
											</p>
										) : null}
									</div>
								</div>
							</div>
							<div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
								<button
									type="submit"
									className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									Create
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default NewMemberView;
