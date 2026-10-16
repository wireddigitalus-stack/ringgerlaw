import fs from "fs";
import path from "path";
import { getSupabaseClient, SUPABASE_URL } from "@/lib/supabase";
import { TrafficChannel } from "@/lib/attribution";

export type UrgencyLevel = "EMERGENCY_FORECLOSURE_REPO" | "WAGE_GARNISHMENT" | "STANDARD_DEBT_RELIEF";
export type LeadStatus = "NEW" | "CONTACTED" | "CONSULTATION_BOOKED" | "INTAKE_COMPLETED" | "RETAINED" | "ARCHIVED";
export type RecommendedChapter = "Chapter 7 ($0 Down Eligible)" | "Chapter 13 (Asset Protection Plan)" | "Chapter 7 or 13 Evaluation";

export interface LeadRecord {
  id: string;
  createdAt: string;
  firstName: string;
  lastName?: string;
  phone: string;
  email: string;
  county: string;
  primaryConcern: string;
  estimatedDebt: number;
  ownsHome: boolean;
  behindOnPayments: boolean;
  urgency: UrgencyLevel;
  recommendedChapter: RecommendedChapter;
  sourcePage: string;
  captureMethod: "60-Sec Qualifier Quiz" | "Emergency Hotline Bar" | "AI Debt Concierge" | "Free Consultation Form" | "Intake Questionnaire";
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  status: LeadStatus;
  estimatedCaseValue: number;
  // First-Touch Traffic & Ad Attribution Fields
  trafficChannel?: TrafficChannel;
  trafficSourceLabel?: string;
  referrerUrl?: string;
  landingPage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  clickId?: string;
  deviceType?: "Mobile" | "Tablet" | "Desktop";
}

export interface IntakeRecord {
  id: string;
  createdAt: string;
  leadId?: string;
  fullName: string;
  phone: string;
  email: string;
  mailingAddress: string;
  birthday: string;
  ssnLast4: string;
  maritalStatus: "Single" | "Married" | "Separated" | "Divorced" | "Widowed";
  filingWithSpouse: boolean;
  spouseName?: string;
  spouseBirthday?: string;
  dependents?: string;
  priorBankruptcyLast10Years: boolean;
  realEstateOwned: string;
  mortgagePaymentsCurrent: "Yes" | "No" | "N/A";
  receivedForeclosureNotice: boolean;
  vehiclesOwned: string;
  recreationalVehicles: string;
  paysChildSupportOrAlimony: boolean;
  supportRecipientDetails?: string;
  unpaidTaxes: string;
  hasCourtJudgmentsOrLiens: boolean;
  judgmentDetails?: string;
  creditCardsList: string;
  cashAdvanceLoans: string;
  rentToOwnItems: string;
  payFrequency: "Weekly" | "Bi-Weekly" | "Monthly" | "Other";
  grossMonthlyIncome: string;
  otherIncomeSources: string;
  involvedInPendingLawsuitPayout: boolean;
  lawsuitPayoutDetails?: string;
  rentOrMortgageMonthly: string;
  taxesIncludedInMortgage: boolean;
  insuranceIncludedInMortgage: boolean;
  monthlyFoodExpense: string;
  monthlyUtilitiesAndPhone: string;
  monthlyMedicalExpense: string;
  monthlyTransportationExpense: string;
  monthlyCarPayments: string;
  debtsInMaidenOrOtherName: boolean;
  expectingLargeSumNextYear: boolean;
  transferredPropertyLast2Years: boolean;
  usedCreditCardsLast90Days: boolean;
  movedFromAnotherStateLast2Years: boolean;
  hasCosignersOnDebts: boolean;
  hasUnfiledTaxReturns: boolean;
  debtorSignature: string;
  coDebtorSignature?: string;
  signatureDate: string;
}

export interface TrafficEventRecord {
  id: string;
  timestamp: string;
  trafficChannel: TrafficChannel;
  trafficSourceLabel: string;
  referrerHost: string;
  referrerUrl: string;
  landingPage: string;
  currentPath: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  clickId?: string;
  deviceType: "Mobile" | "Tablet" | "Desktop";
}

export interface AnalyticsSummary {
  totalVisitors30d: number;
  organicSearchVisitors30d: number;
  googleAdsVisitors30d: number;
  aiSearchReferrals30d: number;
  socialReferralVisitors30d: number;
  directVisitors30d: number;
  equivalentGoogleAdsSavingsMonthly: number;
  averageCpcBankruptcyJacksonTN: number;
  topKeywords: {
    keyword: string;
    position: number;
    monthlyVolume: number;
    cpcEquivalent: number;
    landingPage: string;
    aiCited: boolean;
  }[];
  countyDistribution: {
    county: string;
    leads: number;
    percentage: number;
  }[];
  recentTrafficEvents: TrafficEventRecord[];
}

export interface DatabaseSchema {
  leads: LeadRecord[];
  intakes: IntakeRecord[];
  analytics: AnalyticsSummary;
  storageEngine?: "supabase" | "local-fallback";
  supabaseUrl?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "ringgerlaw-db.json");
const TELEMETRY_ROW_ID = "__ANALYTICS_TELEMETRY__";

const DEFAULT_KEYWORDS = [
  {
    keyword: "bankruptcy attorney jackson tn",
    position: 1,
    monthlyVolume: 480,
    cpcEquivalent: 68.5,
    landingPage: "/",
    aiCited: true,
  },
  {
    keyword: "stop foreclosure jackson tn lawyer",
    position: 1,
    monthlyVolume: 210,
    cpcEquivalent: 84.0,
    landingPage: "/practice/stop-foreclosure-jackson-tn",
    aiCited: true,
  },
  {
    keyword: "no money down bankruptcy jackson tn",
    position: 1,
    monthlyVolume: 320,
    cpcEquivalent: 62.0,
    landingPage: "/practice/no-money-down-bankruptcy-jackson-tn",
    aiCited: true,
  },
  {
    keyword: "chapter 7 vs chapter 13 tennessee exemptions",
    position: 1,
    monthlyVolume: 590,
    cpcEquivalent: 51.0,
    landingPage: "/resources/tennessee-bankruptcy-exemptions-means-test",
    aiCited: true,
  },
  {
    keyword: "stop wage garnishment attorney west tennessee",
    position: 2,
    monthlyVolume: 190,
    cpcEquivalent: 69.0,
    landingPage: "/practice/stop-wage-garnishment-jackson-tn",
    aiCited: true,
  },
  {
    keyword: "bankruptcy lawyer gibson county tn",
    position: 1,
    monthlyVolume: 140,
    cpcEquivalent: 48.0,
    landingPage: "/locations/gibson-county-tn",
    aiCited: true,
  },
];

const COUNTY_BUCKETS = [
  "Madison County (Jackson)",
  "Gibson County (Milan / Humboldt)",
  "Haywood County (Brownsville)",
  "Henderson County (Lexington)",
  "Chester County (Henderson)",
  "Crockett County (Alamo)",
];

const INITIAL_DB: DatabaseSchema = {
  leads: [],
  intakes: [],
  analytics: {
    totalVisitors30d: 0,
    organicSearchVisitors30d: 0,
    googleAdsVisitors30d: 0,
    aiSearchReferrals30d: 0,
    socialReferralVisitors30d: 0,
    directVisitors30d: 0,
    equivalentGoogleAdsSavingsMonthly: 0,
    averageCpcBankruptcyJacksonTN: 64.5,
    topKeywords: DEFAULT_KEYWORDS,
    countyDistribution: COUNTY_BUCKETS.map((county) => ({
      county,
      leads: 0,
      percentage: 0,
    })),
    recentTrafficEvents: [],
  },
};

export function computeLiveAnalytics(
  events: TrafficEventRecord[],
  leads: LeadRecord[]
): AnalyticsSummary {
  const organicCount = events.filter(
    (e) => e.trafficChannel === "GOOGLE_ORGANIC" || e.trafficChannel === "OTHER_ORGANIC"
  ).length;
  const googleAdsCount = events.filter((e) => e.trafficChannel === "GOOGLE_ADS").length;
  const aiCount = events.filter((e) => e.trafficChannel === "AI_SEARCH").length;
  const socialCount = events.filter((e) => e.trafficChannel === "SOCIAL_REFERRAL").length;
  const directCount = events.filter((e) => e.trafficChannel === "DIRECT").length;
  const totalVisitors = events.length;

  const avgCpc = 64.5;
  const equivalentSavings = Math.round((organicCount + aiCount) * avgCpc);

  const totalLeads = leads.length;
  const countyDistribution = COUNTY_BUCKETS.map((bucket) => {
    const prefix = bucket.split(" ")[0].toLowerCase();
    const count = leads.filter((l) => (l.county || "").toLowerCase().includes(prefix)).length;
    const percentage = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
    return {
      county: bucket,
      leads: count,
      percentage,
    };
  });

  return {
    totalVisitors30d: totalVisitors,
    organicSearchVisitors30d: organicCount,
    googleAdsVisitors30d: googleAdsCount,
    aiSearchReferrals30d: aiCount,
    socialReferralVisitors30d: socialCount,
    directVisitors30d: directCount,
    equivalentGoogleAdsSavingsMonthly: equivalentSavings,
    averageCpcBankruptcyJacksonTN: avgCpc,
    topKeywords: DEFAULT_KEYWORDS,
    countyDistribution,
    recentTrafficEvents: events.slice(0, 100),
  };
}

export function getLocalDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), "utf-8");
      return INITIAL_DB;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw) as DatabaseSchema;
    const events = parsed.analytics?.recentTrafficEvents || [];
    const leads = parsed.leads || [];
    return {
      leads,
      intakes: parsed.intakes || [],
      analytics: computeLiveAnalytics(events, leads),
    };
  } catch {
    return INITIAL_DB;
  }
}

export function saveLocalDb(db: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist local DB:", err);
  }
}

// Map Supabase row -> LeadRecord
function rowToLead(r: Record<string, unknown>): LeadRecord {
  const payload = (r.payload as Partial<LeadRecord>) || {};
  return {
    id: String(r.id),
    createdAt: String(r.created_at || payload.createdAt || new Date().toISOString()),
    firstName: String(r.first_name || payload.firstName || ""),
    lastName: String(r.last_name || payload.lastName || ""),
    phone: String(r.phone || payload.phone || ""),
    email: String(r.email || payload.email || ""),
    county: String(r.county || payload.county || "Madison County (Jackson)"),
    primaryConcern: String(r.primary_concern || payload.primaryConcern || ""),
    estimatedDebt: Number(r.estimated_debt ?? payload.estimatedDebt ?? 25000),
    ownsHome: Boolean(r.owns_home ?? payload.ownsHome),
    behindOnPayments: Boolean(r.behind_on_payments ?? payload.behindOnPayments),
    urgency: (r.urgency || payload.urgency || "STANDARD_DEBT_RELIEF") as UrgencyLevel,
    recommendedChapter: (r.recommended_chapter ||
      payload.recommendedChapter ||
      "Chapter 7 ($0 Down Eligible)") as RecommendedChapter,
    sourcePage: String(r.source_page || payload.sourcePage || "/"),
    captureMethod: (r.capture_method ||
      payload.captureMethod ||
      "Free Consultation Form") as LeadRecord["captureMethod"],
    preferredDate: String(r.preferred_date || payload.preferredDate || ""),
    preferredTime: String(r.preferred_time || payload.preferredTime || ""),
    notes: String(r.notes || payload.notes || ""),
    status: (r.status || payload.status || "NEW") as LeadStatus,
    estimatedCaseValue: Number(r.estimated_case_value ?? payload.estimatedCaseValue ?? 0),
    trafficChannel: payload.trafficChannel,
    trafficSourceLabel: payload.trafficSourceLabel,
    referrerUrl: payload.referrerUrl,
    landingPage: payload.landingPage,
    utmSource: payload.utmSource,
    utmMedium: payload.utmMedium,
    utmCampaign: payload.utmCampaign,
    utmTerm: payload.utmTerm,
    clickId: payload.clickId,
    deviceType: payload.deviceType,
  };
}

export async function getDbAsync(): Promise<DatabaseSchema> {
  const localDb = getLocalDb();
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { ...localDb, storageEngine: "local-fallback", supabaseUrl: SUPABASE_URL };
  }

  try {
    const [leadsRes, intakesRes] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("intakes").select("*").order("created_at", { ascending: false }),
    ]);

    if (leadsRes.error || intakesRes.error) {
      return { ...localDb, storageEngine: "local-fallback", supabaseUrl: SUPABASE_URL };
    }

    const remoteLeads = (leadsRes.data || []).map((r) => rowToLead(r as Record<string, unknown>));

    let remoteTrafficEvents: TrafficEventRecord[] = localDb.analytics.recentTrafficEvents || [];
    const remoteIntakes: IntakeRecord[] = [];

    for (const r of intakesRes.data || []) {
      const rec = r as Record<string, unknown>;
      if (rec.id === TELEMETRY_ROW_ID) {
        const telemetryPayload = rec.payload as { events?: TrafficEventRecord[] } | undefined;
        if (telemetryPayload && Array.isArray(telemetryPayload.events)) {
          remoteTrafficEvents = telemetryPayload.events;
        }
      } else {
        remoteIntakes.push((rec.payload as IntakeRecord) || (rec as unknown as IntakeRecord));
      }
    }

    const liveAnalytics = computeLiveAnalytics(remoteTrafficEvents, remoteLeads);

    return {
      leads: remoteLeads,
      intakes: remoteIntakes,
      analytics: liveAnalytics,
      storageEngine: "supabase",
      supabaseUrl: SUPABASE_URL,
    };
  } catch {
    return { ...localDb, storageEngine: "local-fallback", supabaseUrl: SUPABASE_URL };
  }
}

export async function recordTrafficVisitAsync(
  eventInput: Omit<TrafficEventRecord, "id" | "timestamp">
): Promise<AnalyticsSummary> {
  const db = getLocalDb();
  const newEvent: TrafficEventRecord = {
    ...eventInput,
    id: `TV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
  };

  const existingEvents = db.analytics?.recentTrafficEvents || [];
  const updatedEvents = [newEvent, ...existingEvents].slice(0, 250);
  db.analytics = computeLiveAnalytics(updatedEvents, db.leads);
  saveLocalDb(db);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const existingTelemetry = await supabase
        .from("intakes")
        .select("payload")
        .eq("id", TELEMETRY_ROW_ID)
        .maybeSingle();

      const prevEvents: TrafficEventRecord[] =
        (existingTelemetry.data?.payload as { events?: TrafficEventRecord[] })?.events || [];
      const mergedEvents = [newEvent, ...prevEvents].slice(0, 250);

      await supabase.from("intakes").upsert({
        id: TELEMETRY_ROW_ID,
        created_at: new Date().toISOString(),
        lead_id: "",
        full_name: "SYSTEM_ANALYTICS_TELEMETRY",
        phone: "0000000000",
        email: "",
        debtor_signature: "SYSTEM",
        signature_date: new Date().toISOString().slice(0, 10),
        payload: { events: mergedEvents },
      });

      return computeLiveAnalytics(mergedEvents, db.leads);
    } catch (e) {
      console.error("Supabase telemetry sync fallback:", e);
    }
  }

  return db.analytics;
}

export async function addLeadAsync(
  input: Omit<
    LeadRecord,
    "id" | "createdAt" | "urgency" | "recommendedChapter" | "status" | "estimatedCaseValue"
  >
): Promise<LeadRecord> {
  const db = getLocalDb();
  const concernLower = input.primaryConcern.toLowerCase();

  let urgency: UrgencyLevel = "STANDARD_DEBT_RELIEF";
  if (
    concernLower.includes("foreclosure") ||
    concernLower.includes("repo") ||
    concernLower.includes("house") ||
    concernLower.includes("car")
  ) {
    urgency = "EMERGENCY_FORECLOSURE_REPO";
  } else if (
    concernLower.includes("garnish") ||
    concernLower.includes("lawsuit") ||
    concernLower.includes("judgment")
  ) {
    urgency = "WAGE_GARNISHMENT";
  }

  let recommendedChapter: RecommendedChapter = "Chapter 7 ($0 Down Eligible)";
  const estimatedCaseValue = 0;
  if (
    (input.ownsHome && input.behindOnPayments) ||
    concernLower.includes("foreclosure") ||
    concernLower.includes("repo") ||
    concernLower.includes("chapter 13")
  ) {
    recommendedChapter = "Chapter 13 (Asset Protection Plan)";
  }

  const newLead: LeadRecord = {
    ...input,
    id: `LD-2026-${String(Date.now()).slice(-4)}${Math.floor(10 + Math.random() * 89)}`,
    createdAt: new Date().toISOString(),
    urgency,
    recommendedChapter,
    status: input.preferredDate ? "CONSULTATION_BOOKED" : "NEW",
    estimatedCaseValue,
  };

  db.leads.unshift(newLead);
  db.analytics = computeLiveAnalytics(db.analytics.recentTrafficEvents || [], db.leads);
  saveLocalDb(db);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("leads").upsert({
        id: newLead.id,
        created_at: newLead.createdAt,
        first_name: newLead.firstName,
        last_name: newLead.lastName || "",
        phone: newLead.phone,
        email: newLead.email || "",
        county: newLead.county,
        primary_concern: newLead.primaryConcern,
        estimated_debt: newLead.estimatedDebt,
        owns_home: newLead.ownsHome,
        behind_on_payments: newLead.behindOnPayments,
        urgency: newLead.urgency,
        recommended_chapter: newLead.recommendedChapter,
        source_page: newLead.sourcePage,
        capture_method: newLead.captureMethod,
        preferred_date: newLead.preferredDate || "",
        preferred_time: newLead.preferredTime || "",
        notes: newLead.notes || "",
        status: newLead.status,
        estimated_case_value: newLead.estimatedCaseValue,
        payload: newLead,
      });
      if (error) {
        console.error("Supabase lead upsert error:", error);
      }
    } catch (e) {
      console.error("Supabase lead insert fallback:", e);
    }
  }

  return newLead;
}

export async function updateLeadStatusAsync(
  id: string,
  status?: LeadStatus,
  notes?: string
): Promise<LeadRecord | null> {
  const db = getLocalDb();
  const lead = db.leads.find((l) => l.id === id);
  if (lead) {
    if (status) lead.status = status;
    if (typeof notes === "string") lead.notes = notes;
    saveLocalDb(db);
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const patch: Record<string, unknown> = {};
      if (status) patch.status = status;
      if (typeof notes === "string") patch.notes = notes;
      await supabase.from("leads").update(patch).eq("id", id);
    } catch (e) {
      console.error("Supabase lead update fallback:", e);
    }
  }

  return lead || null;
}

export async function deleteLeadAsync(id: string): Promise<boolean> {
  const db = getLocalDb();
  db.leads = db.leads.filter((l) => l.id !== id);
  db.analytics = computeLiveAnalytics(db.analytics.recentTrafficEvents || [], db.leads);
  saveLocalDb(db);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("leads").delete().eq("id", id);
    } catch (e) {
      console.error("Supabase lead delete fallback:", e);
    }
  }
  return true;
}

export async function resetAllDataAsync(): Promise<void> {
  saveLocalDb(INITIAL_DB);
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("leads").delete().neq("id", "__NONE__");
      await supabase.from("intakes").delete().neq("id", "__NONE__");
    } catch (e) {
      console.error("Supabase reset error:", e);
    }
  }
}

export async function addIntakeAsync(
  input: Omit<IntakeRecord, "id" | "createdAt"> & {
    trafficChannel?: TrafficChannel;
    trafficSourceLabel?: string;
    referrerUrl?: string;
    landingPage?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    clickId?: string;
    deviceType?: "Mobile" | "Tablet" | "Desktop";
  }
): Promise<IntakeRecord> {
  const db = getLocalDb();
  const newIntake: IntakeRecord = {
    ...input,
    id: `INT-2026-${String(Date.now()).slice(-4)}${Math.floor(10 + Math.random() * 89)}`,
    createdAt: new Date().toISOString(),
  };
  db.intakes.unshift(newIntake);

  const createdLead = await addLeadAsync({
    firstName: input.fullName.trim().split(" ")[0] || input.fullName,
    lastName: input.fullName.trim().split(" ").slice(1).join(" "),
    phone: input.phone,
    email: input.email,
    county: "Madison County (Jackson)",
    primaryConcern: input.receivedForeclosureNotice
      ? "Stop Foreclosure (Full Intake Submitted)"
      : input.hasCourtJudgmentsOrLiens
      ? "Stop Garnishment / Judgment (Full Intake Submitted)"
      : "Full Bankruptcy Intake Questionnaire Submitted",
    estimatedDebt: 35000,
    ownsHome:
      input.realEstateOwned.toLowerCase() !== "none" && input.realEstateOwned.trim() !== "",
    behindOnPayments:
      input.mortgagePaymentsCurrent === "No" || input.receivedForeclosureNotice,
    sourcePage: "/intake",
    captureMethod: "Intake Questionnaire",
    notes: `Full Court Intake Packet #${newIntake.id} completed and signed by ${input.debtorSignature}.`,
    trafficChannel: input.trafficChannel,
    trafficSourceLabel: input.trafficSourceLabel,
    referrerUrl: input.referrerUrl,
    landingPage: input.landingPage,
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
    utmTerm: input.utmTerm,
    clickId: input.clickId,
    deviceType: input.deviceType,
  });
  newIntake.leadId = createdLead.id;
  saveLocalDb(db);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("intakes").upsert({
        id: newIntake.id,
        created_at: newIntake.createdAt,
        lead_id: newIntake.leadId || "",
        full_name: newIntake.fullName,
        phone: newIntake.phone,
        email: newIntake.email || "",
        mailing_address: newIntake.mailingAddress || "",
        birthday: newIntake.birthday || "",
        ssn_last4: newIntake.ssnLast4 || "",
        marital_status: newIntake.maritalStatus,
        filing_with_spouse: newIntake.filingWithSpouse,
        debtor_signature: newIntake.debtorSignature,
        signature_date: newIntake.signatureDate,
        payload: newIntake,
      });
      if (error) {
        console.error("Supabase intake upsert error:", error);
      }
    } catch (e) {
      console.error("Supabase intake insert fallback:", e);
    }
  }

  return newIntake;
}
