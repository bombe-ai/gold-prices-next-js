"use client";

import React, { useRef } from 'react';
import { Card } from '../ui/Card';
import { TrendBadge } from '../ui/Badge';
import { GoldPriceWithChange } from '@/lib/types';
import { MapPin, CalendarDays } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface GoldTodayCardProps {
    data: GoldPriceWithChange;
}

export function GoldTodayCard({ data }: GoldTodayCardProps) {
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
            {/* City & Date Header */}
            <div className="mb-6 flex flex-col items-center justify-center text-center">
                <div className="animate-enter inline-flex items-center gap-2 rounded-full bg-gold-50 px-3 py-1 text-sm font-medium text-gold-700 dark:bg-gold-900/20 dark:text-gold-300">
                    <MapPin className="h-4 w-4" />
                    <span className="capitalize">{data.city}</span>
                </div>
                <h2 className="animate-enter mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                    Today's Gold Rate
                </h2>
                <div className="animate-enter mt-1 flex items-center gap-2 text-gray-500">
                    <CalendarDays className="h-4 w-4" />
                    <span>{new Date(data.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>

                {/* Main Highlight: 22K Pavan Price */}
                <div className="animate-enter mt-8 w-full max-w-md scale-100 transform transition-transform hover:scale-105 duration-500">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700 p-1 shadow-2xl shadow-gold-500/30">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative rounded-xl bg-white p-8 text-center dark:bg-gray-900 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
                            <p className="text-sm font-bold uppercase tracking-wider text-gold-600">22K Gold Price</p>
                            <div
                                ref={priceRef}
                                className="mt-2 text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-800 dark:from-gold-300 dark:to-gold-500"
                            >
                                ₹0
                            </div>
                            <p className="mt-1 text-sm font-medium text-gray-400">Per Pavan (8 Grams)</p>

                            <div className="mt-4 flex justify-center">
                                <TrendBadge change={data.change22k} direction={data.direction22k} />
                            </div>
                        </div>
                    </div>
                </div>
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
