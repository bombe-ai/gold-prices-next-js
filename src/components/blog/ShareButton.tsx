'use client';

import { Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ShareButtonProps {
    title: string;
    excerpt: string;
}

export function ShareButton({ title, excerpt }: ShareButtonProps) {
    const t = useTranslations('Blog');

    const handleShare = async () => {
        const shareData = {
            title: title || '',
            text: excerpt?.replace(/<[^>]*>/g, '') || '',
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:border-kerala-200 hover:bg-kerala-50 text-gray-600 hover:text-kerala-700 transition-all duration-300 shadow-sm hover:shadow-md"
            aria-label={t('share')}
        >
            <Share2 className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="text-sm font-medium">{t('share')}</span>
        </button>
    );
}
