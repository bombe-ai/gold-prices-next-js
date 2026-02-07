"use client";

import React, { useRef } from 'react';
import { Card } from '../ui/Card';
import { TrendBadge } from '../ui/Badge';
import { GoldPriceWithChange, GoldHistoryItem } from '@/lib/types'; // Added GoldHistoryItem
import { MapPin, CalendarDays, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { useTranslations } from 'next-intl';

gsap.registerPlugin(useGSAP);

interface GoldTodayCardProps {
    data: GoldPriceWithChange;
    historyData?: GoldHistoryItem[]; // Added optional historyData
}

export function GoldTodayCard({ data, historyData = [] }: GoldTodayCardProps) {
    const t = useTranslations('GoldTodayCard');
    const containerRef = useRef<HTMLElement>(null);
    const priceRef = useRef<HTMLDivElement>(null);

    // Logic to determine price per gram.
    const getPricePerGram = (price: number) => price > 20000 ? price / 10 : price;

    const price1g_22k = getPricePerGram(data.price22k);
    const price1g_24k = getPricePerGram(data.price24k);
    const price1g_18k = getPricePerGram(data.price18k);

    // Pavan = 8 grams
    const price8g_22k = price1g_22k * 8;
    const price8g_24k = price1g_24k * 8;
    const price8g_18k = price1g_18k * 8;

    // Monthly High/Low Calculation
    let highestOfMonth = 0;
    let lowestOfMonth = 0;

    // Calculate stats if history exists
    if (historyData && historyData.length > 0) {
        // historyData prices are already 8g (1 Pavan) from the API transformation
        const historyPrices = historyData.map(d => d.price);

        // Include today's price in the High/Low calculation to be accurate
        const allPrices = [...historyPrices, price8g_22k].filter(p => !isNaN(p) && p > 0);

        highestOfMonth = Math.max(...allPrices);
        lowestOfMonth = Math.min(...allPrices);
    } else {
        // Fallback if no history: Use today's as placeholder or 0
        highestOfMonth = price8g_22k;
        lowestOfMonth = price8g_22k;
    }

    // Yesterday's Pavan Price
    // User requested to use the API provided "yesterday" value * 8
    const price1g_yesterday_22k = getPricePerGram(data.previousPrice22k || 0);
    const yesterday8g = price1g_yesterday_22k * 8;

    // Calculate change for 8g based on the difference
    const change8g = Math.abs(price8g_22k - yesterday8g);


    useGSAP(() => {
        // Staggered entry for main content
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(".animate-enter",
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1
            }
        )
            .fromTo(".animate-card",
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15
                },
                "-=0.4"
            );

        // Rolling number animation for the main price
        const priceObj = { val: 0 };
        const priceTarget = price8g_22k;

        gsap.to(priceObj, {
            val: priceTarget,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
                if (priceRef.current) {
                    priceRef.current.innerText = `₹${Math.round(priceObj.val).toLocaleString('en-IN')}`;
                }
            }
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-4">
            <div className="flex justify-center">
                <Card className="animate-enter w-full overflow-hidden bg-white p-6 shadow-lg shadow-kerala-900/5 border border-kerala-100 rounded-2xl">

                    {/* Header Badge */}
                    <div className="flex justify-center mb-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            {t('liveMarket')}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-4">
                        <h2 className="text-lg font-medium text-gray-500">
                            {t('mainTitle')}
                        </h2>
                    </div>

                    {/* Big Price Display */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                        <div
                            ref={priceRef}
                            className="text-6xl font-extrabold text-kerala-900 tracking-tight"
                        >
                            ₹0
                        </div>

                        {/* Change Badge */}
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-base ${data.direction22k === 'up' ? 'bg-green-100 text-green-700' :
                            data.direction22k === 'down' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {data.direction22k === 'up' ? <TrendingUp className="h-5 w-5" /> :
                                data.direction22k === 'down' ? <TrendingDown className="h-5 w-5" /> :
                                    <Minus className="h-5 w-5" />}
                            <span>
                                {data.direction22k === 'up' ? '+' : data.direction22k === 'down' ? '-' : ''}{change8g.toLocaleString('en-IN')}
                                <span className="text-xs ml-1 opacity-80 font-medium">
                                    ({data.direction22k === 'up' ? '+' : data.direction22k === 'down' ? '-' : ''}
                                    {((change8g / yesterday8g) * 100).toFixed(2)}%)
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Timestamp */}
                    <div className="text-center mb-8 text-gray-400 text-xs flex items-center justify-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{t('lastUpdated')} {new Date(data.date).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        })}</span>
                    </div>

                    <div className="h-px bg-gray-100 w-full mb-6"></div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                            <p className="text-red-600 text-xs font-semibold mb-1 uppercase tracking-wide">{t('high30d')}</p>
                            <p className="text-2xl font-bold text-red-700">₹{highestOfMonth.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                            <p className="text-green-600 text-xs font-semibold mb-1 uppercase tracking-wide">{t('low30d')}</p>
                            <p className="text-2xl font-bold text-green-700">₹{lowestOfMonth.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <p className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">{t('yesterday')}</p>
                            <p className="text-2xl font-bold text-gray-700">₹{yesterday8g.toLocaleString('en-IN')}</p>
                        </div>
                    </div>

                </Card>
            </div>


        </section>
    );
}
