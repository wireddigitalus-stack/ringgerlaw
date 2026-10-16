"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Phone,
  Lock,
  Sparkles,
  FileText,
  Home,
  Car,
  CreditCard,
  Gavel,
} from "lucide-react";
import { FIRM_INFO } from "@/lib/seo-data";
import { LeadRecord } from "@/lib/db";

const CONCERN_OPTIONS = [
  {
    id: "Eliminate Credit Card & Medical Debt",
    label: "Wipe Out Credit Card & Medical Bills",
    sub: "Eliminate 100% of unsecured debt in 90–120 days",
    icon: CreditCard,
  },
  {
    id: "Stop Foreclosure & Catch Up Mortgage",
    label: "Stop Home Foreclosure Sale",
    sub: "Halt trustee auctions & catch up missed house payments",
    icon: Home,
  },
  {
    id: "Stop Vehicle Repossession",
    label: "Stop Car / Truck Repossession",
    sub: "Keep your vehicle & lower high-interest auto notes",
    icon: Car,
  },
  {
    id: "Stop Wage Garnishment Immediately",
    label: "Stop 25% Wage Garnishment / Lawsuit",
    sub: "Halt General Sessions Court paycheck deductions today",
    icon: Gavel,
  },
];

const COUNTY_OPTIONS = [
  "Madison County (Jackson)",
  "Gibson County (Milan / Humboldt / Trenton)",
  "Haywood County (Brownsville)",
  "Crockett County (Alamo / Bells)",
  "Chester County (Henderson)",
  "Henderson County (Lexington)",
  "Other West Tennessee County",
];

export function DebtReliefQuiz({ defaultSource = "/" }: { defaultSource?: string }) {
  const [step, setStep] = useState(1);
  const [primaryConcern, setPrimaryConcern] = useState(CONCERN_OPTIONS[0].id);
  const [estimatedDebt, setEstimatedDebt] = useState(32000);
  const [ownsHome, setOwnsHome] = useState(false);
  const [behindOnPayments, setBehindOnPayments] = useState(false);
  const [county, setCounty] = useState(COUNTY_OPTIONS[0]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createdLead, setCreatedLead] = useState<LeadRecord | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !phone) return;
    setSubmitting(true);
    try {
      const { captureOrGetAttribution } = await import("@/lib/attribution");
      const attribution = captureOrGetAttribution();
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(attribution || {}),
          firstName,
          lastName,
          phone,
          email,
          county,
          primaryConcern,
          estimatedDebt,
          ownsHome,
          behindOnPayments,
          preferredDate,
          sourcePage: typeof window !== "undefined" ? window.location.pathname : defaultSource,
          captureMethod: "60-Sec Qualifier Quiz",
          notes: `Completed 60-Second Qualifier. Estimated Unsecured Debt: $${estimatedDebt.toLocaleString()}. Homeowner: ${ownsHome ? "Yes" : "No"}, Behind on Mortgage/Car: ${behindOnPayments ? "Yes" : "No"}.`,
        }),
      });
      const data = await res.json();
      if (data.lead) {
        setCreatedLead(data.lead);
        setStep(4);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-gold-500/40 overflow-hidden text-slate-900">
      {/* Top Quiz Header */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4 text-white flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gold-400">
            <Sparkles className="w-3.5 h-3.5" /> Free 60-Second Tennessee Relief Check
          </span>
          <h3 className="text-lg font-serif font-bold text-white">
            Check Your $0-Down Eligibility & Relief Options
          </h3>
        </div>
        {step < 4 && (
          <div className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-gold-300 border border-white/10">
            Step {step} of 3
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {step < 4 && (
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-gold-500 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      )}

      <div className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-sm font-bold text-navy-950">
              1. What is your #1 financial priority right now?
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {CONCERN_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = primaryConcern === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setPrimaryConcern(opt.id);
                      if (opt.id.includes("Foreclosure")) {
                        setOwnsHome(true);
                        setBehindOnPayments(true);
                      }
                      setStep(2);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition flex items-start gap-3 cursor-pointer ${
                      active
                        ? "border-navy-900 bg-navy-900/5 shadow-sm"
                        : "border-slate-200 hover:border-gold-500 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg mt-0.5 ${
                        active ? "bg-navy-900 text-gold-400" : "bg-slate-100 text-navy-800"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-navy-950">{opt.label}</div>
                      <div className="text-xs text-slate-600">{opt.sub}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 self-center" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-navy-950">
                  2. Estimated Unsecured Debt to Wipe Out:
                </label>
                <span className="text-lg font-extrabold text-navy-900 bg-gold-100 px-3 py-0.5 rounded-lg border border-gold-400">
                  ${estimatedDebt.toLocaleString()}{estimatedDebt >= 100000 ? "+" : ""}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={120000}
                step={2500}
                value={estimatedDebt}
                onChange={(e) => setEstimatedDebt(Number(e.target.value))}
                className="w-full accent-navy-900 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>$5,000</span>
                <span>$35,000</span>
                <span>$75,000</span>
                <span>$120,000+</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-navy-950 mb-2">Do you own or pay on a home?</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOwnsHome(true)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                      ownsHome
                        ? "bg-navy-900 text-white border-navy-900"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setOwnsHome(false)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                      !ownsHome
                        ? "bg-navy-900 text-white border-navy-900"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    No (Rent/Other)
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-navy-950 mb-2">Behind on house or car payments?</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBehindOnPayments(true)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                      behindOnPayments
                        ? "bg-navy-900 text-white border-navy-900"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setBehindOnPayments(false)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                      !behindOnPayments
                        ? "bg-navy-900 text-white border-navy-900"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    No (Current)
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Which West Tennessee County Do You Live In?
              </label>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-navy-950 font-medium bg-white"
              >
                {COUNTY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-500 hover:text-navy-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
              >
                See My Relief Recommendation <ArrowRight className="w-4 h-4 text-gold-400" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} autoComplete="on" spellCheck={true} className="space-y-3.5">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Good News for {county.split(" ")[0]} County:</strong> Based on{" "}
                <strong>${estimatedDebt.toLocaleString()}</strong> in debt, you likely qualify for{" "}
                <strong>
                  {ownsHome && behindOnPayments
                    ? "Chapter 13 Foreclosure & Asset Protection"
                    : "Chapter 7 ($0 Down Eligible) Complete Discharge"}
                </strong>{" "}
                under Tennessee exemptions. Enter your info below for your free review with Attorney Louis W. Ringger Jr.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  autoComplete="given-name"
                  spellCheck={true}
                  autoCorrect="on"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  autoComplete="family-name"
                  spellCheck={true}
                  autoCorrect="on"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(731) 555-0199"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Day for Your Free Phone/Office Consultation (Optional)
              </label>
              <input
                type="date"
                name="preferredDate"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-slate-500 hover:text-navy-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-navy-950 font-extrabold text-sm px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
              >
                {submitting ? "Generating Your Relief Plan..." : "Get My Free Relief Plan Now →"}
              </button>
            </div>
          </form>
        )}

        {step === 4 && createdLead && (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Case Reference #{createdLead.id}
                </div>
                <h4 className="text-lg font-serif font-bold text-navy-950">
                  Thank You, {createdLead.firstName}! Your Preliminary Assessment Is Ready.
                </h4>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Recommended Path:</span>
                <span className="font-bold text-navy-950">{createdLead.recommendedChapter}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Primary Goal:</span>
                <span className="font-semibold text-slate-800">{createdLead.primaryConcern}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Court Jurisdiction:</span>
                <span className="font-semibold text-slate-800">Western District of TN (Jackson)</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Attorney Louis W. Ringger Jr.&apos;s team has received your consultation request. Want to speed up your appointment? You can complete our optional online Intake Worksheet now or call our Jackson office directly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <a
                href={FIRM_INFO.phoneHref}
                className="bg-navy-900 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-gold-400" /> Call {FIRM_INFO.phoneFormatted}
              </a>
              <Link
                href="/intake"
                className="bg-gold-500 text-navy-950 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> Start Step-2 Intake Portal →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer Trust Strip */}
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1 font-medium">
          <Lock className="w-3.5 h-3.5 text-emerald-600" /> 100% Confidential • No SSN Required
        </span>
        <span className="flex items-center gap-1 font-semibold text-navy-900">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-600" /> $0 Down Options
        </span>
      </div>
    </div>
  );
}
