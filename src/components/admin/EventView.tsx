import React, { FunctionComponent } from "react";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { trpc } from "@/utils/trpc";
import type { Event } from "@prisma/client";

const columnHelper = createColumnHelper<Event>();

const columns = [
	columnHelper.accessor("name", {
		header: "Name",
	}),
	columnHelper.accessor("description", {
		header: "Description",
	}),
	columnHelper.accessor("organization", {
		header: "Org.",
	}),
	columnHelper.accessor("eventStart", {
		header: "Start",
	}),
	columnHelper.accessor("eventEnd", {
		header: "End",
	}),
	columnHelper.accessor("formOpen", {
		header: "Form Open",
	}),
	columnHelper.accessor("formClose", {
		header: "Form Close",
	}),
];

const EventView: FunctionComponent = () => {
	const events = trpc.useQuery(["events.getAll"]);

	const table = useReactTable({
		data: events.isSuccess ? events.data : [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="w-full h-full">
			<div className="p-4 bg-white rounded">
				<div className="pb-2">
					{events.isSuccess ? (
						<span className="pl-1 tracking-wide text-zinc-800 font-bold font-inter">Events</span>
					) : (
						<div className="animate-pulse p-2 h-5 bg-gray-300 rounded-full dark:bg-gray-700 w-48" />
					)}
				</div>
				<table className="text-sm">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default EventView;
