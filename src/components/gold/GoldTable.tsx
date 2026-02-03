"use client";

import React from 'react';
import { Card } from '../ui/Card';
import { GoldHistoryItem } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface GoldTableProps {
    data: GoldHistoryItem[];
}

export function GoldTable({ data }: GoldTableProps) {
    // Sort by date desc for table view
    const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate stats
    const prices = data.map(d => d.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    // Check if a date is today
    const isToday = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    return (
        <Card className="h-full overflow-hidden p-0 border border-kerala-100 shadow-sm rounded-2xl bg-white">
            <div className="border-b border-gray-100 bg-kerala-50/50 p-4 flex items-center justify-between">
                <h3 className="font-bold text-kerala-900 text-sm">Price History (30 Days)</h3>
            </div>
            <div id="history-table-export" className="w-full bg-white p-0">
                <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-kerala-200">
                    <table className="w-full text-xs">
                        <thead className="bg-gray-50 text-left sticky top-0 z-10">
                            <tr>
                                <th className="px-3 py-2.5 font-semibold text-gray-500">Date</th>
                                <th className="px-3 py-2.5 text-right font-semibold text-gray-500">Price (8g)</th>
                                <th className="px-3 py-2.5 text-right font-semibold text-gray-500">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sortedData.map((item, index) => {
                                const nextItem = sortedData[index + 1];
                                const prevPrice = nextItem ? nextItem.price : item.price;
                                const diff = item.price - prevPrice;
                                const isUp = diff > 0;
                                const isDown = diff < 0;

                                const isHighest = item.price === maxPrice;
                                const isLowest = item.price === minPrice;
                                const isDateToday = isToday(item.date);

                                let rowClass = "hover:bg-gray-50 transition-colors";
                                if (isHighest) rowClass = "bg-red-50/60 hover:bg-red-50";
                                else if (isLowest) rowClass = "bg-green-50/60 hover:bg-green-50";
                                else if (isDateToday) rowClass = "bg-kerala-50/60 hover:bg-kerala-50";

                                return (
                                    <tr key={item.date} className={rowClass}>
                                        <td className="px-3 py-2.5 text-gray-700 font-medium">
                                            <div className="flex items-center gap-2">
                                                {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                {isDateToday && (
                                                    <span className="rounded-full bg-kerala-100 px-1.5 py-0.5 text-[10px] font-bold text-kerala-700">
                                                        Today
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2.5 text-right font-bold text-gray-900">
                                            <div className="flex flex-col items-end">
                                                <span>₹{item.price.toLocaleString('en-IN')}</span>
                                                <div className="flex gap-1 mt-0.5">
                                                    {isHighest && (
                                                        <span className="rounded-full bg-red-100 px-1.5 py-0 text-[10px] font-bold uppercase text-red-700">
                                                            High
                                                        </span>
                                                    )}
                                                    {isLowest && (
                                                        <span className="rounded-full bg-green-100 px-1.5 py-0 text-[10px] font-bold uppercase text-green-700">
                                                            Low
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2.5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {isUp ? (
                                                    <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                                                ) : isDown ? (
                                                    <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                                                ) : (
                                                    <Minus className="h-3.5 w-3.5 text-gray-300" />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
}
