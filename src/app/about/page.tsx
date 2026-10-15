import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Award,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Phone,
  ArrowRight,
  Building2,
  Clock,
} from "lucide-react";
import { FIRM_INFO, PRACTICE_AREAS } from "@/lib/seo-data";
import { DebtReliefQuiz } from "@/components/DebtReliefQuiz";

export const metadata: Metadata = {
  title: "About Ringger Law | Founded in 1981 | Louis W. Ringger Jr. Bankruptcy Attorney",
  description:
    "Founded by Bill Ringger in 1981, The Law Offices of Louis W. Ringger has over 45 years of experience helping Jackson and West Tennessee families eliminate debt through Chapter 7 and Chapter 13 bankruptcy.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white py-14 lg:py-20 border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <Award className="w-4 h-4 text-gold-400" /> Founded by Bill Ringger in 1981 • Jackson, Tennessee
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
              Over 45 Years of Helping West Tennessee Families Realize Financial Freedom.
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
              The Law Offices of Louis W. Ringger has stood beside hardworking people across Madison County and West Tennessee since 1981—helping thousands of families eliminate credit card and medical debt, stop foreclosures, and gain a fresh start.
            </p>

            <div className="flex items-center gap-4 bg-white/5 border border-white/15 rounded-2xl p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FIRM_INFO.louisPortraitUrl}
                alt="Louis W. Ringger Jr. — Attorney at Law"
                className="w-20 h-26 object-cover rounded-xl border-2 border-gold-400"
              />
              <div>
                <div className="text-lg font-serif font-bold text-white">Louis W. Ringger Jr.</div>
                <div className="text-xs text-gold-400 font-semibold">
                  Lead Bankruptcy Attorney • U.S. Bankruptcy Court, Western District of Tennessee
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  367 N. Parkway, Suite 1, Jackson, TN 38305 • Direct: {FIRM_INFO.phoneFormatted}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <DebtReliefQuiz defaultSource="/about" />
          </div>
        </div>
      </section>

      {/* What is Personal Bankruptcy: Chapter 7 vs Chapter 13 */}
      <section className="py-16 px-4 max-w-7xl mx-auto space-y-12">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Understanding Your Federal Rights
          </span>
          <h2 className="text-3xl font-serif font-bold text-navy-950 mt-2">
            What Is Personal Bankruptcy &amp; How Does It Give You a Fresh Start?
          </h2>
          <p className="text-slate-700 text-sm sm:text-base mt-3 leading-relaxed">
            Personal bankruptcy is a constitutional federal right designed to help honest individuals who have become overwhelmed by debt due to medical bills, inflation, job shifts, divorce, or high interest rates. It provides a structured, court-protected way to eliminate or reorganize debts while protecting your essential property.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 bg-navy-900 text-gold-400 text-xs font-bold px-3 py-1 rounded-lg">
              Chapter 7 Bankruptcy • Complete Fresh Start
            </div>
            <h3 className="text-2xl font-serif font-bold text-navy-950">
              Chapter 7: Wipe Out Unsecured Debt in 90–120 Days
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Chapter 7 eliminates 100% of qualifying unsecured debts—including credit cards, medical bills, personal loans, and old utility or deficiency balances—without a multi-year repayment plan. Under Tennessee statutory exemptions, your primary residence, vehicle equity, household furnishings, and retirement accounts are protected from liquidation in over 98% of cases.
            </p>
            <Link
              href="/practice/chapter-7-bankruptcy-jackson-tn"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-900 hover:text-gold-600"
            >
              Read Full Chapter 7 Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 bg-gold-500 text-navy-950 text-xs font-bold px-3 py-1 rounded-lg">
              Chapter 13 Bankruptcy • Home &amp; Car Protection
            </div>
            <h3 className="text-2xl font-serif font-bold text-navy-950">
              Chapter 13: Stop Foreclosure &amp; Catch Up Over 3–5 Years
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Chapter 13 is a court-supervised reorganization plan that allows individuals and married couples to keep their homes and vehicles while catching up on missed payments over 36 to 60 months. It immediately halts scheduled foreclosure auctions and vehicle repossessions while consolidating unsecured debt at 0% interest.
            </p>
            <Link
              href="/practice/chapter-13-bankruptcy-jackson-tn"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-900 hover:text-gold-600"
            >
              Read Full Chapter 13 Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
