import React, { Suspense } from 'react';
import { fetchTodayGoldPrice, fetchGoldHistory, fetchMarketData } from '@/lib/api';
import { TopBanner } from '@/components/banners/TopBanner';
import { GoldTodayCard } from '@/components/gold/GoldTodayCard';
import { GoldHistoryChart } from '@/components/gold/GoldHistoryChart';
import { GoldTable } from '@/components/gold/GoldTable';
import Loading from './loading';

// Revalidate every hour
export const revalidate = 3600;

interface HomeProps {
  searchParams: Promise<{ city?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const city = params.city || 'kerala';

  const [priceData, historyData, marketData] = await Promise.all([
    fetchTodayGoldPrice(city),
    fetchGoldHistory(city),
    fetchMarketData()
  ]);

  return (
    <main className="min-h-screen pb-20">
      <TopBanner marketData={marketData} />

      <div className="container mx-auto px-4">
        <header className="py-8 text-center">
          <h1 className="text-4xl font-extrabold text-gold-900 dark:text-gold-100 sm:text-5xl">
            Gold Rates <span className="text-gold-500">Live</span>
          </h1>
          <p className="mt-2 text-gold-700/80 dark:text-gold-200/60">
            Real-time gold prices in Kerala, India
          </p>
        </header>

        <Suspense fallback={<Loading />}>
          {priceData ? (
            <GoldTodayCard data={priceData} historyData={historyData} />
          ) : (
            <div className="py-10 text-center text-gray-500">
              Unable to load today's gold rates. Please try again later.
            </div>
          )}
        </Suspense>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="h-[300px] rounded-2xl bg-gray-100 animate-pulse"></div>}>
              <GoldHistoryChart data={historyData} />
            </Suspense>
          </div>

          <div className="lg:col-span-1">
            <Suspense fallback={<div className="h-[400px] rounded-2xl bg-gray-100 animate-pulse"></div>}>
              <GoldTable data={historyData} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
