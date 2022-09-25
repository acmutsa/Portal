import type { NextPage } from "next";
import { useRouter } from "next/router";
import EventHeader from "../../components/events/EventHeader";
import EventDescription from "../../components/events/EventDescription";

const EventView: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;

	return (
		<div className="page-view pt-[20px]">
			<EventHeader />
			<br />
			<EventDescription description="This is a event!" calanderLink="https://acmutsa.org/" />
		</div>
	);
};

export default EventView;
