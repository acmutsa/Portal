import React from "react";

interface StatProps {
	label: JSX.Element | string;
	loading?: boolean | null;
	value?: JSX.Element | string | number | null;
	subtext?: JSX.Element | string | null;
}

const valueSkeleton = <div className="animate-pulse p-1 h-[1.3em] w-14 bg-gray-300 rounded-md" />;

const Stat = ({ loading, label, value, subtext }: StatProps) => {
	return (
		<dl className="font-inter">
			<dt className="text-sm sm:text-[14px] font-medium text-zinc-700">{label}</dt>
			<dt className="font-bold py-1 text-xl text-zinc-800">
				{loading === true ? valueSkeleton : value ?? valueSkeleton}
			</dt>
			{subtext ? <dt>{subtext}</dt> : null}
		</dl>
	);
};

export default Stat;
