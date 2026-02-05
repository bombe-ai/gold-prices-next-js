import { useTranslations } from 'next-intl';
import { MarketData } from '@/lib/types';
import { MarketMarquee } from './MarketMarquee';

interface TopBannerProps {
    marketData?: MarketData[];
}

export function TopBanner({ marketData }: TopBannerProps) {
    const t = useTranslations('TopBanner');

    return (
        <div className="w-full bg-[#1F222D] h-10 overflow-hidden text-white border-b border-kerala-800 relative z-50">
            {marketData && marketData.length > 0 ? (
                <MarketMarquee items={marketData} />
            ) : (
                <div className="container mx-auto px-4 flex items-center justify-between text-sm h-full">
                    <span className="opacity-90 font-medium">{t('scrollingText')}</span>
                    <div className="flex gap-4">
                        <span className="hidden sm:inline opacity-70">{t('location')}</span>
                        <span className="font-bold text-gold-400">{t('marketOpen')}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
