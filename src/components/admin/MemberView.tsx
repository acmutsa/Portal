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
import { RowActions } from "@/components/table/RowActions";
import { useRouter } from "next/router";
import { BsPlus } from "react-icons/bs";
import Link from "next/link";

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

	const triggerDelete = (id: string) => {
		console.log(`Deleting Member ${id}`);
	};

	const router = useRouter();
	const table = useReactTable({
		data: isSuccess ? members : [],
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
							return router.push(`/admin/members/${ctx.row.original.id}`);
						}}
					/>
				),
			}),
		],
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
								<Link href="/admin/members/new">
									<button className="inline-flex h-9 justify-center items-center align-middle mx-3 p-2 pr-4 bg-green-500 hover:bg-green-600 rounded-lg text-white font-inter font-medium">
										<BsPlus className="h-6 w-6" />
										New Member
									</button>
								</Link>
								{/* TODO: Use the labels & default value options & use the human format (not id) */}
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
					<div className="inline-block pb-1 w-full">{membersTable}</div>
				</div>
			</div>
		</div>
	);
};

export default EventView;
