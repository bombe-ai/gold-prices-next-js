import Link from 'next/link';
import { getLatestPosts } from '@/lib/wordpress';
import { Card } from '@/components/ui/Card';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Logo } from '@/components/ui/Logo';

export async function HomeBlogList({ locale }: { locale: string }) {
    const posts = await getLatestPosts(3);
    const t = await getTranslations('Blog');

    if (!posts || posts.length === 0) {
        return null; // Or return empty state
    }

    return (
        <section className="py-8 mt-8 border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {t('latestUpdates')}
                </h2>
                <Link
                    href={`/${locale}/blog`}
                    className="group flex items-center gap-1 text-sm font-semibold text-gold-600 hover:text-gold-700 transition-colors"
                >
                    {t('viewAll')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/${locale}/blog/${post.slug}`}
                        className="group"
                    >
                        <Card className="h-full overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white">
                            {post.featuredImage?.node?.sourceUrl ? (
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img
                                        src={post.featuredImage.node.sourceUrl}
                                        alt={post.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                            ) : (
                                <div className="relative h-48 w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                                    <div className='opacity-30 grayscale'>
                                        <Logo height={60} width={60}></Logo>
                                    </div>
                                </div>
                            )}

                            <div className="p-5 flex flex-col h-[200px]">
                                {post.categories?.edges?.length > 0 && (
                                    <div className="mb-2 flex flex-wrap gap-2">
                                        <span
                                            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gold-50 text-gold-700 uppercase tracking-wider"
                                        >
                                            {post.categories.edges[0].node.name}
                                        </span>
                                    </div>
                                )}

                                <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-gold-600 transition-colors line-clamp-2 leading-tight">
                                    {post.title}
                                </h3>

                                <div
                                    className="mb-3 text-sm text-gray-500 line-clamp-2 flex-grow"
                                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                                />

                                <div className="flex items-center text-xs text-gray-400 mt-auto pt-3 border-t border-gray-50">
                                    <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                                    <span>{new Date(post.date).toLocaleDateString(locale === 'ml' ? 'ml-IN' : 'en-IN', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}</span>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
