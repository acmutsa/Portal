import type { NextPage } from "next";
import { Widget } from "@typeform/embed-react";
import { useRouter } from "next/router";

const Join: NextPage = () => {
	const router = useRouter();

	return (
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
	);
};

export default Join;
