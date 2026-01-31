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

    return (
        <Card className="h-full overflow-hidden p-0">
            <div className="border-b border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                <h3 className="font-bold text-gray-900 dark:text-white">Price History</h3>
            </div>
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gold-200">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-white text-left shadow-sm dark:bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 font-medium text-gray-500">Date</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-500">Price (22K)</th>
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

                            return (
                                <tr key={item.date} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-4 py-3 text-gray-900 dark:text-gray-300">
                                        {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                        ₹{item.price.toLocaleString('en-IN')}
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
