import { NextPage } from "next";
import LoginForm from "@/components/admin/LoginForm";
import { setCookie } from "cookies-next";
import { cookies } from "@/utils/constants";

const Login: NextPage = () => {
	const onSubmit = (username: string, password: string) => {
		const expDate = new Date();
		expDate.setMonth(expDate.getMonth() + 3);

		setCookie(cookies.admin_username, username, { expires: expDate });
		setCookie(cookies.admin_password, password, { expires: expDate });

		window.location.reload();
	};

	return (
		<div className="flex items-center justify-center page-view">
			<LoginForm callback={(username, password) => onSubmit(username, password)} />
		</div>
	);
};

export default Login;
