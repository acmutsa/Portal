import type { FunctionComponent } from "react";

const Disclosure: FunctionComponent = () => {
	return (
		<p className="footer w-full font-inter opacity-[60%] text-center select-none text-[12px] mx-auto text-white absolute bottom-0 py-1">
			Made with{" "}
			<a
				href="https://github.com/UTSA-ACM/Portal"
				target={"_blank"}
				className="disclosure-symbol underline"
			>
				&lt;/&gt;
			</a>{" "}
			& ♥ @ ACM UTSA |{" "}
			<a href="https://forms.gle/eqj1gMRRhZKitAn47" target={"_blank"} className="underline">
				Report a Bug
			</a>
			<br />© Association of Computing Machinery at UTSA {new Date().getFullYear()}. All Rights
			Reserved.
		</p>
	);
};

export default Disclosure;
