import { getPostBySlug, getAllPosts } from '@/lib/wordpress';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ShareButton } from '@/components/blog/ShareButton';
import { Metadata } from 'next';

// Revalidate every hour
export const revalidate = 3600;

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    const plainExcerpt = post.excerpt?.replace(/<[^>]*>/g, '') || '';
    const categories = post.categories?.edges?.map(({ node }) => node.name).join(', ') || '';

    return {
        title: `${post.title} | Gold Kerala Blog`,
        description: plainExcerpt.substring(0, 160),
        keywords: [
            post.title,
            'gold investment',
            'gold news',
            'kerala gold',
            categories,
        ].filter(Boolean),
        authors: [{ name: 'Gold Kerala' }],
        openGraph: {
            title: post.title,
            description: plainExcerpt.substring(0, 160),
            type: 'article',
            locale: locale === 'ml' ? 'ml_IN' : 'en_IN',
            siteName: 'Gold Kerala',
            url: `https://goldkerala.com/${locale}/blog/${post.slug}`,
            publishedTime: post.date,
            authors: ['Gold Kerala'],
            images: post.featuredImage?.node?.sourceUrl ? [
                {
                    url: post.featuredImage.node.sourceUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: plainExcerpt.substring(0, 160),
            images: post.featuredImage?.node?.sourceUrl ? [post.featuredImage.node.sourceUrl] : [],
        },
        alternates: {
            canonical: `https://goldkerala.com/${locale}/blog/${post.slug}`,
            languages: {
                en: `https://goldkerala.com/en/blog/${post.slug}`,
                ml: `https://goldkerala.com/ml/blog/${post.slug}`,
            },
        },
    };
}

export default async function BlogPost({
    params
}: {
    params: Promise<{ locale: string; slug: string }>
}) {
    const { locale, slug } = await params;
    const post = await getPostBySlug(slug);
    const t = await getTranslations('Blog');

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
                        <ShareButton title={post.title} excerpt={post.excerpt} />
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
                <article className="prose prose-slate max-w-[980px] mx-auto 
          [&_p]:text-[18px] [&_p]:leading-[28px] lg:[&_p]:text-[20px] lg:[&_p]:leading-[32px] [&_p]:text-gray-700 [&_p]:mb-6
          [&_li]:text-[18px] [&_li]:leading-[28px] lg:[&_li]:text-[20px] lg:[&_li]:leading-[32px] [&_li]:text-gray-700
          prose-headings:text-kerala-900 prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
          prose-a:text-gold-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
          prose-strong:text-kerala-900 prose-strong:font-bold
          first-letter:text-6xl first-letter:font-bold first-letter:text-kerala-900 first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]
        ">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>
            </div>
        </main>
    );
}
