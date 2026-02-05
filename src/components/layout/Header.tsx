import Link from 'next/link';
import { Logo } from '../ui/Logo';
import { LanguageToggle } from '../common/LanguageToggle';

import { useTranslations } from 'next-intl';

export const Header = () => {
    const t = useTranslations('Header');
    return (
        <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left: Logo and Brand */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Logo className="h-[29px] w-[29px] text-gold-500 transition-transform group-hover:scale-105" />
                        <span className="text-[30px] font-bold text-kerala-900   flex items-center">
                            <span className="text-[#E09921]">{t('gold')}</span>
                            <span className="text-[#E09921]">{t('kerala')}</span>
                        </span>
                    </Link>
                </div>

                {/* Center: Navigation Links (Hidden on small mobile) */}
                {/* <nav className="hidden md:flex items-center gap-8">
                    <Link href="/calculators" className="text-sm font-medium text-gray-700 hover:text-[#AF771A] transition-colors dark:text-gray-300 dark:hover:text-gold-400">
                        Calculators
                    </Link>
                    <Link href="/jewellery" className="text-sm font-medium text-gray-700 hover:text-[#AF771A] transition-colors dark:text-gray-300 dark:hover:text-gold-400">
                        Jewellery
                    </Link>
                    <Link href="/learn-more" className="text-sm font-medium text-gray-700 hover:text-[#AF771A] transition-colors dark:text-gray-300 dark:hover:text-gold-400">
                        Learn more
                    </Link>
                </nav> */}

                {/* Right: Language Selector */}
                <div className="flex items-center gap-4">
                    <LanguageToggle />
                </div>
            </div>
        </header>
    );
};

