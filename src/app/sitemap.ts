import { MetadataRoute } from "next";
import { PRACTICE_AREAS, COUNTY_LOCATIONS } from "@/lib/seo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.ringgerlaw.com";
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/solutions`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/book-online`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/intake`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${baseUrl}/resources/tennessee-bankruptcy-exemptions-means-test`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: `${baseUrl}/terms-and-conditions`, lastModified, changeFrequency: "yearly", priority: 0.4 },
  ];

  const practiceRoutes: MetadataRoute.Sitemap = PRACTICE_AREAS.map((p) => ({
    url: `${baseUrl}/practice/${p.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.95,
  }));

  const countyRoutes: MetadataRoute.Sitemap = COUNTY_LOCATIONS.map((c) => ({
    url: `${baseUrl}/locations/${c.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...practiceRoutes, ...countyRoutes];
}
