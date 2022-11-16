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
		title: "The Association of Computing Machinery",
		suffix: false,
		url: "/",
	});

	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<div className="page-view bg-darken !pt-40 md:!pt-44 lg:!pt-48">
				<div className="w-full max-w-[1024px] h-full flex flex-col items-center mx-auto px-4">
					<div className="flex flex-col items-center justify-start max-w-[25rem] w-full sm:w-[25rem] bg-white rounded border-2 border-primary-light">
						<div className="shrink relative text-sm md:text-base bottom-[0em] h-[9em] w-[9em] rounded-full overflow-hidden border-2 border-primary-light bg-white">
							<Image
								className="drop-shadow-sm"
								src={"/img/logo.png"}
								layout="fill"
								objectFit="cover"
							/>
						</div>
						<h1 className="text-4xl md:text-[2.75rem] md:leading-12  lg:text-5xl font-extrabold font-inter my-[10px] text-center text-primary-light relative bottom-[0rem]">
							Membership
							<br />
							Portal
						</h1>
						<div className="grid grid-rows-3 grid-cols-1 gap-2 px-3 py-4 w-full text-white font-semibold">
							<Link href="/events/">
								<button className="h-12 w-full px-2 justify-self-center bg-primary-dark hover:bg-primary-dark-hover rounded">
									Events
								</button>
							</Link>
							<Link href="/register">
								<button className="h-12 w-full justify-self-center bg-primary-dark hover:bg-primary-dark-hover rounded">
									Register
								</button>
							</Link>
							<Link href="/member/status" className="mx-2">
								<button className="h-12 w-full justify-self-center bg-primary-dark hover:bg-primary-dark-hover rounded">
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
