import React, { FunctionComponent, useMemo } from "react";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { trpc } from "@/utils/trpc";
import type { Event } from "@prisma/client";
import { formatDateCell, pluralize } from "@/utils/helpers";
import Stat from "@/components/common/Stat";
import VisibilityDropdown from "@/components/table/VisibilityDropdown";
import { useRouter } from "next/router";
import { RowActions } from "@/components/table/RowActions";
import { BsPlus } from "react-icons/bs";
import Link from "next/link";
import { isAfter } from "date-fns";

const columnHelper = createColumnHelper<Event>();
const columns = [
	columnHelper.accessor("name", {
		header: "Name",
		size: 200,
	}),
	columnHelper.accessor("description", {
		header: "Description",
		minSize: 200,
		maxSize: 500,
		cell: (info) => (
			<div className="text-ellipsis overflow-hidden max-h-[5rem]">{info.getValue()}</div>
		),
	}),
	columnHelper.accessor("organization", {
		header: "Org.",
		minSize: 30,
		size: 30,
	}),
	columnHelper.accessor("eventStart", {
		header: "Event Start",
		cell: (info) => formatDateCell(info.getValue()),
	}),
	columnHelper.accessor("eventEnd", {
		header: "Event End",
		cell: (info) => formatDateCell(info.getValue()),
	}),
	columnHelper.accessor("formOpen", {
		header: "Form Open",
		cell: (info) => formatDateCell(info.getValue()),
	}),
	columnHelper.accessor("formClose", {
		header: "Form Close",
		cell: (info) => formatDateCell(info.getValue()),
	}),
];

const EventView: FunctionComponent = () => {
	const events = trpc.useQuery(["events.getAll"], { refetchOnWindowFocus: false });
	const router = useRouter();

	const [upcomingEvents, pastEvents] = useMemo(() => {
		const now = new Date();
		if (events.isFetched) {
			const upcoming = events.data!.filter((e) => isAfter(e.eventStart, now)).length;
			return [upcoming, events.data!.length - upcoming];
		}
		return [null, null];
	}, [events]);

	const triggerDelete = (id: string) => {
		console.log(`Deleting Event ${id}`);
	};

	const table = useReactTable({
		data: events.isSuccess ? events.data : [],
		columns: [
			...columns,
			columnHelper.display({
				id: "actions",
				header: "Actions",
				minSize: 200,
				cell: (ctx) => (
					<RowActions
						onDelete={() => {
							triggerDelete(ctx.row.original.id);
						}}
						onEdit={() => {
							return router.push(`/admin/events/${ctx.row.original.id}`);
						}}
					/>
				),
			}),
		],
		getCoreRowModel: getCoreRowModel(),
		columnResizeMode: "onChange",
		enableColumnResizing: true,
	});

	const eventsTable = (
		<table className="text-sm max-h-[150rem]">
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<th
								{...{
									key: header.id,
									colSpan: header.colSpan,
									style: {
										width: header.getSize(),
									},
								}}
							>
								{header.isPlaceholder
									? null
									: flexRender(header.column.columnDef.header, header.getContext())}
								<div
									{...{
										onMouseDown: header.getResizeHandler(),
										onTouchStart: header.getResizeHandler(),
										className: `resizer ${header.column.getIsResizing() ? "isResizing" : ""}`,
									}}
								/>
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody>
				{table.getRowModel().rows.map((row) => (
					<tr key={row.id}>
						{row.getVisibleCells().map((cell) => (
							<td
								{...{
									key: cell.id,
									style: {
										width: cell.column.getSize(),
									},
								}}
							>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);

	return (
		<div className="w-full h-full">
			<div className="flex w-full">
				<div className="flex gap-10 justify-start my-2 p-4 bg-white border-zinc-200 border-[1px] rounded-lg">
					{/* TODO: Create truly useful statistics or implement the logic behind these ones. */}
					<Stat label="Total Events" value={events.data?.length} />
					<Stat label="Upcoming Events" value={upcomingEvents} />
					<Stat label="Past Events" value={pastEvents} />
				</div>
			</div>
			<div className="p-4 bg-white rounded-lg border-zinc-200 border-[1px]">
				<div className="w-full pb-2">
					{events.isSuccess ? (
						<div className="flex justify-start font-inter">
							<span className="text-xl tracking-wide text-zinc-800 font-bold my-auto">Events</span>
							<span className="ml-2 px-2 pt-0.5 text-zinc-600 text-sm my-auto overflow-hidden overflow-ellipsis whitespace-nowrap">
								viewing {events.data.length} event{pluralize(events.data.length)}
							</span>
							<div className="grow" />
							<div className="justify-self-end">
								<Link href="/admin/events/new">
									<button className="inline-flex h-8 md:h-9 text-sm whitespace-nowrap md:text-base justify-center items-center align-middle mx-3 p-2 pr-4 bg-indigo-500 hover:bg-indigo-600 shadow-inner hover:shadow-inner-md-2 rounded-lg text-white font-inter font-medium">
										<BsPlus className="h-6 w-6" />
										New Event
									</button>
								</Link>
								{/* TODO: Use the labels & default value options to disable form open/close & use the human format (not id) */}
								<VisibilityDropdown
									onColumnChange={(visibilityState) => {
										table.setState((prev) => ({ ...prev, columnVisibility: visibilityState }));
									}}
									columns={table.getAllLeafColumns().map((column) => ({ id: column.id }))}
								/>
							</div>
						</div>
					) : (
						<div className="animate-pulse p-2 h-5 bg-gray-300 rounded-full dark:bg-gray-700 w-48" />
					)}
				</div>
				<div className="overflow-scroll overflow-x-auto border-box">
					<div className="inline-block pb-1 w-full">{eventsTable}</div>
				</div>
			</div>
		</div>
	);
};

export default EventView;
