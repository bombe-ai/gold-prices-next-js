import Link from 'next/link';
import { Logo } from '../ui/Logo';

export const Header = () => {
    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-gray-900/80 dark:border-gray-800">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left: Logo and Brand */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Logo className="h-[29px] w-[29px] text-gold-500 transition-transform group-hover:scale-105" />
                        <span className="text-[30px] font-bold text-kerala-900 dark:text-gray-100 flex items-center">
                            <span className="text-[#E09921]">Gold</span>
                            <span className="text-[#E09921]">kerala</span>
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
                    <div className="flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                        <button
                            className="rounded-md bg-[#F6A824] px-3 py-1 text-xs font-bold text-white shadow-sm"
                            aria-label="English"
                        >
                            EN
                        </button>
                        <button
                            className="rounded-md px-3 py-1 text-xs font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                            aria-label="Malayalam"
                        >
                            മല
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
