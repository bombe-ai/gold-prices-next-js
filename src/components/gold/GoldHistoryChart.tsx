"use client";

import React, { useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { GoldHistoryItem } from '@/lib/types';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


interface GoldHistoryChartProps {
    data: GoldHistoryItem[];
}

export function GoldHistoryChart({ data }: GoldHistoryChartProps) {
    const chartRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(
            chartRef.current,
            { opacity: 0, y: 30, scale: 0.98 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: 'power3.out',
                delay: 0.2,
                clearProps: "all" // Clear styles after animation to prevent tooltip issues
            }
        );
    }, { scope: chartRef });

    if (!data || data.length === 0) return null;

    // Format dates for chart
    const formattedData = data.map(item => ({
        ...item,
        formattedDate: new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    }));

    return (
        <Card className="p-6">
            <div ref={chartRef}>
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Gold Price Trend</h3>
                        <p className="text-sm text-gray-500">Last 30 Days History (22K - 1 Pavan)</p>
                    </div>
                </div>

                <div id="history-chart-export" className="h-[300px] w-full bg-white dark:bg-gray-900 p-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={formattedData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="formattedDate"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                tickMargin={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                domain={['auto', 'auto']}
                                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                formatter={(value: any) => [`₹${Number(value || 0).toLocaleString('en-IN')}`, 'Price']}
                                labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#f59e0b"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card >
    );
}
