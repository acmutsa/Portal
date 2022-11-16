import { FunctionComponent, useState, useEffect } from "react";
import public_config from "@/config/public_config.json";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";

// const Home: NextPage = () => {
//   const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

const NewMemberView: FunctionComponent = () => {
	// const orgs = public_config.organizations;
	// const orgSelects = [];
	// for (let org of orgs) {
	// 	console.log(org);
	// 	orgSelects.push(
	// 		<option key={org} value={org}>
	// 			{org}
	// 		</option>
	// 	);
	// }

	// let r = trpc.useMutation(["admin.createEvent"]);

	const { register, handleSubmit, setValue } = useForm();
	const didSubmit = async (p: any) => {
		let data = p;

		// const ret = r.mutate({
		// 	eventName: data.eventName,
		// 	eventDescription: data.eventDescription,
		// 	eventImage: data.eventImage,
		// 	eventOrg: data.eventOrg,
		// 	eventLocation: data.eventLocation,
		// 	eventStart: new Date(data.eventStart),
		// 	eventEnd: new Date(data.eventEnd),
		// 	formOpen: new Date(data.formOpen),
		// 	formClose: new Date(data.formClose),
		// });
		// console.log(ret);
	};

	return (
		<div className="w-full h-full p-[5px]">
			<h1 className="text-5xl font-extrabold font-raleway max-w-[800px] mx-auto mb-[15px]">
				New Member
			</h1>
			<form
				onSubmit={handleSubmit(didSubmit)}
				className="w-full flex flex-col mx-auto max-w-[800px] "
			>
				<p className="text-sm">Member Info</p>
				<div className="border-2 p-[5px] rounded-md">
					<input
						id="memberName"
						type="text"
						placeholder="Name"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md my-[10px]"
						{...register("eventName", { required: true })}
					/>
					<input
						id="memberEmail"
						type="text"
						placeholder="Email"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md my-[10px]"
						{...register("memberEmail", { required: false })}
					/>
					<input
						type="text"
						id="memberID"
						minLength={6}
						maxLength={6}
						placeholder="abc123"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md my-[10px]"
						{...register("memberID", { required: true, minLength: 6, maxLength: 6 })}
					/>
				</div>
				<p className="text-sm mt-[15px]">Academic Info</p>
				<div className="border-2 p-[5px] rounded-md">
					<input
						id="memberMajor"
						type="text"
						placeholder="Major"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md my-[10px]"
						{...register("memberMajor", { required: true })}
					/>
					<label htmlFor="eventOrg" className="text-sm">
						Classification
					</label>
					<select
						id="eventOrg"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md mb-[10px]"
						{...register("eventOrg", { required: true })}
					>
						<option value="Freshman">Freshman</option>
						<option value="Sophmore">Sophmore</option>
						<option value="Junior">Junior</option>
						<option value="Senior">Senior</option>
						<option value="Graduate">Graduate</option>
					</select>
					<input
						id="memberGradDate"
						type="text"
						placeholder="Expected Graduation Date (MM/YYYY)"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md my-[10px]"
						{...register("memberGradDate", { required: true })}
					/>
				</div>
				<p className="text-sm mt-[15px]">Personal Info</p>
				<div className="border-2 p-[5px] rounded-md mb-[5px]">
					<label htmlFor="memberBirthday" className="text-sm">
						Birthday
					</label>
					<input
						type="datetime-local"
						id="memberBirthday"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md mb-[10px]"
						{...register("memberBirthday", { required: true })}
					/>
					<label htmlFor="eventOrg" className="text-sm">
						Identity
					</label>
					<select
						id="eventOrg"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md mb-[10px]"
						{...register("eventOrg", { required: true })}
					>
						<option value="Freshman">Male</option>
						<option value="Sophmore">Female</option>
						<option value="Junior">Non-Binary</option>
						<option value="Junior">Transgender</option>
						<option value="Senior">Intersex</option>
						<option value="Graduate">Prefer Not To Say</option>
						<option value="Graduate">Other</option>
					</select>
				</div>
				<button className="bg-primary-light text-white h-[50px] w-[150px] rounded-xl ml-auto font-bold flex items-center justify-center align-center mt-[15px]">
					Create Member <BsFillArrowRightCircleFill className="ml-[5px]" />
				</button>
			</form>
		</div>
	);
};

export default NewMemberView;
