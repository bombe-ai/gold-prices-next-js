import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface BadgeProps {
    change: number;
    direction: 'up' | 'down' | 'flat';
    currency?: string;
}

export function TrendBadge({ change, direction, currency = '₹' }: BadgeProps) {
    const isUp = direction === 'up';
    const isDown = direction === 'down';

    const colorClass = isUp
        ? 'text-emerald-600 bg-emerald-50'
        : isDown
            ? 'text-rose-600 bg-rose-50'
            : 'text-gray-600 bg-gray-50';

    const Icon = isUp ? ArrowUp : isDown ? ArrowDown : Minus;

    return (
        <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}>
            <Icon className="h-3 w-3" />
            <span>{currency}{Math.abs(change).toLocaleString('en-IN')}</span>
        </div>
    );
}
