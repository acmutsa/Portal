import { FunctionComponent } from "react";
import Navbar, { StaticAuthenticationProps } from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { classNames } from "@/utils/helpers";
import Footer from "@/components/util/Footer";

type RootLayoutProps = {
	className?: string;
	innerClassName?: string;
	children: JSX.Element | JSX.Element[];
	// If true, show the background. If false, show white. If a string is provided, it will act as a class. Defaults to 'true'.
	background?: boolean | string;
	// If false, hide the navbar. Defaults to 'true'.
	navbar?: boolean;
	// If false, hide the footer. Defaults to 'true'.
	footer?: boolean;
	footerClass?: string;
} & StaticAuthenticationProps;

const RootLayout: FunctionComponent<RootLayoutProps> = ({
	className,
	innerClassName,
	background,
	children,
	authentication,
	navbar,
	footer,
	footerClass,
}) => {
	// Decide what the background prop means.
	background = background ?? true; // Defaults to 'true'
	const backgroundClass =
		typeof background === "boolean" ? (background ? "bg-acm" : "bg-white") : background;

	navbar = navbar ?? true;
	footer = footer ?? true;

	return (
		<>
			{navbar ? <Navbar authentication={authentication} /> : null}
			<div
				id="layout"
				className={classNames(
					className,
					backgroundClass,
					"flex flex-col flex-grow min-h-screen pt-[72px]"
				)}
			>
				<Toaster
					toastOptions={{
						duration: 3000,
						position: "top-right",
					}}
					containerStyle={{
						top: "calc(72px + 1rem)",
					}}
				/>
				<div className={classNames(innerClassName, "flex flex-grow")}>{children}</div>
				{footer ? <Footer className={classNames(footerClass, "")} /> : null}
			</div>
		</>
	);
};

export default RootLayout;
