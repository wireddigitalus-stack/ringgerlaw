import { NextRequest } from "next/server";

export interface BotCheckInput {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  notes?: string;
  preferredDate?: string;
  primaryConcern?: string;
  // Honeypot & timing trap fields
  companyWebsite?: string;
  faxNumber?: string;
  website?: string;
  formStartedAt?: number | string;
}

export interface BotCheckResult {
  blocked: boolean;
  reason?: string;
}

const ipSubmissionLog = new Map<string, number[]>();

const BLOCKED_EMAIL_DOMAINS = [
  "vettedvas.com",
  "trustedvirtualteam.com",
  "melottogroup.com",
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "10minutemail.com",
  "yopmail.com",
  "sharklasers.com",
];

const SOLICITATION_KEYWORDS = [
  "virtual assistant",
  "vetted va",
  "offshore staff",
  "paralegal staffing",
  "seo services",
  "google ranking",
  "backlinks",
  "lead generation agency",
  "pay per lead",
  "web design services",
  "digital marketing agency",
  "crypto recovery",
  "whatsapp",
  "telegram",
];

export function escapeHtml(input: string | number | boolean | undefined | null): string {
  if (input === undefined || input === null) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isGibberishWord(word: string): boolean {
  const clean = word.replace(/[^a-zA-Z]/g, "");
  if (clean.length < 2) return false;

  // Any name token >= 4 chars with zero vowels (a,e,i,o,u,y) is bot gibberish (e.g. "Nxnvq", "Qabl")
  if (clean.length >= 4 && !/[aeiouyAEIOUY]/.test(clean)) {
    return true;
  }

  // 5+ consecutive consonants in a name (e.g. "Nxnvq", "Tuboxb")
  if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(clean)) {
    return true;
  }

  // Extremely high consonant-to-vowel ratio in a single 6+ char name token (e.g. "Mumbaumt", "Tuboxb")
  if (clean.length >= 6) {
    const vowels = (clean.match(/[aeiouy]/gi) || []).length;
    if (vowels <= 1) return true;
    // Random bot string ending in impossible English bigrams like "xb", "vq", "mt", "qj", "zx"
    if (/(xb|vq|qj|zx|kx|jq|qz|vx|umt|bx)$/i.test(clean)) {
      return true;
    }
  }

  return false;
}

function isInvalidNorthAmericanPhone(rawPhone: string): string | null {
  let digits = (rawPhone || "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }

  if (digits.length !== 10) {
    return "Phone number must be a valid 10-digit US number";
  }

  // Block Ringger Law's own number being spoofed as client callback
  if (digits === "7314211501") {
    return "Self-spoofed office phone number (731-421-1501)";
  }

  // Block repeating digits (e.g. 2222222222) or sequential test strings
  if (/^(\d)\1{9}$/.test(digits) || digits === "1234567890" || digits === "0123456789") {
    return "Invalid repeating/sequential phone number";
  }

  const areaCode = digits.slice(0, 3);
  const exchange = digits.slice(3, 6);

  // NANP rules: Neither Area Code (NPA) nor Exchange (NXX) can start with 0 or 1, nor be 911 or 555
  if (
    areaCode.startsWith("0") ||
    areaCode.startsWith("1") ||
    areaCode === "911" ||
    areaCode === "555"
  ) {
    return `Invalid US area code (${areaCode})`;
  }

  if (
    exchange.startsWith("0") ||
    exchange.startsWith("1") ||
    exchange === "911" ||
    exchange === "555"
  ) {
    return `Invalid US central office exchange (${exchange})`;
  }

  return null;
}

function isSuspiciousEmail(rawEmail: string): string | null {
  const email = (rawEmail || "").trim().toLowerCase();
  if (!email) return null;

  const parts = email.split("@");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return "Malformed email address";
  }

  const [local, domain] = parts;

  // Check blocked cold-outreach / disposable domains
  if (
    BLOCKED_EMAIL_DOMAINS.includes(domain) ||
    domain.includes("vettedva") ||
    domain.includes("virtualassistant") ||
    domain.includes("trustedvirtual")
  ) {
    return `Blocked solicitation/disposable email domain (${domain})`;
  }

  // Dotted-Gmail bot generator pattern: e.g. "u.q.adi.ye.4.3.5@gmail.com" or "or.e.qera7.3.8@gmail.com"
  const dotCount = (local.match(/\./g) || []).length;
  if (
    (domain === "gmail.com" || domain === "googlemail.com") &&
    (dotCount >= 3 || /\.[a-z0-9]\.[a-z0-9]/i.test(local))
  ) {
    return `Dotted-Gmail bot generator pattern (${email})`;
  }

  return null;
}

export function verifyHumanSubmission(
  input: BotCheckInput,
  req?: NextRequest
): BotCheckResult {
  // 1. Honeypot trap check
  if (
    (input.companyWebsite && String(input.companyWebsite).trim() !== "") ||
    (input.faxNumber && String(input.faxNumber).trim() !== "") ||
    (input.website && String(input.website).trim() !== "")
  ) {
    return { blocked: true, reason: "Honeypot trap field populated" };
  }

  // 2. Human interaction timing check (if formStartedAt is present, require >= 1.8s)
  if (input.formStartedAt) {
    const started = Number(input.formStartedAt);
    if (!Number.isNaN(started) && started > 0) {
      const elapsedMs = Date.now() - started;
      if (elapsedMs >= 0 && elapsedMs < 1800) {
        return { blocked: true, reason: `Form submitted too fast (${elapsedMs}ms)` };
      }
    }
  }

  // 3. Per-IP burst rate limiting (max 4 submissions per 10 minutes per IP)
  if (req) {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    if (ip && ip !== "unknown" && ip !== "127.0.0.1" && ip !== "::1") {
      const now = Date.now();
      const windowStart = now - 10 * 60 * 1000;
      const recent = (ipSubmissionLog.get(ip) || []).filter((t) => t > windowStart);
      if (recent.length >= 4) {
        return { blocked: true, reason: `IP rate limit exceeded (${ip})` };
      }
      recent.push(now);
      ipSubmissionLog.set(ip, recent);
    }
  }

  // 4. Name validation (no URLs, digits, or consonant-mashed gibberish)
  const combinedName = `${input.firstName || ""} ${input.lastName || ""} ${input.fullName || ""}`.trim();
  if (!combinedName || combinedName.length < 2) {
    return { blocked: true, reason: "Missing client name" };
  }
  if (/https?:\/\/|www\.|<script|<a\s|\d{3,}/i.test(combinedName)) {
    return { blocked: true, reason: "URL, HTML, or numbers injected into name field" };
  }

  const nameTokens = combinedName.split(/\s+/).filter(Boolean);
  for (const token of nameTokens) {
    if (isGibberishWord(token)) {
      return { blocked: true, reason: `Gibberish bot name detected (${token})` };
    }
  }

  // 5. Phone validation
  const phoneError = isInvalidNorthAmericanPhone(input.phone || "");
  if (phoneError) {
    return { blocked: true, reason: phoneError };
  }

  // 6. Email validation
  const emailError = isSuspiciousEmail(input.email || "");
  if (emailError) {
    return { blocked: true, reason: emailError };
  }

  // 7. Preferred date check (block past dates like "1970-05-31")
  if (input.preferredDate && String(input.preferredDate).trim() !== "") {
    const dateStr = String(input.preferredDate).trim();
    const parsedTime = Date.parse(dateStr);
    if (!Number.isNaN(parsedTime)) {
      const twoDaysAgo = Date.now() - 2 * 86400 * 1000;
      const oneYearAhead = Date.now() + 370 * 86400 * 1000;
      if (parsedTime < twoDaysAgo || parsedTime > oneYearAhead) {
        return { blocked: true, reason: `Out-of-range preferredDate (${dateStr})` };
      }
    }
  }

  // 8. Notes & Phishing Link / Numeric-Bot-Note check
  const notes = String(input.notes || "").trim();
  if (notes) {
    // Block clickable URLs / phishing links in notes
    if (/https?:\/\/|www\.[a-z0-9-]+|bit\.ly\/|tinyurl\.com|t\.me\/|wa\.me\/|<script|<a\s|href=/i.test(notes)) {
      return { blocked: true, reason: "Phishing link or HTML detected in notes" };
    }

    // Block /book-online bot pattern where "Client notes: 4504195682" is a pure 7-12 digit integer
    if (/Client notes:\s*\d{6,14}\s*$/i.test(notes) || /^\d{6,14}$/.test(notes)) {
      return { blocked: true, reason: "Bot numeric-only client notes detected" };
    }

    const lowerNotes = notes.toLowerCase();
    for (const kw of SOLICITATION_KEYWORDS) {
      if (lowerNotes.includes(kw)) {
        return { blocked: true, reason: `Cold solicitation keyword detected (${kw})` };
      }
    }
  }

  return { blocked: false };
}
