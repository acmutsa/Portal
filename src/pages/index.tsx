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
			<div className="page-view bg-darken !pt-[25vh]">
				<div className="w-full max-w-[1024px] h-full flex flex-col items-center mx-auto m-[5px]">
					<div className="flex flex-col items-center justify-start w-[25rem] bg-white rounded border-2 border-primary-lighter">
						<div className="shrink relative bottom-[5rem] h-[140px] w-[140px] rounded-full overflow-hidden border-2 border-primary-lighter bg-white">
							<Image
								className="drop-shadow-sm"
								width={150}
								height={150}
								src={"/img/logo.png"}
								layout="fill"
								objectFit="cover"
							/>
						</div>
						<h1 className="text-5xl font-extrabold font-inter my-[10px] text-center text-primary-lighter relative bottom-[5rem]">
							Membership
							<br />
							Portal
						</h1>
						<div className="grid grid-rows-3 grid-cols-1 gap-2 px-3 pb-4 w-full text-white font-semibold">
							<Link href="/events/">
								<button className="h-[3.125rem] w-full px-2 justify-self-center bg-primary-darker rounded">
									Events
								</button>
							</Link>
							<Link href="/register/">
								<button className="h-[3.125rem] w-full justify-self-center bg-primary-darker rounded">
									Register
								</button>
							</Link>
							<Link href="/member/status/" className="mx-2">
								<button className="h-[3.125rem] w-full justify-self-center bg-primary-darker rounded">
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
