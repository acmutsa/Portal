import { FunctionComponent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGlobalContext } from "@/components/common/GlobalContext";
import { useRouter } from "next/router";
import { classNames } from "@/utils/helpers";

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
			<a className={classNames(highlight ? "force" : null, "under-hover")}>{children}</a>
		</Link>
	);
};

const Navbar: FunctionComponent = () => {
	const [globalState, setGlobalState] = useGlobalContext();
	const router = useRouter();

	let dynamicNavbarElements = [];

	if (globalState.ready) {
		if (globalState.member)
			dynamicNavbarElements = [
				<NavbarItem key={"status"} router={router} route={"/me"}>
					Status
				</NavbarItem>,
				<Link key={"logout"} href={"/logout"}>
					<a className="under-hover">Logout</a>
				</Link>,
			];
		else
			dynamicNavbarElements = [
				<NavbarItem key={"login"} router={router} route={"/login"}>
					<span>Login</span>
				</NavbarItem>,
				<NavbarItem key={"register"} router={router} route={"/register"}>
					<span>Register</span>
				</NavbarItem>,
			];

		if (globalState.admin)
			dynamicNavbarElements.push(
				<NavbarItem key={"admin"} router={router} route={"/admin"} logic="starts-with">
					<span>Admin</span>
				</NavbarItem>
			);
	} else
		dynamicNavbarElements = [
			<div key={1} className="animate-pulse h-3 bg-gray-400 rounded-full w-10 mx-4" />,
			<div key={2} className="animate-pulse h-3 bg-gray-400 rounded-full w-10 mx-4" />,
		];

	return (
		<div className="h-[4.5rem] p-1 w-full bg-primary-600 font-inter drop-shadow-lg z-50 text-white text-xl fixed">
			<div className="flex justify-between h-full w-full max-w-[100vw] px-0.5 xs:px-1 sm:px-6 md:px-16 lg:pr-32 mx-auto">
				<Link href="/">
					<div className="h-full mx-1 sm:mx-2 flex items-center cursor-pointer">
						<Image src="/img/logo.png" className="aspect-square" width={40} height={40} />
						<h1 className="ml-1 font-bold">Portal</h1>
					</div>
				</Link>
				<div className="grow flex items-center justify-end font-inter text-base">
					<div className="flex gap-1 gap-2 sm:gap-3">
						<NavbarItem router={router} route={"/"}>
							Home
						</NavbarItem>
						<NavbarItem router={router} route={"/events"}>
							Events
						</NavbarItem>
						{dynamicNavbarElements}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
