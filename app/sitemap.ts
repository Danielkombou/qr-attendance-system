import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

  return [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/sign-in`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/get-started`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
