import type { MetadataRoute } from "next";
import {
  getPublicInsights,
  getPublicWork,
} from "@/lib/content/public-content";
import { publicPath } from "@/lib/content/public-routes";

function cleanBaseUrl(value: string) {
  return value.replace(/\/$/, "");
}

function sitemapEntry(
  baseUrl: string,
  path: string,
  options: {
    lastModified?: string | null;
    priority: number;
    changeFrequency: "weekly" | "monthly";
  }
): MetadataRoute.Sitemap[number] {
  return {
    url: `${baseUrl}${path}`,
    ...(options.lastModified
      ? { lastModified: new Date(options.lastModified) }
      : {}),
    changeFrequency: options.changeFrequency,
    priority: options.priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = cleanBaseUrl(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rzqllh-port.vercel.app"
  );

  const [workEn, workId, insightsEn, insightsId] = await Promise.all([
    getPublicWork("en"),
    getPublicWork("id"),
    getPublicInsights("en"),
    getPublicInsights("id"),
  ]);

  const staticPaths = ["/", "/work", "/insights", "/about", "/contact", "/resume"];
  const staticEntries = staticPaths.flatMap((path) => [
    sitemapEntry(baseUrl, path, {
      priority: path === "/" ? 1 : 0.8,
      changeFrequency: "weekly",
    }),
    sitemapEntry(baseUrl, publicPath("id", path), {
      priority: path === "/" ? 0.9 : 0.7,
      changeFrequency: "weekly",
    }),
  ]);

  const workEntries = [
    ...workEn.map((item) =>
      sitemapEntry(baseUrl, `/work/${item.slug}`, {
        lastModified: item.updatedAt,
        priority: 0.7,
        changeFrequency: "monthly",
      })
    ),
    ...workId.map((item) =>
      sitemapEntry(baseUrl, `/id/work/${item.slug}`, {
        lastModified: item.updatedAt,
        priority: 0.6,
        changeFrequency: "monthly",
      })
    ),
  ];

  const insightEntries = [
    ...insightsEn.map((item) =>
      sitemapEntry(baseUrl, `/insights/${item.slug}`, {
        lastModified: item.updatedAt ?? item.publishedAt,
        priority: 0.6,
        changeFrequency: "monthly",
      })
    ),
    ...insightsId.map((item) =>
      sitemapEntry(baseUrl, `/id/insights/${item.slug}`, {
        lastModified: item.updatedAt ?? item.publishedAt,
        priority: 0.5,
        changeFrequency: "monthly",
      })
    ),
  ];

  return [...staticEntries, ...workEntries, ...insightEntries];
}
