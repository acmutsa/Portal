import { FunctionComponent } from "react";
import Navbar, { StaticAuthenticationProps } from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { classNames } from "@/utils/helpers";
import Footer from "@/components/util/Footer";
import Image, { StaticImageData } from "next/image";

type RootLayoutProps = {
	className?: string;
	innerClassName?: string;
	children: JSX.Element | JSX.Element[];
	// A path to an image resource. If not given, no background image is used.
	backgroundImage?: StaticImageData | string | null;
	// Image's image blur data URL.
	backgroundImageBlur?: string;
	// Classes to be applied to the background image.
	backgroundClass?: string;
	// If false, hide the navbar. Defaults to 'true'.
	navbar?: boolean;
	// If false, hide the footer. Defaults to 'true'.
	footer?: boolean;
	footerClass?: string;
} & StaticAuthenticationProps;

const RootLayout: FunctionComponent<RootLayoutProps> = ({
	className,
	innerClassName,
	backgroundImage,
	backgroundImageBlur,
	backgroundClass,
	children,
	authentication,
	navbar,
	footer,
	footerClass,
}) => {
	navbar = navbar ?? true;
	footer = footer ?? true;

	if (backgroundImage === undefined) {
		backgroundImage = "/img/bg.png";
		backgroundClass = "brightness-[0.60]";
	}

	return (
		<>
			{navbar ? <Navbar authentication={authentication} /> : null}
			<div
				id="layout"
				className={classNames(className, "flex flex-col flex-grow min-h-screen pt-[72px]")}
			>
				{backgroundImage != null ? (
					<Image
						className={classNames("w-screen h-screen -z-10", backgroundClass)}
						src={backgroundImage}
						width={1920}
						height={1080}
						placeholder={
							backgroundImageBlur != null || typeof backgroundImage != "string" ? "blur" : "empty"
						}
						quality={80}
						sizes="(max-width: 768px) 100vh,
              (max-width: 1200px) 100vh,
              70vw"
						alt="The North Paseo Building"
						style={{ objectFit: "cover", position: "fixed" }}
					/>
				) : null}
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
