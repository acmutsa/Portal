import { NextPage } from "next";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { readFileSync } from "fs";
import path from "path";
import OpenGraph from "@/components/common/OpenGraph";
import Head from "next/head";
import useOpenGraph from "@/components/common/useOpenGraph";

interface TosProps {
	text: string;
}

const lastUpdated = new Date("11-20-2022");

export function getStaticProps() {
	const text = readFileSync(path.resolve(process.cwd(), "./src/utils/tos.md"), "utf-8");
	return { props: { text } };
}

const TermsOfService: NextPage<TosProps> = ({ text }: TosProps) => {
	const ogp = useOpenGraph({
		title: "Terms of Service",
		description:
			"Usage of our membership website comes with a number of terms concerning your data and privacy.",
		url: "/terms-of-service",
	});

	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<div className="page-view bg-darken !py-0 font-inter">
				<div className="min-h-[100vh] max-w-[40rem] w-[70%] px-10 py-20 bg-gray-100 mx-auto">
					<div className="px-4 sm:px-6 lg:px-8">
						<div className="relative mx-auto max-w-[37.5rem] pt-20 text-center pb-24">
							<h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
								Privacy policy
							</h1>
							<p className="mt-4 text-base leading-7 text-slate-600">
								Last updated{" "}
								<time dateTime={lastUpdated.toISOString()}>
									{format(lastUpdated, "MMMM d, yyyy")}
								</time>
							</p>
						</div>
						<div className="relative px-4 sm:px-6 lg:px-8">
							<div className="mx-auto max-w-[40rem] prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600">
								<ReactMarkdown>{text}</ReactMarkdown>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default TermsOfService;
