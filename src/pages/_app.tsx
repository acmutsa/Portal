import "@/styles/globals.css";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import type { AppRouter } from "@/server/router";
import Navbar from "@/components/Navbar";
import { GlobalContext, initialState } from "@/components/common/GlobalContext";
import { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
import NProgress from "nprogress";
import 'nprogress/nprogress.css'
import { useRouter } from "next/router";

const MyApp: AppType = ({ Component, pageProps }) => {
	const [globalState, setGlobalState] = useState(initialState);
	const loggedIn = trpc.useMutation(["member.loggedIn"]);

	const router = useRouter();
	useEffect(() => {
		const handleStart = (url: string) => {
			console.log(`Loading: ${url}`)
			NProgress.start()
		}

		const handleStop = () => {
			NProgress.done()
		}

		router.events.on('routeChangeStart', handleStart)
		router.events.on('routeChangeComplete', handleStop)
		router.events.on('routeChangeError', handleStop)

		return () => {
			router.events.off('routeChangeStart', handleStart)
			router.events.off('routeChangeComplete', handleStop)
			router.events.off('routeChangeError', handleStop)
		}
	}, [router])

	useEffect(() => {
		loggedIn.mutate(null, {
			onSuccess: (response) => {
				setGlobalState({ ...globalState, loggedIn: response ?? false, ready: true });
			},
		});
	}, []);

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<GlobalContext.Provider value={[globalState, setGlobalState]}>
				<Navbar />
				<div
					className={`${
						globalState.background ? "bg-[url('/img/bg.png')]" : "bg-white"
					} bg-fixed bg-center bg-cover h-[calc(100vh-72px)] overflow-y-auto`}
				>
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
