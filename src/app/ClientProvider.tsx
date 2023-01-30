"use client";

import superjson from "superjson";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { useState } from "react";
import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@/server/router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { getBaseUrl } from "@/utils/trpc";

export const trpc = createTRPCReact<AppRouter>({
	unstable_overrides: {
		useMutation: {
			async onSuccess(opts) {
				await opts.originalFn();
				await opts.queryClient.invalidateQueries();
			},
		},
	},
});

export function ClientProvider(props: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				loggerLink({
					enabled: () => true,
				}),
				httpBatchLink({
					url: `${getBaseUrl()}/api/trpc`,
				}),
			],
			transformer: superjson,
		})
	);
	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
		</trpc.Provider>
	);
}
