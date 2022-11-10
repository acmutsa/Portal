import { ltrim } from "@/utils/helpers";

export type OGProperties = {
  locale?: "en_US" | "fr_FR";
  url: string;
  title: string;
  type: "article" | "website";
  description: string;
  site_name: string;
  theme_color?: string
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
  labels?: [string, string][] | null
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
                       theme_color
                     }
                   }: { properties: OGProperties }) => {
  return (
    <>
      <meta property="og:locale" content={locale || "en_US"} />
      <meta property="og:title" content={title} />
      <meta property="og:type" content={type} />
      <meta property="og:description" content={description || ""} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={site_name} />
      {type === "article" && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:section" content={section} />
          <meta property="article:modified_time" content={modified_time} />
          <meta property="article:published_time" content={published_time} />
        </>
      )}
      {image && (
        <>
          <meta property="og:image" content={image.url} />
          <meta property="og:image:secure_url" content={image.url.replace("http://", "https://")} />
          <meta property="og:image:width" content={image.width.toString()} />
          <meta property="og:image:height" content={image.height.toString()} />
          <meta property="og:image:alt" content={image.alt} />
          <meta property="og:image:type" content={image.type} />
          <meta name="twitter:image" content={image.url} />
        </>
      )}
      <meta name="theme-color" content={`#${ltrim(theme_color ?? "179BD5", "#")}`} />
      <meta name="twitter:card" content={card} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:domain" content="portal.acmutsa.org" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description || ""} />
      <meta name="twitter:site" content="@acmutsa" />
      <meta name="twitter:creator" content="@acmutsa" />
      {
        labels && labels.map(([label, data], index) => {
          return <>
            <meta key={index * 2} name={`twitter:label${index + 1}`} content={label} />
            <meta key={index * 2 + 1} name={`twitter:data${index + 1}`} content={data} />
          </>;
        })
      }
    </>
  );
};

export default OpenGraph;
