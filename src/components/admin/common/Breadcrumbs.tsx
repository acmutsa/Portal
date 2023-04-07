import { HiHome } from "react-icons/hi";
import React from "react";
import Link from "next/link";

export type Page = {
	name: string;
	href: string;
	current?: boolean;
};

type BreadcrumbsProps = {
	pages: Page[];
};

export default function Breadcrumbs({ pages }: BreadcrumbsProps) {
	return (
		<nav className="flex border-b border-gray-200 bg-white" aria-label="Breadcrumb">
			<ol
				role="list"
				className="md:ml-12 lg:ml-24 xl:ml-32 flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8"
			>
				<li className="flex">
					<div className="flex items-center">
						<Link href="/admin/" className="text-gray-400 hover:text-gray-500">
							<HiHome className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
							<span className="sr-only">Home</span>
						</Link>
					</div>
				</li>
				{pages.map((page) => (
					<li key={page.name} className="flex">
						<div className="flex items-center">
							<svg
								className="h-full w-6 flex-shrink-0 text-gray-200"
								viewBox="0 0 24 44"
								preserveAspectRatio="none"
								fill="currentColor"
								aria-hidden="true"
							>
								<path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
							</svg>
							<Link
								href={page.href}
								className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
								aria-current={page.current ? "page" : undefined}
							>
								{page.name}
							</Link>
						</div>
					</li>
				))}
			</ol>
		</nav>
	);
}
