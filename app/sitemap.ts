import { MetadataRoute } from 'next'
import { getAllArticles, getAllAuthors, getAllTopics } from '@/utils/actions'
import { getAbsoluteUrl } from '@/utils/seo'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()

  const [articles, authors, topics] = await Promise.all([
    getAllArticles(),
    getAllAuthors(),
    getAllTopics(),
  ])

  type SitemapArticle = {
    slug?: string | null
    published: boolean
    updatedAt?: Date | string | null
    createdAt: Date | string
  }

  type SitemapAuthor = {
    id?: string | null
    name: string
    updatedAt?: Date | string | null
    createdAt?: Date | string | null
  }

  type SitemapTopic = {
    slug?: string | null
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: getAbsoluteUrl('/'),
      priority: 1.0,
      changeFrequency: 'daily' as const,
    },
    {
      url: getAbsoluteUrl('/latest'),
      priority: 0.9,
      changeFrequency: 'daily' as const,
    },
    {
      url: getAbsoluteUrl('/topics'),
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    },
    {
      url: getAbsoluteUrl('/about'),
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      url: getAbsoluteUrl('/contact'),
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      url: getAbsoluteUrl('/write'),
      priority: 0.5,
      changeFrequency: 'monthly' as const,
    },
    {
      url: getAbsoluteUrl('/login'),
      priority: 0.4,
      changeFrequency: 'yearly' as const,
    },
    {
      url: getAbsoluteUrl('/pricing'),
      priority: 0.4,
      changeFrequency: 'yearly' as const,
    },
    {
      url: getAbsoluteUrl('/signup'),
      priority: 0.4,
      changeFrequency: 'yearly' as const,
    },
  ].map((p) => ({ ...p, lastModified: now }))

  const articlePages: MetadataRoute.Sitemap = (articles as SitemapArticle[])
    .filter((a) => a.slug && a.published)
    .map((a) => ({
      url: getAbsoluteUrl(`/articles/${a.slug}`),
      lastModified: a.updatedAt
        ? new Date(a.updatedAt).toISOString()
        : new Date(a.createdAt).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  const topicPages: MetadataRoute.Sitemap = (topics as SitemapTopic[])
    .filter((topic) => topic.slug)
    .map((topic) => ({
      url: getAbsoluteUrl(`/topics/${topic.slug}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  const authorPages: MetadataRoute.Sitemap = (authors as SitemapAuthor[])
    .filter((a) => a.id)
    .map((a) => ({
      url: getAbsoluteUrl(`/profile/${a.id}`),
      lastModified:
        a.updatedAt || a.createdAt
          ? new Date(a.updatedAt || a.createdAt!).toISOString()
          : now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

  return [...staticPages, ...articlePages, ...topicPages, ...authorPages]
}

export async function getAllUrls(): Promise<string[]> {
  const map = await sitemap()
  return map.map((item) => item.url)
}
