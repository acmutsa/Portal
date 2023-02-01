import { FunctionComponent } from "react";
import Navbar, { StaticAuthenticationProps } from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { classNames } from "@/utils/helpers";
import Disclosure from "@/components/util/Disclosure";

type RootLayoutProps = {
	className?: string;
	children: JSX.Element;
	// If true, show the background. If false, show white. If a string is provided, it will act as a class. Defaults to 'true'.
	background?: boolean | string;
	// If false, hide the navbar. Defaults to 'true'.
	navbar?: boolean;
	// If false, hide the footer. Defaults to 'true'.
	footer?: boolean;
} & StaticAuthenticationProps;

const RootLayout: FunctionComponent<RootLayoutProps> = ({
	className,
	background,
	children,
	authentication,
	navbar,
	footer,
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
				className={classNames(
					className,
					backgroundClass,
					"min-h-screen pt-[72px] w-full bg-fixed bg-center bg-cover bg-no-repeat overflow-y-auto"
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
				{children}
				{footer ? <Disclosure /> : null}
			</div>
		</>
	);
};

export default RootLayout;
