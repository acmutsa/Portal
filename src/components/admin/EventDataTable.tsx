import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";

const preventDefault = (e: Event) => e.preventDefault();
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

const EventDataTable = () => {
	const [selectedEvents, setSelectedEvents] = useState(null);
	const { data: events } = trpc.events.getAll.useQuery();

	return (
		<DataTable
			id="events"
			rowHover
			onSelectionChange={(e) => setSelectedEvents(e.value)}
			selection={selectedEvents}
			responsiveLayout="scroll"
			value={events}
			selectionAriaLabel="name"
			size="small"
			paginator
			rows={10}
			rowsPerPageOptions={[10, 25, 50, 100]}
			dataKey="event.id"
			currentPageReportTemplate="Showing {first} through {last} of {totalRecords} total events"
			paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
		>
			<Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
			<Column sortable filter field="name" header="Name"></Column>
			<Column field="description" header="Description"></Column>
			<Column filter field="organization" header="Organization"></Column>
			<Column sortable filter field="location" header="Major"></Column>
		</DataTable>
	);
};

export default EventDataTable;
