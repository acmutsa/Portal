"use client";

import { ReactNode } from "react";

export function NProgressProvider({ children }: { children: ReactNode }): JSX.Element {
	/*

	TODO: Re-enable this once Router Events are made available.

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
	*/

	return <>{children}</>;
}
