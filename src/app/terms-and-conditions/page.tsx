import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Scale, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms, Conditions & 11 U.S.C. § 528 Debt Relief Disclosures | Ringger Law",
  description:
    "Terms of use, attorney-client relationship disclaimers, and federal bankruptcy debt-relief agency disclosures for Ringger Law in Jackson, TN.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="py-14 px-4 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-600">
          <Scale className="w-4 h-4" /> Legal Disclaimers &amp; Terms of Use
        </div>
        <h1 className="text-3xl font-serif font-bold text-navy-950">
          Terms &amp; Conditions
        </h1>

        <p className="text-sm text-slate-700 leading-relaxed">
          By using this website (<code className="text-navy-900 font-semibold">ringgerlaw.com</code>), you agree to the following terms and conditions:
        </p>

        <h2 className="text-lg font-serif font-bold text-navy-950 pt-2">
          1. Educational Information Only — Not Legal Advice
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          Please note that this website does not provide legal advice. The information, calculators, exemption tables, and AI assistant responses provided on this website are for general informational purposes only and do not constitute formal legal advice. Bankruptcy is a complex legal matter, and it is important to consult directly with a qualified Tennessee bankruptcy attorney to discuss your specific situation and receive personalized legal counsel.
        </p>

        <h2 className="text-lg font-serif font-bold text-navy-950 pt-2">
          2. No Attorney-Client Relationship Established Online
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          Submitting an online quiz, intake questionnaire, chat message, or scheduling a phone/Zoom consultation does not establish an attorney-client relationship with The Law Offices of Louis W. Ringger. While we can answer general questions during an initial consultation, a formal attorney-client relationship is formed only after a written representation agreement is signed by both you and our firm.
        </p>

        <h2 className="text-lg font-serif font-bold text-navy-950 pt-2">
          3. Mandatory Federal Debt Relief Agency Disclosure (11 U.S.C. § 528)
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          Pursuant to 11 U.S.C. § 528(a)(4), The Law Offices of Louis W. Ringger (Ringger Law) is a federally designated Debt Relief Agency. We proudly help individuals and families file for bankruptcy relief under the United States Bankruptcy Code in the Western District of Tennessee.
        </p>

        <div className="pt-4">
          <Link
            href="/book-online"
            className="inline-block bg-navy-900 text-white font-bold text-xs px-6 py-3 rounded-xl"
          >
            Schedule Formal Free Consultation →
          </Link>
        </div>
      </div>
    </div>
  );
}
