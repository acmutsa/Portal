import { ltrim } from "@/utils/helpers";

export type OGProperties = {
	locale?: "en_US";
	url: string;
	title: string;
	type: "article" | "website";
	description: string;
	site_name: string;
	theme_color?: string;
	image: {
		alt: string;
		type: "image/jpeg" | "image/png";
		url: string;
		width: number;
		height: number;
	} | null;
	author?: string;
	section?: string;
	modified_time?: string;
	published_time?: string;
	card: "summary" | "summary_large_image" | "app" | "player";
	labels?: [string, string][] | null;
};

const OpenGraph = ({
	properties: {
		locale,
		url,
		site_name,
		title,
		type,
		description,
		author,
		section,
		image,
		modified_time,
		published_time,
		card,
		labels,
		theme_color,
	},
}: {
	properties: OGProperties;
}) => {
	return (
		<>
			<meta property="og:locale" content={locale || "en_US"} />
			<meta property="og:title" content={title} />
			<meta property="og:type" content={type} />
			<meta property="description" content={description} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content={url} />
			<meta property="og:site_name" content={site_name} />
			{type === "article" ? (
				<>
					<meta key={1} property="article:author" content={author} />
					<meta key={2} property="article:section" content={section} />
					<meta key={3} property="article:modified_time" content={modified_time} />
					<meta key={4} property="article:published_time" content={published_time} />
				</>
			) : null}
			{image != null ? (
				<>
					<meta key={1} property="og:image" content={image.url} />
					<meta
						key={2}
						property="og:image:secure_url"
						content={image.url.replace("http://", "https://")}
					/>
					<meta key={3} property="og:image:width" content={image.width.toString()} />
					<meta key={4} property="og:image:height" content={image.height.toString()} />
					<meta key={5} property="og:image:alt" content={image.alt} />
					<meta key={6} property="og:image:type" content={image.type} />
					<meta key={7} name="twitter:image" content={image.url} />
				</>
			) : null}
			<meta name="theme-color" content={`#${ltrim(theme_color ?? "179BD5", "#")}`} />
			<meta name="twitter:card" content={card} />
			<meta name="twitter:url" content={url} />
			<meta name="twitter:domain" content="portal.acmutsa.org" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description || ""} />
			<meta name="twitter:site" content="@acmutsa" />
			<meta name="twitter:creator" content="@acmutsa" />
			{labels != null
				? labels.map(([label, data], index) => {
						return (
							<>
								<meta key={index * 2} name={`twitter:label${index + 1}`} content={label} />
								<meta key={index * 2 + 1} name={`twitter:data${index + 1}`} content={data} />
							</>
						);
				  })
				: null}
		</>
	);
};

export default OpenGraph;
