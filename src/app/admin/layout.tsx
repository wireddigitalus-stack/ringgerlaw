import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attorney & Staff Portal — Live Lead & Intake Dashboard",
  description:
    "Internal Executive Command Center for Ringger Law (Jackson, TN): 1. Live Client Leads & Emergency Triage, 2. Signed 5-Step Court Intake Packets, 3. Live Google Ads & Search Traffic.",
  alternates: {
    canonical: "https://www.ringgerlaw.com/admin",
  },
  openGraph: {
    title: "RINGGER LAW • Attorney & Staff Management Portal (PIN Protected)",
    description:
      "Internal Office Dashboard: Live Client Leads & Emergency Triage, Signed 5-Step Court Intake Packets, and Google Ads / Search Attribution.",
    url: "https://www.ringgerlaw.com/admin",
    siteName: "Ringger Law — Internal Office Portal",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/admin-og-image.png",
        width: 1200,
        height: 630,
        alt: "Ringger Law — Attorney & Staff Management Portal (ringgerlaw.com/admin)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RINGGER LAW • Attorney & Staff Management Portal",
    description:
      "Internal Office Dashboard: Live Client Leads, Signed Court Intake Packets, and Google Ads Attribution.",
    images: ["/admin-og-image.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
