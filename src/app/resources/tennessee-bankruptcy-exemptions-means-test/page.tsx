"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  Calculator,
  CheckCircle2,
  Building2,
  Phone,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { TENNESSEE_EXEMPTIONS_TABLE, FIRM_INFO } from "@/lib/seo-data";
import { DebtReliefQuiz } from "@/components/DebtReliefQuiz";

// Approximate Tennessee Median Annual Income Benchmarks by Household Size
const TN_MEDIAN_INCOME_BY_SIZE: Record<number, number> = {
  1: 61850,
  2: 76900,
  3: 89400,
  4: 106500,
  5: 116400,
  6: 126300,
};

export default function TennesseeExemptionsAndMeansTestPage() {
  const [householdSize, setHouseholdSize] = useState(2);
  const [monthlyGrossIncome, setMonthlyGrossIncome] = useState(4600);
  const [homeValue, setHomeValue] = useState(185000);
  const [mortgageBalance, setMortgageBalance] = useState(155000);
  const [filingJointly, setFilingJointly] = useState(true);

  const annualizedIncome = monthlyGrossIncome * 12;
  const medianThreshold = TN_MEDIAN_INCOME_BY_SIZE[householdSize] || 106500;
  const passesStep1MeansTest = annualizedIncome <= medianThreshold;

  const homeEquity = Math.max(0, homeValue - mortgageBalance);
  const homesteadLimit = filingJointly ? 52500 : 35000;
  const homeFullyProtected = homeEquity <= homesteadLimit;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white py-12 lg:py-16 border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <Scale className="w-4 h-4 text-gold-400" /> Official Tennessee Statutory Guide &amp; Interactive Calculator
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight">
              Tennessee Bankruptcy Exemptions, Means Test &amp; Jackson 341 Court Guide
            </h1>

            <p className="text-base text-slate-200 leading-relaxed">
              Use our interactive calculator below to see how Tennessee law protects your home equity, vehicles, and paycheck—and whether your household passes the Chapter 7 Means Test automatically.
            </p>

            {/* Interactive Means Test + Homestead Equity Calculator */}
            <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border-2 border-gold-400 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="text-lg font-serif font-bold text-navy-950 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-gold-600" /> Instant TN Means Test &amp; Home Equity Shield Calculator
                </h2>
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  Live Statutory Check
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Household Size (People in Home)
                  </label>
                  <select
                    value={householdSize}
                    onChange={(e) => setHouseholdSize(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Person" : "People"} (TN Median: ${TN_MEDIAN_INCOME_BY_SIZE[n].toLocaleString()}/yr)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Monthly Gross Income: <span className="text-navy-900">${monthlyGrossIncome.toLocaleString()}/mo</span>
                  </label>
                  <input
                    type="range"
                    min={1500}
                    max={11000}
                    step={250}
                    value={monthlyGrossIncome}
                    onChange={(e) => setMonthlyGrossIncome(Number(e.target.value))}
                    className="w-full accent-navy-900 mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Est. Home Value
                  </label>
                  <input
                    type="number"
                    step={5000}
                    value={homeValue}
                    onChange={(e) => setHomeValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Mortgage Payoff Balance
                  </label>
                  <input
                    type="number"
                    step={5000}
                    value={mortgageBalance}
                    onChange={(e) => setMortgageBalance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Filing Status
                  </label>
                  <select
                    value={filingJointly ? "joint" : "single"}
                    onChange={(e) => setFilingJointly(e.target.value === "joint")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  >
                    <option value="joint">Married Filing Jointly ($52.5k+ Homestead)</option>
                    <option value="single">Individual Filer ($35k–$50k Homestead)</option>
                  </select>
                </div>
              </div>

              {/* Output Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-navy-950 flex items-center gap-1.5">
                    <CheckCircle2 className={`w-4 h-4 ${passesStep1MeansTest ? "text-emerald-600" : "text-amber-600"}`} />
                    TN Chapter 7 Means Test Result:
                  </div>
                  <p className="text-slate-700">
                    Your annualized income (<strong>${annualizedIncome.toLocaleString()}</strong>) is{" "}
                    {passesStep1MeansTest ? (
                      <strong className="text-emerald-700">
                        BELOW the Tennessee median (${medianThreshold.toLocaleString()}) — You automatically pass Part 1 of the Chapter 7 Means Test!
                      </strong>
                    ) : (
                      <strong className="text-amber-800">
                        above the initial median (${medianThreshold.toLocaleString()}), so we apply Part 2 expense deductions or Chapter 13 reorganization.
                      </strong>
                    )}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-navy-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    TN Homestead Equity Result:
                  </div>
                  <p className="text-slate-700">
                    Estimated Home Equity: <strong>${homeEquity.toLocaleString()}</strong>.{" "}
                    {homeFullyProtected ? (
                      <strong className="text-emerald-700">
                        100% Protected under Tenn. Code Ann. § 26-2-301 (${homesteadLimit.toLocaleString()} limit)!
                      </strong>
                    ) : (
                      <strong className="text-navy-900">
                        Protected via Chapter 13 Asset Preservation Plan so your home is never sold.
                      </strong>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <DebtReliefQuiz defaultSource="/resources/tennessee-bankruptcy-exemptions-means-test" />
          </div>
        </div>
      </section>

      {/* Complete Statutory Exemptions Table */}
      <section className="py-14 px-4 max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Complete Tennessee Bankruptcy Exemptions Table (Tenn. Code Ann.)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Tennessee is an &ldquo;opt-out&rdquo; state, meaning residents filing bankruptcy in Jackson and West Tennessee use Tennessee state exemptions along with federal non-bankruptcy exemptions:
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-navy-950 text-white">
                <th className="py-3.5 px-4 font-bold">Asset / Property Category</th>
                <th className="py-3.5 px-4 font-bold">Protected Amount in Tennessee</th>
                <th className="py-3.5 px-4 font-bold">Tennessee Statutory Citation</th>
                <th className="py-3.5 px-4 font-bold">Practical Protection for Your Family</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {TENNESSEE_EXEMPTIONS_TABLE.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-navy-950">{row.assetCategory}</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-800">{row.statutoryAmount}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{row.tennesseeStatute}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.practicalMeaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Western District of TN (Jackson Courthouse) Local Guide */}
        <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Local Court Intelligence • Eastern Division
            </span>
            <h3 className="text-2xl font-serif font-bold text-white">
              What to Expect at the Jackson, TN Bankruptcy Court (341 Meeting of Creditors)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Cases for residents of <strong>Madison, Gibson, Haywood, Crockett, Chester, and Henderson counties</strong> are assigned to the Eastern Division of the U.S. Bankruptcy Court for the Western District of Tennessee at <strong>111 South Highland Avenue, Jackson, TN 38301</strong>. Approximately 30 days after we file your petition, a brief 5-to-10 minute &ldquo;341 Meeting of Creditors&rdquo; takes place with the appointed trustee. Today, most 341 meetings are held by Zoom or telephone—and credit card companies almost never show up. Attorney Louis W. Ringger Jr. prepares you thoroughly and represents you every step of the way.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-3">
            <Link
              href="/book-online"
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-extrabold text-sm py-3.5 px-5 rounded-xl text-center shadow-lg"
            >
              Book Free Case Evaluation →
            </Link>
            <a
              href={FIRM_INFO.phoneHref}
              className="bg-white/10 hover:bg-white/15 text-white font-bold text-sm py-3 px-5 rounded-xl text-center border border-white/20 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-gold-400" /> Call {FIRM_INFO.phoneFormatted}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
