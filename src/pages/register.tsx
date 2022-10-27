import type { NextPage } from "next";
import { Widget } from "@typeform/embed-react";
import { useRouter } from "next/router";
import useOpenGraph from "@/components/common/useOpenGraph";
import OpenGraph from "@/components/common/OpenGraph";
import Head from "next/head";

const Join: NextPage = () => {
	const router = useRouter();
	const ogp = useOpenGraph({
		description:
			"Register to embark on the road to becoming a new member of The Association of Computing Machinery at UTSA!",
		title: "Register",
		url: "/register",
	});

	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<div className="page-view">
				<div className="w-full max-w-[1024px] h-full flex flex-col items-center mx-auto">
					<Widget
						className="w-full h-full"
						opacity={0}
						id="xJq9Z5PI"
						onSubmit={(e) => {
							console.log(e);
						}}
					/>
				</div>
			</div>
		</>
	);
};

export default Join;
