import "@/styles/globals.css";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import type { AppRouter } from "@/server/router";
import Navbar from "@/components/navbar";
import Head from "next/head";
import { GlobalContext, initialState } from "@/components/state/global";
import { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";

const MyApp: AppType = ({ Component, pageProps }) => {
	const [globalState, setGlobalState] = useState(initialState);
	const loggedIn = trpc.useMutation(["member.loggedIn"]);

	useEffect(() => {
		loggedIn.mutate(null, {
			onSuccess: (response) => {
				setGlobalState({ ...globalState, loggedIn: response ?? false });
			},
		});
	}, []);

	return (
		<>
			<Head>
				<title>ACM Membership Portal</title>
			</Head>
			<GlobalContext.Provider value={[globalState, setGlobalState]}>
				<Navbar />
				<div
					className={`${
						globalState.background ? "bg-[url('/img/bg.png')]" : "bg-white"
					} bg-fixed bg-center bg-cover`}
				>
					<Component {...pageProps} />
					<p className="absolute bottom-0 w-full text-center text-[10px] mx-auto text-white">
						Made with &lt;/&gt; @ ACM UTSA
						<br />© Association of Computing Machinery at UTSA {new Date().getFullYear()}. All
						Rights Reserved.
					</p>
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
