// src/utils/trpc.ts
import type { AppRouter } from "@/server/router";
import { createTRPCNext } from "@trpc/next";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { loggerLink } from "@trpc/client/links/loggerLink";

function getBaseUrl() {
	if (typeof window !== "undefined")
		// browser should use relative path
		return "";
	// reference for railway.app
	if (process.env.APP_URL) return process.env.APP_URL;
	if (process.env.VERCEL_URL)
		// reference for vercel.com
		return `https://${process.env.VERCEL_URL}`;
	if (process.env.RENDER_INTERNAL_HOSTNAME)
		// reference for render.com
		return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
	// assume localhost
	return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
	config({ ctx }) {
		return {
			transformer: superjson,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			queryClientConfig: {
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
					},
				},
			},
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === "development" ||
						(opts.direction === "down" && opts.result instanceof Error),
				}),
				httpBatchLink({
					/**
					 * If you want to use SSR, you need to use the server's full URL
					 * @link https://trpc.io/docs/ssr
					 **/
					url: `${getBaseUrl()}/api/trpc`,
				}),
			],
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 **/
	ssr: false,
});
