import fs from "fs";
import path from "path";

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
  // Section 1: Personal & Marital Info
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
  // Section 2: Real Estate & Vehicles
  realEstateOwned: string;
  mortgagePaymentsCurrent: "Yes" | "No" | "N/A";
  receivedForeclosureNotice: boolean;
  vehiclesOwned: string;
  recreationalVehicles: string;
  // Section 3: Debts, Judgments & Support
  paysChildSupportOrAlimony: boolean;
  supportRecipientDetails?: string;
  unpaidTaxes: string;
  hasCourtJudgmentsOrLiens: boolean;
  judgmentDetails?: string;
  creditCardsList: string;
  cashAdvanceLoans: string;
  rentToOwnItems: string;
  // Section 4: Income & Household Budget
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
  // Section 5: Mandatory Statutory Declarations (90-Day & 2-Year Disclosures)
  debtsInMaidenOrOtherName: boolean;
  expectingLargeSumNextYear: boolean;
  transferredPropertyLast2Years: boolean;
  usedCreditCardsLast90Days: boolean;
  movedFromAnotherStateLast2Years: boolean;
  hasCosignersOnDebts: boolean;
  hasUnfiledTaxReturns: boolean;
  // Section 6: Digital Signature
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
      firstName: "patricia",
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

export function getDb(): DatabaseSchema {
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

export function saveDb(db: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist DB:", err);
  }
}

export function addLead(
  input: Omit<LeadRecord, "id" | "createdAt" | "urgency" | "recommendedChapter" | "status" | "estimatedCaseValue">
): LeadRecord {
  const db = getDb();
  const concernLower = input.primaryConcern.toLowerCase();

  let urgency: UrgencyLevel = "STANDARD_DEBT_RELIEF";
  if (concernLower.includes("foreclosure") || concernLower.includes("repo") || concernLower.includes("house") || concernLower.includes("car")) {
    urgency = "EMERGENCY_FORECLOSURE_REPO";
  } else if (concernLower.includes("garnish") || concernLower.includes("lawsuit") || concernLower.includes("judgment")) {
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
    id: `LD-2026-${1092 + db.leads.length}`,
    createdAt: new Date().toISOString(),
    urgency,
    recommendedChapter,
    status: input.preferredDate ? "CONSULTATION_BOOKED" : "NEW",
    estimatedCaseValue,
  };

  db.leads.unshift(newLead);
  saveDb(db);
  return newLead;
}

export function addIntake(input: Omit<IntakeRecord, "id" | "createdAt">): IntakeRecord {
  const db = getDb();
  const newIntake: IntakeRecord = {
    ...input,
    id: `INT-2026-${402 + db.intakes.length}`,
    createdAt: new Date().toISOString(),
  };
  db.intakes.unshift(newIntake);

  // Also create or update lead in CRM so the attorney sees it in one pipeline
  const matchingLead = db.leads.find(
    (l) => l.phone.replace(/\D/g, "") === input.phone.replace(/\D/g, "") || l.email.toLowerCase() === input.email.toLowerCase()
  );
  if (matchingLead) {
    matchingLead.status = "INTAKE_COMPLETED";
    newIntake.leadId = matchingLead.id;
  } else {
    const names = input.fullName.trim().split(" ");
    const firstName = names[0] || input.fullName;
    const lastName = names.slice(1).join(" ");
    const createdLead = addLead({
      firstName,
      lastName,
      phone: input.phone,
      email: input.email,
      county: "Madison County (Jackson)",
      primaryConcern: input.receivedForeclosureNotice
        ? "Stop Foreclosure (Full Intake Submitted)"
        : input.hasCourtJudgmentsOrLiens
        ? "Stop Garnishment / Judgment (Full Intake Submitted)"
        : "Full Bankruptcy Intake Questionnaire Submitted",
      estimatedDebt: 35000,
      ownsHome: input.realEstateOwned.toLowerCase() !== "none" && input.realEstateOwned.trim() !== "",
      behindOnPayments: input.mortgagePaymentsCurrent === "No" || input.receivedForeclosureNotice,
      sourcePage: "/intake",
      captureMethod: "Intake Questionnaire",
      notes: `Full Court Intake Packet #${newIntake.id} completed and signed by ${input.debtorSignature}.`,
    });
    createdLead.status = "INTAKE_COMPLETED";
    newIntake.leadId = createdLead.id;
  }

  saveDb(db);
  return newIntake;
}
