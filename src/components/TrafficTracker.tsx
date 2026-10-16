"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureOrGetAttribution, shouldRecordSessionVisit } from "@/lib/attribution";
import { trackGoogleAdsConversion } from "@/lib/google-ads";

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

  // Global Click-to-Call (tel:7314211501) Conversion Listener for Google Ads #164-867-7882
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname?.startsWith("/admin")) return;

    function handlePhoneClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (anchor) {
        trackGoogleAdsConversion({
          action: "PHONE_CALL_CLICK",
          captureMethod: `Click-to-Call (${anchor.getAttribute("href") || "tel:7314211501"})`,
          primaryConcern: "Direct Phone Call Inquiry",
        });
      }
    }

    document.addEventListener("click", handlePhoneClick, { passive: true });
    return () => document.removeEventListener("click", handlePhoneClick);
  }, [pathname]);

  return null;
}
