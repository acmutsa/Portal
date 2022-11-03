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
			<a className={`under-hover ${highlight ? "force" : ""} mx-[15px] font-sans text-[14px]`}>
				{children}
			</a>
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
					<a className="under-hover mx-[15px] text-[14px] font-sans">Logout</a>
				</Link>,
		  ]
		: [
				<NavbarItem key={1} router={router} route={"/login"}>
					<span className="mx-[15px] text-[14px] font-sans">Login</span>
				</NavbarItem>,
				<NavbarItem key={2} router={router} route={"/register"}>
					<span className="mx-[15px] text-[14px] font-sans">Register</span>
				</NavbarItem>,
		  ];

	return (
		<div className="h-[72px] p-[5px] w-full bg-primary-darker font-inter drop-shadow-lg text-white text-xl">
			<div className="grid grid-cols-2 max-w-[1140px] h-full w-full mx-auto">
				<div className="flex items-center">
					<Link href="/">
						<div className="h-full flex items-center cursor-pointer">
							<Image src="/img/logo.png" width={40} height={40} />
							<h1 className="ml-[5px] font-bold">Portal</h1>
						</div>
					</Link>
				</div>
				<div className="flex items-center justify-end">
					<NavbarItem router={router} route={"/"}>
						Home
					</NavbarItem>
					<NavbarItem router={router} route={"/events"}>
						Events
					</NavbarItem>
					{right_navbar_elements}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
