import type { NextPage } from "next";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { deleteCookie } from "cookies-next";
import { cookies } from "@/utils/constants";

export async function getServerSideProps({
	req,
	res,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{}>> {
	deleteCookie(cookies.member_email, { req, res });
	deleteCookie(cookies.member_id, { req, res });

	// The destination of the redirect must update the global context so the user's client knows it is no longer a member.
	// As a server-based logout, we have no way to update a user's global context directly without some sort of
	// global middleware.
	return {
		redirect: {
			destination: "/login",
			permanent: false,
		},
	};
}

const Logout: NextPage = () => {
	return null;
};

export default Logout;
