import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  MapPin,
  Building2,
  CheckCircle2,
  Phone,
  ArrowRight,
  Scale,
  HelpCircle,
} from "lucide-react";
import { COUNTY_LOCATIONS, PRACTICE_AREAS, FIRM_INFO } from "@/lib/seo-data";
import { FastCaptureCard } from "@/components/FastCaptureCard";

export function generateStaticParams() {
  return COUNTY_LOCATIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const county = COUNTY_LOCATIONS.find((c) => c.slug === slug);
  if (!county) return {};
  const url = `https://www.ringgerlaw.com/locations/${county.slug}`;
  return {
    title: county.metaTitle,
    description: county.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: county.metaTitle,
      description: county.metaDescription,
      url,
      siteName: "Ringger Law",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: county.metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: county.metaTitle,
      description: county.metaDescription,
      images: ["/og-image.png"],
    },
  };
}

export default async function CountyLocationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const county = COUNTY_LOCATIONS.find((c) => c.slug === slug);
  if (!county) notFound();

  const pageUrl = `https://www.ringgerlaw.com/locations/${county.slug}`;
  const structuredSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.ringgerlaw.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "West TN Counties Served",
            item: "https://www.ringgerlaw.com/contact",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${county.countyName}, TN`,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#county-service`,
        name: `${county.countyName}, Tennessee Bankruptcy & Foreclosure Defense`,
        serviceType: "Chapter 7 & Chapter 13 Bankruptcy Legal Representation",
        description: county.directAnswerSummary,
        url: pageUrl,
        provider: {
          "@type": "LegalService",
          "@id": "https://www.ringgerlaw.com/#legalservice",
          name: FIRM_INFO.name,
          telephone: "+1-731-421-1501",
        },
        areaServed: [
          {
            "@type": "AdministrativeArea",
            name: `${county.countyName}, Tennessee`,
          },
          ...county.primaryCities.map((city) => ({
            "@type": "City",
            name: `${city}, TN`,
          })),
          ...county.zipCodes.map((zip) => ({
            "@type": "PostalAddress",
            postalCode: zip,
            addressRegion: "TN",
            addressCountry: "US",
          })),
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: county.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredSchema) }}
      />

      {/* County Hero */}
      <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white py-12 lg:py-16 border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-5">
            <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex flex-wrap items-center gap-1.5">
              <Link href="/" className="hover:text-gold-400 transition">
                Home
              </Link>
              <span>/</span>
              <Link href="/contact" className="hover:text-gold-400 transition">
                Counties Served
              </Link>
              <span>/</span>
              <span className="text-gold-300 font-semibold">{county.countyName}, TN</span>
            </nav>

            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <MapPin className="w-4 h-4 text-gold-400" /> Serving {county.countyName}, Tennessee Since 1981
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight">
              {county.countyName} Bankruptcy &amp; Debt Relief Attorney
            </h1>

            <p className="text-sm sm:text-base text-gold-300 font-medium">
              Serving Families in {county.primaryCities.join(" • ")} (ZIPs: {county.zipCodes.join(", ")})
            </p>

            {/* Direct Answer Block for AI & Local Pack */}
            <div className="bg-navy-950/90 border-l-4 border-gold-400 rounded-r-xl p-5 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4" /> {county.countyName} Bankruptcy Court &amp; Filing Guide
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {county.directAnswerSummary}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Federal Bankruptcy Court Division:</strong> {county.courtJurisdiction} ({county.courtAddress})
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Consultation Convenience:</strong> {county.drivingDistanceToOffice}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-gold-400">
                How We Help {county.countyName} Residents:
              </div>
              {county.commonLocalIssues.map((issue, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={FIRM_INFO.phoneHref}
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-2"
              >
                <Phone className="w-4 h-4" /> Call {FIRM_INFO.phoneFormatted}
              </a>
              <Link
                href="/book-online"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-white/20"
              >
                Book Virtual Phone Consult
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <FastCaptureCard defaultSource={`/locations/${county.slug}`} allowQuizToggle={true} />
          </div>
        </div>
      </section>

      {/* Local Economic Context & Practice Areas */}
      <section className="py-14 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Protecting Hardworking Families in {county.primaryCities.slice(0, 3).join(", ")} &amp; Across {county.countyName}
          </h2>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {county.localEconomicContext}
          </p>

          <div className="space-y-4 pt-2">
            <h3 className="text-xl font-serif font-bold text-navy-950 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-gold-600" /> {county.countyName} Bankruptcy FAQs
            </h3>
            {county.faqs.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <h4 className="font-bold text-navy-950 text-base mb-1.5">{f.question}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-navy-950">
              Bankruptcy Services Available in {county.countyName}
            </h3>
            <div className="space-y-2.5">
              {PRACTICE_AREAS.map((p) => (
                <Link
                  key={p.slug}
                  href={`/practice/${p.slug}`}
                  className="block p-3.5 rounded-xl border border-slate-200 hover:border-navy-900 hover:bg-slate-50 transition"
                >
                  <div className="font-bold text-sm text-navy-950 flex items-center justify-between">
                    <span>{p.shortTitle}</span>
                    <ArrowRight className="w-4 h-4 text-gold-600" />
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {p.heroHeadline}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
