import { NextPage } from "next";
import LoginForm from "@/components/admin/LoginForm";
import { setCookie } from "cookies-next";

const Login: NextPage = () => {
	const onSubmit = (username: string, password: string) => {
		setCookie("admin_uname", username);
		setCookie("admin_pass", password);

		window.location.reload();
	};

	return (
		<div className="flex items-center justify-center page-view">
			<LoginForm callback={(username, password) => onSubmit(username, password)} />
		</div>
	);
};

export default Login;
