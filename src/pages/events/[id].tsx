import type { NextPage } from "next";
import { useRouter } from "next/router";
import EventHeader from "../../components/events/EventHeader";

const EventView: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;

	return (
		<div className="page-view pt-[20px]">
			<EventHeader />
		</div>
	);
};

export default EventView;
