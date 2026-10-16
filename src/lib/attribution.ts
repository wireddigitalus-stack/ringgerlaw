export type TrafficChannel =
  | "GOOGLE_ADS"
  | "AI_SEARCH"
  | "GOOGLE_ORGANIC"
  | "OTHER_ORGANIC"
  | "SOCIAL_REFERRAL"
  | "DIRECT";

export interface AttributionData {
  trafficChannel: TrafficChannel;
  trafficSourceLabel: string;
  referrerUrl: string;
  referrerHost: string;
  landingPage: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  clickId?: string;
  deviceType: "Mobile" | "Tablet" | "Desktop";
  capturedAt: string;
}

const STORAGE_KEY = "ringgerlaw_first_touch_attribution_v1";
const SESSION_TRACKED_KEY = "ringgerlaw_session_tracked_v1";

export function detectDeviceType(userAgent: string): "Mobile" | "Tablet" | "Desktop" {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) {
    return "Tablet";
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

export function classifyTrafficSource(params: {
  referrer: string;
  search: string;
  pathname: string;
  userAgent: string;
}): AttributionData {
  const { referrer, search, pathname, userAgent } = params;
  const urlParams = new URLSearchParams(search || "");

  const utmSource = (urlParams.get("utm_source") || "").toLowerCase().trim();
  const utmMedium = (urlParams.get("utm_medium") || "").toLowerCase().trim();
  const utmCampaign = (urlParams.get("utm_campaign") || "").trim();
  const utmTerm = (urlParams.get("utm_term") || "").trim();

  const gclid = urlParams.get("gclid") || urlParams.get("gbraid") || urlParams.get("wbraid") || "";
  const msclkid = urlParams.get("msclkid") || "";
  const fbclid = urlParams.get("fbclid") || "";
  const clickId = gclid || msclkid || fbclid || "";

  let referrerHost = "";
  try {
    if (referrer) {
      referrerHost = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
    }
  } catch {
    referrerHost = "";
  }

  // Ignore internal self-referrals
  if (
    referrerHost.includes("ringgerlaw") ||
    referrerHost.includes("vercel.app") ||
    referrerHost.includes("localhost")
  ) {
    referrerHost = "";
  }

  const deviceType = detectDeviceType(userAgent);
  const capturedAt = new Date().toISOString();

  // 1. Check Paid Search / Google Ads / Microsoft Ads
  const isPaidMedium = ["cpc", "ppc", "paid", "paidsearch", "adwords", "google_ads"].includes(
    utmMedium
  );
  if (gclid || msclkid || isPaidMedium) {
    const label = msclkid
      ? `Bing Ads${utmCampaign ? ` (${utmCampaign})` : ""}`
      : `Google Ads / PPC${utmCampaign ? ` (${utmCampaign})` : ""}`;
    return {
      trafficChannel: "GOOGLE_ADS",
      trafficSourceLabel: label,
      referrerUrl: referrer || "",
      referrerHost: referrerHost || utmSource || "google.com",
      landingPage: pathname || "/",
      utmSource: utmSource || (msclkid ? "bing" : "google"),
      utmMedium: utmMedium || "cpc",
      utmCampaign: utmCampaign || undefined,
      utmTerm: utmTerm || undefined,
      clickId: clickId || undefined,
      deviceType,
      capturedAt,
    };
  }

  // 2. Check AI Search Engines (ChatGPT, Perplexity, Gemini, Claude, Copilot, You.com)
  const aiEngines: { match: string; name: string }[] = [
    { match: "chatgpt.com", name: "ChatGPT Search" },
    { match: "openai.com", name: "OpenAI / ChatGPT" },
    { match: "perplexity.ai", name: "Perplexity AI" },
    { match: "gemini.google.com", name: "Google Gemini AI" },
    { match: "claude.ai", name: "Claude AI" },
    { match: "copilot.microsoft.com", name: "Microsoft Copilot AI" },
    { match: "you.com", name: "You.com AI" },
    { match: "phind.com", name: "Phind AI" },
  ];

  const matchedAi = aiEngines.find(
    (ai) => referrerHost.includes(ai.match) || utmSource.includes(ai.match.split(".")[0])
  );
  if (matchedAi) {
    return {
      trafficChannel: "AI_SEARCH",
      trafficSourceLabel: matchedAi.name,
      referrerUrl: referrer || "",
      referrerHost: referrerHost || matchedAi.match,
      landingPage: pathname || "/",
      utmSource: utmSource || matchedAi.name,
      utmMedium: utmMedium || "ai-referral",
      utmCampaign: utmCampaign || undefined,
      utmTerm: utmTerm || undefined,
      deviceType,
      capturedAt,
    };
  }

  // 3. Check Google Organic Search & Google Maps / Business Profile
  if (
    referrerHost.includes("google.") ||
    utmSource === "google" ||
    utmSource === "gmb" ||
    utmSource === "google_my_business"
  ) {
    const isMaps =
      referrer.toLowerCase().includes("maps") ||
      utmSource === "gmb" ||
      utmCampaign.toLowerCase().includes("gmb");
    return {
      trafficChannel: "GOOGLE_ORGANIC",
      trafficSourceLabel: isMaps ? "Google Maps / Business Profile" : "Google Organic Search",
      referrerUrl: referrer || "",
      referrerHost: referrerHost || "google.com",
      landingPage: pathname || "/",
      utmSource: utmSource || "google",
      utmMedium: utmMedium || "organic",
      utmCampaign: utmCampaign || undefined,
      utmTerm: utmTerm || undefined,
      deviceType,
      capturedAt,
    };
  }

  // 4. Check Other Organic Search Engines (Bing, Yahoo, DuckDuckGo, Brave)
  const otherSearch: { match: string; name: string }[] = [
    { match: "bing.com", name: "Bing Organic Search" },
    { match: "yahoo.com", name: "Yahoo Search" },
    { match: "duckduckgo.com", name: "DuckDuckGo Search" },
    { match: "search.brave.com", name: "Brave Search" },
  ];
  const matchedSearch = otherSearch.find(
    (s) => referrerHost.includes(s.match) || utmSource === s.match.split(".")[0]
  );
  if (matchedSearch) {
    return {
      trafficChannel: "OTHER_ORGANIC",
      trafficSourceLabel: matchedSearch.name,
      referrerUrl: referrer || "",
      referrerHost: referrerHost || matchedSearch.match,
      landingPage: pathname || "/",
      utmSource: utmSource || matchedSearch.name,
      utmMedium: utmMedium || "organic",
      utmCampaign: utmCampaign || undefined,
      utmTerm: utmTerm || undefined,
      deviceType,
      capturedAt,
    };
  }

  // 5. Check Social Media & Legal Directories (Facebook, Nextdoor, Avvo, Justia, FindLaw)
  if (fbclid || referrerHost || utmSource) {
    let label = referrerHost || utmSource || "Referral";
    if (fbclid || referrerHost.includes("facebook") || utmSource.includes("facebook")) {
      label = "Facebook";
    } else if (referrerHost.includes("instagram") || utmSource.includes("instagram")) {
      label = "Instagram";
    } else if (referrerHost.includes("nextdoor") || utmSource.includes("nextdoor")) {
      label = "Nextdoor Local";
    } else if (referrerHost.includes("avvo")) {
      label = "Avvo Legal Directory";
    } else if (referrerHost.includes("justia")) {
      label = "Justia Legal Directory";
    } else if (referrerHost.includes("findlaw")) {
      label = "FindLaw Directory";
    }
    return {
      trafficChannel: "SOCIAL_REFERRAL",
      trafficSourceLabel: label,
      referrerUrl: referrer || "",
      referrerHost: referrerHost || utmSource || "referral",
      landingPage: pathname || "/",
      utmSource: utmSource || undefined,
      utmMedium: utmMedium || "referral",
      utmCampaign: utmCampaign || undefined,
      utmTerm: utmTerm || undefined,
      clickId: clickId || undefined,
      deviceType,
      capturedAt,
    };
  }

  // 6. Direct Visit
  return {
    trafficChannel: "DIRECT",
    trafficSourceLabel: "Direct Visit",
    referrerUrl: "",
    referrerHost: "direct",
    landingPage: pathname || "/",
    deviceType,
    capturedAt,
  };
}

export function captureOrGetAttribution(): AttributionData | null {
  if (typeof window === "undefined") return null;

  try {
    const current = classifyTrafficSource({
      referrer: document.referrer || "",
      search: window.location.search || "",
      pathname: window.location.pathname || "/",
      userAgent: navigator.userAgent || "",
    });

    const existingRaw = localStorage.getItem(STORAGE_KEY);
    if (existingRaw) {
      const existing = JSON.parse(existingRaw) as AttributionData;
      // Upgrade attribution if the new visit has a non-direct channel (e.g. clicked a Google Ad or Search result)
      if (current.trafficChannel !== "DIRECT") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        return current;
      }
      return existing;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch {
    return null;
  }
}

export function shouldRecordSessionVisit(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const alreadyTracked = sessionStorage.getItem(SESSION_TRACKED_KEY);
    if (alreadyTracked) return false;
    sessionStorage.setItem(SESSION_TRACKED_KEY, "1");
    return true;
  } catch {
    return false;
  }
}
