import type { Metadata } from "next";
import { siteConfig } from "../site";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  images?: string[];
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authors?: string[];
  noIndex?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  images,
  publishedTime,
  modifiedTime,
  authors,
  noIndex,
}: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: path,
      type,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      ...(images && { images }),
      ...(type === "article" && {
        publishedTime: publishedTime ?? undefined,
        modifiedTime: modifiedTime ?? undefined,
        authors,
      }),
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitter,
      creator: siteConfig.twitter,
      title,
      description,
      ...(images && { images }),
    },
  };
}
