import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Today's Gold Rate in Kerala | Live 22K & 24K Gold Price History",
  description: "Check the latest 22K and 24K gold rates in Kerala today. Real-time updates, price trends, and last 30 days history graph. Live Gold Price India.",
  keywords: ["gold rate today", "gold price kerala", "22k gold rate", "24k gold price", "gold trend india"],
  openGraph: {
    title: "Today's Gold Rate in Kerala | Live Updates",
    description: "Real-time 22K & 24K Gold Rates in Kerala. Track daily price changes and trends.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
