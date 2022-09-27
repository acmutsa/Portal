import type { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiGooglecalendar } from "react-icons/si";
import QRCode from "react-qr-code";

interface EventDescriptionProps {
	description: string;
	calanderLink: string;
}

export const EventDescription: FunctionComponent<EventDescriptionProps> = ({
	description,
	calanderLink,
}) => {
	return (
		<div className="bg-white mx-auto max-w-[1200px] min-h-[400px] rounded-xl p-[10px]">
			<div className="grid grid-cols-4 w-full min-h-[400px]">
				<div className="col-span-3 pr-[15px] py-[20px]">
					<div className="prose prose-md max-w-none font-raleway font-semibold">
						<h2 className="border-b-2 mb-1">Description</h2>
						<ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
						<h2 className="border-b-2 mb-1">About ACM</h2>
						<p>
							ACM is the premier organization on campus for students interested in technology. ACM
							is dedicated to providing members with opportunities for professional, academic, and
							social growth outside the classroom in order to prepare students for their career in
							tech or fuel their interest in the tech field. Anyone who has an interest in
							technology can join ACM.
						</p>
					</div>
				</div>
				<div className="border-l-2">
					<h2 className="text-center font-bold">Actions</h2>
					<button className="h-[50px] w-full bg-primary-darker text-white rounded-lg font-semibold mx-[5px] mb-[5px]">
						Check-in
					</button>
					<a href={calanderLink} target="_blank">
						<button className="h-[50px] w-full bg-[#5484ED] text-white rounded-lg font-semibold mx-[5px] mb-[5px] flex items-center justify-center">
							<SiGooglecalendar className="mr-[5px] w-[20px] h-[20px]" />
							Add To Google Calander
						</button>
					</a>
					<QRCode className="mx-auto" value={"acmutsa.org"} style={{ transform: "scale(0.7)" }} />
				</div>
			</div>
		</div>
	);
};

export default EventDescription;
