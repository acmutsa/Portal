import "@/styles/globals.scss";
import type { AppType } from "next/dist/shared/lib/utils";
import Navbar from "@/components/Navbar";
import { GlobalContext, initialState } from "@/components/common/GlobalContext";
import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
import "nprogress/nprogress.css";
import { classNames } from "@/utils/helpers";
import { Toaster } from "react-hot-toast";
import useNProgress from "@/utils/useNProgress";

const MyApp: AppType = ({ Component, pageProps }) => {
	const [globalState, setGlobalState] = useState(initialState);
	const memberLoggedIn = trpc.member.loggedIn.useMutation();
	const adminLoggedIn = trpc.admin.loggedIn.useMutation();

	useNProgress();

	const checkAdminAuthentication = useMemo(() => {
		return () => {
			adminLoggedIn.mutate(null, {
				onSuccess: (response) => {
					setGlobalState((previousGlobalState) => {
						return { ...previousGlobalState, admin: response ?? false };
					});
				},
			});
		};
	}, [adminLoggedIn]);

	const checkMemberAuthentication = useMemo(() => {
		return () => {
			memberLoggedIn.mutate(null, {
				onSuccess: (response) => {
					setGlobalState((previousGlobalState) => {
						return { ...previousGlobalState, member: response ?? false, ready: true };
					});
				},
			});
		};
	}, [memberLoggedIn]);

	// Check whether the user is logged in or not.
	useEffect(() => {
		checkAdminAuthentication();
		checkMemberAuthentication();
	}, []);

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<GlobalContext.Provider value={[globalState, setGlobalState]}>
				<Navbar />
				<div
					className={classNames(
						globalState.background ? "bg-[url('/img/bg.png')]" : "bg-white",
						"bg-fixed bg-center bg-cover h-[calc(100vh)] overflow-y-auto"
					)}
				>
					<Toaster
						toastOptions={{
							duration: 3000,
							position: "top-right",
						}}
						containerStyle={{
							top: "calc(72px + 1rem)",
						}}
					/>
					<Component {...pageProps} />
				</div>
			</GlobalContext.Provider>{" "}
		</>
	);
};

export default trpc.withTRPC(MyApp);
