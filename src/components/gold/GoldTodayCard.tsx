"use client";

import React, { useRef } from 'react';
import { Card } from '../ui/Card';
import { TrendBadge } from '../ui/Badge';
import { GoldPriceWithChange, GoldHistoryItem } from '@/lib/types'; // Added GoldHistoryItem
import { MapPin, CalendarDays, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface GoldTodayCardProps {
    data: GoldPriceWithChange;
    historyData?: GoldHistoryItem[]; // Added optional historyData
}

export function GoldTodayCard({ data, historyData = [] }: GoldTodayCardProps) {
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
        <section ref={containerRef} className="py-6">
            <div className="flex justify-center">
                <Card className="animate-enter w-full overflow-hidden bg-white p-8 shadow-xl dark:bg-gray-900 border-none ring-1 ring-gray-100 dark:ring-gray-800">

                    {/* Header Badge */}
                    <div className="flex justify-center mb-4">
                        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                            </span>
                            Live Price
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                            22 Karat Gold (8 grams)
                        </h2>
                    </div>

                    {/* Big Price Display */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
                        <div
                            ref={priceRef}
                            className="text-7xl font-bold text-gray-900 dark:text-white tracking-tight"
                        >
                            ₹0
                        </div>

                        {/* Change Badge */}
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg ${data.direction22k === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            data.direction22k === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}>
                            {data.direction22k === 'up' ? <TrendingUp className="h-6 w-6" /> :
                                data.direction22k === 'down' ? <TrendingDown className="h-6 w-6" /> :
                                    <Minus className="h-6 w-6" />}
                            <span>
                                {data.direction22k === 'up' ? '+' : data.direction22k === 'down' ? '-' : ''}{change8g.toLocaleString('en-IN')}
                                <span className="text-sm ml-1 opacity-80">
                                    ({data.direction22k === 'up' ? '+' : data.direction22k === 'down' ? '-' : ''}
                                    {((change8g / yesterday8g) * 100).toFixed(2)}%)
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Timestamp */}
                    <div className="text-center mb-10 text-gray-400 text-sm flex items-center justify-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>Last updated: {new Date(data.date).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        })}</span>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-gray-800 w-full mb-8"></div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <p className="text-red-500 font-semibold mb-1">Highest (30 Days)</p>
                            <p className="text-3xl font-bold text-red-500">₹{highestOfMonth.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                            <p className="text-green-600 font-semibold mb-1">Lowest (30 Days)</p>
                            <p className="text-3xl font-bold text-green-600">₹{lowestOfMonth.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-semibold mb-1">Yesterday</p>
                            <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">₹{yesterday8g.toLocaleString('en-IN')}</p>
                        </div>
                    </div>

                </Card>
            </div>

            {/* Detailed Grid for 1g and 8g */}
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* 22K Card */}
                <Card className="animate-card overflow-hidden border-t-4 border-gold-500 p-0 transform transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-gold-500/10 duration-300">
                    <div className="bg-gradient-to-r from-gold-50 to-white p-4 text-center dark:from-gray-800 dark:to-gray-900 border-b border-gold-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">22K Gold</h3>
                        <p className="text-xs text-gold-600 font-medium">Standard Hallmark</p>
                    </div>
                    <div className="divide-y divide-gray-100 p-4 dark:divide-gray-800 bg-white dark:bg-gray-900">
                        <div className="flex justify-between py-3">
                            <span className="text-gray-600 dark:text-gray-400">1 Gram</span>
                            <span className="font-bold text-gray-900 dark:text-white">₹{price1g_22k.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-3">
                            <span className="text-gray-600 dark:text-gray-400">8 Gram (Pavan)</span>
                            <span className="font-bold text-gray-900 dark:text-white">₹{price8g_22k.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </Card>

                {/* 24K Card */}
                <Card className="animate-card overflow-hidden border-t-4 border-orange-500 p-0 transform transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10 duration-300">
                    <div className="bg-gradient-to-r from-orange-50 to-white p-4 text-center dark:from-gray-800 dark:to-gray-900 border-b border-orange-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">24K Gold</h3>
                        <p className="text-xs text-orange-600 font-medium">99.9% Pure Gold</p>
                    </div>
                    <div className="divide-y divide-gray-100 p-4 dark:divide-gray-800 bg-white dark:bg-gray-900">
                        <div className="flex justify-between py-3">
                            <span className="text-gray-600 dark:text-gray-400">1 Gram</span>
                            <span className="font-bold text-gray-900 dark:text-white">₹{price1g_24k.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-3">
                            <span className="text-gray-600 dark:text-gray-400">8 Gram (Pavan)</span>
                            <span className="font-bold text-gray-900 dark:text-white">₹{price8g_24k.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </Card>

                {/* 18K Card */}
                <Card className="animate-card overflow-hidden border-t-4 border-gray-400 p-0 transform transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-gray-400/10 duration-300">
                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 text-center dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">18K Gold</h3>
                        <p className="text-xs text-gray-600 font-medium">Rose Gold / Diamond</p>
                    </div>
                    <div className="divide-y divide-gray-100 p-4 dark:divide-gray-800 bg-white dark:bg-gray-900">
                        <div className="flex justify-between py-3">
                            <span className="text-gray-600 dark:text-gray-400">1 Gram</span>
                            <span className="font-bold text-gray-900 dark:text-white">₹{price1g_18k.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-3">
                            <span className="text-gray-600 dark:text-gray-400">8 Gram (Pavan)</span>
                            <span className="font-bold text-gray-900 dark:text-white">₹{price8g_18k.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
}
