import { FunctionComponent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGlobalContext } from "@/components/state/global";
import { useRouter } from "next/router";

interface HighlightProps {
	router: any;
	route: string;
	href?: string;
	children: JSX.Element | JSX.Element[] | string;
}

const NavbarItem: FunctionComponent<HighlightProps> = ({ router, route, children, href }) => {
	const highlight = route == router.route;
	return (
		<Link href={href ?? route}>
			<a className={`under-hover ${highlight ? "force" : ""}`}>{children}</a>
		</Link>
	);
};

const Navbar: FunctionComponent = () => {
	const [globalState, setGlobalState] = useGlobalContext();
	const router = useRouter();

	return (
		<div className="h-[72px] w-full bg-primary-darker font-inter drop-shadow-lg text-white text-xl flex items-center">
			<div className="flex-1 flex justify-evenly text-center">
				<NavbarItem router={router} route={"/"}>
					Home
				</NavbarItem>
				<NavbarItem router={router} route={"/events"}>
					Events
				</NavbarItem>
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
							<NavbarItem key={1} router={router} route={"/member/status"}>
								Status
							</NavbarItem>,
							<Link key={2} href={"/logout"}>
								<a className="under-hover">Logout</a>
							</Link>,
					  ]
					: [
							<NavbarItem key={1} router={router} route={"/login"}>
								Login
							</NavbarItem>,
							<Link key={2} href={"/register"}>
								<NavbarItem router={router} route={"/register"}>
									Register
								</NavbarItem>
							</Link>,
					  ]}
			</div>
		</div>
	);
};

export default Navbar;
