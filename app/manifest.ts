// Author: Zeday | https://join.co.id
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F5F5F5",
    theme_color: "#4A90E2",
    lang: "id",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
    ],
  };
}
