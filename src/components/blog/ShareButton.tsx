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
            className="flex items-center gap-2 text-gray-500 hover:text-kerala-700 transition-colors text-sm font-medium"
        >
            <Share2 className="h-4 w-4" />
            {t('share')}
        </button>
    );
}
