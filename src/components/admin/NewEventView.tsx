import { FunctionComponent, useState } from "react";
import organizations from "@/config/organizations.json";
import { BsImage } from "react-icons/bs";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import CustomSelect, { Choice } from "@/components/forms/CustomSelect";
import { Switch } from "@headlessui/react";
import { classNames, getPreciseSemester, getSemesterRange } from "@/utils/helpers";
import AdvancedInput from "@/components/forms/AdvancedInput";
import { useRouter } from "next/router";

interface FormValues {
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
}

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

const NewEventView: FunctionComponent = () => {
	const router = useRouter();
	const now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

	let createEvent = trpc.useMutation(["admin.createEvent"]);
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			eventStart: now,
			eventEnd: now,
			formOpen: null,
			formClose: null,
		},
	});

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		if (data == null) return;
		createEvent.mutate(
			{ ...data, organization: data.organization.id, semester: data.semester.id },
			{
				onSuccess: (res) => {
					router.push(`/admin/events/${res.id}`);
					window.open(`/events/${res.pageID}`, "_blank");
				},
			}
		);
	};

	const [formTimesEnabled, setFormTimesEnabled] = useState(false);

	return (
		<div className="w-full h-full p-[5px]">
			<div className="max-w-[50rem] mx-auto">
				<div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="shadow rounded-md">
							<div className="bg-white py-6 px-4 space-y-6 sm:p-6">
								<div>
									<h3 className="text-lg leading-6 font-medium text-gray-900">Create New Event</h3>
									<p className="mt-1 text-sm text-gray-500">
										Take care to double check all information before submitting.
									</p>
								</div>
								<div className="grid grid-cols-12 gap-6">
									<div className="col-span-12 sm:col-span-8 lg:col-span-6">
										<AdvancedInput
											label="Name"
											placeholder="Group Mock Interviews"
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
												<CustomSelect<FormValues>
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
												<CustomSelect<FormValues>
													field={field}
													fieldState={fieldState}
													label="Organization"
													choices={organizations}
													unselectedText="RowdyHacks"
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
									<div className="col-span-12 sm:col-span-8">
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
									<div className="col-span-12 sm:col-span-4">
										<AdvancedInput
											placeholder="NPB 3.1.40"
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
											<AdvancedInput
												label="Event Start"
												type="datetime-local"
												register={register("eventStart", {
													required: { value: true, message: "Required." },
													valueAsDate: true,
													validate: {
														invalid: (date) => !isNaN(date.getTime()) || "Invalid Date.",
													},
												})}
												errors={errors}
											/>
										</div>
										<div className="col-span-12 sm:col-span-6 sm:place-self-start">
											<AdvancedInput
												label="Event End"
												type="datetime-local"
												register={register("eventEnd", {
													required: { value: true, message: "Required." },
													valueAsDate: true,
													validate: {
														invalid: (date) => !isNaN(date.getTime()) || "Invalid Date.",
													},
												})}
												errors={errors}
											/>
										</div>
									</div>

									<div className="col-span-12">
										<Switch.Group
											as="div"
											className="flex items-center justify-center gap-5 mx-2 xs:mr-4 sm:mx-8 md:mx-2 lg:mx-28 pt-4 pb-2"
										>
											<span className="flex flex-col pr-2">
												<Switch.Label
													as="span"
													className="text-sm font-medium text-gray-900"
													passive
												>
													Use separate form times
												</Switch.Label>
												<Switch.Description as="span" className="text-sm text-gray-500">
													Should the forms open at a different time than the event?
												</Switch.Description>
											</span>
											<Switch
												checked={formTimesEnabled}
												onChange={setFormTimesEnabled}
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
											<AdvancedInput
												label="Form Open"
												type="datetime-local"
												register={register("formOpen", {
													required: { value: formTimesEnabled, message: "Required." },
													valueAsDate: true,
													disabled: !formTimesEnabled,
													validate: {
														invalid: (date) =>
															(date != null && !isNaN(date.getTime())) || "Invalid Date.",
													},
												})}
												errors={errors}
											/>
										</div>
										<div className="col-span-12 sm:col-span-6 sm:place-self-start">
											<AdvancedInput
												label="Form Close"
												type="datetime-local"
												register={register("formClose", {
													required: { value: formTimesEnabled, message: "Required." },
													valueAsDate: true,
													disabled: !formTimesEnabled,
													validate: {
														invalid: (date) =>
															(date != null && !isNaN(date.getTime())) || "Invalid Date.",
													},
												})}
												errors={errors}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
								<button
									type="submit"
									className="bg-primary border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

export default NewEventView;
