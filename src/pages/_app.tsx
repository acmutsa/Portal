import "@/styles/globals.scss";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import type { AppRouter } from "@/server/router";
import Navbar from "@/components/Navbar";
import { GlobalContext, initialState } from "@/components/common/GlobalContext";
import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useRouter } from "next/router";
import { classNames } from "@/utils/helpers";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
	const [globalState, setGlobalState] = useState(initialState);
	const memberLoggedIn = trpc.useMutation(["member.loggedIn"]);
	const adminLoggedIn = trpc.useMutation(["admin.loggedIn"]);

	// Setup progress bar router-based listeners
	const router = useRouter();
	useEffect(() => {
		const handleStart = () => {
			NProgress.start();
		};

		const handleStop = () => {
			NProgress.done();
		};

		router.events.on("routeChangeStart", handleStart);
		router.events.on("routeChangeComplete", handleStop);
		router.events.on("routeChangeError", handleStop);

		return () => {
			router.events.off("routeChangeStart", handleStart);
			router.events.off("routeChangeComplete", handleStop);
			router.events.off("routeChangeError", handleStop);
		};
	}, [router]);

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
			</GlobalContext.Provider>
		</>
	);
};

const getBaseUrl = () => {
	if (typeof window !== "undefined") return ""; // browser should use relative url
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`;

		return {
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === "development" ||
						(opts.direction === "down" && opts.result instanceof Error),
				}),
				httpBatchLink({ url }),
			],
			url,
			transformer: superjson,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },

			// To use SSR properly you need to forward the client's headers to the server
			// headers: () => {
			//   if (ctx?.req) {
			//     const headers = ctx?.req?.headers;
			//     delete headers?.connection;
			//     return {
			//       ...headers,
			//       "x-ssr": "1",
			//     };
			//   }
			//   return {};
			// }
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(MyApp);
