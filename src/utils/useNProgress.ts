import { useRouter } from "next/router";
import { useEffect } from "react";
import NProgress from "nprogress";

const useNProgress = () => {
	const router = useRouter();

	useEffect(() => {
		const handleStart = () => {
			NProgress.start();
		};

		const handleStop = () => {
			NProgress.done();
		};

		// Add router event listeners
		router.events.on("routeChangeStart", handleStart);
		router.events.on("routeChangeComplete", handleStop);
		router.events.on("routeChangeError", handleStop);

		return () => {
			// Remove router event listeners
			router.events.off("routeChangeStart", handleStart);
			router.events.off("routeChangeComplete", handleStop);
			router.events.off("routeChangeError", handleStop);
		};
	}, [router]);
};

export default useNProgress;
