import { DependencyList, useEffect, useRef } from "react";

export const useEffectAfterMount = (cb: () => void, dependencies: DependencyList) => {
	const mounted = useRef(true);

	useEffect(() => {
		if (!mounted.current) {
			return cb();
		}
		mounted.current = false;
	}, dependencies);
};
