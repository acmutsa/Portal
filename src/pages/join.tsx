import type { NextPage } from "next";
import Link from "next/link";

const Join: NextPage = () => {
	return (
		<div className="page-view pt-[25vh]">
			<div className="w-full max-w-[1024px] flex flex-col items-center mx-auto">
				<h1 className="text-white text-5xl font-bold font-raleway mb-[5px]">
					Up Next <span className="text-primary-lighter">@ ACM</span>
				</h1>
			</div>
		</div>
	);
};

export default Join;
