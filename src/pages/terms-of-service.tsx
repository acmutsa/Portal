import { NextPage } from "next";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { readFileSync } from "fs";
import path from "path";
import OpenGraph from "@/components/common/OpenGraph";
import Head from "next/head";
import useOpenGraph from "@/components/common/useOpenGraph";
import RootLayout from "@/components/layout/RootLayout";
import Footer from "@/components/util/Footer";

interface TosProps {
	text: string;
}

const lastUpdated = new Date(2023, 2, 5);

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
			{/*<div className="page-view bg-darken !py-0 font-inter">*/}
			<RootLayout footer={false} innerClassName="justify-center">
				<div className="min-h-[100vh] max-w-[30rem] sm:max-w-[40rem] sm:px-10 pt-20 pb-2 bg-gray-100 w-full">
					<div className="px-4 sm:px-6 lg:px-8 pb-5">
						<div className="flex flex-col items-center relative mx-auto max-w-[37.5rem] text-center pb-16">
							<div className="w-full max-w-[25rem] sm:max-w-[30rem]">
								<h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
									Terms of Service and Privacy Policy
								</h1>
							</div>
							<p className="mt-4 text-base md:text-lg leading-7 text-slate-600">
								Last updated{" "}
								<time dateTime={lastUpdated.toISOString()}>
									{format(lastUpdated, "MMMM d, yyyy")}
								</time>
							</p>
						</div>
						<div className="relative px-4 sm:px-6 lg:px-8">
							<div className="mx-auto max-w-[24rem] sm:max-w-[40rem] prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600">
								<ReactMarkdown>{text}</ReactMarkdown>
							</div>
						</div>
					</div>
					<Footer className="text-gray-800" />
				</div>
			</RootLayout>
		</>
	);
};

export default TermsOfService;
