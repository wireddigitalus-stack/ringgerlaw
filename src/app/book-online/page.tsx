"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Phone,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Video,
  Building2,
} from "lucide-react";
import { FIRM_INFO } from "@/lib/seo-data";
import { LeadRecord } from "@/lib/db";

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:30 PM",
  "2:30 PM",
  "4:00 PM",
];

export default function BookOnlinePage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    county: "Madison County (Jackson)",
    consultType: "Free Phone Consultation (1 Hr)",
    preferredDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    preferredTime: "10:00 AM",
    primaryConcern: "Eliminate Credit Card & Medical Debt",
    estimatedDebt: 30000,
    ownsHome: false,
    behindOnPayments: false,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookedLead, setBookedLead] = useState<LeadRecord | null>(null);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { captureOrGetAttribution } = await import("@/lib/attribution");
      const attribution = captureOrGetAttribution();
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(attribution || {}),
          ...form,
          sourcePage: "/book-online",
          captureMethod: "Free Consultation Form",
          notes: `${form.consultType} requested for ${form.preferredDate} at ${form.preferredTime}. Client notes: ${
            form.notes || "None"
          }`,
        }),
      });
      const data = await res.json();
      if (data.lead) setBookedLead(data.lead);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 bg-gold-100 text-gold-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
          <Calendar className="w-3.5 h-3.5" /> Fast &amp; Easy Scheduling • $0 Money Down
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950 mt-2">
          Book Your FREE Bankruptcy Consultation Today
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">
          Speak directly with Attorney Louis W. Ringger Jr. or our Jackson debt relief team by phone, virtual Zoom, or in person at 367 N. Parkway, Suite 1.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
          {bookedLead ? (
            <div className="space-y-5 py-4">
              <div className="flex items-start gap-4 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Booking Confirmation #{bookedLead.id}
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-navy-950 mt-0.5">
                    Your Free Consultation Request Is Confirmed!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1">
                    Requested Time: <strong>{form.preferredDate} at {form.preferredTime}</strong> ({form.consultType}). Our office will confirm within 1 business day.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/intake"
                  className="bg-navy-900 text-white font-bold text-xs px-5 py-3.5 rounded-xl flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-gold-400" /> Complete Pre-Appointment Intake Questionnaire →
                </Link>
                <a
                  href={FIRM_INFO.phoneHref}
                  className="bg-gold-500 text-navy-950 font-bold text-xs px-5 py-3.5 rounded-xl flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" /> Call {FIRM_INFO.phoneFormatted}
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBook} autoComplete="on" spellCheck={true} className="space-y-5">
              {/* Consultation Format */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                  1. Choose Your Free Consultation Format
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "Free Phone Consultation (1 Hr)", label: "Phone Call", icon: Phone },
                    { id: "Free Virtual / Zoom Consultation", label: "Virtual / Zoom", icon: Video },
                    { id: "In-Office (367 N. Parkway, Jackson)", label: "Jackson Office", icon: Building2 },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    const active = form.consultType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setForm({ ...form, consultType: opt.id })}
                        className={`p-3.5 rounded-xl border-2 text-left flex items-center gap-2.5 cursor-pointer transition ${
                          active
                            ? "border-navy-900 bg-navy-900 text-white"
                            : "border-slate-200 hover:border-gold-400 text-slate-800"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? "text-gold-400" : "text-navy-800"}`} />
                        <span className="text-xs font-bold">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    2. Select Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    required
                    value={form.preferredDate}
                    onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    3. Preferred Time Slot *
                  </label>
                  <select
                    name="preferredTime"
                    value={form.preferredTime}
                    onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t} (Central Time)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    spellCheck={true}
                    autoCorrect="on"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    spellCheck={true}
                    autoCorrect="on"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(731) 555-0199"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    spellCheck={false}
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Primary Debt Relief Goal
                  </label>
                  <select
                    name="primaryConcern"
                    value={form.primaryConcern}
                    onChange={(e) => setForm({ ...form, primaryConcern: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  >
                    <option value="Eliminate Credit Card & Medical Debt">Wipe Out Credit Card &amp; Medical Debt</option>
                    <option value="Stop Foreclosure & Catch Up Mortgage">Stop Home Foreclosure Sale</option>
                    <option value="Stop Vehicle Repossession">Stop Car / Truck Repossession</option>
                    <option value="Stop Wage Garnishment Immediately">Stop 25% Wage Garnishment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    West Tennessee County
                  </label>
                  <select
                    name="county"
                    value={form.county}
                    onChange={(e) => setForm({ ...form, county: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  >
                    <option>Madison County (Jackson)</option>
                    <option>Gibson County (Milan / Humboldt / Trenton)</option>
                    <option>Haywood County (Brownsville)</option>
                    <option>Crockett County (Alamo / Bells)</option>
                    <option>Chester County (Henderson)</option>
                    <option>Henderson County (Lexington)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Additional Information or Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  name="notes"
                  spellCheck={true}
                  autoCorrect="on"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Tell us briefly about your situation or any urgent court/sale dates..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-navy-950 font-extrabold text-sm py-3.5 rounded-xl shadow-lg cursor-pointer"
              >
                {submitting ? "Booking Your Free Consultation..." : "Confirm Free Consultation Appointment →"}
              </button>
            </form>
          )}
        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-navy-950 text-white rounded-2xl p-6 space-y-4 border border-gold-500/40">
            <h3 className="text-lg font-serif font-bold text-white">
              What Happens During Your Free 1-Hour Consultation?
            </h3>
            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Complete Debt Review:</strong> We examine your unsecured bills, mortgage, car loans, and income with zero judgment.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Asset Protection Guarantee:</strong> We confirm how Tennessee exemptions shield your home, car, and retirement.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong>$0 Money Down Path:</strong> Learn how to start immediately and stop collector calls today.
                </span>
              </li>
            </ul>
            <div className="pt-3 border-t border-white/10 text-xs">
              <div className="text-gold-400 font-bold mb-1">Need Immediate Help Today?</div>
              <a href={FIRM_INFO.phoneHref} className="text-base font-bold text-white hover:text-gold-300">
                📞 {FIRM_INFO.phoneFormatted}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
