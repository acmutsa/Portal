import React, { FunctionComponent } from "react";
import type { Member } from "@prisma/client";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { trpc } from "@/utils/trpc";
import Stat from "@/components/common/Stat";
import { formatDateCell, pluralize } from "@/utils/helpers";
import VisibilityDropdown from "@/components/table/VisibilityDropdown";
const columnHelper = createColumnHelper<Member>();

const columns = [
	columnHelper.accessor("id", {
		header: "ID",
	}),
	columnHelper.accessor("name", {
		header: "Name",
		size: 200,
	}),
	columnHelper.accessor("email", {
		header: "Email Address",
		size: 300,
	}),
	columnHelper.accessor("joinDate", {
		header: "Join Date",
		size: 240,
		cell: (info) => formatDateCell(info.getValue()),
	}),
];

const EventView: FunctionComponent = () => {
	const { isSuccess, data: members } = trpc.useQuery(["member.getAll"], {
		refetchOnWindowFocus: false,
	});

	const table = useReactTable({
		data: isSuccess ? members : [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		columnResizeMode: "onChange",
		enableColumnResizing: true,
	});

	const membersTable = (
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
					<Stat label="Total Members" value={members?.length} />
					<Stat label="Active Members" value={members?.length} />
					<Stat label="Inactive Members" value={members?.length} />
				</div>
			</div>
			<div className="p-4 bg-white rounded-lg border-zinc-200 border-[1px]">
				<div className="w-full pb-2">
					{isSuccess ? (
						<div className="flex justify-start font-inter">
							<span className="text-xl tracking-wide text-zinc-800 font-bold my-auto">Members</span>
							<span className="ml-2 px-2 pt-0.5 text-zinc-600 text-sm my-auto">
								viewing {members.length} member{pluralize(members.length)}
							</span>
							<div className="grow" />
							<div className="justify-self-end">
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
				<div className="overflow-scroll overflow-x-auto border-box ">
					<div className="inline-block pb-1">{membersTable}</div>
				</div>
			</div>
		</div>
	);
};

export default EventView;
