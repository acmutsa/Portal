import React from "react";
import { format } from "date-fns";
import { Event } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { BsPencilSquare, BsDownload } from "react-icons/bs";
import QRCode from "react-qr-code";

type EventDetailsProps = {
	event: Event;
	qrCodeValue: string;
};

export default function EventDetails({ event, qrCodeValue }: EventDetailsProps) {
	const details = [
		["Event Name", event.name],
		["Event Start", format(event.eventStart, "M/dd/yyyy h:mm a")],
		["Event End", format(event.eventEnd, "M/dd/yyyy h:mm a")],
		["Description", <ReactMarkdown>{event.description}</ReactMarkdown>],
	];

	// A little bit hacky but it works
	const doQrDownload = () => {
		const svg = document.getElementById("QRCode");
		const svgData = new XMLSerializer().serializeToString(svg as HTMLElement);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx?.drawImage(img, 0, 0);
			const pngFile = canvas.toDataURL("image/png");
			const downloadLink = document.createElement("a");
			downloadLink.download = `checkin-QR-${event.pageID}`;
			downloadLink.href = `${pngFile}`;
			downloadLink.click();
		};
		img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
	};

	return (
		<div className="overflow-hidden bg-white shadow sm:rounded-lg">
			<div className="px-4 py-5 sm:px-6 flex items-center">
				<div className="w-[70%] h-full">
					<h3 className="text-base font-semibold leading-6 text-gray-900">{event.name}</h3>
					<p className="mt-1 max-w-2xl text-sm text-gray-500">
						Occurs from {format(event.eventStart, "M/dd h:mm a")} to{" "}
						{format(event.eventEnd, "M/dd h:mm a")}
					</p>
				</div>
				<div className="w-[30%] h-full flex items-center justify-end">
					<button
						onClick={() => doQrDownload()}
						className="inline-flex h-8 md:h-9 text-sm whitespace-nowrap md:text-base justify-center items-center align-middle mx-3 p-2 pr-4 bg-indigo-500 hover:bg-indigo-600 shadow-inner hover:shadow-inner-md-2 rounded-lg text-white font-inter font-medium"
					>
						<BsDownload className="h-6 w-6 p-1" />
						QR Code
						<QRCode id="QRCode" className="hidden" value={qrCodeValue} />
					</button>
					<Link
						href="/admin/events/new"
						className="inline-flex h-8 md:h-9 text-sm whitespace-nowrap md:text-base justify-center items-center align-middle mx-3 p-2 pr-4 bg-indigo-500 hover:bg-indigo-600 shadow-inner hover:shadow-inner-md-2 rounded-lg text-white font-inter font-medium"
					>
						<BsPencilSquare className="h-6 w-6 p-1" />
						Modify
					</Link>
				</div>
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
