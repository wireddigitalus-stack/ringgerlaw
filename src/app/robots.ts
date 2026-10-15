import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Google-Extended", "ClaudeBot"],
        allow: ["/", "/llms.txt", "/practice/", "/locations/", "/resources/"],
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: "https://www.ringgerlaw.com/sitemap.xml",
  };
}
