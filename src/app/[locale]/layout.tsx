import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { PageAnimateWrapper } from "@/components/ui/PageAnimateWrapper";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from '@next/third-parties/google';

import { TopBanner } from "@/components/banners/TopBanner";

import { fetchMarketData } from "@/lib/api";

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
        url: "/thumbnail.png", // Ensure this image exists or use a placeholder
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
  icons: {
    icon: "/icon.png",
  },
};

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const marketData = await fetchMarketData();

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
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        {/* Microsoft Clarity */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "vdjvz75s8q");`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W3SH6P3N');`,
          }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W3SH6P3N"
          height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
        <NextIntlClientProvider messages={messages}>
          <div className="sticky top-0 z-50 w-full">
            <TopBanner marketData={marketData} />
            <Header />
          </div>

          <PageAnimateWrapper>
            {children}
          </PageAnimateWrapper>

          <Footer />
        </NextIntlClientProvider>
        <GoogleAnalytics gaId="G-ZS1SPENSSC" />
      </body>
    </html>
  );
}
