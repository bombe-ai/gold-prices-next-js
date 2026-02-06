'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { LogoWithBranding } from '@/components/ui/LogoWithBranding';

export function Footer() {
    const t = useTranslations('Footer');
    const params = useParams();
    const locale = params.locale as string;

    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
    ];

    const quickLinks = [
        { label: t('home'), href: `/${locale}` },
        { label: t('blog'), href: `/${locale}/blog` },
        { label: t('about'), href: `/${locale}/about` },
        { label: t('contact'), href: `/${locale}/contact` },
    ];

    const legalLinks = [
        { label: t('privacy'), href: `/${locale}/privacy` },
        { label: t('terms'), href: `/${locale}/terms` },
        { label: t('disclaimer'), href: `/${locale}/disclaimer` },
    ];

    return (
        <footer className="bg-[#1F222D] text-white mt-20">
            <div className="mx-auto px-4 py-12 w-full max-w-7xl">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href={`/${locale}`} className="inline-block group">
                            <LogoWithBranding
                                className="h-[30px] w-[153px] transition-transform group-hover:scale-105"
                            />
                        </Link>
                        <p className="text-kerala-100 text-sm leading-relaxed">
                            {t('tagline')}
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-9 h-9 rounded-full bg-kerala-700/50 hover:bg-gold-500 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gold-500/30"
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-gold-400">{t('quickLinks')}</h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-kerala-100 hover:text-gold-400 text-sm transition-colors duration-200 inline-flex items-center gap-1 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-gold-400 transition-all duration-200"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-gold-400">{t('legal')}</h4>
                        <ul className="space-y-2">
                            {legalLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-kerala-100 hover:text-gold-400 text-sm transition-colors duration-200 inline-flex items-center gap-1 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-gold-400 transition-all duration-200"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-gold-400">{t('contact')}</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-kerala-100">
                                <MapPin className="w-4 h-4 mt-0.5 text-gold-400 flex-shrink-0" />
                                <span>{t('address')}</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-kerala-100">
                                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                                <a href="tel:+919876543210" className="hover:text-gold-400 transition-colors">
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-kerala-100">
                                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                                <a href="mailto:info@goldkerala.com" className="hover:text-gold-400 transition-colors">
                                    info@goldkerala.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-kerala-600 to-transparent mb-6"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-kerala-200">
                    <p>
                        © {currentYear} <span className="text-gold-400 font-semibold">Gold Kerala</span>. {t('rights')}
                    </p>
                    <p className="text-xs text-kerala-300">
                        {t('disclaimer')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
