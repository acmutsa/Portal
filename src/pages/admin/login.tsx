import { NextPage } from "next";
import LoginForm from "@/components/admin/LoginForm";
import { setCookie } from "cookies-next";
import { cookies } from "@/utils/constants";

const Login: NextPage = () => {
	const onSubmit = (username: string, password: string) => {
		setCookie(cookies.admin_username, username);
		setCookie(cookies.admin_password, password);

		window.location.reload();
	};

	return (
		<div className="flex items-center justify-center page-view">
			<LoginForm callback={(username, password) => onSubmit(username, password)} />
		</div>
	);
};

export default Login;
