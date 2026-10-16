"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  MapPin,
  AlertTriangle,
  Calendar,
  FileCheck,
  Scale,
  ArrowRight,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { FIRM_INFO, PRACTICE_AREAS, COUNTY_LOCATIONS } from "@/lib/seo-data";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [emergencySubmitted, setEmergencySubmitted] = useState(false);
  const [emergencyForm, setEmergencyForm] = useState({
    firstName: "",
    phone: "",
    county: "Madison County (Jackson)",
    primaryConcern: "Emergency Foreclosure Sale / Notice",
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleEmergencySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emergencyForm.firstName || !emergencyForm.phone) return;
    setSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: emergencyForm.firstName,
          phone: emergencyForm.phone,
          email: "",
          county: emergencyForm.county,
          primaryConcern: emergencyForm.primaryConcern,
          estimatedDebt: 45000,
          ownsHome: emergencyForm.primaryConcern.includes("Foreclosure"),
          behindOnPayments: true,
          sourcePage: typeof window !== "undefined" ? window.location.pathname : "/",
          captureMethod: "Emergency Hotline Bar",
          notes: "URGENT CALLBACK REQUESTED via Top Emergency Protection Bar",
        }),
      });
      setEmergencySubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Top Emergency Foreclosure / Garnishment Alert Bar */}
      <div className="bg-gradient-to-r from-red-950 via-navy-900 to-red-950 text-white border-b border-gold-500/30 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1 bg-red-600 text-white font-bold px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" /> Urgent Filing Line
            </span>
            <span className="text-slate-100 font-medium">
              Facing a <strong>Foreclosure Sale</strong>, <strong>Car Repo</strong>, or <strong>25% Wage Garnishment</strong> this week? Same-day Automatic Stay protection available.
            </span>
          </div>
          <button
            onClick={() => {
              setEmergencySubmitted(false);
              setEmergencyModalOpen(true);
            }}
            className="text-gold-400 hover:text-gold-300 font-bold underline underline-offset-4 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ml-auto"
          >
            Request Instant Emergency Callback <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header className="sticky top-0 z-40 bg-navy-950/95 backdrop-blur-md text-white border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 font-serif font-bold text-lg shadow-md group-hover:scale-105 transition shrink-0">
              RL
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
                  RINGGER LAW
                </span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-400/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Est. 1981
                </span>
              </div>
              <p className="text-[11px] text-slate-300 whitespace-nowrap mt-0.5">
                Louis W. Ringger Jr. • West TN Bankruptcy
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-slate-200">
            {/* Solutions Dropdown */}
            <div className="relative group py-6">
              <Link
                href="/solutions"
                className="flex items-center gap-1 hover:text-gold-400 transition whitespace-nowrap"
              >
                <span>Debt Solutions</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition" />
              </Link>
              <div className="absolute left-0 top-full w-80 bg-navy-900 border border-white/15 rounded-xl shadow-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-gold-400 px-3 py-1.5 border-b border-white/10 mb-1">
                  Bankruptcy &amp; Emergency Protection
                </div>
                {PRACTICE_AREAS.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/practice/${item.slug}`}
                    className="block px-3 py-2 rounded-lg hover:bg-white/10 text-slate-100 hover:text-gold-300 transition text-xs"
                  >
                    <div className="font-semibold text-sm">{item.shortTitle}</div>
                    <div className="text-slate-400 text-[11px] line-clamp-1">{item.heroHeadline}</div>
                  </Link>
                ))}
                <div className="mt-2 pt-2 border-t border-white/10">
                  <Link
                    href="/resources/tennessee-bankruptcy-exemptions-means-test"
                    className="block px-3 py-2 rounded-lg bg-gold-500/15 hover:bg-gold-500/25 text-gold-300 font-semibold text-xs"
                  >
                    📊 TN Exemptions &amp; Means Test Calculator →
                  </Link>
                </div>
              </div>
            </div>

            {/* Counties Served Dropdown */}
            <div className="relative group py-6">
              <button className="flex items-center gap-1 hover:text-gold-400 transition whitespace-nowrap cursor-pointer">
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Counties Served</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition" />
              </button>
              <div className="absolute left-0 top-full w-72 bg-navy-900 border border-white/15 rounded-xl shadow-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-gold-400 px-3 py-1.5 border-b border-white/10 mb-1">
                  Western District of TN (Eastern Div.)
                </div>
                {COUNTY_LOCATIONS.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/locations/${c.slug}`}
                    className="block px-3 py-2 rounded-lg hover:bg-white/10 text-slate-100 hover:text-gold-300 transition"
                  >
                    <div className="font-semibold text-sm">{c.countyName}, TN</div>
                    <div className="text-slate-400 text-[11px]">{c.primaryCities.slice(0, 3).join(", ")}</div>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/resources/tennessee-bankruptcy-exemptions-means-test"
              className="hover:text-gold-400 transition whitespace-nowrap"
            >
              TN Exemptions
            </Link>

            <Link
              href="/about"
              className="hover:text-gold-400 transition whitespace-nowrap"
            >
              About Us
            </Link>

            <Link
              href="/intake"
              className="flex items-center gap-1.5 text-slate-200 hover:text-gold-400 transition whitespace-nowrap"
            >
              <FileCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span>Intake Questionnaire</span>
            </Link>

            <Link
              href="/contact"
              className="hover:text-gold-400 transition whitespace-nowrap"
            >
              Contact
            </Link>
          </nav>

          {/* Right Call & Free Consultation CTAs */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href={FIRM_INFO.phoneHref}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-white/15 hover:border-gold-400/60 bg-white/5 transition whitespace-nowrap"
            >
              <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[10px] uppercase tracking-wider text-gold-400 font-bold whitespace-nowrap">
                  Call Jackson Office
                </div>
                <div className="text-sm font-extrabold text-white whitespace-nowrap">
                  {FIRM_INFO.phoneFormatted}
                </div>
              </div>
            </a>

            <Link
              href="/book-online"
              className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-navy-950 font-extrabold text-xs sm:text-sm px-4 py-3 rounded-xl shadow-lg shadow-gold-500/20 flex items-center gap-2 whitespace-nowrap transition transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Free Consultation</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={FIRM_INFO.phoneHref}
              className="bg-gold-500 text-navy-950 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1 whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5" /> Call Now
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-navy-900 border-t border-white/10 px-4 pt-4 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/book-online"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-gold-500 text-navy-950 font-bold text-center py-3 rounded-xl text-sm"
              >
                Book Free Consult
              </Link>
              <Link
                href="/intake"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-white/10 text-white font-semibold text-center py-3 rounded-xl text-sm border border-white/15"
              >
                Intake Questionnaire
              </Link>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-gold-400 px-2 py-1">
                Bankruptcy &amp; Debt Relief Solutions
              </div>
              {PRACTICE_AREAS.map((item) => (
                <Link
                  key={item.slug}
                  href={`/practice/${item.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/10"
                >
                  {item.shortTitle}
                </Link>
              ))}
              <Link
                href="/resources/tennessee-bankruptcy-exemptions-means-test"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gold-300 font-semibold hover:bg-white/10"
              >
                TN Exemptions &amp; Means Test Calculator
              </Link>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-gold-400 px-2 py-1">
                West Tennessee Counties Served
              </div>
              <div className="grid grid-cols-2 gap-1">
                {COUNTY_LOCATIONS.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/locations/${c.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-xs text-slate-200 bg-white/5"
                  >
                    {c.countyName}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-wrap justify-between gap-2 text-sm">
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-slate-300">
                About Ringger Law
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-slate-300">
                Contact Office
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Emergency Fast-Track Callback Modal */}
      {emergencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-red-600 relative">
            <button
              onClick={() => setEmergencyModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {emergencySubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-navy-950">Emergency Alert Sent to Ringger Law!</h3>
                <p className="text-sm text-slate-600">
                  Your priority callback request has been flagged as <strong>URGENT</strong> in our Jackson office dashboard. For immediate assistance right now, call us directly:
                </p>
                <a
                  href={FIRM_INFO.phoneHref}
                  className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg"
                >
                  <Phone className="w-4 h-4" /> Call {FIRM_INFO.phoneFormatted} Now
                </a>
              </div>
            ) : (
              <form onSubmit={handleEmergencySubmit} autoComplete="on" spellCheck={true} className="space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
                  <AlertTriangle className="w-4 h-4" /> Priority Emergency Filing Triage
                </div>
                <h3 className="text-xl font-serif font-bold text-navy-950">
                  Stop Foreclosure, Repossession, or Wage Garnishment Today
                </h3>
                <p className="text-xs text-slate-600">
                  Enter your direct number below. Our team prioritizes emergency automatic-stay filings in Madison County and across West Tennessee.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    spellCheck={true}
                    autoCorrect="on"
                    required
                    value={emergencyForm.firstName}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, firstName: e.target.value })}
                    placeholder="e.g., John Smith"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Best Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    required
                    value={emergencyForm.phone}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, phone: e.target.value })}
                    placeholder="(731) 555-0123"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">What Emergency Are You Facing?</label>
                  <select
                    value={emergencyForm.primaryConcern}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, primaryConcern: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm"
                  >
                    <option value="Emergency Foreclosure Sale / Notice">Scheduled Home Foreclosure Sale</option>
                    <option value="Emergency Vehicle Repossession">Vehicle Repossession Threat or Recent Repo</option>
                    <option value="Emergency 25% Wage Garnishment">25% Paycheck Garnishment / Bank Levy</option>
                    <option value="General Sessions Lawsuit Summons">General Sessions Court Lawsuit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">West TN County</label>
                  <select
                    value={emergencyForm.county}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, county: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm"
                  >
                    <option>Madison County (Jackson)</option>
                    <option>Gibson County (Milan / Humboldt / Trenton)</option>
                    <option>Haywood County (Brownsville)</option>
                    <option>Crockett County (Alamo / Bells)</option>
                    <option>Chester County (Henderson)</option>
                    <option>Henderson County (Lexington)</option>
                    <option>Other West TN County</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg transition cursor-pointer"
                >
                  {submitting ? "Sending Priority Alert..." : "Alert Attorney Louis Ringger Now →"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-white/10">
      {/* Pre-Footer Callout Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border-b border-white/10 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-widest mb-2">
              <ShieldCheck className="w-4 h-4" /> Over 45 Years of Helping West Tennessee Realize Financial Freedom
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Ready to Stop the Stress &amp; Get a Fresh Financial Start?
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Get started today with $0 Money Down and a fast, confidential Free Consultation with Attorney Louis W. Ringger Jr.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/book-online"
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-6 py-3.5 rounded-xl shadow-lg transition"
            >
              Book FREE Consultation
            </Link>
            <a
              href={FIRM_INFO.phoneHref}
              className="bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3.5 rounded-xl border border-white/20 transition flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-gold-400" /> Call {FIRM_INFO.phoneFormatted}
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
        {/* Col 1: Firm Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold-500 text-navy-950 font-serif font-bold flex items-center justify-center text-lg">
              RL
            </div>
            <span className="font-serif text-xl font-bold text-white">RINGGER LAW</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            The Law Offices of Louis W. Ringger were founded by Bill Ringger in 1981 and have helped many thousands of West Tennessee clients become financially independent with a fresh start.
          </p>
          <div className="space-y-1.5 text-xs text-slate-200">
            <div className="font-semibold text-gold-400">{FIRM_INFO.attorney}</div>
            <div>📍 {FIRM_INFO.address.full}</div>
            <div>
              📞{" "}
              <a href={FIRM_INFO.phoneHref} className="hover:text-gold-400">
                {FIRM_INFO.phoneFormatted}
              </a>
            </div>
            <div>
              ✉️{" "}
              <a href={`mailto:${FIRM_INFO.email}`} className="hover:text-gold-400">
                {FIRM_INFO.email}
              </a>
            </div>
          </div>
        </div>

        {/* Col 2: Practice Areas (SEO Internal Links) */}
        <div>
          <h3 className="font-bold uppercase tracking-wider text-xs mb-4 text-gold-400">
            Bankruptcy &amp; Debt Solutions
          </h3>
          <ul className="space-y-2.5 text-xs">
            {PRACTICE_AREAS.map((p) => (
              <li key={p.slug}>
                <Link href={`/practice/${p.slug}`} className="hover:text-gold-400 transition">
                  {p.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/resources/tennessee-bankruptcy-exemptions-means-test"
                className="text-gold-300 hover:text-gold-200 font-semibold"
              >
                Tennessee Bankruptcy Exemptions &amp; Means Test
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: West TN Counties Served */}
        <div>
          <h3 className="font-bold uppercase tracking-wider text-xs mb-4 text-gold-400">
            West Tennessee Service Areas
          </h3>
          <ul className="space-y-2.5 text-xs">
            {COUNTY_LOCATIONS.map((c) => (
              <li key={c.slug}>
                <Link href={`/locations/${c.slug}`} className="hover:text-gold-400 transition">
                  {c.countyName} ({c.primaryCities.slice(0, 2).join(", ")})
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Quick Links & Client Portal */}
        <div>
          <h3 className="font-bold uppercase tracking-wider text-xs mb-4 text-gold-400">
            Client Resources &amp; Portal
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/book-online" className="hover:text-gold-400 transition">
                Schedule Free Phone or Office Consultation
              </Link>
            </li>
            <li>
              <Link href="/intake" className="hover:text-gold-400 transition">
                Online Bankruptcy Intake Questionnaire
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold-400 transition">
                About Ringger Law (Founded 1981)
              </Link>
            </li>
            <li>
              <Link href="/solutions" className="hover:text-gold-400 transition">
                All Debt Relief Practice Areas
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:text-gold-400 transition">
                Terms, Conditions &amp; Legal Disclaimers
              </Link>
            </li>
            <li className="pt-3 border-t border-white/10">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-gold-300 px-3.5 py-2.5 rounded-xl font-bold border border-gold-400/30 transition"
              >
                <BarChart3 className="w-4 h-4 text-gold-400" />
                <span>Attorney Lead &amp; Valuation Dashboard</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Statutory 11 U.S.C. § 528 Bankruptcy Disclosure */}
      <div className="border-t border-white/10 bg-black/30 py-6 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="max-w-4xl leading-relaxed">
            <strong>Mandatory Federal Disclosure (11 U.S.C. § 528):</strong> The Law Offices of Louis W. Ringger (Ringger Law) is a Federally Designated Debt Relief Agency. We help people file for bankruptcy relief under the U.S. Bankruptcy Code. Information on this website is for general educational purposes in Tennessee and does not establish an attorney-client relationship until a formal agreement is signed.
          </p>
          <div className="flex items-center gap-4 text-slate-500 whitespace-nowrap">
            <span>© {new Date().getFullYear()} Ringger Law • Jackson, TN</span>
            <Link href="/admin" className="text-slate-500 hover:text-gold-400 underline">
              Staff Login / Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
