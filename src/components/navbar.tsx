import { FunctionComponent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGlobalContext } from "@/components/state/global";

const Navbar: FunctionComponent = () => {
	const [globalState, setGlobalState] = useGlobalContext();

	return (
		<div className="h-[72px] w-full bg-primary-darker font-inter drop-shadow-lg text-white text-xl flex items-center">
			<div className="flex-1 text-center">
				<Link href={"/events"}>Events</Link>
			</div>
			<div className="flex-2">
				<Link href={"/"}>
					<div className="flex justify-center relative top-[1.2rem] hover:translate-y-1 cursor-pointer hover:scale-[110%] transition-transform">
						<Image width={100} height={100} quality={100} loading={"eager"} src={"/img/logo.png"} />
					</div>
				</Link>
			</div>
			<div className="flex-1 flex justify-evenly">
				{globalState.loggedIn
					? [
							<Link key={1} href={"/member/status"}>
								Status
							</Link>,
							<Link key={2} href={"/logout"}>
								Logout
							</Link>,
					  ]
					: [
							<Link key={1} href={"/login"}>
								Login
							</Link>,
							<Link key={3} href={"/register"}>
								Register
							</Link>,
					  ]}
			</div>
		</div>
	);
};

export default Navbar;
