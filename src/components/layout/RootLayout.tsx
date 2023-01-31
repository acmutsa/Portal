import { FunctionComponent } from "react";
import Navbar, { StaticAuthenticationProps } from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { classNames } from "@/utils/helpers";

type RootLayoutProps = {
	children: JSX.Element;
	// If true, show the background. If false, show white. If a string is provided, it will act as a class. Defaults to 'true'.
	background?: boolean | string;
	// If false, hide the navbar. Defaults to 'true'.
	navbar?: boolean;
} & StaticAuthenticationProps;

const RootLayout: FunctionComponent<RootLayoutProps> = ({
	background,
	children,
	authentication,
	navbar,
}) => {
	// Decide what the background prop means.
	background = background ?? true; // Defaults to 'true'
	const backgroundClass =
		typeof background === "boolean"
			? background
				? "bg-[url('/img/bg.png')]"
				: "bg-[url('/img/bg.png')]"
			: background;

	navbar = navbar ?? true;

	return (
		<>
			{navbar ? <Navbar authentication={authentication} /> : null}
			<div
				className={classNames(
					backgroundClass,
					"bg-fixed bg-center bg-cover h-[calc(100vh)] overflow-y-auto"
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
			</div>
		</>
	);
};

export default RootLayout;
