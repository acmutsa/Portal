import type { NextPage } from "next";
import { Widget } from "@typeform/embed-react";
import useOpenGraph from "@/components/common/useOpenGraph";
import OpenGraph from "@/components/common/OpenGraph";
import Head from "next/head";
import RootLayout from "@/components/layout/RootLayout";

const Join: NextPage = () => {
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
			<RootLayout>
				<Widget
					className="flex flex-grow"
					style={{ borderRadius: "0px" }}
					opacity={0}
					id="xJq9Z5PI"
					onSubmit={(e) => {
						console.log(e);
					}}
				/>
			</RootLayout>
		</>
	);
};

export default Join;
