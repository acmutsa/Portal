import React, { FunctionComponent } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { format } from "date-fns";
import { trpc } from "@/utils/trpc";
import type { Event } from "@prisma/client";
import { pluralize } from "@/utils/helpers";
import Stat from "@/components/common/Stat";

const columnHelper = createColumnHelper<Event>();

const formatDateCell = (value: Date) => {
  const hoverText = format(value, "EEEE, LLL do, yyyy 'at' h:mm:ss aaaa");
  const shortText = format(value, "y/MM/dd h:mma z");
  return (
    <span className="whitespace-nowrap bg-slate-300 p-1 rounded-lg font-medium" title={hoverText}>
			{shortText}
		</span>
  );
};

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    size: 200
  }),
  columnHelper.accessor("description", {
    header: "Description",
    minSize: 200,
    maxSize: 500,
    cell: (info) => (
      <div className="text-ellipsis overflow-hidden max-h-[5rem]">{info.getValue()}</div>
    )
  }),
  columnHelper.accessor("organization", {
    header: "Org.",
    minSize: 30,
    size: 30
  }),
  columnHelper.accessor("eventStart", {
    header: "Start",
    cell: (info) => formatDateCell(info.getValue())
  }),
  columnHelper.accessor("eventEnd", {
    header: "End",
    cell: (info) => formatDateCell(info.getValue())
  }),
  columnHelper.accessor("formOpen", {
    header: "Form Open",
    cell: (info) => formatDateCell(info.getValue())
  }),
  columnHelper.accessor("formClose", {
    header: "Form Close",
    cell: (info) => formatDateCell(info.getValue())
  })
];

const EventView: FunctionComponent = () => {
  const events = trpc.useQuery(["events.getAll"]);

  const table = useReactTable({
    data: events.isSuccess ? events.data : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    enableColumnResizing: true
  });

  const eventsTable = <table className="text-sm max-h-[150rem]">
    <thead>
    {table.getHeaderGroups().map((headerGroup) => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <th
            {...{
              key: header.id,
              colSpan: header.colSpan,
              style: {
                width: header.getSize()
              }
            }}
          >
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
            <div
              {...{
                onMouseDown: header.getResizeHandler(),
                onTouchStart: header.getResizeHandler(),
                className: `resizer ${header.column.getIsResizing() ? "isResizing" : ""}`
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
                width: cell.column.getSize()
              }
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ))}
    </tbody>
  </table>;

  return (
    <div className="w-full h-full">
      <div className="flex w-full">
        <div className="flex gap-10 justify-start my-2 p-4 bg-white border-zinc-200 border-[1px] rounded-lg">
          {/* TODO: Create truly useful statistics or implement the logic behind these ones. */}
          <Stat label="Total Events" value={events.data?.length} />
          <Stat label="Upcoming Events" value={events.data?.length} />
          <Stat label="Past Events" value={events.data?.length} />
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg border-zinc-200 border-[1px]">
        <div className="pb-2">
          {events.isSuccess ? (
            <div className="flex justify-start font-inter">
              <span className="text-lg tracking-wide text-zinc-800 font-bold">Events</span>
              <span className="ml-2 px-2 text-zinc-600 text-xs my-auto">
                viewing {events.data.length} event{pluralize(events.data.length)}
              </span>
            </div>
          ) : (
            <div className="animate-pulse p-2 h-5 bg-gray-300 rounded-full dark:bg-gray-700 w-48" />
          )}
        </div>
        <div className="overflow-scroll overflow-x-auto border-box ">
          <div className="inline-block pb-1">
            {eventsTable}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventView;
