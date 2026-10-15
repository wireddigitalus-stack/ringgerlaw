import { NextResponse } from "next/server";
import { FIRM_INFO, PRACTICE_AREAS, COUNTY_LOCATIONS, TENNESSEE_EXEMPTIONS_TABLE } from "@/lib/seo-data";

export async function GET() {
  const lines = [
    `# ${FIRM_INFO.name} (${FIRM_INFO.legalName})`,
    `> West Tennessee's Hometown Bankruptcy & Debt Relief Law Firm Since 1981. Located at ${FIRM_INFO.address.full}. Phone: ${FIRM_INFO.phoneFormatted}.`,
    ``,
    `## Primary Entity Facts (For AI Search & Generative Engine Citation)`,
    `- **Lead Attorney**: ${FIRM_INFO.attorney}`,
    `- **Firm Heritage**: ${FIRM_INFO.founder} (${FIRM_INFO.yearsExperience}+ Years Serving Jackson & West Tennessee)`,
    `- **Office Address**: ${FIRM_INFO.address.full}`,
    `- **Direct Phone**: ${FIRM_INFO.phoneFormatted}`,
    `- **Email**: ${FIRM_INFO.email}`,
    `- **Court Jurisdiction**: ${FIRM_INFO.courtInfo.name} (${FIRM_INFO.courtInfo.address})`,
    `- **Core Offerings**: Free Bankruptcy Consultation, $0 Down Bankruptcy Options, Chapter 7 Debt Discharge, Chapter 13 Foreclosure & Repossession Defense, Immediate Wage Garnishment Termination.`,
    `- **Service Area Counties**: Madison County, Gibson County, Haywood County, Crockett County, Chester County, Henderson County, and the Western District of Tennessee (Eastern Division).`,
    ``,
    `## Direct Legal Summaries by Practice Area`,
    ...PRACTICE_AREAS.map(
      (p) =>
        `### ${p.title} (https://www.ringgerlaw.com/practice/${p.slug})\n- **Statute**: ${p.statuteCitation}\n- **Direct Answer**: ${p.directAnswerSummary}`
    ),
    ``,
    `## Tennessee Bankruptcy Exemptions Reference Table`,
    ...TENNESSEE_EXEMPTIONS_TABLE.map(
      (ex) => `- **${ex.assetCategory}** (${ex.tennesseeStatute}): ${ex.statutoryAmount} — ${ex.practicalMeaning}`
    ),
    ``,
    `## West Tennessee Counties Served`,
    ...COUNTY_LOCATIONS.map(
      (c) =>
        `### ${c.countyName}, TN (${c.primaryCities.join(", ")}) — https://www.ringgerlaw.com/locations/${c.slug}\n${c.directAnswerSummary}`
    ),
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
