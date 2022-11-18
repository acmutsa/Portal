import { FunctionComponent, useEffect, useState } from "react";
import public_config from "@/config/public_config.json";
import { BsExclamationCircle, BsImage } from "react-icons/bs";
import { Controller, useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import CustomSelect from "@/components/forms/CustomSelect";
import { Switch } from "@headlessui/react";
import { classNames } from "@/utils/helpers";

const NewEventView: FunctionComponent = () => {
	const organizations = public_config.organizations;
	let createEvent = trpc.useMutation(["admin.createEvent"]);

	const {
		register,
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();
	const didSubmit = async (p: any) => {
		let data = p;

		createEvent.mutate(
			{
				eventName: data.eventName,
				eventDescription: data.eventDescription,
				eventImage: data.eventImage,
				eventOrg: data.eventOrg,
				eventLocation: data.eventLocation,
				eventStart: new Date(data.eventStart.replace("T", " ").replace("-", "/")),
				eventEnd: new Date(data.eventEnd.replace("T", " ").replace("-", "/")),
				formOpen: new Date(data.formOpen.replace("T", " ").replace("-", "/")),
				formClose: new Date(data.formClose.replace("T", " ").replace("-", "/")),
			},
			{
				onSuccess: (res) => {
					alert("Event created successfully!");
					window.open(`/events/${res.event.pageID}`, "_blank");
				},
			}
		);
	};

	useEffect(() => {
		const now = new Date();
		now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

		setValue("eventStart", now.toISOString().slice(0, 16));
		setValue("eventEnd", now.toISOString().slice(0, 16));
	}, []);

	const [formTimesEnabled, setFormTimesEnabled] = useState(false);

	const shouldShowFormTimes = () => {
		setFormTimesEnabled(() => !formTimesEnabled);
	};

	return (
		<div className="w-full h-full p-[5px]">
			<div className="max-w-[50rem] mx-auto">
				<div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
					<form onSubmit={handleSubmit(didSubmit)}>
						<div className="shadow rounded-md">
							<div className="bg-white py-6 px-4 space-y-6 sm:p-6">
								<div>
									<h3 className="text-lg leading-6 font-medium text-gray-900">Create New Event</h3>
									<p className="mt-1 text-sm text-gray-500">
										Take care to double check all information before submitting.
									</p>
								</div>

								<div className="grid grid-cols-12 gap-6">
									<div className="col-span-12 sm:col-span-8">
										<label htmlFor="name" className="block text-sm font-medium text-gray-700">
											Name
										</label>
										<input
											type="text"
											id="name"
											placeholder="Group Mock Interviews"
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
												minLength: { value: 6, message: "At least 6 characters required." },
												maxLength: { value: 50, message: "Maximum 50 characters allowed." },
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
									<div className="col-span-12 sm:col-span-6 md:col-span-4">
										<Controller
											name={"organization" as string}
											rules={{ required: true }}
											control={control}
											render={({ field, fieldState }) => (
												<CustomSelect
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
										<label
											htmlFor="description"
											className="block text-sm font-medium text-gray-700"
										>
											Description
										</label>
										<div className="mt-1">
											<textarea
												rows={5}
												id="description"
												aria-invalid={errors.description ? "true" : "false"}
												aria-describedby="description-error"
												placeholder="Describe what is happening, where it is happening, and who it's happening with..."
												className={`${
													errors.description
														? "border-red-300 focus:border-red-300 focus:ring-red-300"
														: "border-gray-300"
												} mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
												{...register("description")}
											/>
										</div>
									</div>
									<div className="col-span-12 sm:col-span-8">
										<label htmlFor="name" className="block text-sm font-medium text-gray-700">
											Header Image URL
										</label>
										<div className="mt-1 relative rounded-md shadow-sm">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<BsImage className="h-[18px] w-[18px] text-gray-400" aria-hidden="true" />
											</div>
											<input
												type="url"
												id="imageURL"
												placeholder="https://i.imgur.com/kUK771p.jpeg"
												autoComplete="imageURL"
												aria-invalid={errors.imageURL ? "true" : "false"}
												aria-describedby="imageURL-error"
												className={`${
													errors.imageURL
														? "border-red-300 focus:border-red-300 focus:ring-red-300"
														: "border-gray-300"
												} font-mono block w-full shadow-sm rounded-md sm:text-sm pl-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
												{...register("imageURL", {
													required: { value: true, message: "Required." },
												})}
											/>
										</div>
										{errors.imageURL ? (
											<p
												className="absolute inline-flex mt-1 text-sm text-red-600"
												id="imageURL-error"
												role="alert"
											>
												<BsExclamationCircle className="mx-1 mt-1" />
												{errors.imageURL.message as string}
											</p>
										) : null}
									</div>
									<div className="col-span-12 sm:col-span-4">
										<label htmlFor="location" className="block text-sm font-medium text-gray-700">
											Location
										</label>
										<input
											type="text"
											id="location"
											placeholder="NPB 3.1.40"
											aria-invalid={errors.location ? "true" : "false"}
											aria-describedby="location-error"
											className={`${
												errors.location
													? "border-red-300 focus:border-red-300 focus:ring-red-300"
													: "border-gray-300"
											} mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
											{...register("location", {
												required: { value: true, message: "Required." },
												minLength: { value: 3, message: "At least 3 characters required." },
												maxLength: { value: 20, message: "Maximum 20 characters allowed." },
											})}
										/>
										{errors.location ? (
											<p
												className="absolute inline-flex mt-1 text-sm text-red-600"
												id="location-error"
												role="alert"
											>
												<BsExclamationCircle className="mx-1 mt-1" />
												{errors.location.message as string}
											</p>
										) : null}
									</div>
									<div className="col-span-12 grid gap-6 grid-cols-6 sm:grid-cols-12 mt-3">
										<div className="col-span-12 sm:col-span-6 sm:place-self-end">
											<label
												htmlFor="eventStart"
												className="block text-sm font-medium text-gray-700"
											>
												Event Start
											</label>
											<input
												type="datetime-local"
												id="eventStart"
												aria-invalid={errors.eventStart ? "true" : "false"}
												aria-describedby="eventStart-error"
												className={`${
													errors.eventStart
														? "border-red-300 focus:border-red-300 focus:ring-red-300"
														: "border-gray-300"
												} mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
												{...register("eventStart", {
													required: { value: true, message: "Required." },
													valueAsDate: true,
													validate: {
														invalid: (date) => !isNaN(date) || "Invalid Date.",
													},
												})}
											/>
											{errors.eventStart ? (
												<p
													className="absolute inline-flex mt-1 text-sm text-red-600"
													id="eventStart-error"
													role="alert"
												>
													<BsExclamationCircle className="mx-1 mt-1" />
													{errors.eventStart.message as string}
												</p>
											) : null}
										</div>
										<div className="col-span-12 sm:col-span-6 sm:place-self-start">
											<label htmlFor="eventEnd" className="block text-sm font-medium text-gray-700">
												Event End
											</label>
											<input
												type="datetime-local"
												id="eventEnd"
												aria-invalid={errors.eventEnd ? "true" : "false"}
												aria-describedby="eventEnd-error"
												className={`${
													errors.eventEnd
														? "border-red-300 focus:border-red-300 focus:ring-red-300"
														: "border-gray-300"
												} mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
												{...register("eventEnd", {
													required: { value: true, message: "Required." },
													valueAsDate: true,
													validate: {
														invalid: (date) => !isNaN(date) || "Invalid Date.",
													},
												})}
											/>
											{errors.eventEnd ? (
												<p
													className="absolute inline-flex mt-1 text-sm text-red-600"
													id="eventEnd-error"
													role="alert"
												>
													<BsExclamationCircle className="mx-1 mt-1" />
													{errors.eventEnd.message as string}
												</p>
											) : null}
										</div>
									</div>

									<div className="col-span-12">
										<Switch.Group
											as="div"
											className="flex items-center justify-center gap-5 mx-2 xs:mr-4 sm:mx-8 md:mx-2 lg:mx-28"
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
											<label htmlFor="eventEnd" className="block text-sm font-medium text-gray-700">
												Form Open
											</label>
											<input
												type="datetime-local"
												id="formOpen"
												aria-invalid={formTimesEnabled && errors.formOpen ? "true" : "false"}
												aria-describedby="formOpen-error"
												className={classNames(
													formTimesEnabled && errors.formOpen
														? "border-red-300 focus:border-red-300 focus:ring-red-300"
														: "border-gray-300",
													!formTimesEnabled ? "bg-gray-50 text-gray-500" : null,
													"mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
												)}
												{...register("formOpen", {
													required: { value: formTimesEnabled, message: "Required." },
													valueAsDate: true,
													disabled: !formTimesEnabled,
													validate: {
														invalid: (date) => !isNaN(date) || "Invalid Date.",
													},
												})}
											/>
											{formTimesEnabled && errors.formOpen ? (
												<p
													className="absolute inline-flex mt-1 text-sm text-red-600"
													id="formOpen-error"
													role="alert"
												>
													<BsExclamationCircle className="mx-1 mt-1" />
													{errors.formOpen.message as string}
												</p>
											) : null}
										</div>
										<div className="col-span-12 sm:col-span-6 sm:place-self-start">
											<label
												htmlFor="formClose"
												className="block text-sm font-medium text-gray-700"
											>
												Form Close
											</label>
											<input
												type="datetime-local"
												id="formClose"
												aria-invalid={formTimesEnabled && errors.formClose ? "true" : "false"}
												aria-describedby="formClose-error"
												className={classNames(
													formTimesEnabled && errors.formClose
														? "border-red-300 focus:border-red-300 focus:ring-red-300"
														: "border-gray-300",
													!formTimesEnabled ? "bg-gray-50 text-gray-500" : null,
													"mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
												)}
												{...register("formClose", {
													required: { value: formTimesEnabled, message: "Required." },
													valueAsDate: true,
													disabled: !formTimesEnabled,
													validate: {
														invalid: (date) => !isNaN(date) || "Invalid Date.",
													},
												})}
											/>
											{formTimesEnabled && errors.formClose ? (
												<p
													className="absolute inline-flex mt-1 text-sm text-red-600"
													id="formClose-error"
													role="alert"
												>
													<BsExclamationCircle className="mx-1 mt-1" />
													{errors.formClose.message as string}
												</p>
											) : null}
										</div>
									</div>
								</div>
							</div>
							<div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
								<button
									type="submit"
									className="bg-primary-dark border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
