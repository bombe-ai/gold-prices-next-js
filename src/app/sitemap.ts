import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/wordpress'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://goldkerala.com'

    // Fetch all blog posts
    const posts = await getAllPosts()

    // Generate blog post URLs
    const blogPosts = posts.map((post) => ({
        url: `${baseUrl}/en/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: {
            languages: {
                en: `${baseUrl}/en/blog/${post.slug}`,
                ml: `${baseUrl}/ml/blog/${post.slug}`,
            },
        },
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
            alternates: {
                languages: {
                    en: `${baseUrl}/en`,
                    ml: `${baseUrl}/ml`,
                },
            },
        },
        {
            url: `${baseUrl}/en/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
            alternates: {
                languages: {
                    en: `${baseUrl}/en/blog`,
                    ml: `${baseUrl}/ml/blog`,
                },
            },
        },
        ...blogPosts,
    ]
}
