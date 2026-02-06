import { getAllPosts } from '@/lib/wordpress';
import { Card } from '@/components/ui/Card';
import { CalendarDays, Clock } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export const revalidate = 3600;

export default async function BlogPage({
    params
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params;
    const posts = await getAllPosts();
    const t = await getTranslations('Blog');

    return (
        <main className="min-h-screen pb-20 bg-gray-50/50">
            <div className="mx-auto px-4 w-full max-w-7xl">
                <header className="py-6 text-center">
                    <h1 className="text-3xl font-extrabold text-kerala-900 sm:text-4xl">
                        {t('title')}
                    </h1>
                    <p className="mt-2 text-lg text-kerala-700/80">
                        {t('subtitle')}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/${locale}/blog/${post.slug}`}
                            className="group"
                        >
                            <Card className="h-full overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                {post.featuredImage?.node?.sourceUrl ? (
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img
                                            src={post.featuredImage.node.sourceUrl}
                                            alt={post.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative h-48 w-full bg-gradient-to-br from-kerala-600/20 to-gold-500/20 flex items-center justify-center">
                                        {/* <div className="text-white text-5xl font-bold opacity-80">
                                            {post.title.charAt(0).toUpperCase()}
                                        </div> */}
                                        <div className='opacity-40'>
                                            <Logo height={80} width={80}></Logo>
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 flex flex-col h-[280px]">
                                    {post.categories?.edges?.length > 0 && (
                                        <div className="mb-3 flex flex-wrap gap-2">
                                            {post.categories.edges.map(({ node }) => (
                                                <span
                                                    key={node.id}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-100 text-gold-800"
                                                >
                                                    {node.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <h2 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-gold-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    <div
                                        className="mb-4 text-sm text-gray-500 line-clamp-3 flex-grow"
                                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                                    />

                                    <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            <span>{new Date(post.date).toLocaleDateString(locale === 'ml' ? 'ml-IN' : 'en-IN', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}</span>
                                        </div>

                                        {post.blogPosts?.readingTime && (
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>{post.blogPosts.readingTime} min read</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
