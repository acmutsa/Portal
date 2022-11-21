import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import OpenGraph from "@/components/common/OpenGraph";
import useOpenGraph from "@/components/common/useOpenGraph";
import Disclosure from "@/components/util/Disclosure";

const Home: NextPage = () => {
	const ogp = useOpenGraph({
		description: "The premier Computer Science organization at UTSA",
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
			<div className="page-view bg-darken">
				{/* TODO: Fix the logo's weird overlap/clipping issues at short viewports */}
				<div className="w-full !mt-4 md:!mt-6 lg:!mt-10 max-w-[1024px] h-full flex flex-col items-center mx-auto px-4">
					<div className="relative z-20 md:text-base -bottom-16 h-[144px] w-[144px] rounded-full overflow-visible border-2 border-secondary bg-white">
						<Image
							className="absolute overflow-visible drop-shadow-sm"
							src={"/img/logo.png"}
							layout="fill"
							objectFit="cover"
						/>
					</div>
					<div className="flex flex-col z-10 relative overflow-hidden items-center justify-start max-w-[25rem] w-full sm:w-[25rem] bg-white rounded border-2 border-secondary">
						<h1 className="text-4xl md:text-[2.75rem] md:leading-12 pt-14 lg:text-5xl font-extrabold font-inter my-[10px] text-center text-secondary relative bottom-[0rem]">
							Membership
							<br />
							Portal
						</h1>
						<div className="grid grid-rows-3 grid-cols-1 gap-2 px-3 py-4 w-full text-white font-semibold">
							<Link href="/events/">
								<button className="h-12 w-full px-2 justify-self-center bg-primary-dark hover:bg-primary-dark-hover rounded transition ease-in">
									Events
								</button>
							</Link>
							<Link href="/register">
								<button className="h-12 w-full justify-self-center bg-primary-dark hover:bg-primary-dark-hover rounded transition ease-in">
									Register
								</button>
							</Link>
							<Link href="/member/status" className="mx-2">
								<button className="h-12 w-full justify-self-center bg-primary-dark hover:bg-primary-dark-hover rounded transition ease-in">
									Status
								</button>
							</Link>
						</div>
					</div>
				</div>
				<Disclosure />
			</div>
		</>
	);
};

export default Home;
