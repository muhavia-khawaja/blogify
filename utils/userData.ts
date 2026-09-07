'use server'

import prisma from '@/prisma/script'
import { revalidatePath } from 'next/cache'

interface CreateArticleInput {
  userId: string
  title: string
  slug: string
  short_desc: string
  long_desc: string
  tags?: string[]
  image?: string
  categoryId?: string
  readTime?: string
  published?: boolean
}

interface UpdateArticleInput extends Partial<CreateArticleInput> {
  id: string
}

const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

export async function createUserArticle(data: CreateArticleInput) {
  try {
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title)

    const existingSlug = await prisma.article.findUnique({
      where: { slug },
    })

    if (existingSlug) {
      return {
        success: false,
        error: 'An article with this slug already exists.',
      }
    }

    const newArticle = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        short_desc: data.short_desc,
        long_desc: data.long_desc,
        tags: data.tags || [],
        image: data.image || null,
        readTime: data.readTime || null,
        published: data.published ?? false,
        status: data.published ? 'PUBLISHED' : 'DRAFT',
        userId: data.userId,
        categoryId: data.categoryId || null,
        analytics: {
          create: {
            totalImpressions: 0,
            totalViews: 0,
            guestViews: 0,
            userViews: 0,
            totalReadTimeSec: 0,
            avgReadTimeSec: 0,
            avgScrollDepth: 0,
            bounceCount: 0,
          },
        },
      },
    })

    revalidatePath('/profile')
    revalidatePath('/blog')
    return { success: true, data: newArticle }
  } catch (error: any) {
    console.error('Error creating user article:', error)
    return {
      success: false,
      error: error.message || 'Failed to create article.',
    }
  }
}

export async function getUserArticles(userId: string) {
  try {
    const articles = await prisma.article.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { id: true, title: true, slug: true },
        },
        analytics: true,
        _count: {
          select: {
            likes: true,
            views: true,
            impressions: true,
            reviews: true,
            citations: true,
          },
        },
      },
    })

    return { success: true, data: articles }
  } catch (error: any) {
    console.error('Error fetching user articles:', error)
    return { success: false, error: 'Failed to fetch user articles.' }
  }
}

export async function getUserArticleById(articleId: string, userId: string) {
  try {
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        userId: userId,
      },
      include: {
        category: true,
        analytics: true,
        _count: {
          select: { likes: true, reviews: true, citations: true },
        },
      },
    })

    if (!article) {
      return { success: false, error: 'Article not found or access denied.' }
    }

    return { success: true, data: article }
  } catch (error: any) {
    console.error('Error fetching single user article:', error)
    return { success: false, error: 'Failed to fetch article details.' }
  }
}

export async function updateUserArticle(data: UpdateArticleInput) {
  try {
    const existing = await prisma.article.findFirst({
      where: { id: data.id, userId: data.userId },
    })

    if (!existing) {
      return { success: false, error: 'Article not found or unauthorized.' }
    }

    let slug = existing.slug
    if (data.slug && data.slug !== existing.slug) {
      slug = generateSlug(data.slug)
      const slugCheck = await prisma.article.findUnique({ where: { slug } })
      if (slugCheck) {
        return {
          success: false,
          error: 'Slug already taken by another article.',
        }
      }
    }

    const updatedArticle = await prisma.article.update({
      where: { id: data.id },
      data: {
        title: data.title ?? existing.title,
        slug,
        short_desc: data.short_desc ?? existing.short_desc,
        long_desc: data.long_desc ?? existing.long_desc,
        tags: data.tags ?? existing.tags,
        image: data.image ?? existing.image,
        readTime: data.readTime ?? existing.readTime,
        published: data.published ?? existing.published,
        status:
          data.published !== undefined
            ? data.published
              ? 'PUBLISHED'
              : 'DRAFT'
            : existing.status,
        categoryId: data.categoryId ?? existing.categoryId,
      },
    })

    revalidatePath(`/blog/${updatedArticle.slug}`)
    revalidatePath('/dashboard/articles')
    return { success: true, data: updatedArticle }
  } catch (error: any) {
    console.error('Error updating article:', error)
    return {
      success: false,
      error: error.message || 'Failed to update article.',
    }
  }
}

export async function deleteUserArticle(articleId: string, userId: string) {
  try {
    const article = await prisma.article.findFirst({
      where: { id: articleId, userId },
    })

    if (!article) {
      return { success: false, error: 'Article not found or unauthorized.' }
    }

    await prisma.article.delete({
      where: { id: articleId },
    })

    revalidatePath('/dashboard/articles')
    revalidatePath('/blog')
    return { success: true, message: 'Article deleted successfully.' }
  } catch (error: any) {
    console.error('Error deleting article:', error)
    return { success: false, error: 'Failed to delete article.' }
  }
}

export async function getUserAnalyticsOverview(userId: string) {
  try {
    const articles = await prisma.article.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
        analytics: true,
        _count: {
          select: {
            likes: true,
            views: true,
            impressions: true,
            reviews: true,
            citations: true,
          },
        },
      },
    })

    const totalMetrics = articles.reduce(
      (acc, curr) => {
        const stats = curr.analytics
        acc.totalImpressions += stats?.totalImpressions || 0
        acc.totalViews += stats?.totalViews || 0
        acc.guestViews += stats?.guestViews || 0
        acc.userViews += stats?.userViews || 0
        acc.totalLikes += curr._count.likes
        acc.totalCitations += curr._count.citations
        acc.totalReviews += curr._count.reviews
        acc.totalReadTimeSec += stats?.totalReadTimeSec || 0
        return acc
      },
      {
        totalImpressions: 0,
        totalViews: 0,
        guestViews: 0,
        userViews: 0,
        totalLikes: 0,
        totalCitations: 0,
        totalReviews: 0,
        totalReadTimeSec: 0,
      },
    )

    return {
      success: true,
      data: {
        summary: totalMetrics,
        articles,
      },
    }
  } catch (error: any) {
    console.error('Error computing analytics overview:', error)
    return { success: false, error: 'Failed to retrieve analytics.' }
  }
}

export async function getUserArticleDetailedStats(
  articleId: string,
  userId: string,
) {
  try {
    const article = await prisma.article.findFirst({
      where: { id: articleId, userId },
      include: {
        analytics: true,
        views: {
          take: 30,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            duration: true,
            scrollDepth: true,
            deviceType: true,
            referrer: true,
            createdAt: true,
          },
        },
        impressions: {
          take: 30,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            deviceType: true,
            location: true,
            createdAt: true,
          },
        },
        _count: {
          select: { likes: true, reviews: true, citations: true },
        },
      },
    })

    if (!article) {
      return { success: false, error: 'Article not found or access denied.' }
    }

    return { success: true, data: article }
  } catch (error: any) {
    console.error('Error fetching detailed article stats:', error)
    return { success: false, error: 'Failed to fetch detailed stats.' }
  }
}
