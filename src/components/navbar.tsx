import { FunctionComponent } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar: FunctionComponent = () => {
	return (
		<div className="h-[72px] w-full bg-primary-darker font-opensans drop-shadow-lg text-white text-xl flex items-center justify-evenly px-[5px]">
			<Link className="font-bold" href={"/events"}>
				Events
			</Link>
			<Link href={"/"}>
				<div className="relative top-[1.2rem] hover:translate-y-1 cursor-pointer hover:scale-[110%] transition-transform">
					<Image width={100} height={100} quality={100} loading={"eager"} src={"/img/logo.png"} />
				</div>
			</Link>
			<Link className="font-bold" href={"/login"}>
				Login
			</Link>
		</div>
	);
};

export default Navbar;
