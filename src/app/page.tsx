import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Phone,
  CheckCircle2,
  Scale,
  Award,
  MapPin,
  ArrowRight,
  Star,
  BookOpen,
  Building2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { FastCaptureCard } from "@/components/FastCaptureCard";
import { DebtReliefQuiz } from "@/components/DebtReliefQuiz";
import {
  FIRM_INFO,
  PRACTICE_AREAS,
  COUNTY_LOCATIONS,
  TENNESSEE_EXEMPTIONS_TABLE,
} from "@/lib/seo-data";

const CREDIT_CARD_HERO_BG =
  "https://static.wixstatic.com/media/77e9849579aa4e5985019cd20d8d5ea1.jpg/v1/fill/w_1920,h_1080,al_c,q_85/77e9849579aa4e5985019cd20d8d5ea1.jpg";

export default function HomePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How can I eliminate credit card and medical debt or stop a foreclosure in Jackson, Tennessee?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "By filing Chapter 7 or Chapter 13 bankruptcy in the U.S. Bankruptcy Court for the Western District of Tennessee (111 S. Highland Ave, Jackson, TN), a federal Automatic Stay (11 U.S.C. § 362) immediately stops foreclosures, vehicle repossessions, and 25% wage garnishments. Ringger Law has helped West Tennessee families since 1981 with $0 Money Down consultation and filing options.",
        },
      },
      {
        "@type": "Question",
        name: "Will I lose my home or car if I file bankruptcy with Ringger Law in Tennessee?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No—over 98% of our clients keep their homes and vehicles. Tennessee statutory exemptions (Tenn. Code Ann. § 26-2-301 and § 26-2-103) protect up to $35,000–$52,500+ in primary home equity and $10,000 per filer in personal property, while Chapter 13 lets you catch up on missed mortgage or car payments over 3 to 5 years.",
        },
      },
      {
        "@type": "Question",
        name: "What are the 4 easy steps to file bankruptcy at Ringger Law?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Step 1: Free Phone or Office Consultation with Attorney Louis W. Ringger Jr. Step 2: Gather essential documents (pay stubs, tax returns, debts). Step 3: Ringger Law prepares and electronically files your Bankruptcy Petition, activating immediate creditor protection. Step 4: Fast online credit counseling and final debt discharge.",
        },
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* SIGNATURE HERO BANNER: Centered Hero Text Over Signature Credit-Card + Rich Purple/Indigo Background */}
      <section className="relative bg-[#140826] text-white overflow-hidden">
        {/* Background Credit Card Macro Image + Rich Purple/Indigo Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50 scale-105"
          style={{ backgroundImage: `url("${CREDIT_CARD_HERO_BG}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#130624]/90 via-[#261042]/80 to-[#140826]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(163,217,41,0.18),transparent_60%)]" />

        {/* Centered Hero Content Container */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16 relative z-10 text-center space-y-6">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-black/45 backdrop-blur-md border border-[#A8E028]/40 rounded-full px-5 py-1.5 text-xs sm:text-sm font-bold text-[#B6F035]">
            <Award className="w-4 h-4 text-[#A8E028]" />
            <span>Serving Jackson &amp; West Tennessee Since 1981 • $0 Money Down Options</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[68px] xl:text-[74px] font-sans font-extrabold tracking-tight leading-[1.05] drop-shadow-md">
            <span className="text-[#A8E028]">Eliminate</span>{" "}
            <span className="text-white">Credit Card &amp; Medical Debt.</span>
            <span className="block mt-1">
              <span className="text-[#A8E028]">Stop</span>{" "}
              <span className="text-white">Foreclosures &amp; Repossessions.</span>
            </span>
            <span className="block text-[#A8E028] text-3xl sm:text-5xl lg:text-[54px] mt-3">
              In just 4 easy steps
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-medium">
            Start your <strong>FREE Consultation</strong> today with{" "}
            <span className="text-[#B6F035] font-bold underline underline-offset-4">
              No Money Down
            </span>
            . We enforce your federal rights so you keep your home and vehicle while immediately stopping aggressive bill collectors and 25% wage garnishments.
          </p>

          {/* Centered High-Impact Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#fast-capture"
              className="bg-[#A8E028] hover:bg-[#b8f038] text-black font-extrabold text-sm sm:text-base px-8 py-4 rounded-full shadow-xl shadow-[#A8E028]/25 flex items-center gap-2.5 transition transform hover:-translate-y-0.5"
            >
              <span>GET STARTED! (Free Consult)</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href={FIRM_INFO.phoneHref}
              className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white font-bold text-sm sm:text-base px-7 py-4 rounded-full border border-white/25 hover:border-[#A8E028] flex items-center gap-2.5 transition"
            >
              <Phone className="w-4 h-4 text-[#A8E028]" />
              <span>Call {FIRM_INFO.phoneFormatted}</span>
            </a>
          </div>
        </div>

        {/* Rounded Black Bottom Transition Band ("4 Easy Steps!" Bar) */}
        <div className="relative z-20 bg-black rounded-t-[36px] border-t border-white/15 px-4 sm:px-8 py-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#A8E028] tracking-tight">
                4 Easy Steps!
              </span>
              <span className="text-xs sm:text-sm text-slate-300">
                1. Free Consultation → 2. Gather Documents → 3. We File Your Petition → 4. Fresh Financial Start
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#qualifier-quiz-section"
                className="bg-white/10 hover:bg-white/20 text-[#A8E028] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full border border-[#A8E028]/40 transition"
              >
                Take 60-Sec $0-Down Quiz ↓
              </a>
              <Link
                href="/book-online"
                className="bg-[#A8E028] hover:bg-[#b8f038] text-black font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center gap-2 transition"
              >
                <Calendar className="w-4 h-4" /> Book Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CAPTURE ENGINE #1 (TOP OF PAGE): ABOUT RINGGER LAW CARD (PORTRAIT JUSTIFIED RIGHT) + 1-STEP FAST CONSULTATION FORM */}
      <section id="fast-capture" className="bg-navy-950 text-white py-14 lg:py-20 px-4 border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: About Ringger Law Card with Cutout Portrait Justified Right + Trust Bullets */}
          <div className="lg:col-span-7 space-y-6">
            {/* ABOUT CARD WITH LOUIS W. RINGGER JR. CUTOUT JUSTIFIED FLUSH RIGHT IN THE CARD */}
            <div className="relative bg-gradient-to-br from-[#1b0c33] via-navy-900 to-[#120722] border border-[#A8E028]/35 rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-12 items-end">
                {/* Card Left Copy */}
                <div className="sm:col-span-7 p-6 sm:p-8 space-y-4 self-center z-10">
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#A8E028] bg-black/40 border border-[#A8E028]/30 px-3 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#A8E028]" /> Est. 1981 • 45+ Years Experience
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                    Start Your Free Consultation Today — With{" "}
                    <span className="text-[#A8E028]">$0 Money Down</span>.
                  </h2>

                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                    Founded by <strong>Bill Ringger in 1981</strong>, The Law Offices of Louis W. Ringger has helped thousands of Jackson and West Tennessee families eliminate debt, stop foreclosures, and gain a fresh start.
                  </p>

                  <div className="pt-1">
                    <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                      Louis W. Ringger Jr.
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-[#A8E028]">
                      Attorney at Law • Jackson, TN
                    </div>
                  </div>
                </div>

                {/* Card Right Image: Cutout Portrait Justified Flush Right & Bottom Inside the Card */}
                <div className="sm:col-span-5 relative flex items-end justify-end self-end pr-0 pb-0 mr-0 ml-auto w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://static.wixstatic.com/media/44d8da_50b497936b394f05978c2296d23a252d~mv2.png/v1/fill/w_1260,h_1680,al_c,q_90/LR%20edit.png"
                    alt="Louis W. Ringger Jr. — Attorney at Law in Jackson, Tennessee"
                    className="w-[240px] sm:w-[270px] md:w-[300px] lg:w-[310px] max-w-none h-auto object-contain object-right-bottom drop-shadow-[0_14px_28px_rgba(0,0,0,0.85)] select-none ml-auto mr-0 block"
                  />
                </div>
              </div>
            </div>

            {/* 4 Key Value Pillars Beneath the About Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                <CheckCircle2 className="w-5 h-5 text-[#A8E028] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">Fast &amp; Affordable ($0 Down)</div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Stop harassing collector phone calls, foreclosures, and repossessions without needing thousands upfront.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                <CheckCircle2 className="w-5 h-5 text-[#A8E028] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">We Make Sure You Keep What’s Yours</div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    We enforce your Tennessee statutory exemptions so you keep your home, your car, and your paycheck.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                <CheckCircle2 className="w-5 h-5 text-[#A8E028] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">We Do All the Court Paperwork</div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    We prepare and file your petition with the Western District of TN Bankruptcy Court in Jackson so you can breathe easy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                <CheckCircle2 className="w-5 h-5 text-[#A8E028] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">Phone, Virtual Zoom, or In-Office</div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Visit us at 367 N. Parkway, Suite 1 in Jackson or complete your consultation from your phone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 1-Step Fast Capture Card (with optional toggle to Quiz) */}
          <div className="lg:col-span-5">
            <FastCaptureCard defaultSource="/" allowQuizToggle={true} />
          </div>
        </div>
      </section>

      {/* GEO / AI OVERVIEW DIRECT-ANSWER AUTHORITY BAR */}
      <section className="bg-white border-b border-slate-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-50 border-l-4 border-navy-900 rounded-r-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-navy-900">
                <Scale className="w-4 h-4 text-gold-600" /> Tennessee Bankruptcy Law Summary (Western District of TN — Eastern Division)
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                11 U.S.C. §§ 362, 701, 1301 • Tenn. Code Ann. § 26-2-301
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong>How Bankruptcy Works in Jackson &amp; West Tennessee:</strong> Filing a Chapter 7 or Chapter 13 petition with{" "}
              <strong>Ringger Law</strong> in the U.S. Bankruptcy Court in Jackson, TN (111 S. Highland Ave) immediately activates a federal{" "}
              <strong>Automatic Stay</strong>. This court order halts home foreclosures, car repossessions, collection lawsuits, and 25% paycheck garnishments the moment your case is filed. Under Tennessee property exemptions, homeowners protect up to{" "}
              <strong>$35,000–$52,500+ in home equity</strong> and <strong>$10,000 per filer in personal assets</strong>, meaning over 98% of clients eliminate their unsecured debt while keeping their house, vehicles, and retirement intact.
            </p>
          </div>
        </div>
      </section>

      {/* THE 4 EASY STEPS TO FINANCIAL FREEDOM */}
      <section className="py-16 lg:py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600 bg-gold-100 px-3 py-1 rounded-full">
            Painless &amp; Proven Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950 mt-3">
            Eliminate Your Debt in Just 4 Easy Steps
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            We handle the heavy paperwork and deal directly with aggressive creditors so you can get back to your life without all the stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "Step 1",
              title: "Free Consultation ($0 Down)",
              desc: "Speak live with our Jackson debt relief team by phone, virtual Zoom, or in person. We review your options, answer every question, and map out your path with zero pressure.",
              ctaText: "Book Free Consultation",
              ctaHref: "/book-online",
            },
            {
              step: "Step 2",
              title: "Gather Simple Documents",
              desc: "Collect basic documents like pay stubs, tax returns, and creditor statements—or use our simple Step-by-Step Online Intake Portal from your phone.",
              ctaText: "View Document Checklist",
              ctaHref: "/intake",
            },
            {
              step: "Step 3",
              title: "We File Your Petition & Stop Collectors",
              desc: "We complete all court schedules and file electronically with the Western District of TN Court—immediately stopping foreclosures, repossessions, and collector calls.",
              ctaText: "Learn About Automatic Stay",
              ctaHref: "/practice/stop-foreclosure-jackson-tn",
            },
            {
              step: "Step 4",
              title: "Fast Online Counseling & Fresh Start",
              desc: "Complete brief online credit counseling from home. Your unsecured debts are wiped out or reorganized, leaving you financially independent with a clean slate.",
              ctaText: "Compare Chapter 7 vs 13",
              ctaHref: "/resources/tennessee-bankruptcy-exemptions-means-test",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-gold-500/60 transition flex flex-col justify-between relative overflow-hidden group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-navy-900 text-[#A8E028] font-bold text-xs px-3 py-1 rounded-lg">
                    {item.step}
                  </span>
                  <span className="text-3xl font-serif font-bold text-slate-200 group-hover:text-gold-400 transition">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-navy-950 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  {item.desc}
                </p>
              </div>
              <Link
                href={item.ctaHref}
                className="text-xs font-bold text-navy-900 hover:text-gold-600 inline-flex items-center gap-1 pt-3 border-t border-slate-100"
              >
                {item.ctaText} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CAPTURE ENGINE #2 (DEDICATED MID-PAGE INTERACTIVE TOOL): CHECK YOUR $0-DOWN ELIGIBILITY & RELIEF OPTIONS */}
      <section
        id="qualifier-quiz-section"
        className="bg-gradient-to-br from-slate-100 via-white to-gold-100/40 border-y border-slate-200 py-16 lg:py-20 px-4"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 bg-navy-900 text-[#A8E028] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4" /> Interactive West Tennessee Relief Calculator
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950 leading-tight">
              Not Sure Which Option Fits You? Check Your $0-Down Eligibility in 60 Seconds.
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              Every family&apos;s financial situation is unique. Whether you want to wipe out{" "}
              <strong>100% of your credit card and medical debt in 90 days (Chapter 7)</strong> or{" "}
              <strong>stop a foreclosure or car repossession and catch up over 3–5 years (Chapter 13)</strong>, our interactive tool gives you an instant recommendation based on Tennessee bankruptcy laws.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  <strong>No Social Security Number</strong> or credit pull required
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Automatically checks <strong>Chapter 7 vs. Chapter 13</strong> fit for your county
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Sends your custom relief summary straight to <strong>Attorney Louis W. Ringger Jr.</strong>
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            <DebtReliefQuiz defaultSource="/#qualifier-quiz-section" />
          </div>
        </div>
      </section>

      {/* CORE PRACTICE SILOS */}
      <section className="bg-navy-950 text-white py-16 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#A8E028]">
                Complete Debt &amp; Asset Protection
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
                How Ringger Law Protects Your Family &amp; Property
              </h2>
            </div>
            <Link
              href="/solutions"
              className="text-sm font-bold text-[#A8E028] hover:text-gold-300 inline-flex items-center gap-1.5"
            >
              View All Practice Areas &amp; Guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRACTICE_AREAS.map((area) => (
              <Link
                key={area.slug}
                href={`/practice/${area.slug}`}
                className="bg-navy-900/90 hover:bg-navy-800 border border-white/10 hover:border-[#A8E028]/60 rounded-2xl p-6 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#A8E028] mb-2">
                    {area.heroBadge}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#A8E028] transition mb-2">
                    {area.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {area.directAnswerSummary.slice(0, 190)}...
                  </p>
                  <ul className="space-y-1.5 mb-5">
                    {area.keyBenefits.slice(0, 2).map((b, i) => (
                      <li key={i} className="text-xs text-slate-200 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#A8E028] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#A8E028]">
                  <span>Explore {area.shortTitle} Guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GEO AUTHORITY TABLE: TENNESSEE BANKRUPTCY EXEMPTIONS PREVIEW */}
      <section className="bg-slate-100 border-y border-slate-200 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-navy-900 bg-white border border-slate-300 px-3 py-1 rounded-full">
              Tennessee Statutory Asset Protection (Tenn. Code Ann.)
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-3">
              Will I Lose My House, Car, or Retirement in Tennessee Bankruptcy?
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              <strong>No.</strong> Tennessee law shields your essential property from creditors. Here is the exact statutory exemption chart Ringger Law uses to protect your assets:
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-navy-950 text-white">
                  <th className="py-3.5 px-4 font-bold">Protected Asset Category</th>
                  <th className="py-3.5 px-4 font-bold">Tennessee Exemption Limit</th>
                  <th className="py-3.5 px-4 font-bold hidden md:table-cell">Tennessee Statute</th>
                  <th className="py-3.5 px-4 font-bold">How It Protects You</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {TENNESSEE_EXEMPTIONS_TABLE.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-navy-950">{row.assetCategory}</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-800">{row.statutoryAmount}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-xs hidden md:table-cell">
                      {row.tennesseeStatute}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{row.practicalMeaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              * Married couples filing jointly in Tennessee can double most personal property exemptions.
            </p>
            <Link
              href="/resources/tennessee-bankruptcy-exemptions-means-test"
              className="text-xs sm:text-sm font-bold text-navy-900 hover:text-gold-600 inline-flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-gold-600" /> View Full Tennessee Means Test &amp; Exemption Calculator →
            </Link>
          </div>
        </div>
      </section>

      {/* REAL CLIENT TESTIMONIALS */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Verified Client Reviews
          </span>
          <h2 className="text-3xl font-serif font-bold text-navy-950 mt-2">
            What Our West Tennessee Clients Are Saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FIRM_INFO.testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-gold-500 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-500" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-navy-950">{t.author}</div>
                  <div className="text-xs text-slate-500">{t.location}</div>
                </div>
                <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full">
                  {t.caseType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WEST TENNESSEE COUNTIES & COURT HUB */}
      <section className="bg-white border-t border-slate-200 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-600 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> Western District of Tennessee • Eastern Division
              </span>
              <h2 className="text-3xl font-serif font-bold text-navy-950 mt-1">
                Local Bankruptcy Representation Across West Tennessee
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Select your county below for local court rules, virtual consultation options, and foreclosure/garnishment defense:
              </p>
            </div>
            <div className="text-xs text-slate-500 bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200">
              <strong>Bankruptcy Courthouse:</strong> 111 S. Highland Ave, Jackson, TN 38301
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COUNTY_LOCATIONS.map((c) => (
              <Link
                key={c.slug}
                href={`/locations/${c.slug}`}
                className="p-5 rounded-2xl border border-slate-200 hover:border-navy-900 bg-slate-50/70 hover:bg-white hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-serif font-bold text-navy-950 group-hover:text-gold-600 transition flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold-600" /> {c.countyName}, TN
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-navy-900 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  <strong>Cities Served:</strong> {c.primaryCities.join(", ")}
                </p>
                <div className="text-[11px] text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  {c.drivingDistanceToOffice}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
