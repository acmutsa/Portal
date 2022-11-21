import { FunctionComponent } from "react";
import Image from "next/image";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { FieldValues, useForm } from "react-hook-form";
// import TextField from "@material-ui/core/TextField";

interface LoginFormProps {
	callback: (username: string, password: string) => void;
}

const LoginForm: FunctionComponent<LoginFormProps> = (props) => {
	const { register, handleSubmit } = useForm();
	const didSubmit = (p: any) => props.callback(p.admin_uname, p.admin_pass);

	return (
		<div className="w-full max-w-[500px] h-full max-h-[600px] shadow-2xl rounded-xl bg-white flex flex-col justify-center items-center">
			<Image src="/img/logo.png" width={128} height={128} />
			<h1 className="font-bold text-xl mb-[20%] mt-[10px]">Officer Login</h1>
			<form
				onSubmit={handleSubmit(didSubmit)}
				className="flex flex-col justify-center items-center w-full"
			>
				<input
					type="text"
					id="admin_uname"
					placeholder="Username"
					className="bg-slate-200 border-none h-[50px] w-[75%] focus:outline-none p-[5px] rounded-md my-[10px]"
					{...register("admin_uname", { required: true })}
				/>
				<input
					type="password"
					id="admin_pass"
					placeholder="Password"
					className="bg-slate-200 border-none h-[50px] w-[75%] focus:outline-none p-[5px] rounded-md my-[10px]"
					{...register("admin_pass", { required: true })}
				/>
				<div className="flex justify-start w-[75%] mt-[10px]">
					<button className="bg-secondary text-white h-[50px] w-[100px] rounded-xl font-bold flex items-center justify-center">
						Sign in <BsFillArrowRightCircleFill className="ml-[5px]" />
					</button>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
