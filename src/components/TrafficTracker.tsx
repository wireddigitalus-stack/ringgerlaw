"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureOrGetAttribution, shouldRecordSessionVisit } from "@/lib/attribution";

export function TrafficTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname?.startsWith("/admin")) return;

    // Skip automated headless crawlers/bots from inflating human visitor counts
    const ua = navigator.userAgent || "";
    if (/bot|crawler|spider|crawling|lighthouse/i.test(ua)) return;

    const attribution = captureOrGetAttribution();
    if (!attribution) return;

    if (shouldRecordSessionVisit()) {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...attribution,
          currentPath: pathname || "/",
        }),
      }).catch(() => {
        // Non-blocking telemetry
      });
    }
  }, [pathname]);

  return null;
}
