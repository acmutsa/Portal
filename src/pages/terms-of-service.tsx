import OpenGraph from "@/components/common/OpenGraph";
import useOpenGraph from "@/components/common/useOpenGraph";
import RootLayout from "@/components/layout/RootLayout";
import Footer from "@/components/util/Footer";
import { format } from "date-fns";
import { readFileSync } from "fs";
import { GetStaticPropsResult, NextPage } from "next";
import Head from "next/head";
import path from "path";
import ReactMarkdown from "react-markdown";

type TermsOfServicePageProps = {
	text: string;
};

// Last time the terms of service were updated. Needs to be updated manually.
// Perhaps we could automate this by checking the last commit date of the file?
// Or at least include it in the file itself.
const lastUpdated = new Date(2023, 2, 5);

export function getStaticProps(): GetStaticPropsResult<TermsOfServicePageProps> {
	const text = readFileSync(path.resolve(process.cwd(), "./src/utils/tos.md"), "utf-8");

	return {
		props: { text },
	};
}

const TermsOfService: NextPage<TermsOfServicePageProps> = ({ text }) => {
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
			<RootLayout footer={false} innerClassName="justify-center">
				<div className="min-h-[100vh] max-w-[30rem] sm:max-w-[40rem] lg:max-w-[40rem] pt-20 pb-2 bg-gray-100 w-full">
					<div className="px-4 sm:px-6 lg:px-8 pb-5">
						<div className="flex flex-col items-center relative mx-auto max-w-[37.5rem] text-center pb-8">
							<div className="w-full max-w-[25rem]">
								<h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
									Terms of Service and Privacy Policy
								</h1>
							</div>
							<p className="mt-4 text-base md:text-lg leading-7 text-slate-600">
								Last updated{" "}
								<time dateTime={lastUpdated.toISOString()} title={lastUpdated.toISOString()}>
									{format(lastUpdated, "MMMM d, yyyy")}
								</time>
							</p>
						</div>
						<div className="relative px-4 sm:px-6">
							<div className="mx-auto prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600">
								<ReactMarkdown>{text}</ReactMarkdown>
							</div>
						</div>
					</div>
				</div>
			</RootLayout>
		</>
	);
};

export default TermsOfService;
