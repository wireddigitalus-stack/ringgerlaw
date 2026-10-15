import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Scale,
  BookOpen,
} from "lucide-react";
import { PRACTICE_AREAS, COUNTY_LOCATIONS } from "@/lib/seo-data";
import { DebtReliefQuiz } from "@/components/DebtReliefQuiz";

export const metadata: Metadata = {
  title: "Bankruptcy & Debt Relief Solutions in Jackson & West TN | Ringger Law",
  description:
    "Explore Ringger Law's consumer bankruptcy solutions in Jackson, TN: Chapter 7 debt discharge, Chapter 13 foreclosure defense, stopping car repossession, and ending 25% wage garnishments.",
};

export default function SolutionsHubPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white py-14 border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <Scale className="w-4 h-4 text-gold-400" /> Western District of Tennessee • Debt Relief Authority
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
              Comprehensive Debt Relief &amp; Asset Protection Solutions
            </h1>
            <p className="text-base text-slate-200 leading-relaxed">
              Filing bankruptcy helps individuals and married couples either discard unsecured debt completely or establish a court-protected plan to catch up on mortgages and vehicles. Select your situation below or take our 60-second qualifier.
            </p>
          </div>
          <div className="lg:col-span-5">
            <DebtReliefQuiz defaultSource="/solutions" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRACTICE_AREAS.map((area) => (
            <div
              key={area.slug}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-gold-600 mb-1">
                  {area.heroBadge}
                </div>
                <h2 className="text-xl font-serif font-bold text-navy-950 mb-2">{area.title}</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {area.directAnswerSummary}
                </p>
                <ul className="space-y-1.5 mb-5">
                  {area.keyBenefits.map((b, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={`/practice/${area.slug}`}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2"
              >
                Read Full {area.shortTitle} Guide <ArrowRight className="w-4 h-4 text-gold-400" />
              </Link>
            </div>
          ))}
        </div>

        {/* Counties Block */}
        <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200">
          <h2 className="text-2xl font-serif font-bold text-navy-950 mb-2">
            Counties We Serve in the Western District of Tennessee (Eastern Division)
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Our Jackson office represents clients across all surrounding West Tennessee counties with both in-person and 100% phone/virtual consultations:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COUNTY_LOCATIONS.map((c) => (
              <Link
                key={c.slug}
                href={`/locations/${c.slug}`}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-navy-900 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-navy-950 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gold-600" /> {c.countyName}, TN
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {c.primaryCities.join(", ")}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
