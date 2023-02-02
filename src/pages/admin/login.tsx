import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next";
import LoginForm from "@/components/admin/LoginForm";
import { setCookie } from "cookies-next";
import { cookies } from "@/utils/constants";
import RootLayout from "@/components/layout/RootLayout";
import { safeUrl } from "@/utils/helpers";
import { validateAdmin } from "@/utils/server_helpers";

export async function getServerSideProps({
	req,
	res,
	query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{}>> {
	const authenticated = await validateAdmin(req, res);

	if (authenticated)
		return {
			redirect: {
				destination: safeUrl(query.next, "/admin"),
				permanent: false,
			},
		};

	return { props: {} };
}

const Login: NextPage = () => {
	const onSubmit = (username: string, password: string) => {
		const expDate = new Date();
		expDate.setMonth(expDate.getMonth() + 3);

		setCookie(cookies.admin_username, username, { expires: expDate });
		setCookie(cookies.admin_password, password, { expires: expDate });

		// TODO: Switch to smooth transition
		window.location.reload();
	};

	return (
		<RootLayout innerClassName="justify-center items-center" authentication={{ admin: false }}>
			<LoginForm callback={(username, password) => onSubmit(username, password)} />
		</RootLayout>
	);
};

export default Login;
