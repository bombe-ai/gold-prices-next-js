import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PageAnimateWrapper } from "@/components/ui/PageAnimateWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://goldkerala.com'),
  title: "Today's Gold Rate in Kerala | Live 22K & 24K Price",
  description: "Check today's live Gold Rate in Kerala per Gram & Pavan (8g). Real-time 22K, 24K, 18K gold prices, silver rates, and daily market trends in Kerala, India. Best price for jewellery.",
  keywords: [
    "gold rate kerala", "today gold price kerala", "22k gold rate in kerala", "24k gold rate",
    "gold price per gram", "1 pavan gold rate today", "8 gram gold price", "silver rate kerala",
    "today gold rate", "kerala gold market", "gold rate today", "gold price today"
  ],
  openGraph: {
    title: "Today's Gold Rate in Kerala | Live 22K & 24K Price",
    description: "Track the latest Gold Rates in Kerala (22K & 24K) per Gram & Pavan. Live updates, market trends, and historical price charts.",
    type: "website",
    locale: "en_IN",
    siteName: "Gold Kerala",
    url: "https://goldkerala.com",
    images: [
      {
        url: "/og-gold-kerala.png", // Ensure this image exists or use a placeholder
        width: 1200,
        height: 630,
        alt: "Kerala Gold Rate Live Graph",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Today's Gold Rate in Kerala | Live 22K & 24K Price",
    description: "Live updates on Kerala Gold prices. Check today's 22K/24K rates per gram and pavan.",
  },
  alternates: {
    canonical: "https://goldkerala.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // JSON-LD for "FinancialProduct" or "PriceSpecification" to help Google understand the content
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Gold Kerala",
    "url": "https://goldkerala.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://goldkerala.com/?city={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "Gold Rate Kerala",
    "description": "Live Gold Rate in Kerala for 22K and 24K Purity",
    "brand": "Gold Kerala",
    "areaServed": {
      "@type": "State",
      "name": "Kerala"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PageAnimateWrapper>
          {children}
        </PageAnimateWrapper>
      </body>
    </html>
  );
}
