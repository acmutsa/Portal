import AdvancedInput from "@/components/forms/AdvancedInput";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CustomSelect, { Choice } from "@/components/forms/CustomSelect";
import organizations from "@/config/organizations.json";
import { BsExclamationCircle, BsImage } from "react-icons/bs";
import { Switch } from "@headlessui/react";
import {
	classNames,
	getCustomChoiceParser,
	getPreciseSemester,
	getSemesterRange,
	pluralize,
} from "@/utils/helpers";
import { FunctionComponent, ReactNode, useMemo, useState } from "react";
import { z } from "zod";
import { differenceInMinutes, isAfter } from "date-fns";
import { Calendar } from "primereact/calendar";
import { HiExclamation } from "react-icons/hi";

import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";

export const InitialEventFormSchema = z
	.object({
		name: z.string(),
		description: z.string(),
		location: z.string(),
		headerImage: z.string(),
		eventStart: z.date(),
		eventEnd: z.date(),
		formOpen: z.date().nullable(),
		formClose: z.date().nullable(),
		organization: z.string().transform(getCustomChoiceParser(organizations)),
		semester: z.string().transform((val) => {
			return {
				id: val,
				name: val,
			};
		}),
	})
	.partial();
export type InitialEventFormValues = z.infer<typeof InitialEventFormSchema>;

export type EventFormValues = {
	name: string;
	description: string;
	organization: Choice;
	location: string;
	headerImage: string;
	semester: Choice;
	eventStart: Date;
	eventEnd: Date;
	formOpen: Date | null;
	formClose: Date | null;
	points: Number;
};

type EventFormProps = {
	onSubmit: SubmitHandler<EventFormValues>;
	onDelete?: () => void;
	initialValues?: InitialEventFormValues;
	context: "create" | "modify";
};

function FormWarning(props: { className?: string; title?: string; children: string | string[] }) {
	return (
		<div className={classNames(props.className, "col-span-12 flex justify-center")}>
			<div className="rounded-md bg-yellow-50 p-4">
				<div className="flex">
					<div className="flex-shrink-0">
						<HiExclamation className="h-5 w-5 text-yellow-400" aria-hidden="true" />
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-yellow-800">{props.title ?? "Warning"}</h3>
						<div className="mt-2 text-sm text-yellow-700">
							<p>{props.children}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const checkIfSubmitted = (callback: any) => {
	const [called, setCalled] = useState(false);

	return (e: any) => {
		if (!called) {
			setCalled(true);
			callback(e);
		}
	}
}

const EventForm: FunctionComponent<EventFormProps> = ({
	context,
	onSubmit,
	onDelete,
	initialValues,
}) => {
	const currentSemester = getPreciseSemester();
	const now = new Date();
	// Include up to 3 years in the past, and one year in the future, but no semesters before Fall 2022.
	const semesters: Choice[] = getSemesterRange(
		[3, Math.max(2022, now.getUTCFullYear() - 3)],
		now.getUTCFullYear() + 1
	).map((s) => ({
		id: s,
		name: s,
	}));

	const currentSemeterChoice = semesters.find((s) => s.name == currentSemester);

	const {
		register,
		watch,
		control,
		handleSubmit,
		trigger,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<EventFormValues>({
		mode: "onChange",
		defaultValues: {
			points: 1,
			semester: currentSemeterChoice,
			eventStart: now,
			eventEnd: now,
			formOpen: now,
			formClose: now,
			...initialValues,
		},
	});

	const [formTimesEnabled, setFormTimesEnabled] = useState<boolean>(
		context == "create" ? true : initialValues?.formClose != null
	);

	const watchedEventTiming = watch(["eventStart", "eventEnd", "formOpen", "formClose"]);

	const eventDurationWarning: ReactNode | null = useMemo(() => {
		const [start, end] = watchedEventTiming.slice(0, 2) as [Date, Date];
		const minuteDifference = differenceInMinutes(end, start);
		if (minuteDifference >= 0 && minuteDifference < 20)
			return (
				<FormWarning className="mt-0">
					The event is set to only last {minuteDifference.toString()} minute
					{pluralize(minuteDifference)}. Are you sure this is correct?
				</FormWarning>
			);
		if (minuteDifference >= 0 && minuteDifference >= 60 * 4) {
			const hours = minuteDifference / 60;
			return (
				<FormWarning className="mt-0">
					The event is set to last {hours.toFixed(1)} hours. Are you sure this is correct?
				</FormWarning>
			);
		}

		return null;
	}, [watchedEventTiming]);

	const formDurationWarning: ReactNode | null = useMemo(() => {
		const [start, end] = watchedEventTiming.slice(-2);
		if (start == null || end == null) return null;
		const minuteDifference = differenceInMinutes(end, start);
		if (minuteDifference >= 0 && minuteDifference < 30)
			return (
				<FormWarning>
					The form is set to only be open for {minuteDifference.toString()} minute
					{pluralize(minuteDifference)}. Are you sure this is correct?
				</FormWarning>
			);
		if (minuteDifference >= 0 && minuteDifference >= 60 * 5) {
			const hours = minuteDifference / 60;
			return (
				<FormWarning className="mt-0">
					The form is set to be open for {hours.toFixed(1)} hours. Are you sure this is correct?
				</FormWarning>
			);
		}
		return null;
	}, [watchedEventTiming]);

	return (
		<form onSubmit={handleSubmit(checkIfSubmitted(onSubmit))}>
			<div className="shadow rounded-md">
				<div className="bg-white py-6 px-4 space-y-6 sm:p-6">
					<div>
						<h3 className="text-lg leading-6 font-medium text-gray-900">
							{
								{
									create: "Create New Event",
									modify: "Modify Event",
								}[context]
							}
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							Take care to double check all information before submitting :&#41;
						</p>
					</div>
					<div className="grid grid-cols-12 gap-6">
						<div className="col-span-12 sm:col-span-8 lg:col-span-6">
							<AdvancedInput
								label="Name"
								placeholder="A Wicked Awesome Event"
								type="text"
								register={register("name", {
									required: { value: true, message: "Required." },
									minLength: { value: 6, message: "At least 6 characters required." },
									maxLength: { value: 50, message: "Maximum 50 characters allowed." },
								})}
								errors={errors}
							/>
						</div>
						<div className="col-span-6 sm:col-span-4 lg:col-span-3">
							<Controller
								name={"semester"}
								rules={{ required: true }}
								control={control}
								render={({ field, fieldState }) => (
									<CustomSelect<EventFormValues>
										field={field}
										fieldState={fieldState}
										label="Semester"
										choices={semesters}
										unselectedText={currentSemester}
									/>
								)}
							/>
						</div>
						<div className="col-span-6 sm:col-span-4 lg:col-span-3">
							<Controller
								name={"organization"}
								rules={{ required: true }}
								control={control}
								render={({ field, fieldState }) => (
									<CustomSelect<EventFormValues>
										field={field}
										fieldState={fieldState}
										label="Organization"
										choices={organizations}
										unselectedText="ACM & Co."
									/>
								)}
							/>
						</div>
						<div className="col-span-12 sm:col-span-12">
							<AdvancedInput
								id="description"
								label="Description"
								placeholder="Describe what is happening, where it is happening, and who it's happening with..."
								type="text"
								as="textarea"
								register={register("description")}
								errors={errors}
							/>
						</div>
						<div className="col-span-12 sm:col-span-6">
							<AdvancedInput
								label="Header Image URL"
								placeholder="https://i.imgur.com/kUK771p.jpeg"
								InlineIcon={BsImage}
								type="url"
								register={register("headerImage", {
									required: { value: true, message: "Required." },
								})}
								errors={errors}
								controlClass="font-mono"
							/>
						</div>
						<div className="col-span-6 sm:col-span-2">
							<AdvancedInput
								label="Points"
								type="text"
								register={register("points", {
									required: { value: true, message: "Required." },
									min: 0,
									valueAsNumber: true,
								})}
								errors={errors}
							/>
						</div>
						<div className="col-span-12 sm:col-span-4">
							<AdvancedInput
								placeholder="EMCS's Garage"
								label="Location"
								type="text"
								register={register("location", {
									required: { value: true, message: "Required." },
									minLength: { value: 3, message: "At least 3 characters required." },
									maxLength: { value: 20, message: "Maximum 20 characters allowed." },
								})}
								errors={errors}
							/>
						</div>
						<div className="col-span-12 grid gap-6 grid-cols-6 sm:grid-cols-12 mt-3">
							<div className="col-span-12 sm:col-span-6 sm:place-self-end">
								<label
									htmlFor="eventStart"
									className="mb-1 block text-sm font-medium text-gray-700"
								>
									Event Start
								</label>
								<Controller
									name="eventStart"
									control={control}
									rules={{ required: "Date is required." }}
									render={({ field, fieldState }) => (
										<>
											<Calendar
												inputClassName="!py-2 !px-3"
												inputId={field.name}
												placeholder="Event Start Time"
												value={field.value}
												onChange={(e) => {
													trigger("eventEnd");
													if (formTimesEnabled && context == "create") {
														setValue("formOpen", getValues("eventStart"));
													}
													return field.onChange(e);
												}}
												dateFormat="dd/mm/yy"
												showTime
												hourFormat="12"
												className={classNames(fieldState.error ? "p-invalid" : null)}
											/>
										</>
									)}
								/>
								{errors.eventStart != undefined ? (
									<p
										className="absolute inline-flex mt-1 text-sm text-red-600"
										// id={ariaErrorIdentifier}
										role="alert"
									>
										<BsExclamationCircle className="mx-1 mt-1" />
										{(errors.eventStart.message as string) ?? "Invalid."}
									</p>
								) : null}
							</div>
							<div className="col-span-12 sm:col-span-6 sm:place-self-start">
								<label
									htmlFor="eventStart"
									className="mb-1 block text-sm font-medium text-gray-700"
								>
									Event End
								</label>
								<Controller
									name="eventEnd"
									control={control}
									rules={{
										required: "Date is required.",
										validate: {
											invalid: (date) => !isNaN(date.getTime()) || "Invalid Date.",
											onlyAfter: (date) => {
												return (
													isAfter(date, watch("eventStart")) ||
													"The event must end after it starts."
												);
											},
										},
									}}
									render={({ field, fieldState }) => (
										<div>
											<Calendar
												inputClassName="!py-2 !px-3"
												inputId={field.name}
												placeholder="Event End Time"
												value={field.value}
												onChange={(e) => {
													if (formTimesEnabled && context == "create") {
														setValue(
															"formClose",
															new Date(getValues("eventEnd").getTime() + 30 * 60 * 1000)
														);
													}
													return field.onChange(e);
												}}
												dateFormat="dd/mm/yy"
												showTime
												hourFormat="12"
												className={classNames(fieldState.error ? "p-invalid" : null)}
											/>
										</div>
									)}
								/>
								{errors.eventEnd != undefined ? (
									<p
										className="absolute inline-flex mt-1 text-sm text-red-600"
										// id={ariaErrorIdentifier}
										role="alert"
									>
										<BsExclamationCircle className="mx-1 mt-1" />
										{(errors.eventEnd.message as string) ?? "Invalid."}
									</p>
								) : null}
							</div>

							{eventDurationWarning != null &&
							!(errors.eventEnd != undefined || errors.eventStart != undefined)
								? eventDurationWarning
								: null}
						</div>

						<div className="col-span-12">
							<Switch.Group
								as="div"
								className="flex items-center justify-center gap-5 mx-2 xs:mr-4 sm:mx-8 md:mx-2 lg:mx-28 pt-4 pb-2"
							>
								<span className="flex flex-col pr-2">
									<Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
										Use separate check-in form times
									</Switch.Label>
									<Switch.Description as="span" className="text-sm text-gray-500">
										Should the check-in open at a different time than the event?
									</Switch.Description>
								</span>
								<Switch
									checked={formTimesEnabled}
									onChange={() => {
										setValue("formOpen", null);
										setValue("formClose", null);
										setFormTimesEnabled(!formTimesEnabled);
									}}
									className={classNames(
										formTimesEnabled ? "bg-indigo-600" : "bg-gray-200",
										"relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									)}
								>
									<span
										aria-hidden="true"
										className={classNames(
											formTimesEnabled ? "translate-x-5" : "translate-x-0",
											"pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
										)}
									/>
								</Switch>
							</Switch.Group>
						</div>
						<div className="col-span-12 grid gap-6 grid-cols-6 sm:grid-cols-12">
							<div className="col-span-12 sm:col-span-6 sm:place-self-end">
								<label htmlFor="formOpen" className="mb-1 block text-sm font-medium text-gray-700">
									Form Open
								</label>
								<Controller
									name="formOpen"
									control={control}
									render={({ field, fieldState }) => (
										<>
											<Calendar
												inputClassName="!py-2 !px-3"
												disabled={!formTimesEnabled}
												inputId={field.name}
												placeholder="Form Open Time"
												value={field.value ?? undefined}
												onChange={(e) => {
													trigger("formClose");
													return field.onChange(e);
												}}
												dateFormat="dd/mm/yy"
												showTime
												hourFormat="12"
												className={classNames(fieldState.error ? "p-invalid" : null)}
											/>
											<small className="p-error">{errors.formOpen?.message}</small>
										</>
									)}
								/>
							</div>
							<div className="col-span-12 sm:col-span-6 sm:place-self-start">
								<label htmlFor="formClose" className="mb-1 block text-sm font-medium text-gray-700">
									Form Close
								</label>
								<Controller
									name="formClose"
									control={control}
									rules={{
										validate: {
											invalid: (date) => date == null || !isNaN(date.getTime()) || "Invalid Date.",
											onlyAfter: (date) => {
												return (
													date == null ||
													isAfter(date, watch("eventStart")) ||
													"The event must end after it starts."
												);
											},
										},
									}}
									render={({ field, fieldState }) => (
										<div>
											<Calendar
												inputClassName="!py-2 !px-3"
												inputId={field.name}
												disabled={!formTimesEnabled}
												placeholder="Form Close Time"
												value={field.value ?? undefined}
												onChange={field.onChange}
												dateFormat="dd/mm/yy"
												showTime
												hourFormat="12"
												className={classNames(fieldState.error ? "p-invalid" : null)}
											/>
										</div>
									)}
								/>
								{errors.formClose != undefined ? (
									<p
										className="absolute inline-flex mt-1 text-sm text-red-600"
										// id={ariaErrorIdentifier}
										role="alert"
									>
										<BsExclamationCircle className="mx-1 mt-1" />
										{(errors.formClose.message as string) ?? "Invalid."}
									</p>
								) : null}
							</div>
							{formDurationWarning != null &&
							formTimesEnabled &&
							!(errors.formOpen != undefined || errors.formClose != undefined)
								? formDurationWarning
								: null}
						</div>
					</div>
				</div>
				<div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-3">
					{onDelete != undefined ? (
						<button
							type="button"
							onClick={onDelete}
							className="bg-red-500 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Delete
						</button>
					) : null}
					<button
						type="submit"
						className="bg-primary border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						{
							{
								create: "Create",
								modify: "Save",
							}[context]
						}
					</button>
				</div>
			</div>
		</form>
	);
};

export default EventForm;
