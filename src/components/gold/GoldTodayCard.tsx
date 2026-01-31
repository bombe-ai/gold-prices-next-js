import React from 'react';
import { Card } from '../ui/Card';
import { TrendBadge } from '../ui/Badge';
import { GoldPriceWithChange } from '@/lib/types';
import { MapPin, CalendarDays, TrendingUp } from 'lucide-react';

interface GoldTodayCardProps {
    data: GoldPriceWithChange;
}

export function GoldTodayCard({ data }: GoldTodayCardProps) {
    // Logic to determine price per gram.
    // Assuming standard API response is often 10g or could be 1g.
    // If price > 20000, it's 10g.
    const getPricePerGram = (price: number) => price > 20000 ? price / 10 : price;

    const price1g_22k = getPricePerGram(data.price22k);
    const price1g_24k = getPricePerGram(data.price24k);
    const price1g_18k = getPricePerGram(data.price18k);

    // Pavan = 8 grams
    const price8g_22k = price1g_22k * 8;
    const price8g_24k = price1g_24k * 8;
    const price8g_18k = price1g_18k * 8;

    return (
        <section className="py-6">
            {/* City & Date Header */}
            <div className="mb-6 flex flex-col items-center justify-center text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-3 py-1 text-sm font-medium text-gold-700 dark:bg-gold-900/20 dark:text-gold-300">
                    <MapPin className="h-4 w-4" />
                    <span className="capitalize">{data.city}</span>
                </div>
                <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                    Today's Gold Rate
                </h2>
                <div className="mt-1 flex items-center gap-2 text-gray-500">
                    <CalendarDays className="h-4 w-4" />
                    <span>{new Date(data.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>

                {/* Main Highlight: 22K Pavan Price */}
                <div className="mt-8 scale-110 transform">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 p-1 shadow-2xl shadow-gold-500/20">
                        <div className="rounded-xl bg-white p-8 text-center dark:bg-gray-900">
                            <p className="text-sm font-bold uppercase tracking-wider text-gold-600">22K Gold Price</p>
                            <div className="mt-2 text-5xl font-extrabold text-gray-900 dark:text-white">
                                ₹{price8g_22k.toLocaleString('en-IN')}
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
                <Card className="overflow-hidden border-t-4 border-gold-500 p-0">
                    <div className="bg-gold-50/50 p-4 text-center dark:bg-gray-800/50">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">22K Gold</h3>
                        <p className="text-xs text-gray-500">Standard</p>
                    </div>
                    <div className="divide-y divide-gray-100 p-4 dark:divide-gray-800">
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
                <Card className="overflow-hidden border-t-4 border-orange-500 p-0">
                    <div className="bg-orange-50/50 p-4 text-center dark:bg-gray-800/50">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">24K Gold</h3>
                        <p className="text-xs text-gray-500">Pure Gold</p>
                    </div>
                    <div className="divide-y divide-gray-100 p-4 dark:divide-gray-800">
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
                <Card className="overflow-hidden border-t-4 border-gray-400 p-0">
                    <div className="bg-gray-50/50 p-4 text-center dark:bg-gray-800/50">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">18K Gold</h3>
                        <p className="text-xs text-gray-500">Decorated</p>
                    </div>
                    <div className="divide-y divide-gray-100 p-4 dark:divide-gray-800">
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
