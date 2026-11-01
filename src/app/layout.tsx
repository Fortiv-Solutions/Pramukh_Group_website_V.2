import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Marcellus } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { offices, site, socials } from "@/content/site";
import "./globals.css";

const display = Marcellus({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-body", display: "swap", weight: ["400", "500"] });

const title = "Pramukh Group | Real Estate Developer in Surat, Vapi, Silvassa & Daman since 1993";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  keywords: ["Pramukh Group", "real estate developer Surat", "apartments in Vapi", "Silvassa flats", "One Tapi", "commercial property Surat"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title,
    description: site.description,
    siteName: site.name,
    locale: "en_IN",
    images: [{ url: "/media/one-tapi-hero.jpg", width: 2200, height: 1103, alt: "One Tapi by Pramukh Group, Surat" }],
  },
  twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#332820",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: site.name,
  url: site.url,
  foundingDate: String(site.established),
  founder: { "@type": "Person", name: "Natubhai R. Bhatu" },
  slogan: site.tagline,
  areaServed: ["Surat", "Vapi", "Silvassa", "Daman"],
  sameAs: socials.map((s) => s.href),
  location: offices.map((o) => ({
    "@type": "Place",
    name: `Pramukh Group, ${o.city}`,
    address: { "@type": "PostalAddress", streetAddress: o.lines.join(" "), addressLocality: o.city, addressCountry: "IN" },
    telephone: o.phone,
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Flag JS before paint so split headings start hidden instead of flashing. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
