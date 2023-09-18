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

	const base_properties: [string, string][] = [
		["og:locale", locale || "en_US"],
		["og:title", title],
		["og:type", type],
		["description", description],
		["og:description", description],
		["og:url", url],
		["og:site_name", site_name],
		["theme-color", `#${ltrim(theme_color ?? "179BD5", "#")}`],
		["twitter:card", card],
		["twitter:url", url],
		["twitter:domain", "portal.acmutsa.org"],
		["twitter:title", title],
		["twitter:description", description || ""],
		["twitter:site", "@acmutsa"],
		["twitter:creator", "@acmutsa"],
	]

	if (type === "article") {
		base_properties.push(
			["article:author", author!],
			["article:section", section!],
			["article:modified_time", modified_time!],
			["article:published_time", published_time!],
		)
	}

	if (image != null) {
		base_properties.push(
			["og:image", image.url],
			["og:image:secure_url", image.url.replace("http://", "https://")],
			["og:image:width", image.width.toString()],
			["og:image:height", image.height.toString()],
			["og:image:alt", image.alt],
			["og:image:type", image.type],
			["twitter:image", image.url],
		)
	}

	/*
	if (labels != null) {
		base_properties.push(
			...(labels.map(([label, data], index) => {
				return [
					[`twitter:label${index + 1}`, label],
					[`twitter:data${index + 1}`, data]
				] as [string, string][]
			}))
		)
	}
	*/


	return (
		<>
			{base_properties.map(([key, value]) => (
				<meta key={key} property={key} content={value} />
			))}
		</>
	);
};

export default OpenGraph;
