import type { FunctionComponent } from "react";

const Disclosure: FunctionComponent = () => {
	return (
		<p className="footer w-full font-inter opacity-[60%] text-center text-[12px] mx-auto text-white absolute bottom-0 py-1">
			Made with &lt;/&gt; @ ACM UTSA
			<br />© Association of Computing Machinery at UTSA {new Date().getFullYear()}. All Rights
			Reserved.
		</p>
	);
};

export default Disclosure;
