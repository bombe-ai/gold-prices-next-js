import { MarketData } from '@/lib/types';
import { MarketMarquee } from './MarketMarquee';

interface TopBannerProps {
    marketData?: MarketData[];
}

export function TopBanner({ marketData }: TopBannerProps) {
    return (
        <div className="w-full bg-[#1F222D] h-10 overflow-hidden text-white border-b border-kerala-800 relative z-50">
            {marketData && marketData.length > 0 ? (
                <MarketMarquee items={marketData} />
            ) : (
                <div className="container mx-auto px-4 flex items-center justify-between text-sm h-full">
                    <span className="opacity-90 font-medium">Gold & Silver Rates • Real-time Updates</span>
                    <div className="flex gap-4">
                        <span className="hidden sm:inline opacity-70">Kerala, India</span>
                        <span className="font-bold text-gold-400">Live Market Open</span>
                    </div>
                </div>
            )}
        </div>
    );
}
