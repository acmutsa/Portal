import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { FunctionComponent, useState } from "react";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import { Event } from "@prisma/client";
import { useRouter } from "next/router";

export type EventWithCount = Event & { checkinCount: number };

export const preventDefault = (e: { preventDefault: () => void }) => e.preventDefault();

const mouseLeaveHandler = (e: React.MouseEvent<HTMLDivElement>) => {
	document.removeEventListener("wheel", preventDefault, false);
};
const mouseEnterHandler = (e: React.MouseEvent<HTMLDivElement>) => {
	document.addEventListener("wheel", preventDefault, {
		passive: false,
	});
};
const wheelHandler = (e: React.WheelEvent<HTMLDivElement>) => {
	if (e.deltaY > 0 || e.deltaX > 0) e.currentTarget.scrollLeft += 10;
	else e.currentTarget.scrollLeft -= 10;
	e.preventDefault();
};

const scrollHandlers = {
	onWheel: wheelHandler,
	onMouseEnter: mouseEnterHandler,
	onMouseLeave: mouseLeaveHandler,
};

const EventDataTable: FunctionComponent<{ data: EventWithCount[] }> = ({ data }) => {
	const [selectedEvents, setSelectedEvents] = useState(null);
	const router = useRouter();
	return (
		<DataTable
			id="events"
			rowHover
			onSelectionChange={(e) => setSelectedEvents(e.value)}
			selection={selectedEvents}
			onRowClick={({ data: { pageID } }) => {
				router.push(`/admin/events/${pageID}`).then();
			}}
			rowClassName={() => "cursor-pointer"}
			responsiveLayout="scroll"
			value={data}
			selectionAriaLabel="name"
			size="small"
			paginator
			rows={10}
			rowsPerPageOptions={[10, 25, 50, 100]}
			dataKey="id"
			currentPageReportTemplate="Showing {first} through {last} of {totalRecords} total events"
			paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
		>
			<Column headerStyle={{ width: "2em" }} />
			<Column sortable filter field="name" header="Name" />
			<Column field="description" header="Description" />
			<Column filter field="organization" header="Organization" />
			<Column sortable filter field="location" header="Location" />
			<Column sortable field="checkinCount" header="Checkins" />
		</DataTable>
	);
};

export default EventDataTable;
