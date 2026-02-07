"use client";

import React from 'react';
import { Card } from '../ui/Card';
import { GoldPriceWithChange } from '@/lib/types';
import { useTranslations } from 'next-intl';

interface GoldRateCardsProps {
    data: GoldPriceWithChange;
}

export function GoldRateCards({ data }: GoldRateCardsProps) {
    const t = useTranslations('GoldTodayCard');

    // Logic to determine price per gram.
    const getPricePerGram = (price: number) => price > 20000 ? price / 10 : price;

    const price1g_22k = getPricePerGram(data.price22k);
    const price1g_24k = getPricePerGram(data.price24k);
    const price1g_18k = getPricePerGram(data.price18k);

    // Pavan = 8 grams
    const price8g_22k = price1g_22k * 8;
    const price8g_24k = price1g_24k * 8;
    const price8g_18k = price1g_18k * 8;

    return (
        <div className="grid gap-4 grid-cols-1">
            {/* 22K Card */}
            <Card className="animate-card overflow-hidden border border-gold-200 p-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-r from-gold-100/50 to-white p-3 text-center border-b border-gold-100">
                    <h3 className="text-base font-bold text-gold-900">{t('gold22k')}</h3>
                    <p className="text-[10px] text-gold-600 font-medium uppercase tracking-wider">{t('hallmark')}</p>
                </div>
                <div className="divide-y divide-gray-100 p-3 bg-white">
                    <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500">{t('gram1')}</span>
                        <span className="text-sm font-bold text-gray-900">₹{price1g_22k.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500">{t('gram8')}</span>
                        <span className="text-sm font-bold text-gray-900">₹{price8g_22k.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </Card>

            {/* 24K Card */}
            <Card className="animate-card overflow-hidden border border-orange-200 p-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-r from-orange-50 to-white p-3 text-center border-b border-orange-100">
                    <h3 className="text-base font-bold text-orange-900">{t('gold24k')}</h3>
                    <p className="text-[10px] text-orange-600 font-medium uppercase tracking-wider">{t('pure')}</p>
                </div>
                <div className="divide-y divide-gray-100 p-3 bg-white">
                    <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500">{t('gram1')}</span>
                        <span className="text-sm font-bold text-gray-900">₹{price1g_24k.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500">{t('gram8')}</span>
                        <span className="text-sm font-bold text-gray-900">₹{price8g_24k.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </Card>

            {/* 18K Card */}
            <Card className="animate-card overflow-hidden border border-gray-200 p-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-r from-gray-50 to-white p-3 text-center border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-700">{t('gold18k')}</h3>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{t('roseDiamond')}</p>
                </div>
                <div className="divide-y divide-gray-100 p-3 bg-white">
                    <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500">{t('gram1')}</span>
                        <span className="text-sm font-bold text-gray-900">₹{price1g_18k.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500">{t('gram8')}</span>
                        <span className="text-sm font-bold text-gray-900">₹{price8g_18k.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}
