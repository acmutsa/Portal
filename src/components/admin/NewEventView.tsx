import { FunctionComponent, useState, useEffect } from "react";
import public_config from "../../../config/public_config.json";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { trpc } from "../../utils/trpc";

// const Home: NextPage = () => {
//   const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

const NewEventView: FunctionComponent = () => {
	const orgs = public_config.organizations;
	const orgSelects = [];
	for (let org of orgs) {
		console.log(org);
		orgSelects.push(
			<option key={org} value={org}>
				{org}
			</option>
		);
	}

	let r = trpc.useMutation(["admin.createEvent"]);

	const { register, handleSubmit, setValue } = useForm();
	const didSubmit = async (p: any) => {
		let data = p;

		r.mutate(
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

	const [showFormTimes, setShowFormTimes] = useState(false);

	const shouldShowFormTimes = () => {
		setShowFormTimes(() => !showFormTimes);
	};

	return (
		<div className="w-full h-full p-[5px]">
			<h1 className="text-5xl font-extrabold font-raleway max-w-[800px] mx-auto mb-[15px]">
				New Event
			</h1>
			<form
				onSubmit={handleSubmit(didSubmit)}
				className="w-full flex flex-col mx-auto max-w-[800px] "
			>
				<p className="text-sm">Event Info</p>
				<div className="border-2 p-[5px] rounded-md">
					<input
						id="eventName"
						type="text"
						placeholder="Event Name"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md my-[10px]"
						{...register("eventName", { required: true })}
					/>
					<textarea
						id="eventDescription"
						placeholder="Description"
						className="bg-slate-200 border-none h-[150px] w-full focus:outline-none p-[5px] rounded-md my-[10px]"
						{...register("eventDescription", { required: true })}
					/>
					<input
						id="eventImage"
						type="text"
						placeholder="Image URL (optional)"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md my-[10px]"
						{...register("eventImage", { required: false })}
					/>
					<input
						type="text"
						id="eventLocation"
						placeholder="Event Location"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md my-[10px]"
						{...register("eventLocation", { required: true })}
					/>
					<select
						id="eventOrg"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md my-[10px]"
						{...register("eventOrg", { required: true })}
					>
						{orgSelects}
					</select>
				</div>
				<p className="text-sm mt-[15px]">Event Dates</p>
				<div className="border-2 p-[5px] rounded-md mb-[5px]">
					<label htmlFor="eventStart" className="text-sm">
						Event Start
					</label>
					<input
						type="datetime-local"
						id="eventStart"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md mb-[10px]"
						{...register("eventStart", { required: true })}
					/>
					<label htmlFor="eventEnd" className="text-sm">
						Event End
					</label>
					<input
						type="datetime-local"
						id="eventEnd"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md mb-[10px]"
						{...register("eventEnd", { required: true })}
					/>
					<input
						type="checkbox"
						id="shouldShowFormTimes"
						name="shouldShowFormTimes"
						className="mr-[2px]"
						onChange={() => shouldShowFormTimes()}
					/>
					<label htmlFor="shouldShowFormTimes" className="text-sm">
						Set Different Form Open/Close Time
					</label>
					{showFormTimes ? (
						<>
							<br />
							<label htmlFor="formOpen" className="text-sm">
								Form Open
							</label>
							<input
								type="datetime-local"
								id="formOpen"
								className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md mb-[10px]"
								{...register("formOpen", { required: false })}
							/>
							<label htmlFor="formClose" className="text-sm">
								Form Close
							</label>
							<input
								type="datetime-local"
								id="formClose"
								className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md mb-[10px]"
								{...register("formClose", { required: false })}
							/>
						</>
					) : null}
				</div>
				<button className="bg-primary-lighter text-white h-[50px] w-[150px] ml-auto align-text-center rounded-full font-bold flex items-center justify-center align-center mt-[15px]">
					Create Event <BsFillArrowRightCircleFill className="ml-[15px]" />
				</button>
			</form>
		</div>
	);
};

export default NewEventView;
