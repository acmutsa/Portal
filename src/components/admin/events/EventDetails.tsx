import { useState, Fragment } from "react";
import { format } from "date-fns";
import { Event } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { BsPencilSquare, BsDownload, BsPlus } from "react-icons/bs";
import QRCode from "react-qr-code";
import { Dialog, Transition } from "@headlessui/react";
import { trpc } from "@/utils/trpc";

type EventDetailsProps = {
	event: Event;
	qrCodeValue: string;
};

export default function EventDetails({ event, qrCodeValue }: EventDetailsProps) {
	const [isAddCheckinsOpen, setIsAddCheckinsOpen] = useState(false);
	const [textAreaValue, setTextAreaValue] = useState("");

	const details = [
		["Event Name", event.name],
		["Event Start", format(event.eventStart, "M/dd/yyyy h:mm a")],
		["Event End", format(event.eventEnd, "M/dd/yyyy h:mm a")],
		["Description", <ReactMarkdown>{event.description}</ReactMarkdown>],
	];

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

	const massMutation = trpc.admin.massCreateCheckins.useMutation();

	const handleAddCheckins = async () => {
		if (textAreaValue.length < 1) {
			return alert("To add checkins, enter at least 1 member ID in the text field.");
		}

		let res = await massMutation.mutateAsync({
			eventID: event.id,
			memberIDs: new Set(textAreaValue.toLowerCase().replace(/ /g, "").split(",")),
		});

		alert(
			`Checkins added!\n\n${res.count} of ${
				textAreaValue.toLowerCase().replace(/ /g, "").split(",").length
			} checkins added`
		);

		setTextAreaValue("");
		setIsAddCheckinsOpen(false);
	};

	return (
		<>
			<Transition appear show={isAddCheckinsOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={() => setIsAddCheckinsOpen(false)}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
										Add Check-ins
									</Dialog.Title>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											Enter one or more myUTSA IDs below to add check-ins to this event. IDs should
											be seperated by a comma and have no spaces.
										</p>
										<textarea
											className="w-full rounded mt-2 bg-gray-100"
											onChange={(e) => setTextAreaValue(e.target.value)}
											placeholder="ABC123,DEF456,GHI789"
										/>
									</div>

									<div className="mt-4">
										<button
											type="button"
											className="inline-flex h-8 md:h-9 mr-3 text-sm whitespace-nowrap md:text-base justify-center items-center align-middle px-2 bg-indigo-500 hover:bg-indigo-600 shadow-inner hover:shadow-inner-md-2 rounded-lg text-white font-inter font-medium"
											onClick={() => handleAddCheckins()}
										>
											Add
										</button>
										<button
											type="button"
											className="inline-flex h-8 md:h-9 text-sm whitespace-nowrap md:text-base mr-3 justify-center items-center align-middle px-2 bg-gray-500 hover:bg-gray-600 shadow-inner hover:shadow-inner-md-2 rounded-lg text-white font-inter font-medium"
											onClick={() => setIsAddCheckinsOpen(false)}
										>
											Close
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
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
							onClick={() => setIsAddCheckinsOpen(true)}
							className="inline-flex h-8 md:h-9 text-sm whitespace-nowrap md:text-base justify-center items-center align-middle mx-3 p-2 pr-4 bg-indigo-500 hover:bg-indigo-600 shadow-inner hover:shadow-inner-md-2 rounded-lg text-white font-inter font-medium"
						>
							<BsPlus className="h-6 w-6" />
							Add Check-ins
						</button>
						<button
							onClick={() => doQrDownload()}
							className="inline-flex h-8 md:h-9 text-sm whitespace-nowrap md:text-base justify-center items-center align-middle mx-3 p-2 pr-4 bg-indigo-500 hover:bg-indigo-600 shadow-inner hover:shadow-inner-md-2 rounded-lg text-white font-inter font-medium"
						>
							<BsDownload className="h-6 w-6 p-1" />
							QR Code
							<QRCode id="QRCode" className="hidden" value={qrCodeValue} />
						</button>
						<Link
							href={`/admin/events/${event.pageID}/modify`}
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
		</>
	);
}
