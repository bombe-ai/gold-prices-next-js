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
        <Card className="h-full overflow-hidden p-0 border-none shadow-none ring-0">
            <div className="border-b border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                <h3 className="font-bold text-gray-900 dark:text-white">Price History (30 Days)</h3>
            </div>
            <div className="w-full">
                <table className="w-full text-sm">
                    <thead className="bg-white text-left shadow-sm dark:bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 font-medium text-gray-500">Date</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-500">Price (22K - 8g)</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-500">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {sortedData.map((item, index) => {
                            const nextItem = sortedData[index + 1];
                            const prevPrice = nextItem ? nextItem.price : item.price;
                            const diff = item.price - prevPrice;
                            const isUp = diff > 0;
                            const isDown = diff < 0;

                            const isHighest = item.price === maxPrice;
                            const isLowest = item.price === minPrice;
                            const isDateToday = isToday(item.date);

                            let rowClass = "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors";
                            if (isHighest) rowClass = "bg-red-50/80 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30";
                            else if (isLowest) rowClass = "bg-green-50/80 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30";
                            else if (isDateToday) rowClass = "bg-blue-50/80 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30";

                            return (
                                <tr key={item.date} className={rowClass}>
                                    <td className="px-4 py-3 text-gray-900 dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            {isDateToday && (
                                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                    Today
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                        <div className="flex flex-col items-end">
                                            <span>₹{item.price.toLocaleString('en-IN')}</span>
                                            <div className="flex gap-1 mt-0.5">
                                                {isHighest && (
                                                    <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                                        Highest
                                                    </span>
                                                )}
                                                {isLowest && (
                                                    <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                        Lowest
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {isUp ? (
                                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                                            ) : isDown ? (
                                                <TrendingDown className="h-4 w-4 text-rose-500" />
                                            ) : (
                                                <Minus className="h-4 w-4 text-gray-400" />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
