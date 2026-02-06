import Link from 'next/link';
import './globals.css';
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TopBanner } from '@/components/banners/TopBanner';
import { fetchMarketData } from '@/lib/api';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default async function GlobalNotFound() {
    const marketData = await fetchMarketData();
    const messages = await getMessages({ locale: 'en' });

    return (
        <html lang="en">
            <head>
                <title>404 - Page Not Found</title>
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <NextIntlClientProvider messages={messages} locale="en">
                    <div className="sticky top-0 z-50 w-full">
                        <TopBanner marketData={marketData} />
                        <Header />
                    </div>

                    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kerala-50 via-gold-50 to-kerala-100 px-4 py-20">
                        <div className="max-w-2xl w-full text-center">
                            {/* Animated 404 Number */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-64 h-64 bg-gradient-to-br from-gold-400/20 to-kerala-400/20 rounded-full blur-3xl animate-pulse"></div>
                                </div>
                                <h1 className="relative text-[180px] font-extrabold leading-none">
                                    <span className="bg-gradient-to-br from-gold-600 via-gold-500 to-kerala-600 bg-clip-text text-transparent">
                                        404
                                    </span>
                                </h1>
                            </div>

                            {/* Error Message */}
                            <div className="space-y-4 mb-10">
                                <h2 className="text-3xl md:text-4xl font-bold text-kerala-900">
                                    Page Not Found
                                </h2>
                                <p className="text-lg text-kerala-700/80 max-w-md mx-auto">
                                    Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
                                </p>
                            </div>

                            {/* Decorative Gold Bars */}
                            <div className="flex items-center justify-center gap-3 mb-10">
                                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gold-500 to-gold-600 rounded-full"></div>
                                <div className="w-3 h-3 bg-gold-500 rounded-full animate-pulse"></div>
                                <div className="w-16 h-1 bg-gradient-to-l from-transparent via-gold-500 to-gold-600 rounded-full"></div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/en"
                                    className="group relative px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative flex items-center gap-2">
                                        <svg
                                            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Back to Home
                                    </span>
                                </Link>

                                <Link
                                    href="/en/blog"
                                    className="group px-8 py-4 bg-white text-kerala-700 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-kerala-200 hover:border-kerala-400"
                                >
                                    <span className="flex items-center gap-2">
                                        View Blog
                                        <svg
                                            className="w-5 h-5 transition-transform group-hover:translate-x-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </Link>
                            </div>

                            {/* Floating Gold Coins Animation */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-gold-400/30 rounded-full blur-sm animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
                                <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-gold-500/30 rounded-full blur-sm animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
                                <div className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-kerala-400/20 rounded-full blur-sm animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
                                <div className="absolute bottom-1/4 right-1/3 w-7 h-7 bg-gold-300/30 rounded-full blur-sm animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }}></div>
                            </div>
                        </div>
                    </main>

                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
