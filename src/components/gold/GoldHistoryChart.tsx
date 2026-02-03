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
        <Card className="p-5 border border-kerala-100 shadow-sm rounded-2xl h-full bg-white">
            <div ref={chartRef}>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-kerala-900">Gold Price Trend</h3>
                        <p className="text-xs text-gray-500">Last 30 Days (22K - 1 Pavan)</p>
                    </div>
                </div>

                <div id="history-chart-export" className="h-[250px] w-full bg-white">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={formattedData}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="formattedDate"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                                tickMargin={10}
                                minTickGap={30}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                                domain={['auto', 'auto']}
                                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    fontSize: '12px'
                                }}
                                formatter={(value: any) => [`₹${Number(value || 0).toLocaleString('en-IN')}`, 'Price']}
                                labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#16a34a"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card >
    );
}
