import React, { Suspense } from 'react';
import { fetchTodayGoldPrice, fetchGoldHistory } from '@/lib/api';
import { GoldTodayCard } from '@/components/gold/GoldTodayCard';
import { GoldHistoryChart } from '@/components/gold/GoldHistoryChart';
import { GoldTable } from '@/components/gold/GoldTable';

// Revalidate every hour
export const revalidate = 3600;

interface HomeProps {
  searchParams: Promise<{ city?: string }>;
}

import { getTranslations } from 'next-intl/server';
import Loading from './loading';

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const city = params.city || 'kerala';
  const t = await getTranslations('HomePage');

  const [priceData, historyData] = await Promise.all([
    fetchTodayGoldPrice(city),
    fetchGoldHistory(city)
  ]);

  return (
    <main className="min-h-screen pb-20 bg-gray-50/50">

      <div className="mx-auto px-4 w-full max-w-7xl">
        <header className="py-6 text-center">
          <h1 className="text-3xl font-extrabold text-kerala-900 sm:text-4xl">
            {t('title')} <span className="text-gold-600">{t('live')}</span>
          </h1>
          <p className="mt-1 text-sm font-medium text-kerala-700/80">
            {t('subtitle')}
          </p>
        </header>

        <Suspense fallback={<Loading />}>
          {priceData ? (
            <GoldTodayCard data={priceData} historyData={historyData} />
          ) : (
            <div className="py-10 text-center text-gray-500">
              {t('error')}
            </div>
          )}
        </Suspense>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12 w-full">
            <Suspense fallback={<div className="h-[300px] rounded-2xl bg-gray-100 animate-pulse"></div>}>
              <GoldHistoryChart data={historyData} />
            </Suspense>
          </div>
        </div>

        <div className="mt-8 w-[514px]">
          <Suspense fallback={<div className="h-[400px] rounded-2xl bg-gray-100 animate-pulse"></div>}>
            <GoldTable data={historyData} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
