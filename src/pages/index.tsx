import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/legacy/image";
import OpenGraph from "@/components/common/OpenGraph";
import useOpenGraph from "@/components/common/useOpenGraph";
import RootLayout from "@/components/layout/RootLayout";
import { FunctionComponent, ReactNode } from "react";

const IndexButton: FunctionComponent<{ href: string; children: string | ReactNode }> = ({
	href,
	children,
}) => {
	return (
		<Link href={href}>
			<button className="h-12 w-full px-2 justify-self-center bg-primary hover:bg-primary-600 rounded transition ease-in">
				{children}
			</button>
		</Link>
	);
};

const Home: NextPage = () => {
	const ogp = useOpenGraph({
		description:
			"The Membership Portal for ACM-UTSA. Sign-in or register to learn about upcoming events, track your membership status, and become more involved.",
		title: "ACM UTSA",
		suffix: false,
		url: "/",
	});

	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<RootLayout>
				<div className="w-full !mt-4 md:!mt-6 lg:!mt-10 max-w-[1024px] h-full flex flex-col items-center mx-auto px-4">
					<div className="relative z-20 md:text-base -bottom-16 h-[144px] w-[144px] rounded-full overflow-visible border-2 border-secondary bg-white">
						<Image
							alt="ACM-UTSA Logo"
							className="absolute overflow-visible drop-shadow-sm"
							src={"/img/logo.png"}
							width={400}
							height={400}
							quality={90}
							objectFit="cover"
							priority={true}
						/>
					</div>
					<div className="flex flex-col z-10 relative overflow-hidden items-center justify-start max-w-[25rem] w-full sm:w-[25rem] bg-white rounded border-2 border-secondary">
						<h1 className="text-4xl md:text-[2.75rem] md:leading-12 pt-14 lg:text-5xl font-extrabold font-inter my-[10px] text-center text-secondary relative bottom-[0rem]">
							Membership
							<br />
							Portal
						</h1>
						<div className="grid grid-rows-3 grid-cols-1 gap-2 px-3 py-4 w-full text-white font-semibold">
							<IndexButton href="/events/">Events</IndexButton>
							<IndexButton href="/register/">Register</IndexButton>
							<IndexButton href="/status/">Status</IndexButton>
						</div>
					</div>
				</div>
			</RootLayout>
		</>
	);
};

export default Home;
