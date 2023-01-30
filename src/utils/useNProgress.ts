import { useRouter } from "next/router";
import { useEffect } from "react";
import NProgress from "nprogress";

const useNProgress = () => {
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
};

export default useNProgress;
