import { FunctionComponent } from "react";
import public_config from "../../../config/public_config.json";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { useForm } from "react-hook-form";

const NewEventView: FunctionComponent = () => {
	const orgs = public_config.organizations;
	const orgSelects = [];
	for (let org of orgs) {
		console.log(org);
		orgSelects.push(<option value={org}>{org}</option>);
	}

	const { register, handleSubmit } = useForm();
	const didSubmit = async (p: any) => {
		let data = p;
		const res = await fetch("/api/events/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		const res_json = await res.json();
	};

	return (
		<div className="w-full h-full p-[5px]">
			<form
				onSubmit={handleSubmit(didSubmit)}
				className="w-full flex flex-col mx-auto max-w-[800px]"
			>
				<label className="font-opensans">Event Name</label>
				<input
					id="eventName"
					type="text"
					placeholder="Event Name"
					className="bg-slate-200 border-none h-[50px] w-[75%] focus:outline-none p-[5px] rounded-md my-[10px]"
					{...register("eventName", { required: true })}
				/>
				<input
					id="eventDescription"
					type="text"
					placeholder="Description"
					className="bg-slate-200 border-none h-[50px] w-[75%] focus:outline-none p-[5px] rounded-md my-[10px]"
					{...register("eventDescription", { required: true })}
				/>
				<input
					id="eventImage"
					type="text"
					placeholder="Image URL (optional)"
					className="bg-slate-200 border-none h-[50px] w-[75%] focus:outline-none p-[5px] rounded-md my-[10px]"
					{...register("eventImage", { required: false })}
				/>
				<select
					id="eventOrg"
					className="bg-slate-200 border-none h-[50px] w-[75%] focus:outline-none p-[5px] rounded-md my-[10px]"
					{...register("eventOrg", { required: true })}
				>
					{orgSelects}
				</select>
				<input
					type="datetime-local"
					id="eventStart"
					className="bg-slate-200 border-none h-[50px] w-[75%] focus:outline-none p-[5px] rounded-md my-[10px]"
					{...register("eventStart", { required: true })}
				/>
				<input
					type="datetime-local"
					id="eventEnd"
					className="bg-slate-200 border-none h-[50px] w-[75%] focus:outline-none p-[5px] rounded-md my-[10px]"
					{...register("eventEnd", { required: true })}
				/>
				<input
					type="datetime-local"
					id="formOpen"
					className="bg-slate-200 border-none h-[50px] w-[75%] focus:outline-none p-[5px] rounded-md my-[10px]"
					{...register("formOpen", { required: true })}
				/>
				<input
					type="datetime-local"
					id="formClose"
					className="bg-slate-200 border-none h-[50px] w-[75%] focus:outline-none p-[5px] rounded-md my-[10px]"
					{...register("formEnd", { required: true })}
				/>
				<button className="bg-primary-lighter text-white h-[50px] w-[150px] rounded-xl font-bold flex items-center justify-center">
					Create Event <BsFillArrowRightCircleFill className="ml-[5px]" />
				</button>
			</form>
		</div>
	);
};

export default NewEventView;
