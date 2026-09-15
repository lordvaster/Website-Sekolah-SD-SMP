// Author: Zeday | https://join.co.id
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { newsArticles } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/tentang",
    "/program",
    "/galeri",
    "/berita",
    "/kontak",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const newsRoutes = newsArticles.map((article) => ({
    url: `${siteConfig.url}/berita/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...newsRoutes];
}
