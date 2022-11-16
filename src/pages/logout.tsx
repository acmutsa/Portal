import type { NextPage } from "next";
import { useEffect } from "react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/components/common/GlobalContext";

const Logout: NextPage = () => {
	const router = useRouter();
	const [globalState, setGlobalState] = useGlobalContext();
	useEffect(() => {
		deleteCookie("member_email");
		deleteCookie("member_shortID");
		setGlobalState({ ...globalState, member: false });
		router.replace("/login");
	}, []);

	return (
		<div className="page-view bg-darken">
			<div className="late-fade-in bg-white p-1.5 mx-auto m-2 max-w-[20rem] rounded">
				<div className="text-center">
					If you see this, something may have went wrong while logging you out.
					<button
						className="text-primary-lighter font-inter font-medium px-2"
						onClick={() => window.location.reload()}
					>
						Reload?
					</button>
				</div>
			</div>
		</div>
	);
};

export default Logout;
