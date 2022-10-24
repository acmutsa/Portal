import { NextPage } from "next";
import LoginForm from "@/components/admin/loginForm";
import { setCookie } from "cookies-next";

const Login: NextPage = () => {
	const pressedSubmit = (username: string, password: string) => {
		setCookie("admin_uname", username);
		setCookie("admin_pass", password);

		window.location.reload();
	};

	return (
		<div className="flex items-center justify-center page-view">
			<LoginForm callback={(username, password) => pressedSubmit(username, password)} />
		</div>
	);
};

export default Login;
