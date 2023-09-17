import type { AppType } from "next/dist/shared/lib/utils";
import { GlobalContext, initialState } from "@/components/common/GlobalContext";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
import useNProgress from "@/utils/useNProgress";
import { Analytics } from "@vercel/analytics/react";
import "@/styles/globals.scss";
import "nprogress/nprogress.css"; // CSS for nProgress, adds the app-wide progress bar.

const MyApp: AppType = ({ Component, pageProps }) => {
	const [globalState, setGlobalState] = useState(initialState);
	useNProgress();

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<GlobalContext.Provider value={[globalState, setGlobalState]}>
				<Component {...pageProps} />
				<Analytics />
			</GlobalContext.Provider>{" "}
		</>
	);
};

export default trpc.withTRPC(MyApp);
