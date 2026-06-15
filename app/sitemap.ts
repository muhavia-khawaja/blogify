// app/sitemap.ts
import { MetadataRoute } from 'next'
import {
  getAllCategories,
  getAllArticles,
  getAllAuthors,
} from '@/utils/actions'
import prisma from '@/prisma/script'

export const revalidate = 3600

const BASE_URL = 'https://blogifyguides.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()

  const [articles, categories, authors] = await Promise.all([
    getAllArticles(),
    getAllCategories(),
    getAllAuthors(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'daily' as const },
    {
      url: `${BASE_URL}/blog`,
      priority: 0.9,
      changeFrequency: 'daily' as const,
    },
    {
      url: `${BASE_URL}/about`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${BASE_URL}/contact`,
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${BASE_URL}/write`,
      priority: 0.5,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${BASE_URL}/login`,
      priority: 0.4,
      changeFrequency: 'yearly' as const,
    },
    {
      url: `${BASE_URL}/signup`,
      priority: 0.4,
      changeFrequency: 'yearly' as const,
    },
  ].map((p) => ({ ...p, lastModified: now }))

  const articlePages: MetadataRoute.Sitemap = articles
    .filter((a) => a.slug)
    .map((a) => ({
      url: `${BASE_URL}/blog/${a.slug}`,
      lastModified: a.updatedAt
        ? new Date(a.updatedAt).toISOString()
        : new Date(a.createdAt).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${BASE_URL}/blog?category=${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  const authorPages: MetadataRoute.Sitemap = authors
    .filter((a) => a.id)
    .map((a) => ({
      url: `${BASE_URL}/blog?author=${encodeURIComponent(a.name)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

  const users = await prisma.user.findMany({
    select: { id: true, updatedAt: true },
  })

  const profilePages: MetadataRoute.Sitemap = users.map((u) => ({
    url: `${BASE_URL}/profile`,
    lastModified: new Date(u.updatedAt).toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...articlePages, ...categoryPages, ...authorPages]
}

export async function getAllUrls(): Promise<string[]> {
  const map = await sitemap()
  return map.map((item) => item.url)
}
