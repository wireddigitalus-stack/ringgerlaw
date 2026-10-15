import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  CheckCircle2,
  Scale,
  Phone,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  MapPin,
  FileCheck,
} from "lucide-react";
import { PRACTICE_AREAS, COUNTY_LOCATIONS, FIRM_INFO } from "@/lib/seo-data";
import { FastCaptureCard } from "@/components/FastCaptureCard";

export function generateStaticParams() {
  return PRACTICE_AREAS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = PRACTICE_AREAS.find((p) => p.slug === slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `https://www.ringgerlaw.com/practice/${page.slug}`,
    },
  };
}

export default async function PracticeAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = PRACTICE_AREAS.find((p) => p.slug === slug);
  if (!page) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white py-12 lg:py-16 border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-gold-400" /> {page.heroBadge}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight">
              {page.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
              {page.heroSubheadline}
            </p>

            {/* Direct Answer Block for AI Search / GEO */}
            <div className="bg-navy-950/90 border-l-4 border-gold-400 rounded-r-xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-gold-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Scale className="w-4 h-4" /> Tennessee Legal Summary &amp; Statutory Authority
                </span>
                <span className="font-mono text-[11px] text-slate-400">{page.statuteCitation}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {page.directAnswerSummary}
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {page.keyBenefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <a
                href={FIRM_INFO.phoneHref}
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-2"
              >
                <Phone className="w-4 h-4" /> Call {FIRM_INFO.phoneFormatted} Now
              </a>
              <Link
                href="/intake"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-white/20 flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-gold-400" /> Complete Online Intake
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <FastCaptureCard defaultSource={`/practice/${page.slug}`} allowQuizToggle={true} />
          </div>
        </div>
      </section>

      {/* 4 Step Process for this Practice Area */}
      <section className="py-14 px-4 max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Step-by-Step Legal Process in Jackson &amp; West TN
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-1">
            How {page.title} Works at Ringger Law
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {page.howItWorksSteps.map((st, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-navy-900 text-gold-400 font-serif font-bold flex items-center justify-center mb-4">
                  {idx + 1}
                </div>
                <h3 className="font-serif font-bold text-navy-950 text-lg mb-2">{st.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{st.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Optional Comparison Table */}
      {page.comparisonTable && (
        <section className="py-10 px-4 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-navy-950 text-white">
                  {page.comparisonTable.headers.map((h, i) => (
                    <th key={i} className="py-3.5 px-5 font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {page.comparisonTable.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`py-3.5 px-5 ${
                          cIdx === 0 ? "font-bold text-navy-950" : "text-slate-700"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="py-14 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-gold-600" /> Frequently Asked Questions: {page.shortTitle}
        </h2>
        <div className="space-y-4">
          {page.faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-serif font-bold text-navy-950 text-base sm:text-lg mb-2">
                {f.question}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal Links to Counties & Other Practice Areas */}
      <section className="bg-slate-100 border-t border-slate-200 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950 mb-3">
              Other Debt Relief Services at Ringger Law
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRACTICE_AREAS.filter((p) => p.slug !== page.slug).map((other) => (
                <Link
                  key={other.slug}
                  href={`/practice/${other.slug}`}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-navy-900 text-xs font-bold text-navy-950 flex items-center justify-between"
                >
                  <span>{other.shortTitle}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold-600" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950 mb-3">
              Local Court Representation Across West Tennessee
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {COUNTY_LOCATIONS.map((c) => (
                <Link
                  key={c.slug}
                  href={`/locations/${c.slug}`}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-navy-900 text-xs font-semibold text-slate-800 flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  <span>{c.countyName}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
