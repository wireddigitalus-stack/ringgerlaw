"use client";

import { captureOrGetAttribution } from "@/lib/attribution";

export const GOOGLE_ADS_ACCOUNT_ID = "164-867-7882";
export const GOOGLE_ADS_TAG_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-1648677882";

export const GOOGLE_ADS_TRACKING_TEMPLATE =
  "{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&matchtype={matchtype}&network={network}&device={device}";

export type GoogleAdsConversionAction =
  | "LEAD_FORM_SUBMIT"
  | "QUIZ_QUALIFIED_LEAD"
  | "EMERGENCY_STAY_LEAD"
  | "AI_CONCIERGE_LEAD"
  | "CONSULTATION_BOOKED"
  | "COURT_INTAKE_SUBMIT"
  | "PHONE_CALL_CLICK";

export interface GoogleAdsConversionPayload {
  action: GoogleAdsConversionAction;
  leadId?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  county?: string;
  primaryConcern?: string;
  captureMethod?: string;
  value?: number;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Formats a US phone number into E.164 (+1XXXXXXXXXX) for Google Ads Enhanced Conversions.
 */
export function formatE164Phone(rawPhone?: string): string | undefined {
  if (!rawPhone) return undefined;
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return undefined;
}

/**
 * Fires Google Ads Conversion Events + Enhanced Conversions user_data + GA4 Key Events.
 */
export function trackGoogleAdsConversion(payload: GoogleAdsConversionPayload): void {
  if (typeof window === "undefined") return;

  const attribution = captureOrGetAttribution();
  const gtag = window.gtag;

  const e164Phone = formatE164Phone(payload.phone);
  const cleanEmail = payload.email?.trim().toLowerCase() || undefined;

  // 1. Push Enhanced Conversions user_data if available
  if (gtag && (e164Phone || cleanEmail || payload.firstName)) {
    const userData: Record<string, unknown> = {};
    if (cleanEmail) userData.email = cleanEmail;
    if (e164Phone) userData.phone_number = e164Phone;
    if (payload.firstName || payload.lastName) {
      userData.address = {
        first_name: payload.firstName?.trim().toLowerCase() || "",
        last_name: payload.lastName?.trim().toLowerCase() || "",
        region: "TN",
        country: "US",
      };
    }
    gtag("set", "user_data", userData);
  }

  // 2. Map to standard Google Key Event name
  const eventNameMap: Record<GoogleAdsConversionAction, string> = {
    LEAD_FORM_SUBMIT: "generate_lead",
    QUIZ_QUALIFIED_LEAD: "qualify_lead",
    EMERGENCY_STAY_LEAD: "generate_lead",
    AI_CONCIERGE_LEAD: "generate_lead",
    CONSULTATION_BOOKED: "schedule_consultation",
    COURT_INTAKE_SUBMIT: "submit_court_intake",
    PHONE_CALL_CLICK: "click_to_call",
  };

  const eventName = eventNameMap[payload.action] || "generate_lead";
  const transactionId = payload.leadId || `RL-${Date.now()}`;

  const eventParams: Record<string, unknown> = {
    google_ads_account: GOOGLE_ADS_ACCOUNT_ID,
    conversion_action: payload.action,
    transaction_id: transactionId,
    currency: "USD",
    value: payload.value ?? 0,
    capture_method: payload.captureMethod || payload.action,
    county: payload.county || "Madison County (Jackson)",
    primary_concern: payload.primaryConcern || "",
    traffic_channel: attribution?.trafficChannel || "DIRECT",
    traffic_source: attribution?.trafficSourceLabel || "Direct",
    gclid: attribution?.clickId || "",
    utm_campaign: attribution?.utmCampaign || "",
    utm_term: attribution?.utmTerm || "",
  };

  if (gtag) {
    // Fire GA4 / Google Tag Key Event
    gtag("event", eventName, eventParams);

    // Fire explicit Google Ads AW-Conversion event
    const customLabel =
      payload.action === "COURT_INTAKE_SUBMIT"
        ? process.env.NEXT_PUBLIC_GOOGLE_ADS_INTAKE_LABEL
        : payload.action === "PHONE_CALL_CLICK"
        ? process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL
        : process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;

    const sendTo = customLabel
      ? `${GOOGLE_ADS_TAG_ID}/${customLabel}`
      : GOOGLE_ADS_TAG_ID;

    gtag("event", "conversion", {
      send_to: sendTo,
      value: payload.value ?? 0,
      currency: "USD",
      transaction_id: transactionId,
    });
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
    });
  }
}
