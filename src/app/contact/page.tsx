import React from "react";
import type { Metadata } from "next";
import { Phone, Mail, MapPin, Building2, Clock } from "lucide-react";
import { FIRM_INFO } from "@/lib/seo-data";
import { DebtReliefQuiz } from "@/components/DebtReliefQuiz";

export const metadata: Metadata = {
  title: "Contact Ringger Law | 367 N. Parkway, Suite 1, Jackson, TN 38305 | (731) 421-1501",
  description:
    "Contact Attorney Louis W. Ringger Jr. in Jackson, TN for a free bankruptcy consultation. Call (731) 421-1501 or visit 367 N. Parkway, Suite 1, Jackson, TN 38305.",
};

export default function ContactPage() {
  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600 bg-gold-100 px-3 py-1 rounded-full">
            Ready to Get Started? Take the First Step
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950">
            Contact The Law Offices of Louis W. Ringger in Jackson, TN
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Reach out today for a fast, confidential, and judgment-free consultation. Whether you prefer to visit our Jackson office off North Parkway or handle everything over the phone from anywhere in West Tennessee, we are ready to help.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <Phone className="w-5 h-5 text-gold-600 mb-2" />
              <div className="text-xs font-bold uppercase text-slate-500">Direct Phone</div>
              <a
                href={FIRM_INFO.phoneHref}
                className="text-lg font-extrabold text-navy-950 hover:text-gold-600"
              >
                {FIRM_INFO.phoneFormatted}
              </a>
              <p className="text-xs text-slate-500 mt-1">Same-day emergency triage available</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <Mail className="w-5 h-5 text-gold-600 mb-2" />
              <div className="text-xs font-bold uppercase text-slate-500">Email Office</div>
              <a
                href={`mailto:${FIRM_INFO.email}`}
                className="text-base font-bold text-navy-950 hover:text-gold-600"
              >
                {FIRM_INFO.email}
              </a>
              <p className="text-xs text-slate-500 mt-1">24/7 online intake &amp; document delivery</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <MapPin className="w-5 h-5 text-gold-600 mb-2" />
              <div className="text-xs font-bold uppercase text-slate-500">Jackson Law Office</div>
              <div className="text-sm font-bold text-navy-950">{FIRM_INFO.address.street}</div>
              <div className="text-xs text-slate-600">
                {FIRM_INFO.address.city}, {FIRM_INFO.address.state} {FIRM_INFO.address.zip} (Madison County)
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <Building2 className="w-5 h-5 text-gold-600 mb-2" />
              <div className="text-xs font-bold uppercase text-slate-500">Federal Court Division</div>
              <div className="text-xs font-bold text-navy-950">
                U.S. Bankruptcy Court — Western District of TN
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                111 S. Highland Ave, Jackson, TN 38301
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <DebtReliefQuiz defaultSource="/contact" />
        </div>
      </div>
    </div>
  );
}
