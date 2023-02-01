import { useRouter } from "next/router";
import { FunctionComponent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "@/components/common/GlobalContext";
import RootLayout from "@/components/layout/RootLayout";

interface LoginFormProps {
	callback: (username: string, password: string) => void;
}

const LoginForm: FunctionComponent<LoginFormProps> = ({ callback }: LoginFormProps) => {
	const { register, handleSubmit } = useForm();
	const [globalState, setGlobalState] = useGlobalContext();
	const router = useRouter();
	const onSubmit = (data: any) => {
		callback(data.username, data.password);
	};

	// Redirect immediately to base admin page. This is only for whenever someone navigates directly to /admin/login while logged in.
	useEffect(() => {
		console.log(router.route);
		if (router.route == "/admin/login" && globalState.admin) {
			router.replace("/admin");
		}
	}, [globalState]);

	return (
		<div className="p-3 pt-8">
			<div className="bg-white max-w-[25rem] self-center p-3 rounded-xl text-center flex flex-col items-center justify-center">
				<p className="text-lg md:text-[22px] tracking-wide md:tracking-normal font-semibold text-slate-700 font-raleway mb-2">
					Administrative Portal
				</p>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="min-w-[20rem] sm:w-full flex flex-col font-inter justify-start p-1 pb-2 text-left"
				>
					<label className="">
						<p className="block tracking-wide text-sm md:text-base font-medium text-slate-700">
							Username
						</p>
						<input
							type="text"
							id="username"
							{...register("username", { required: true })}
							className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
						/>
						<p className="mb-1 text-base invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
							Username required.
						</p>
					</label>
					<label>
						<span className="block text-sm md:text-base font-medium text-slate-700">Password</span>
						<input
							type="password"
							id="password"
							{...register("password", {
								required: true,
							})}
							className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
						/>
						<p className="mb-1 text-[13px] invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
							Password required.
						</p>
					</label>
					<button
						className="bg-sky-500 focus:bg-sky-600 hover:bg-sky-600 px-5 outline-none py-2 mt-1.5 md:mt-0 sm:py-2.5 text-sm
							 leading-5 rounded-md font-semibold text-white"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;
