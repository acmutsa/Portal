import type { FunctionComponent } from "react";

const Disclosure: FunctionComponent = () => {
	return (
		<p className="footer w-full text-center text-[10px] mx-auto text-white">
			Made with &lt;/&gt; @ ACM UTSA
			<br />© Association of Computing Machinery at UTSA {new Date().getFullYear()}. All Rights
			Reserved.
		</p>
	);
};

export default Disclosure;
