import type { NextPage } from "next";
import { useGlobalContext } from "@/components/state/global";
import { useEffect } from "react";

const Status: NextPage = () => {
	const [globalState, setGlobalState] = useGlobalContext();

	useEffect(() => {
		setGlobalState({ ...globalState, background: false });
		return () => {
			setGlobalState({ ...globalState, background: true });
		};
	}, []);

	return (
		<div className="page-view">
			<h1>View Member Status</h1>
		</div>
	);
};

export default Status;
