import { FunctionComponent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGlobalContext } from "@/components/common/GlobalContext";
import { useRouter } from "next/router";

interface HighlightProps {
	router: any;
	route: string;
	href?: string;
	logic?: "equals" | "starts-with";
	children: JSX.Element | JSX.Element[] | string;
}

const NavbarItem: FunctionComponent<HighlightProps> = ({
	router,
	route,
	children,
	href,
	logic,
}) => {
	let highlight = false;
	switch (logic) {
		case "starts-with":
			if (router.route.startsWith(route)) highlight = true;
			break;
		case "equals":
		default:
			if (router.route == route) highlight = true;
			break;
	}

	return (
		<Link href={href ?? route}>
			<a className={`under-hover ${highlight ? "force" : ""}`}>{children}</a>
		</Link>
	);
};

const Navbar: FunctionComponent = () => {
	const [globalState, setGlobalState] = useGlobalContext();
	const router = useRouter();

	let right_navbar_elements = globalState.loggedIn
		? [
				<NavbarItem key={1} router={router} route={"/member/status"}>
					Status
				</NavbarItem>,
				<Link key={2} href={"/logout"}>
					<a className="under-hover">Logout</a>
				</Link>,
				<NavbarItem key={3} router={router} route={"/admin"} logic="starts-with">
					Admin
				</NavbarItem>,
		  ]
		: [
				<NavbarItem key={1} router={router} route={"/login"}>
					Login
				</NavbarItem>,
				<NavbarItem key={2} router={router} route={"/register"}>
					Register
				</NavbarItem>,
		  ];

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
			<div className="flex-1 flex justify-evenly">{right_navbar_elements}</div>
		</div>
	);
};

export default Navbar;
