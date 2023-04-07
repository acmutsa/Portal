import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import OpenGraph from "@/components/common/OpenGraph";
import useOpenGraph from "@/components/common/useOpenGraph";
import RootLayout from "@/components/layout/RootLayout";
import Balancer from "react-wrap-balancer";
import BgImgDark from "@/img/bg-dark.png";

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
			<RootLayout
				innerClassName="text-white flex items-center justify-center"
				backgroundClass="brightness-90"
				backgroundImage={BgImgDark}
			>
				<div className="w-full px-2 !mb-8 md:!mb-12 lg:!mb-20 max-w-[90rem] h-full flex flex-col items-center align-middle mx-auto px-4">
					<div className="flex flex-col items-center">
						<h1 className="text-center text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[-0.045em] space-x-5 h-full w-full">
							<Balancer>
								<span className="text-transparent bg-clip-text bg-gradient-to-b from-white from-65% to-zinc-400">
									Innovate.
								</span>{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-b from-white from-65% to-zinc-400">
									Conne<span style={{ letterSpacing: "-1px" }}>c</span>t.
								</span>{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-b from-white from-65% to-zinc-400">
									Learn.
								</span>
							</Balancer>
						</h1>
						<h4 className="mt-4 font-inter text-xl text-center text-zinc-200">
							<Balancer>
								We are the Premier Computer Science Organization at{" "}
								<span
									className="font-bold font-roboto font-white tracking-tighter"
									title="The University of Texas at San Antonio"
								>
									UTSA
								</span>
								, run & staffed by students.
							</Balancer>
						</h4>
					</div>
					<div className="py-10 space-x-4">
						<Link
							href="/register"
							className="rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
						>
							Register
						</Link>
						<Link href="/events" className="text-sm font-semibold leading-6 text-white">
							Find events <span aria-hidden="true">→</span>
						</Link>
					</div>
				</div>
			</RootLayout>
		</>
	);
};

export default Home;
