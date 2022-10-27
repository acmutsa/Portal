import type { NextPage } from "next";
import { useEffect } from "react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/components/state/global";

const Logout: NextPage = () => {
	const router = useRouter();
	const [globalState, setGlobalState] = useGlobalContext();
	useEffect(() => {
		deleteCookie("member_email");
		deleteCookie("member_shortID");
		setGlobalState({ ...globalState, loggedIn: false });
		router.replace("/");
	}, []);

	return <>If you see this, something went wrong while logging you out.</>;
};

export default Logout;
