import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import Navbar from "../components/navbar";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<>
			<Head>
				<title>ACM Membership Portal</title>
			</Head>
			<Navbar />
			<div className="bg-[url('/img/bg.png')] bg-fixed bg-center bg-cover">
				<Component {...pageProps} />
				<p className="absolute bottom-0 w-full text-center text-[10px] mx-auto text-white">
					Made with &lt;/&gt; @ ACM UTSA
					<br />© Association of Computing Machinery at UTSA 2022. All Rights Reserved.
				</p>
			</div>
		</>
	);
};

export default MyApp;
