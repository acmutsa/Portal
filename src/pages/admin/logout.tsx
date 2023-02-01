import { cookies } from "@/utils/constants";
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next";
import { deleteCookie } from "cookies-next";

export async function getServerSideProps({
	req,
	res,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{}>> {
	// TODO: Server-side logout logic

	// Manual method: res.setHeader("Set-Cookie", serialize(cookies.admin_password, "", { maxAge: 0, path: "/" }));
	deleteCookie(cookies.admin_username, { req, res });
	deleteCookie(cookies.admin_password, { req, res });

	// The destination of the redirect must update the global context so the user's client knows it is no longer an admin.
	// As a server-based logout, we have no way to update a user's global context directly without some sort of
	// global middleware.
	return {
		redirect: {
			destination: "/admin/login",
			permanent: false,
		},
	};
}

// This page should never go anywhere or render.
const AdminLogout: NextPage = () => {
	return null;
};

export default AdminLogout;
