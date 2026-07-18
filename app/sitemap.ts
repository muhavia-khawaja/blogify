import { MetadataRoute } from 'next'
import {
  getAllCategories,
  getAllArticles,
  getAllAuthors,
} from '@/utils/actions'
import { getAbsoluteUrl } from '@/utils/seo'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()

  const [articles, categories, authors] = await Promise.all([
    getAllArticles(),
    getAllCategories(),
    getAllAuthors(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: getAbsoluteUrl('/'),
      priority: 1.0,
      changeFrequency: 'daily' as const,
    },
    {
      url: getAbsoluteUrl('/blog'),
      priority: 0.9,
      changeFrequency: 'daily' as const,
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
      url: getAbsoluteUrl('/signup'),
      priority: 0.4,
      changeFrequency: 'yearly' as const,
    },
  ].map((p) => ({ ...p, lastModified: now }))

  const articlePages: MetadataRoute.Sitemap = articles
    .filter((a) => a.slug && a.published)
    .map((a) => ({
      url: getAbsoluteUrl(`/blog/${a.slug}`),
      lastModified: a.updatedAt
        ? new Date(a.updatedAt).toISOString()
        : new Date(a.createdAt).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => c.slug)
    .map((c) => ({
      url: getAbsoluteUrl(`/blog?category=${c.slug}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  const authorPages: MetadataRoute.Sitemap = authors
    .filter((a) => a.id)
    .map((a) => ({
      url: getAbsoluteUrl(`/blog?author=${encodeURIComponent(a.name)}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

  return [...staticPages, ...articlePages, ...categoryPages, ...authorPages]
}

export async function getAllUrls(): Promise<string[]> {
  const map = await sitemap()
  return map.map((item) => item.url)
}
