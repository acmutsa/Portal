import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { setCookie, getCookie } from "cookies-next";
import { trpc } from "../utils/trpc";

const EventView: NextPage = () => {
	const { register, handleSubmit, setValue } = useForm();

	return (
		<div className="page-view pt-[20px]">
			<div className="bg-white max-w-[800px] mx-auto min-h-[400px] rounded-xl text-center flex flex-col items-center justify-center p-[10px]">
				<h1 className="text-5xl font-extrabold font-raleway">Welcome!</h1>
				<p className="text-lg font-extrabold font-raleway mb-[40px]">Please Login Below</p>
				<form className="min-w-[400px]">
					<input
						type="email"
						placeholder="person@example.com"
						id="formClose"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md mb-[10px]"
					/>
					<input
						type="text"
						placeholder="abc123"
						id="formClose"
						className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md mb-[10px]"
					/>
				</form>
				<button className="h-[50px] w-full bg-primary-darker text-white rounded-lg font-semibold mx-[5px] mb-[5px] max-w-[300px] mt-[40px]">
					Login
				</button>
			</div>
		</div>
	);
};

export default EventView;
