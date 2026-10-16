import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/blank"],
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "Google-Extended",
          "ClaudeBot",
          "anthropic-ai",
          "Applebot-Extended",
        ],
        allow: ["/", "/llms.txt", "/practice/", "/locations/", "/resources/"],
        disallow: ["/admin", "/api/", "/blank"],
      },
    ],
    host: "https://www.ringgerlaw.com",
    sitemap: "https://www.ringgerlaw.com/sitemap.xml",
  };
}
