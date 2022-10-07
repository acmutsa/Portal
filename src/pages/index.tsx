import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
	return (
		<div className="page-view pt-[25vh]">
			<div className="w-full max-w-[1024px] flex flex-col items-center mx-auto">
				<h1 className="text-white text-5xl font-bold font-raleway mb-[5px]">ACM UTSA</h1>
				<h2 className="font-roboto font-bold text-5xl p-[5px] text-primary-lighter bg-white rounded-lg">
					Membership Portal
				</h2>
				<div className="flex w-full justify-center mt-[25px]">
					<Link href="/events/">
						<button className="h-[50px] w-[100px] bg-primary-darker text-white rounded font-semibold mx-[5px]">
							Events
						</button>
					</Link>
					<Link href="/register/">
						<button className="h-[50px] w-[100px] bg-primary-darker text-white rounded font-semibold mx-[5px]">
							Register
						</button>
					</Link>
					<Link href="/status/">
						<button className="h-[50px] w-[100px] bg-primary-darker text-white rounded font-semibold mx-[5px]">
							Status
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Home;
