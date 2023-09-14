import type { NextPage } from "next";
import useOpenGraph from "@/components/common/useOpenGraph";
import OpenGraph from "@/components/common/OpenGraph";
import Head from "next/head";
import RootLayout from "@/components/layout/RootLayout";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import c from "@/portal.config";

const Join: NextPage = () => {
	const ogp = useOpenGraph({
		description: "Register to become a member of The Association of Computing Machinery at UTSA!",
		title: "Register",
		url: "/register",
	});

	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<RootLayout>
				<div className="w-full">
					<div className="max-w-[750px] mx-auto w-full text-white pt-[25vh]">
						<h1 className="font-bold text-xl">ACM UTSA Registration</h1>
						<h2 className="font-black text-8xl">Welcome!</h2>
						<p className="pt-3 font-semibold w-full">
							<Balancer ratio={0.4}>
								This form will register you as a member of {c.name.long}! Curious about how
								membership works? Check out our{" "}
								<Link className="underline" href={c.links.faq}>
									FAQs
								</Link>{" "}
								or join us on{" "}
								<Link className="underline" href={c.links.discord}>
									Discord
								</Link>
								!
							</Balancer>
						</p>
					</div>
					<div className="max-w-[750px] mx-auto w-full bg-white rounded-2xl min-h-[50vh] mt-[5vh]"></div>
				</div>
			</RootLayout>
		</>
	);
};

export default Join;
