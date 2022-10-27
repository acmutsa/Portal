import { useMemo } from "react";
import { absUrl } from "@/utils/helpers";
import { OGProperties } from "@/components/common/OpenGraph";

type OGImage = {
	alt: string;
	type: "image/jpeg" | "image/png";
	url: string;
	width?: number;
	height?: number;
};

type PageOgData = Omit<OGProperties, "image" | "card" | "site_name" | "type"> & {
	card?: OGProperties["card"];
	image?: OGImage | null;
	suffix?: boolean;
	type?: "website" | "article";
};

export const useOpenGraph = (data: PageOgData) => {
	// If the image is not defined, assume a default image using the NPB background.
	if (data.image === undefined)
		data.image = {
			url: "/img/bg.png",
			type: "image/png",
			alt: "The North Paseo Building",
			height: 819,
			width: 1430,
		};

	return useMemo<OGProperties>(() => {
		return {
			url: data.url,
			// Provide a suffix to the title, but only if it's not disabled explicitly.
			// Otherwise, always provide a default title.
			title: data.title ? `${data.title}${data.suffix ?? false ? " | ACM-UTSA" : ""}` : "ACM-UTSA",
			type: data.type ?? "website",
			author: data.author,
			site_name: "The Association of Computing Machinery at UTSA Student Chapter",
			description: data.description,
			image: data.image
				? {
						type: data.image.type,
						url: absUrl(data.image.url),
						alt: data.image.alt || "",
						height: data.image.height || 720,
						width: data.image.width || 420,
				  }
				: null,
			card: data.card || data.image ? "summary_large_image" : "summary",
			section: data.section,
			modified_time: data.modified_time,
			published_time: data.published_time,
		};
	}, [data]);
};

export default useOpenGraph;
