'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export const LanguageToggle = () => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleLanguageChange = (nextLocale: 'en' | 'ml') => {
        router.replace({ pathname }, { locale: nextLocale });
    };

    return (
        <div className="relative flex items-center rounded-lg bg-gray-100 p-1 w-[100px] h-[32px]">
            {/* Sliding Pill Background */}
            <div
                className={`absolute top-1 bottom-1 w-[46px] rounded-md bg-[#F6A824] shadow-sm transition-all duration-300 ease-in-out ${locale === 'ml' ? 'translate-x-[46px]' : 'translate-x-0'
                    }`}
            />

            {/* English Button */}
            <button
                onClick={() => handleLanguageChange('en')}
                className={`relative z-10 w-1/2 text-xs font-bold transition-colors duration-300 ${locale === 'en' ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                aria-label="English"
            >
                EN
            </button>

            {/* Malayalam Button */}
            <button
                onClick={() => handleLanguageChange('ml')}
                className={`relative z-10 w-1/2 text-xs font-bold transition-colors duration-300 ${locale === 'ml' ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                aria-label="Malayalam"
            >
                മല
            </button>
        </div>
    );
};
