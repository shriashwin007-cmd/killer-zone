import type { MetadataRoute } from "next";

const SITE_URL = "https://killerzone.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/menu/beverages`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/menu/snacks`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
