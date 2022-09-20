import { FunctionComponent } from "react";
import Image from "next/image";

const Navbar: FunctionComponent = () => {
	return (
		<div className="h-[72px] w-full bg-primary-darker flex items-center px-[5px]">
			<Image width={42} height={42} src={"/img/logo.png"} />
			<h1 className="text-white font-opensans text-xl font-semibold ml-[5px]">Members</h1>
		</div>
	);
};

export default Navbar;
