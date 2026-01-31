 import { MarketData } from '@/lib/api';

interface MarketMarqueeProps {
    items: MarketData[];
}

export function MarketMarquee({ items }: MarketMarqueeProps) {
    if (!items || items.length === 0) return null;

    const renderItems = () => (
        items.map((item, index) => (
            <div key={`${item.symbol}-${index}`} className="flex items-center mx-6 text-sm font-medium">
                <span className="text-gray-100 mr-2">{item.symbol}</span>
                <span className="text-white mr-2">{item.price.toLocaleString('en-IN')}</span>
                <span className={`flex items-center text-xs ${item.direction === 'up' ? 'text-green-400' : item.direction === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                    {item.change > 0 ? '+' : ''}{item.change.toFixed(2)} ({item.change > 0 ? '+' : ''}{item.percentChange.toFixed(2)}%)
                </span>

                {/* Separator Icon between items */}
                <span className="ml-6 text-gray-600">
                    ⟳
                </span>
            </div>
        ))
    );

    return (
        <div className="relative flex overflow-hidden w-full h-full items-center group">
            <div className="flex animate-marquee whitespace-nowrap items-center group-hover:[animation-play-state:paused]">
                {renderItems()}
            </div>
            <div className="flex absolute top-0 left-0 animate-marquee2 whitespace-nowrap items-center group-hover:[animation-play-state:paused] h-full">
                {renderItems()}
            </div>
        </div>
    );
}
