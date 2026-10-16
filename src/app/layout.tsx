import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header, Footer } from "@/components/HeaderFooter";
import { AiConciergeWidget } from "@/components/AiConciergeWidget";
import { TrafficTracker } from "@/components/TrafficTracker";
import { FIRM_INFO } from "@/lib/seo-data";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ringgerlaw.com"),
  title: {
    default: "Ringger Law | Bankruptcy Attorney Jackson TN | Stop Foreclosure & Wipe Out Debt",
    template: "%s | Ringger Law — Jackson, TN",
  },
  description:
    "Over 45 years helping West Tennessee families realize financial freedom. Founded in 1981. Eliminate credit card & medical debt, stop foreclosures, car repossessions, and wage garnishments in Madison County & Jackson, TN. $0 Money Down Free Consultation.",
  keywords: [
    "bankruptcy attorney jackson tn",
    "bankruptcy lawyer jackson tn",
    "chapter 7 bankruptcy lawyer jackson tn",
    "chapter 13 bankruptcy attorney jackson tn",
    "stop foreclosure lawyer jackson tn",
    "stop wage garnishment attorney jackson tn",
    "stop repossession attorney west tennessee",
    "louis ringger bankruptcy attorney",
    "ringger law jackson tn",
    "bankruptcy lawyer madison county tn",
    "bankruptcy lawyer gibson county tn",
    "no money down bankruptcy jackson tn",
  ],
  openGraph: {
    title: "Ringger Law | Eliminate Credit Card & Medical Debt. Stop Foreclosures | Jackson, TN",
    description:
      "Founded in 1981. Attorney Louis W. Ringger Jr. helps West Tennessee families eliminate debt and protect their homes and vehicles with $0 Money Down options.",
    url: "https://www.ringgerlaw.com",
    siteName: "Ringger Law",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ringger Law | Bankruptcy Attorney Jackson TN | Est. 1981",
    description:
      "Eliminate credit card & medical debt, stop foreclosures, car repossessions, and 25% wage garnishments across West Tennessee. Free Consultation.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  alternates: {
    canonical: "https://www.ringgerlaw.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gadsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-1648677882";
  const primaryTagId = gaId || gadsId;

  const legalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LegalService", "Attorney", "LocalBusiness"],
        "@id": "https://www.ringgerlaw.com/#legalservice",
        name: "Ringger Law — The Law Offices of Louis W. Ringger",
        alternateName: "RinggerLAW",
        description:
          "Consumer bankruptcy law firm in Jackson, Tennessee specializing in Chapter 7 debt elimination, Chapter 13 reorganization, foreclosure defense, vehicle repossession protection, and stopping wage garnishments across West Tennessee since 1981.",
        url: "https://www.ringgerlaw.com",
        telephone: "+1-731-421-1501",
        email: FIRM_INFO.email,
        foundingDate: "1981",
        priceRange: "Free Consultation / $0 Money Down Options",
        image: FIRM_INFO.louisPortraitUrl,
        address: {
          "@type": "PostalAddress",
          streetAddress: "367 N. Parkway, Suite 1",
          addressLocality: "Jackson",
          addressRegion: "TN",
          postalCode: "38305",
          addressCountry: "US",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 35.6579,
          longitude: -88.8294,
        },
        areaServed: [
          { "@type": "AdministrativeArea", name: "Madison County, TN" },
          { "@type": "AdministrativeArea", name: "Gibson County, TN" },
          { "@type": "AdministrativeArea", name: "Haywood County, TN" },
          { "@type": "AdministrativeArea", name: "Crockett County, TN" },
          { "@type": "AdministrativeArea", name: "Chester County, TN" },
          { "@type": "AdministrativeArea", name: "Henderson County, TN" },
          { "@type": "City", name: "Jackson, TN" },
        ],
        founder: {
          "@type": "Person",
          name: "Bill Ringger",
        },
        employee: {
          "@type": "Person",
          name: "Louis W. Ringger Jr.",
          jobTitle: "Attorney at Law",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "148",
          bestRating: "5",
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalSchema) }}
        />
        {primaryTagId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${primaryTagId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics-ads" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                ${gaId ? `gtag('config', '${gaId}', { allow_enhanced_conversions: true });` : ""}
                ${gadsId ? `gtag('config', '${gadsId}', { allow_enhanced_conversions: true });` : ""}
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <TrafficTracker />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <AiConciergeWidget />
      </body>
    </html>
  );
}
