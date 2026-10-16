"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  ShieldCheck,
  Lock,
  CheckCircle2,
  ArrowRight,
  Zap,
  Calculator,
  FileText,
  Clock,
} from "lucide-react";
import { FIRM_INFO } from "@/lib/seo-data";
import { LeadRecord } from "@/lib/db";
import { DebtReliefQuiz } from "@/components/DebtReliefQuiz";
import { captureOrGetAttribution } from "@/lib/attribution";

const HELP_OPTIONS = [
  "Eliminate Credit Card & Medical Debt",
  "Stop Home Foreclosure Sale (Urgent)",
  "Stop Car / Truck Repossession",
  "Stop 25% Paycheck Wage Garnishment",
  "Check Chapter 7 vs. Chapter 13 ($0 Down)",
];

const COUNTY_LIST = [
  "Madison County (Jackson)",
  "Gibson County (Milan / Humboldt / Trenton)",
  "Haywood County (Brownsville)",
  "Crockett County (Alamo / Bells)",
  "Chester County (Henderson)",
  "Henderson County (Lexington)",
  "Other West Tennessee County",
];

export function FastCaptureCard({
  defaultSource = "/",
  allowQuizToggle = true,
}: {
  defaultSource?: string;
  allowQuizToggle?: boolean;
}) {
  const [mode, setMode] = useState<"fast" | "quiz">("fast");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [primaryConcern, setPrimaryConcern] = useState(HELP_OPTIONS[0]);
  const [county, setCounty] = useState(COUNTY_LIST[0]);
  const [callTime, setCallTime] = useState("Call Me ASAP Today");
  const [submitting, setSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<LeadRecord | null>(null);

  if (mode === "quiz") {
    return (
      <div className="space-y-2">
        {allowQuizToggle && (
          <div className="grid grid-cols-2 gap-1.5 bg-navy-900 p-1.5 rounded-xl border border-white/15">
            <button
              type="button"
              onClick={() => setMode("fast")}
              className="py-2 px-3 rounded-lg text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <Zap className="w-3.5 h-3.5 text-[#A8E028]" /> Fast Contact Form
            </button>
            <button
              type="button"
              onClick={() => setMode("quiz")}
              className="py-2 px-3 rounded-lg text-xs font-extrabold bg-[#A8E028] text-black flex items-center justify-center gap-1.5 cursor-pointer shadow"
            >
              <Calculator className="w-3.5 h-3.5" /> 60-Sec $0-Down Quiz
            </button>
          </div>
        )}
        <DebtReliefQuiz defaultSource={defaultSource} />
      </div>
    );
  }

  async function handleFastSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;
    setSubmitting(true);
    try {
      const parts = fullName.trim().split(" ");
      const firstName = parts[0] || fullName;
      const lastName = parts.slice(1).join(" ");
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
          estimatedDebt: 30000,
          ownsHome: primaryConcern.toLowerCase().includes("foreclosure"),
          behindOnPayments:
            primaryConcern.toLowerCase().includes("foreclosure") ||
            primaryConcern.toLowerCase().includes("repo"),
          sourcePage: typeof window !== "undefined" ? window.location.pathname : defaultSource,
          captureMethod: "Free Consultation Form",
          notes: `Submitted 1-Step Fast Capture Card. Requested Callback Window: ${callTime}.`,
        }),
      });
      const data = await res.json();
      if (data.lead) {
        setSubmittedLead(data.lead);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-2">
      {/* Optional Mode Switcher Tab */}
      {allowQuizToggle && (
        <div className="grid grid-cols-2 gap-1.5 bg-navy-900 p-1.5 rounded-xl border border-white/15">
          <button
            type="button"
            onClick={() => setMode("fast")}
            className="py-2 px-3 rounded-lg text-xs font-extrabold bg-[#A8E028] text-black flex items-center justify-center gap-1.5 cursor-pointer shadow"
          >
            <Zap className="w-3.5 h-3.5" /> Fast Free Consultation
          </button>
          <button
            type="button"
            onClick={() => setMode("quiz")}
            className="py-2 px-3 rounded-lg text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer transition"
          >
            <Calculator className="w-3.5 h-3.5 text-[#A8E028]" /> 60-Sec $0-Down Quiz
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#A8E028] overflow-hidden text-slate-900">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 px-6 py-4 text-white border-b border-white/10">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#A8E028]">
              <Zap className="w-3.5 h-3.5" /> Fast &amp; Easy • $0 Money Down
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <Clock className="w-3 h-3" /> Takes 15 Seconds
            </span>
          </div>
          <h3 className="text-xl font-serif font-bold text-white mt-0.5">
            Request Your FREE Consultation Now
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Speak directly with Attorney Louis W. Ringger Jr. or our Jackson team by phone or in person.
          </p>
        </div>

        <div className="p-6">
          {submittedLead ? (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Priority Request #{submittedLead.id} Received
                  </div>
                  <h4 className="text-lg font-serif font-bold text-navy-950">
                    Thank You, {submittedLead.firstName}! We Will Call You Shortly.
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Your consultation request has been logged into our Jackson office system ({callTime}). Want to get a head start before we call? You can fill out our optional Step-2 Intake Worksheet or call us directly right now:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a
                  href={FIRM_INFO.phoneHref}
                  className="bg-navy-900 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#A8E028]" /> Call {FIRM_INFO.phoneFormatted}
                </a>
                <Link
                  href="/intake"
                  className="bg-[#A8E028] text-black font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Step-2 Intake Portal →
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFastSubmit} autoComplete="on" spellCheck={true} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  spellCheck={true}
                  autoCorrect="on"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Mary Johnson"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-navy-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Best Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(731) 555-0199"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-navy-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    spellCheck={false}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-navy-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  How Can We Help You Today?
                </label>
                <select
                  value={primaryConcern}
                  onChange={(e) => setPrimaryConcern(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-navy-950 bg-slate-50"
                >
                  {HELP_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Your West TN County
                  </label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                  >
                    {COUNTY_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Best Time to Call You
                  </label>
                  <select
                    value={callTime}
                    onChange={(e) => setCallTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                  >
                    <option>Call Me ASAP Today</option>
                    <option>Morning (8 AM – 12 PM)</option>
                    <option>Afternoon (12 PM – 5 PM)</option>
                    <option>Schedule Virtual Zoom</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#A8E028] hover:bg-[#b8f038] text-black font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>
                  {submitting ? "Sending to Ringger Law..." : "Get My FREE Consultation Now"}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>

        {/* Bottom Trust Strip */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600" /> 100% Confidential • No Obligation
          </span>
          <span className="flex items-center gap-1 font-bold text-navy-900">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-600" /> Founded 1981
          </span>
        </div>
      </div>
    </div>
  );
}
