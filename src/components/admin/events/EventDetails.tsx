import React from "react";
import { format } from "date-fns";
import { Event } from "@prisma/client";
import ReactMarkdown from "react-markdown";

type EventDetailsProps = {
	event: Event;
};

export default function EventDetails({ event }: EventDetailsProps) {
	const details = [
		["Event Name", event.name],
		["Event Start", format(event.eventStart, "M/dd/yyyy h:mm a")],
		["Event End", format(event.eventEnd, "M/dd/yyyy h:mm a")],
		["Description", <ReactMarkdown>{event.description}</ReactMarkdown>],
	];

	return (
		<div className="overflow-hidden bg-white shadow sm:rounded-lg">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-base font-semibold leading-6 text-gray-900">{event.name}</h3>
				<p className="mt-1 max-w-2xl text-sm text-gray-500">
					Occurs from {format(event.eventStart, "M/dd h:mm a")} to{" "}
					{format(event.eventEnd, "M/dd h:mm a")}
				</p>
			</div>
			<div className="border-t border-gray-200">
				<dl>
					{details.map(([label, value]) => (
						<div className="bg-gray-50 even:bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">{label}</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{value}</dd>
						</div>
					))}
				</dl>
			</div>
		</div>
	);
}
