'use client';

import { useEffect, useState } from 'react';
import { getPostBySlug, Post } from '@/lib/wordpress';
import { useTranslations } from 'next-intl';
import { notFound, useParams } from 'next/navigation';
import { Share2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function BlogPost() {
    const params = useParams();
    const locale = params.locale as string;
    const slug = params.slug as string;
    const t = useTranslations('Blog');
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPost() {
            try {
                const data = await getPostBySlug(slug);
                if (!data) {
                    notFound();
                }
                setPost(data);
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [slug]);

    const handleShare = async () => {
        const shareData = {
            title: post?.title || '',
            text: post?.excerpt?.replace(/<[^>]*>/g, '') || '',
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

    if (loading) {
        return (
            <main className="min-h-screen bg-white pb-20">
                <div className="mx-auto px-4 w-full max-w-7xl pt-6 md:pt-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="h-64 bg-gray-200 rounded mb-8"></div>
                    </div>
                </div>
            </main>
        );
    }

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white pb-20">
            <div className="mx-auto px-4 w-full max-w-7xl pt-6 md:pt-8">
                {/* Back Link */}
                <Link
                    href={`/${locale}/blog`}
                    className="inline-flex items-center gap-1 text-gray-500 hover:text-kerala-700 mb-8 text-sm font-medium transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    {t('backToBlog')}
                </Link>

                {/* Categories */}
                {post.categories?.edges?.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                        {post.categories.edges.map(({ node }) => (
                            <span
                                key={node.id}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gold-50 text-gold-700 uppercase tracking-wide"
                            >
                                {node.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-extrabold text-kerala-900 mb-6 leading-tight tracking-tight">
                    {post.title}
                </h1>

                {/* Meta Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-8">
                    <p className="text-sm text-gray-500 font-medium">
                        {new Date(post.date).toLocaleDateString(locale === 'ml' ? 'ml-IN' : 'en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 text-gray-500 hover:text-kerala-700 transition-colors text-sm font-medium"
                        >
                            <Share2 className="h-4 w-4" />
                            {t('share')}
                        </button>
                    </div>
                </div>

                {/* Featured Image */}
                {post.featuredImage?.node?.sourceUrl && (
                    <div className="mb-10 w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                        <img
                            src={post.featuredImage.node.sourceUrl}
                            alt={post.title}
                            className="w-full h-auto object-cover max-h-[500px]"
                        />
                    </div>
                )}

                {/* Content */}
                <article className="prose prose-lg prose-slate max-w-none 
                    prose-headings:text-kerala-900 prose-headings:font-bold
                    prose-a:text-gold-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-xl prose-img:shadow-md
                    prose-p:leading-relaxed prose-p:text-gray-600
                    first-letter:text-5xl first-letter:font-bold first-letter:text-kerala-900 first-letter:mr-3 first-letter:float-left
                ">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>
            </div>
        </main>
    );
}
