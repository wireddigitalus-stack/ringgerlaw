import fs from "fs";
import path from "path";
import { getSupabaseClient, SUPABASE_URL } from "@/lib/supabase";

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

export interface AnalyticsSummary {
  totalVisitors30d: number;
  organicSearchVisitors30d: number;
  aiSearchReferrals30d: number;
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

const INITIAL_DB: DatabaseSchema = {
  leads: [
    {
      id: "LD-2026-1091",
      createdAt: "2026-10-15T16:14:00-04:00",
      firstName: "Marcus",
      lastName: "Henderson",
      phone: "(731) 555-0194",
      email: "m.henderson731@gmail.com",
      county: "Madison County (Jackson)",
      primaryConcern: "Stop Foreclosure & Catch Up Mortgage",
      estimatedDebt: 68500,
      ownsHome: true,
      behindOnPayments: true,
      urgency: "EMERGENCY_FORECLOSURE_REPO",
      recommendedChapter: "Chapter 13 (Asset Protection Plan)",
      sourcePage: "/practice/stop-foreclosure-jackson-tn",
      captureMethod: "60-Sec Qualifier Quiz",
      preferredDate: "2026-10-16",
      preferredTime: "10:00 AM",
      notes: "Received notice of trustee sale set for Nov 4. Wants to save family home on North Highland and consolidate $22k in medical bills from Jackson-Madison County General.",
      status: "CONSULTATION_BOOKED",
      estimatedCaseValue: 3800,
    },
    {
      id: "LD-2026-1090",
      createdAt: "2026-10-15T13:42:00-04:00",
      firstName: "Tammy",
      lastName: "Wilkins",
      phone: "(731) 555-0148",
      email: "tammy.wilkins82@yahoo.com",
      county: "Gibson County (Milan / Humboldt)",
      primaryConcern: "Eliminate Credit Card & Medical Debt",
      estimatedDebt: 41200,
      ownsHome: false,
      behindOnPayments: true,
      urgency: "STANDARD_DEBT_RELIEF",
      recommendedChapter: "Chapter 7 ($0 Down Eligible)",
      sourcePage: "/locations/gibson-county-tn",
      captureMethod: "60-Sec Qualifier Quiz",
      preferredDate: "2026-10-16",
      preferredTime: "2:00 PM",
      notes: "Qualifies for $0 Down Chapter 7. Overwhelmed by 6 credit cards and ER medical bills. Wants to keep her 2020 Honda CR-V.",
      status: "NEW",
      estimatedCaseValue: 1850,
    },
    {
      id: "LD-2026-1089",
      createdAt: "2026-10-15T09:18:00-04:00",
      firstName: "Derrick",
      lastName: "Caldwell",
      phone: "(731) 555-0277",
      email: "dcaldwell.tn@outlook.com",
      county: "Madison County (Jackson)",
      primaryConcern: "Stop Wage Garnishment Immediately",
      estimatedDebt: 29400,
      ownsHome: false,
      behindOnPayments: true,
      urgency: "WAGE_GARNISHMENT",
      recommendedChapter: "Chapter 7 ($0 Down Eligible)",
      sourcePage: "/practice/stop-wage-garnishment-jackson-tn",
      captureMethod: "Emergency Hotline Bar",
      preferredDate: "2026-10-15",
      preferredTime: "4:00 PM",
      notes: "Collection law firm just served payroll garnishment at his plant job in Jackson. Taking 25% of his check starting Friday. Needs immediate automatic stay.",
      status: "INTAKE_COMPLETED",
      estimatedCaseValue: 1850,
    },
    {
      id: "LD-2026-1088",
      createdAt: "2026-10-14T21:50:00-04:00",
      firstName: "Brenda",
      lastName: "Montgomery",
      phone: "(731) 555-0831",
      email: "brenda.m1974@gmail.com",
      county: "Haywood County (Brownsville)",
      primaryConcern: "Stop Vehicle Repossession",
      estimatedDebt: 34000,
      ownsHome: true,
      behindOnPayments: true,
      urgency: "EMERGENCY_FORECLOSURE_REPO",
      recommendedChapter: "Chapter 13 (Asset Protection Plan)",
      sourcePage: "/practice/stop-repossession-jackson-tn",
      captureMethod: "AI Debt Concierge",
      preferredDate: "2026-10-15",
      preferredTime: "11:00 AM",
      notes: "2 months behind on F-150 truck payment, lender threatened repo. Needs truck to commute from Brownsville to Jackson.",
      status: "RETAINED",
      estimatedCaseValue: 3800,
    },
    {
      id: "LD-2026-1087",
      createdAt: "2026-10-14T15:10:00-04:00",
      firstName: "Kenneth & Sarah",
      lastName: "Pruitt",
      phone: "(731) 555-0612",
      email: "kpruitt.family@gmail.com",
      county: "Henderson County (Lexington)",
      primaryConcern: "Eliminate Credit Card & Medical Debt",
      estimatedDebt: 84000,
      ownsHome: true,
      behindOnPayments: false,
      urgency: "STANDARD_DEBT_RELIEF",
      recommendedChapter: "Chapter 7 ($0 Down Eligible)",
      sourcePage: "/practice/chapter-7-bankruptcy-jackson-tn",
      captureMethod: "Free Consultation Form",
      preferredDate: "2026-10-14",
      preferredTime: "1:00 PM",
      notes: "Mortgage is current (~$26k equity, fully exempt under TN homestead exemption for married couple). Wiping out $84k in unsecured debt.",
      status: "RETAINED",
      estimatedCaseValue: 2200,
    },
    {
      id: "LD-2026-1086",
      createdAt: "2026-10-13T18:22:00-04:00",
      firstName: "Patricia",
      lastName: "Vaughn",
      phone: "(731) 555-0911",
      email: "pvaughn_chester@gmail.com",
      county: "Chester County (Henderson)",
      primaryConcern: "Eliminate Medical & Cash Advance Debt",
      estimatedDebt: 19500,
      ownsHome: false,
      behindOnPayments: true,
      urgency: "STANDARD_DEBT_RELIEF",
      recommendedChapter: "Chapter 7 ($0 Down Eligible)",
      sourcePage: "/locations/chester-county-tn",
      captureMethod: "60-Sec Qualifier Quiz",
      status: "CONTACTED",
      notes: "Trapped in 4 high-interest cash advance / payday loans in Henderson plus hospital bills.",
      estimatedCaseValue: 1850,
    },
    {
      id: "LD-2026-1085",
      createdAt: "2026-10-12T11:05:00-04:00",
      firstName: "Robert",
      lastName: "Alston",
      phone: "(731) 555-0443",
      email: "ralston.crockett@yahoo.com",
      county: "Crockett County (Alamo / Bells)",
      primaryConcern: "Stop Foreclosure & Tax Debt",
      estimatedDebt: 92000,
      ownsHome: true,
      behindOnPayments: true,
      urgency: "EMERGENCY_FORECLOSURE_REPO",
      recommendedChapter: "Chapter 13 (Asset Protection Plan)",
      sourcePage: "/locations/crockett-county-tn",
      captureMethod: "60-Sec Qualifier Quiz",
      status: "RETAINED",
      notes: "Filing Chapter 13 repayment plan to cure $11,400 mortgage arrears over 60 months and halt collection calls.",
      estimatedCaseValue: 3800,
    },
  ],
  intakes: [
    {
      id: "INT-2026-401",
      createdAt: "2026-10-15T10:05:00-04:00",
      leadId: "LD-2026-1089",
      fullName: "Derrick Wayne Caldwell",
      phone: "(731) 555-0277",
      email: "dcaldwell.tn@outlook.com",
      mailingAddress: "418 Old Hickory Blvd, Apt 12B, Jackson, TN 38305",
      birthday: "1984-06-14",
      ssnLast4: "4829",
      maritalStatus: "Single",
      filingWithSpouse: false,
      dependents: "1 Son (Age 9)",
      priorBankruptcyLast10Years: false,
      realEstateOwned: "None (Renting apartment)",
      mortgagePaymentsCurrent: "N/A",
      receivedForeclosureNotice: false,
      vehiclesOwned: "2018 Chevrolet Malibu (Financed with Ally Auto, balance $6,200, current on payments)",
      recreationalVehicles: "None",
      paysChildSupportOrAlimony: true,
      supportRecipientDetails: "Jessica Caldwell — $450/mo current via wage assignment",
      unpaidTaxes: "None",
      hasCourtJudgmentsOrLiens: true,
      judgmentDetails: "Midland Credit Management v. Caldwell, Madison County General Sessions Court, Case #26-GS-1942 (Wage Garnishment served 10/14/2026)",
      creditCardsList: "Capital One ($6,400), Synchrony CareCredit ($4,800), Discover ($7,100)",
      cashAdvanceLoans: "Advance Financial 24/7 ($2,400)",
      rentToOwnItems: "None",
      payFrequency: "Bi-Weekly",
      grossMonthlyIncome: "$3,850",
      otherIncomeSources: "None",
      involvedInPendingLawsuitPayout: false,
      rentOrMortgageMonthly: "$1,150",
      taxesIncludedInMortgage: false,
      insuranceIncludedInMortgage: false,
      monthlyFoodExpense: "$650",
      monthlyUtilitiesAndPhone: "$340",
      monthlyMedicalExpense: "$120",
      monthlyTransportationExpense: "$280",
      monthlyCarPayments: "$315",
      debtsInMaidenOrOtherName: false,
      expectingLargeSumNextYear: false,
      transferredPropertyLast2Years: false,
      usedCreditCardsLast90Days: false,
      movedFromAnotherStateLast2Years: false,
      hasCosignersOnDebts: false,
      hasUnfiledTaxReturns: false,
      debtorSignature: "Derrick Wayne Caldwell",
      signatureDate: "2026-10-15",
    },
  ],
  analytics: {
    totalVisitors30d: 3480,
    organicSearchVisitors30d: 2410,
    aiSearchReferrals30d: 685,
    directVisitors30d: 385,
    equivalentGoogleAdsSavingsMonthly: 14850,
    averageCpcBankruptcyJacksonTN: 64.5,
    topKeywords: [
      {
        keyword: "bankruptcy attorney jackson tn",
        position: 1,
        monthlyVolume: 480,
        cpcEquivalent: 78.5,
        landingPage: "/",
        aiCited: true,
      },
      {
        keyword: "stop foreclosure lawyer jackson tn",
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
    ],
    countyDistribution: [
      { county: "Madison County (Jackson)", leads: 24, percentage: 46 },
      { county: "Gibson County (Milan/Humboldt)", leads: 10, percentage: 19 },
      { county: "Haywood County (Brownsville)", leads: 6, percentage: 12 },
      { county: "Henderson County (Lexington)", leads: 5, percentage: 10 },
      { county: "Chester County (Henderson)", leads: 4, percentage: 8 },
      { county: "Crockett County (Alamo)", leads: 3, percentage: 5 },
    ],
  },
};

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
    return JSON.parse(raw) as DatabaseSchema;
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
    estimatedCaseValue: Number(r.estimated_case_value ?? payload.estimatedCaseValue ?? 1850),
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
    const remoteIntakes = (intakesRes.data || []).map((r) => {
      const rec = r as Record<string, unknown>;
      return (rec.payload as IntakeRecord) || (rec as unknown as IntakeRecord);
    });

    // If Supabase tables are freshly created and empty, seed them with initial records
    if (remoteLeads.length === 0 && localDb.leads.length > 0) {
      await Promise.all(
        localDb.leads.map((l) =>
          supabase.from("leads").upsert({
            id: l.id,
            created_at: l.createdAt,
            first_name: l.firstName,
            last_name: l.lastName || "",
            phone: l.phone,
            email: l.email || "",
            county: l.county,
            primary_concern: l.primaryConcern,
            estimated_debt: l.estimatedDebt,
            owns_home: l.ownsHome,
            behind_on_payments: l.behindOnPayments,
            urgency: l.urgency,
            recommended_chapter: l.recommendedChapter,
            source_page: l.sourcePage,
            capture_method: l.captureMethod,
            preferred_date: l.preferredDate || "",
            preferred_time: l.preferredTime || "",
            notes: l.notes || "",
            status: l.status,
            estimated_case_value: l.estimatedCaseValue,
            payload: l,
          })
        )
      );
      return {
        ...localDb,
        storageEngine: "supabase",
        supabaseUrl: SUPABASE_URL,
      };
    }

    return {
      leads: remoteLeads.length > 0 ? remoteLeads : localDb.leads,
      intakes: remoteIntakes.length > 0 ? remoteIntakes : localDb.intakes,
      analytics: localDb.analytics,
      storageEngine: "supabase",
      supabaseUrl: SUPABASE_URL,
    };
  } catch {
    return { ...localDb, storageEngine: "local-fallback", supabaseUrl: SUPABASE_URL };
  }
}

export async function addLeadAsync(
  input: Omit<LeadRecord, "id" | "createdAt" | "urgency" | "recommendedChapter" | "status" | "estimatedCaseValue">
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
  let estimatedCaseValue = 1850;
  if (
    (input.ownsHome && input.behindOnPayments) ||
    concernLower.includes("foreclosure") ||
    concernLower.includes("repo") ||
    concernLower.includes("chapter 13")
  ) {
    recommendedChapter = "Chapter 13 (Asset Protection Plan)";
    estimatedCaseValue = 3800;
  }

  const newLead: LeadRecord = {
    ...input,
    id: `LD-2026-${1092 + db.leads.length + Math.floor(Math.random() * 90)}`,
    createdAt: new Date().toISOString(),
    urgency,
    recommendedChapter,
    status: input.preferredDate ? "CONSULTATION_BOOKED" : "NEW",
    estimatedCaseValue,
  };

  db.leads.unshift(newLead);
  saveLocalDb(db);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("leads").insert({
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

export async function addIntakeAsync(
  input: Omit<IntakeRecord, "id" | "createdAt">
): Promise<IntakeRecord> {
  const db = getLocalDb();
  const newIntake: IntakeRecord = {
    ...input,
    id: `INT-2026-${402 + db.intakes.length + Math.floor(Math.random() * 50)}`,
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
  });
  newIntake.leadId = createdLead.id;
  saveLocalDb(db);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("intakes").insert({
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
    } catch (e) {
      console.error("Supabase intake insert fallback:", e);
    }
  }

  return newIntake;
}
