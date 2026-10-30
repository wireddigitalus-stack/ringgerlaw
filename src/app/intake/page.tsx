"use client";

import React, { useState } from "react";
import {
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Printer,
  ClipboardList,
  Lock,
  Phone,
} from "lucide-react";
import { FIRM_INFO } from "@/lib/seo-data";
import { IntakeRecord } from "@/lib/db";

const DOCUMENT_CHECKLIST = [
  "Social Security card (for yourself and spouse if filing jointly)",
  "Picture ID (e.g., Tennessee driver's license or state identification card)",
  "Your federal income tax returns for the last two (2) years",
  "Pay stubs for the last six (6) months (If married, bring spouse's pay stubs also — whether or not he/she is filing)",
  "Proof of other income: pension/retirement, government (SSI, Social Security, food stamps, Families First), child/spousal support, self-employment, or rental income",
  "Completed household expense schedule (included in Step 4 of this questionnaire)",
  "Existing mortgage statements and/or deed if real estate is paid for",
  "Automobile loan statements or vehicle titles if paid for",
  "The 'Declarations' page of all auto insurance and homeowner's/renter's insurance policies",
  "Recent statements from all credit cards, lenders, cash advance companies, and collection agencies",
  "Documents or summonses from any legal actions, lawsuits, or garnishments you are involved in",
  "Statements from all student loan debts & a list of any questions you have for Attorney Louis W. Ringger Jr.",
];

export default function ClientIntakePortalPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [savedRecord, setSavedRecord] = useState<IntakeRecord | null>(null);
  const [formStartedAt] = useState(() => Date.now());
  const [companyWebsite, setCompanyWebsite] = useState("");

  const [form, setForm] = useState({
    // Step 1: Personal & Marital
    fullName: "",
    phone: "",
    email: "",
    mailingAddress: "",
    birthday: "",
    ssnLast4: "",
    maritalStatus: "Married" as "Single" | "Married" | "Separated" | "Divorced" | "Widowed",
    filingWithSpouse: false,
    spouseName: "",
    spouseBirthday: "",
    dependents: "",
    priorBankruptcyLast10Years: false,

    // Step 2: Real Estate & Vehicles
    realEstateOwned: "",
    mortgagePaymentsCurrent: "Yes" as "Yes" | "No" | "N/A",
    receivedForeclosureNotice: false,
    vehiclesOwned: "",
    recreationalVehicles: "",

    // Step 3: Debts, Judgments & Support
    paysChildSupportOrAlimony: false,
    supportRecipientDetails: "",
    unpaidTaxes: "",
    hasCourtJudgmentsOrLiens: false,
    judgmentDetails: "",
    creditCardsList: "",
    cashAdvanceLoans: "",
    rentToOwnItems: "",

    // Step 4: Income & Household Expenses
    payFrequency: "Bi-Weekly" as "Weekly" | "Bi-Weekly" | "Monthly" | "Other",
    grossMonthlyIncome: "",
    otherIncomeSources: "",
    involvedInPendingLawsuitPayout: false,
    lawsuitPayoutDetails: "",
    rentOrMortgageMonthly: "",
    taxesIncludedInMortgage: true,
    insuranceIncludedInMortgage: true,
    monthlyFoodExpense: "",
    monthlyUtilitiesAndPhone: "",
    monthlyMedicalExpense: "",
    monthlyTransportationExpense: "",
    monthlyCarPayments: "",

    // Step 5: Mandatory Statutory Disclosures & Signature
    debtsInMaidenOrOtherName: false,
    expectingLargeSumNextYear: false,
    transferredPropertyLast2Years: false,
    usedCreditCardsLast90Days: false,
    movedFromAnotherStateLast2Years: false,
    hasCosignersOnDebts: false,
    hasUnfiledTaxReturns: false,
    debtorSignature: "",
    coDebtorSignature: "",
    signatureDate: new Date().toISOString().slice(0, 10),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { captureOrGetAttribution } = await import("@/lib/attribution");
      const attribution = captureOrGetAttribution();
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(attribution || {}),
          ...form,
          companyWebsite,
          formStartedAt,
        }),
      });
      const data = await res.json();
      if (data.intake && !data.blockedBot) {
        const { trackGoogleAdsConversion } = await import("@/lib/google-ads");
        const nameParts = form.fullName.trim().split(" ");
        trackGoogleAdsConversion({
          action: "COURT_INTAKE_SUBMIT",
          leadId: data.intake.id,
          firstName: nameParts[0] || form.fullName,
          lastName: nameParts.slice(1).join(" "),
          phone: form.phone,
          email: form.email,
          primaryConcern: "Full Court Intake Packet",
          captureMethod: "5-Step Court Intake Questionnaire",
        });
        setSavedRecord(data.intake);
        setStep(6);
      } else if (data.blockedBot) {
        setSavedRecord({
          id: "INT-RECEIVED",
          createdAt: new Date().toISOString(),
          ...form,
        });
        setStep(6);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-navy-900 text-gold-400 text-xs font-bold px-3.5 py-1.5 rounded-full mb-3">
          <Lock className="w-3.5 h-3.5" /> Confidential Client Intake Portal • Western District of TN
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950">
          Online Bankruptcy Intake Questionnaire &amp; Document Checklist
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-3xl">
          Completing this step-by-step worksheet helps Attorney Louis W. Ringger Jr. prepare your petition accurately.{" "}
          <strong>
            If you don&apos;t know exact debt balances right now, simply leave them blank and we will help you finish the rest at your appointment!
          </strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Wizard Column */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Wizard Step Tabs */}
          {step < 6 && (
            <div className="bg-navy-950 text-white p-4">
              <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-bold">
                {[
                  { n: 1, label: "1. Personal" },
                  { n: 2, label: "2. Property & Cars" },
                  { n: 3, label: "3. Debts & Suits" },
                  { n: 4, label: "4. Income & Budget" },
                  { n: 5, label: "5. Sign & Submit" },
                ].map((tab) => (
                  <button
                    key={tab.n}
                    type="button"
                    onClick={() => setStep(tab.n)}
                    className={`py-2 px-1 rounded-lg transition cursor-pointer ${
                      step === tab.n
                        ? "bg-gold-500 text-navy-950 font-extrabold"
                        : step > tab.n
                        ? "bg-emerald-900/60 text-emerald-300"
                        : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="on" spellCheck={true} className="p-6 sm:p-8 space-y-6">
            {/* STEP 1: PERSONAL & MARITAL */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-navy-950 border-b border-slate-200 pb-2">
                  Step 1 of 5: Personal, Household &amp; Marital Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="intake-client-full-name"
                      className="block text-xs font-bold uppercase text-slate-700 mb-1"
                    >
                      Full Legal Name *
                    </label>
                    <input
                      id="intake-client-full-name"
                      type="text"
                      name="clientFullName"
                      autoComplete="section-client name"
                      spellCheck={true}
                      autoCorrect="on"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="First Middle Last"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="intake-client-phone"
                      className="block text-xs font-bold uppercase text-slate-700 mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="intake-client-phone"
                      type="tel"
                      name="clientPhone"
                      autoComplete="section-client tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(731) 555-0199"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="intake-client-email"
                      className="block text-xs font-bold uppercase text-slate-700 mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      id="intake-client-email"
                      type="email"
                      name="clientEmail"
                      autoComplete="section-client email"
                      spellCheck={false}
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="bday"
                      autoComplete="bday"
                      required
                      value={form.birthday}
                      onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Full Mailing Address (Street, City, State, ZIP) *
                    </label>
                    <input
                      type="text"
                      name="street-address"
                      autoComplete="street-address"
                      spellCheck={true}
                      autoCorrect="on"
                      required
                      value={form.mailingAddress}
                      onChange={(e) => setForm({ ...form, mailingAddress: e.target.value })}
                      placeholder="123 Main St, Jackson, TN 38305"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Last 4 Digits of SSN (For Conflict Check)
                    </label>
                    <input
                      type="text"
                      name="ssnLast4"
                      inputMode="numeric"
                      maxLength={4}
                      value={form.ssnLast4}
                      onChange={(e) => setForm({ ...form, ssnLast4: e.target.value })}
                      placeholder="XXXX"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Marital Status *
                    </label>
                    <select
                      name="maritalStatus"
                      value={form.maritalStatus}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          maritalStatus: e.target.value as typeof form.maritalStatus,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Separated">Separated</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Are You Filing Jointly With a Spouse?
                    </label>
                    <select
                      name="filingWithSpouse"
                      value={form.filingWithSpouse ? "yes" : "no"}
                      onChange={(e) => setForm({ ...form, filingWithSpouse: e.target.value === "yes" })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    >
                      <option value="no">No — Filing Individually</option>
                      <option value="yes">Yes — Filing Jointly With Spouse</option>
                    </select>
                  </div>
                </div>

                {form.filingWithSpouse && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Spouse Full Name
                      </label>
                      <input
                        type="text"
                        name="spouseName"
                        spellCheck={true}
                        autoCorrect="on"
                        value={form.spouseName}
                        onChange={(e) => setForm({ ...form, spouseName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Spouse Birthday
                      </label>
                      <input
                        type="date"
                        name="spouseBirthday"
                        value={form.spouseBirthday}
                        onChange={(e) => setForm({ ...form, spouseBirthday: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      List Any Dependents (Names &amp; Ages)
                    </label>
                    <input
                      type="text"
                      name="dependents"
                      spellCheck={true}
                      autoCorrect="on"
                      value={form.dependents}
                      onChange={(e) => setForm({ ...form, dependents: e.target.value })}
                      placeholder="e.g., 2 children (ages 7 and 11)"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Filed Bankruptcy in the Last 10 Years?
                    </label>
                    <select
                      name="priorBankruptcyLast10Years"
                      value={form.priorBankruptcyLast10Years ? "yes" : "no"}
                      onChange={(e) =>
                        setForm({ ...form, priorBankruptcyLast10Years: e.target.value === "yes" })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    Next: Real Estate &amp; Vehicles <ArrowRight className="w-4 h-4 text-gold-400" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: REAL ESTATE & VEHICLES */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-navy-950 border-b border-slate-200 pb-2">
                  Step 2 of 5: Real Estate, Home Mortgage &amp; Vehicles
                </h2>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    List All Real Estate You Own or Are Paying For (Include lender &amp; approx. value)
                  </label>
                  <textarea
                    rows={2}
                    name="realEstateOwned"
                    spellCheck={true}
                    autoCorrect="on"
                    value={form.realEstateOwned}
                    onChange={(e) => setForm({ ...form, realEstateOwned: e.target.value })}
                    placeholder="e.g., Primary Residence in Jackson TN — Rocket Mortgage balance $135,000 (or type 'None / Renting')"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      If You Have a Mortgage, Are Payments Current?
                    </label>
                    <select
                      name="mortgagePaymentsCurrent"
                      value={form.mortgagePaymentsCurrent}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          mortgagePaymentsCurrent: e.target.value as "Yes" | "No" | "N/A",
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    >
                      <option value="Yes">Yes — Current</option>
                      <option value="No">No — Behind on Payments</option>
                      <option value="N/A">Not Applicable (Renting)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Have You Received a Notice That Your House Is Going to Be Sold (Foreclosure)?
                    </label>
                    <select
                      name="receivedForeclosureNotice"
                      value={form.receivedForeclosureNotice ? "yes" : "no"}
                      onChange={(e) =>
                        setForm({ ...form, receivedForeclosureNotice: e.target.value === "yes" })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes — URGENT Foreclosure Sale Notice Received</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    List All Cars &amp; Trucks With Your Name on the Title (Paid for or financed) *
                  </label>
                  <textarea
                    rows={2}
                    name="vehiclesOwned"
                    spellCheck={true}
                    autoCorrect="on"
                    value={form.vehiclesOwned}
                    onChange={(e) => setForm({ ...form, vehiclesOwned: e.target.value })}
                    placeholder="e.g., 2019 Ford F-150 (Financed with Ford Credit, $14k owed); 2014 Honda Civic (Paid for)"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    List Any Motorcycles, Boats, Trailers, ATVs, or Other Registered Vehicles
                  </label>
                  <input
                    type="text"
                    name="recreationalVehicles"
                    spellCheck={true}
                    autoCorrect="on"
                    value={form.recreationalVehicles}
                    onChange={(e) => setForm({ ...form, recreationalVehicles: e.target.value })}
                    placeholder="None (or list details)"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-slate-600 hover:text-navy-900 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous Step
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    Next: Debts &amp; Lawsuits <ArrowRight className="w-4 h-4 text-gold-400" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DEBTS, JUDGMENTS & SUPPORT */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-navy-950 border-b border-slate-200 pb-2">
                  Step 3 of 5: Credit Cards, Medical Bills, Judgments &amp; Support
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Do You or Your Spouse Pay Child Support or Alimony?
                    </label>
                    <select
                      name="paysChildSupportOrAlimony"
                      value={form.paysChildSupportOrAlimony ? "yes" : "no"}
                      onChange={(e) =>
                        setForm({ ...form, paysChildSupportOrAlimony: e.target.value === "yes" })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      If Yes, List Recipient Name &amp; Monthly Amount
                    </label>
                    <input
                      type="text"
                      name="supportRecipientDetails"
                      spellCheck={true}
                      autoCorrect="on"
                      value={form.supportRecipientDetails}
                      onChange={(e) => setForm({ ...form, supportRecipientDetails: e.target.value })}
                      placeholder="Parent / Ex-Spouse Name & Monthly Amount"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Do You Have Court Judgments, Garnishments, or Liens Against You?
                    </label>
                    <select
                      name="hasCourtJudgmentsOrLiens"
                      value={form.hasCourtJudgmentsOrLiens ? "yes" : "no"}
                      onChange={(e) =>
                        setForm({ ...form, hasCourtJudgmentsOrLiens: e.target.value === "yes" })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes — Lawsuit / Judgment / Wage Garnishment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      If Yes, Provide Creditor, Court (e.g. Madison Co. Gen. Sessions) &amp; Case #
                    </label>
                    <input
                      type="text"
                      name="judgmentDetails"
                      spellCheck={true}
                      autoCorrect="on"
                      value={form.judgmentDetails}
                      onChange={(e) => setForm({ ...form, judgmentDetails: e.target.value })}
                      placeholder="Creditor Name & Court Case Info"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    List Credit Cards, Medical Bills &amp; Collection Agencies (Rough estimates are fine)
                  </label>
                  <textarea
                    rows={3}
                    name="creditCardsList"
                    spellCheck={true}
                    autoCorrect="on"
                    value={form.creditCardsList}
                    onChange={(e) => setForm({ ...form, creditCardsList: e.target.value })}
                    placeholder="e.g., Capital One ($5,200), West TN Healthcare Medical ($8,400), Discover ($6,000)..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Cash Advance / Payday Loans
                    </label>
                    <input
                      type="text"
                      name="cashAdvanceLoans"
                      spellCheck={true}
                      autoCorrect="on"
                      value={form.cashAdvanceLoans}
                      onChange={(e) => setForm({ ...form, cashAdvanceLoans: e.target.value })}
                      placeholder="e.g., Advance Financial ($1,500)"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Unpaid Taxes (IRS / Property)
                    </label>
                    <input
                      type="text"
                      name="unpaidTaxes"
                      spellCheck={true}
                      autoCorrect="on"
                      value={form.unpaidTaxes}
                      onChange={(e) => setForm({ ...form, unpaidTaxes: e.target.value })}
                      placeholder="None (or years/amounts)"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Rent-to-Own Furniture / Items
                    </label>
                    <input
                      type="text"
                      name="rentToOwnItems"
                      spellCheck={true}
                      autoCorrect="on"
                      value={form.rentToOwnItems}
                      onChange={(e) => setForm({ ...form, rentToOwnItems: e.target.value })}
                      placeholder="None (or Aaron's / Rent-A-Center)"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-slate-600 hover:text-navy-900 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous Step
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    Next: Income &amp; Household Budget <ArrowRight className="w-4 h-4 text-gold-400" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: INCOME & HOUSEHOLD BUDGET */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-navy-950 border-b border-slate-200 pb-2">
                  Step 4 of 5: Employment Income &amp; Monthly Expense Schedule
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      How Often Do You Get Paid?
                    </label>
                    <select
                      value={form.payFrequency}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          payFrequency: e.target.value as typeof form.payFrequency,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-Weekly">Bi-Weekly (Every 2 Weeks)</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Other">Self-Employed / Fixed SSI / Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Estimated Gross Monthly Income
                    </label>
                    <input
                      type="text"
                      name="grossMonthlyIncome"
                      spellCheck={true}
                      value={form.grossMonthlyIncome}
                      onChange={(e) => setForm({ ...form, grossMonthlyIncome: e.target.value })}
                      placeholder="e.g., $3,600/mo"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Other Income (SSI, Pension, Support)
                    </label>
                    <input
                      type="text"
                      name="otherIncomeSources"
                      spellCheck={true}
                      autoCorrect="on"
                      value={form.otherIncomeSources}
                      onChange={(e) => setForm({ ...form, otherIncomeSources: e.target.value })}
                      placeholder="None (or list source/amount)"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Monthly Rent or Mortgage Payment
                    </label>
                    <input
                      type="text"
                      name="rentOrMortgageMonthly"
                      value={form.rentOrMortgageMonthly}
                      onChange={(e) => setForm({ ...form, rentOrMortgageMonthly: e.target.value })}
                      placeholder="e.g., $1,250"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Monthly Food &amp; Groceries
                    </label>
                    <input
                      type="text"
                      name="monthlyFoodExpense"
                      value={form.monthlyFoodExpense}
                      onChange={(e) => setForm({ ...form, monthlyFoodExpense: e.target.value })}
                      placeholder="e.g., $750"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Monthly Utilities, Electric &amp; Cell Phone
                    </label>
                    <input
                      type="text"
                      name="monthlyUtilitiesAndPhone"
                      value={form.monthlyUtilitiesAndPhone}
                      onChange={(e) => setForm({ ...form, monthlyUtilitiesAndPhone: e.target.value })}
                      placeholder="e.g., $390"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Monthly Car Payment(s)
                    </label>
                    <input
                      type="text"
                      name="monthlyCarPayments"
                      value={form.monthlyCarPayments}
                      onChange={(e) => setForm({ ...form, monthlyCarPayments: e.target.value })}
                      placeholder="e.g., $420"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Gas, Auto Maintenance &amp; Insurance
                    </label>
                    <input
                      type="text"
                      name="monthlyTransportationExpense"
                      value={form.monthlyTransportationExpense}
                      onChange={(e) =>
                        setForm({ ...form, monthlyTransportationExpense: e.target.value })
                      }
                      placeholder="e.g., $310"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Out-of-Pocket Medical / Dental
                    </label>
                    <input
                      type="text"
                      name="monthlyMedicalExpense"
                      value={form.monthlyMedicalExpense}
                      onChange={(e) => setForm({ ...form, monthlyMedicalExpense: e.target.value })}
                      placeholder="e.g., $150"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs font-bold text-slate-600 hover:text-navy-900 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous Step
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    Next: Statutory Questions &amp; Sign <ArrowRight className="w-4 h-4 text-gold-400" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: STATUTORY YES/NO QUESTIONS & SIGNATURE */}
            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-navy-950 border-b border-slate-200 pb-2">
                  Step 5 of 5: Standard Court Disclosures &amp; Electronic Signature
                </h2>

                <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
                  {[
                    {
                      key: "usedCreditCardsLast90Days",
                      label: "Have you used any of your credit cards within the last 90 days?",
                    },
                    {
                      key: "transferredPropertyLast2Years",
                      label: "Have you sold or transferred any real estate or vehicles within the last 2 years?",
                    },
                    {
                      key: "movedFromAnotherStateLast2Years",
                      label: "Have you moved to Tennessee from another state within the last 2 years?",
                    },
                    {
                      key: "hasCosignersOnDebts",
                      label: "Do any of your debts have a co-signer listed?",
                    },
                    {
                      key: "expectingLargeSumNextYear",
                      label: "Are you expecting an inheritance, lawsuit settlement, or large payout in the next year?",
                    },
                    {
                      key: "hasUnfiledTaxReturns",
                      label: "Do you have any unfiled federal income tax returns from recent years?",
                    },
                  ].map((q) => (
                    <label
                      key={q.key}
                      className="flex items-center justify-between gap-4 py-1.5 border-b border-slate-200/70 last:border-0 cursor-pointer"
                    >
                      <span className="text-slate-800 font-medium">{q.label}</span>
                      <input
                        type="checkbox"
                        checked={Boolean(form[q.key as keyof typeof form])}
                        onChange={(e) =>
                          setForm({ ...form, [q.key]: e.target.checked })
                        }
                        className="w-4 h-4 accent-navy-900"
                      />
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Debtor Electronic Signature (Type Full Legal Name) *
                    </label>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      spellCheck={true}
                      autoCorrect="on"
                      required
                      value={form.debtorSignature}
                      onChange={(e) => setForm({ ...form, debtorSignature: e.target.value })}
                      placeholder="Type Your Full Name to Sign"
                      className="w-full px-3.5 py-2.5 rounded-lg border-2 border-navy-900 font-serif italic text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Co-Debtor / Spouse Electronic Signature (If Applicable)
                    </label>
                    <input
                      type="text"
                      name="coDebtorSignature"
                      spellCheck={true}
                      autoCorrect="on"
                      value={form.coDebtorSignature}
                      onChange={(e) => setForm({ ...form, coDebtorSignature: e.target.value })}
                      placeholder="Optional Spouse Signature"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 font-serif italic text-base"
                    />
                  </div>
                </div>

                <div aria-hidden="true" className="hidden" style={{ position: "absolute", left: "-9999px" }}>
                  <label htmlFor="intake-company-website">Company Website</label>
                  <input
                    id="intake-company-website"
                    type="text"
                    name="companyWebsite"
                    tabIndex={-1}
                    autoComplete="off"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                  />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="text-xs font-bold text-slate-600 hover:text-navy-900 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous Step
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-navy-950 font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    {submitting ? "Transmitting to Ringger Law..." : "Submit Official Intake Questionnaire"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: CONFIRMATION & PRINTABLE PACKET */}
            {step === 6 && savedRecord && (
              <div className="space-y-6 py-4">
                <div className="flex items-start gap-4 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Intake Packet #{savedRecord.id} Saved to Ringger Law Case System
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-navy-950 mt-0.5">
                      Thank You, {savedRecord.fullName}! Your Intake File Is Complete.
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1">
                      Attorney Louis W. Ringger Jr. has received your questionnaire in the Jackson office dashboard. You can print a copy of your responses and the appointment document checklist below.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="bg-navy-900 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-gold-400" /> Print Intake Packet &amp; Document Checklist
                  </button>
                  <a
                    href={FIRM_INFO.phoneHref}
                    className="bg-gold-500 text-navy-950 font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" /> Call Jackson Office: {FIRM_INFO.phoneFormatted}
                  </a>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Sidebar: 12-Item Document Checklist (Preserved verbatim from original /blank page) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-navy-950 text-white rounded-2xl p-6 shadow-xl border border-gold-500/40">
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ClipboardList className="w-4 h-4" /> Official Appointment Checklist
            </div>
            <h3 className="text-lg font-serif font-bold text-white mb-3">
              Please Bring the Following Documents to Your Bankruptcy Appointment:
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-200">
              {DOCUMENT_CHECKLIST.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t border-white/15 text-xs text-slate-300">
              <strong className="text-gold-300">Missing a document?</strong> Don&apos;t worry—keep your appointment! We can pull your credit report and help you gather remaining items swiftly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
