'use server'

import prisma from '@/prisma/script'
import { revalidatePath } from 'next/cache'

export async function getDashboardStats() {
  try {
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      totalUsers,
      totalSubscribers,
      pendingContacts,
      analyticsAggregate,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { published: true } }),
      prisma.article.count({ where: { published: false } }),
      prisma.user.count(),
      prisma.subscription.count(),
      prisma.contact.count(),
      prisma.articleAnalytics.aggregate({
        _sum: {
          totalViews: true,
          totalImpressions: true,
          totalReadTimeSec: true,
        },
      }),
    ])

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalUsers,
      totalSubscribers,
      pendingContacts,
      totalViews: analyticsAggregate._sum.totalViews || 0,
      totalImpressions: analyticsAggregate._sum.totalImpressions || 0,
      totalReadTimeHours: Math.round(
        (analyticsAggregate._sum.totalReadTimeSec || 0) / 3600,
      ),
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    throw new Error('Database error fetching dashboard metrics.')
  }
}

export async function getRecentArticles(limit = 5) {
  try {
    return await prisma.article.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        published: true,
        status: true,
        createdAt: true,
        category: {
          select: { title: true },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    })
  } catch (error) {
    console.error('Failed to fetch recent articles:', error)
    return []
  }
}

export async function getRecentContacts(limit = 4) {
  try {
    return await prisma.contact.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Failed to fetch recent contacts:', error)
    return []
  }
}

export async function toggleArticlePublish(id: string, currentStatus: boolean) {
  try {
    await prisma.article.update({
      where: { id },
      data: {
        published: !currentStatus,
        status: !currentStatus ? 'PUBLISHED' : 'DRAFT',
      },
    })
    revalidatePath('/control')
  } catch (error) {
    console.error('Failed to toggle article publish state:', error)
  }
}

export async function deleteContact(id: string) {
  try {
    await prisma.contact.delete({ where: { id } })
    revalidatePath('/control')
  } catch (error) {
    console.error('Failed to delete contact:', error)
  }
}

export interface GetArticlesParams {
  query?: string
  status?: string
  categoryId?: string
  page?: number
  limit?: number
}

export async function getArticles({
  query = '',
  status = 'ALL',
  categoryId = '',
  page = 1,
  limit = 10,
}: GetArticlesParams) {
  try {
    const skip = (page - 1) * limit

    const where: any = {}

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { short_desc: { contains: query, mode: 'insensitive' } },
      ]
    }

    if (status === 'PUBLISHED') where.published = true
    if (status === 'DRAFT') where.published = false

    if (categoryId && categoryId !== 'ALL') {
      where.categoryId = categoryId
    }

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, title: true } },
          user: { select: { name: true, email: true } },
          analytics: { select: { totalViews: true } },
        },
      }),
      prisma.article.count({ where }),
    ])

    return {
      articles,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      currentPage: page,
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    return { articles: [], totalPages: 1, totalCount: 0, currentPage: 1 }
  }
}

/**
 * Fetch categories dropdown options
 */
export async function getCategoryOptions() {
  try {
    return await prisma.category.findMany({
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function toggleArticleFeatured(
  id: string,
  currentFeatured: boolean,
) {
  try {
    await prisma.article.update({
      where: { id },
      data: { featured: !currentFeatured },
    })
    revalidatePath('/control/articles')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle featured status:', error)
    return { success: false, error: 'Failed to update feature status' }
  }
}

export async function toggleArticleMainPost(
  id: string,
  currentMainPost: boolean,
) {
  try {
    await prisma.article.update({
      where: { id },
      data: { mainPost: !currentMainPost },
    })
    revalidatePath('/control/articles')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle main post status:', error)
    return { success: false, error: 'Failed to update main post status' }
  }
}

export async function deleteArticle(id: string) {
  try {
    await prisma.article.delete({ where: { id } })
    revalidatePath('/control/articles')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete article:', error)
    return { success: false, error: 'Failed to delete article' }
  }
}

export interface UpdateArticleInput {
  title: string
  slug: string
  short_desc: string
  long_desc: string
  categoryId?: string | null
  image?: string | null
}

export async function getArticleBySlug(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: {
        slug,
      },

      select: {
        id: true,
        title: true,
        slug: true,

        short_desc: true,
        long_desc: true,

        categoryId: true,
        image: true,

        published: true,
        featured: true,
        mainPost: true,

        tags: true,
        status: true,
        readTime: true,

        createdAt: true,
        updatedAt: true,

        userId: true,

        category: {
          select: {
            id: true,
            title: true,
          },
        },

        user: {
          select: {
            email: true,
            name: true,
          },
        },

        analytics: {
          select: {
            totalImpressions: true,
            guestViews: true,
            userViews: true,
            totalReadTimeSec: true,
            avgReadTimeSec: true,
            avgScrollDepth: true,
            bounceCount: true,
            updatedAt: true,
          },
        },
      },
    })

    return article
  } catch (error) {
    console.error('getArticleBySlug error:', error)
    return null
  }
}

export async function updateArticle(id: string, data: UpdateArticleInput) {
  try {
    if (!id) {
      throw new Error('Article ID is required')
    }

    const title = data.title?.trim()
    const slug = data.slug?.trim()
    const short_desc = data.short_desc?.trim() || ''
    const long_desc = data.long_desc || ''
    const image = data.image?.trim() || ''

    if (!title) {
      throw new Error('Article title is required')
    }

    if (!slug) {
      throw new Error('Article slug is required')
    }

    if (!long_desc.trim()) {
      throw new Error('Article content is required')
    }

    const updatedArticle = await prisma.article.update({
      where: {
        id,
      },

      data: {
        title,
        slug,
        short_desc,
        long_desc,
        image,
        categoryId: data.categoryId || null,
        updatedAt: new Date(),
      },
    })

    // Revalidate article listing
    revalidatePath('/control/articles')

    // Revalidate the updated article page
    revalidatePath(`/control/articles/${updatedArticle.slug}`)

    return {
      success: true,
      message: 'Article updated successfully',
      article: updatedArticle,
    }
  } catch (error) {
    console.error('Error updating article:', error)

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update article',
    }
  }
}

interface CategoryInput {
  title: string
  slug: string
}

// Fetch all categories with article count
export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { title: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        _count: {
          select: { articles: true },
        },
      },
    })
  } catch (error) {
    console.error('getCategories error:', error)
    return []
  }
}

interface CategoryInput {
  title: string
  slug: string
  short_desc?: string | null
  long_desc?: string | null
}

export async function createCategory(data: CategoryInput) {
  try {
    const newCategory = await prisma.category.create({
      data: {
        title: data.title,
        slug: data.slug,
        short_desc: data.short_desc || '',
        long_desc: data.long_desc || '',
      },
    })

    revalidatePath('/control/categories')
    return newCategory
  } catch (error) {
    console.error('createCategory error:', error)
    throw new Error('Failed to create category')
  }
}

// Update category
export async function updateCategory(id: string, data: CategoryInput) {
  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        short_desc: data.short_desc ?? '',
        long_desc: data.long_desc ?? '',
      },
    })

    revalidatePath('/control/categories')
    return updatedCategory
  } catch (error) {
    console.error('updateCategory error:', error)
    throw new Error('Failed to update category')
  }
}
export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    })

    revalidatePath('/control/categories')
    return true
  } catch (error) {
    console.error('deleteCategory error:', error)
    throw new Error('Failed to delete category')
  }
}

export async function getTopics() {
  try {
    return await prisma.topic.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
            followers: true,
          },
        },
      },
    })
  } catch (error) {
    console.error('getTopics error:', error)
    return []
  }
}
interface TopicInput {
  name: string
  slug: string
}

export async function createTopic(data: TopicInput) {
  try {
    const newTopic = await prisma.topic.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
            followers: true,
          },
        },
      },
    })

    revalidatePath('/control/topics')
    return newTopic
  } catch (error) {
    console.error('createTopic error:', error)
    throw new Error('Failed to create topic')
  }
}

export async function updateTopic(id: string, data: TopicInput) {
  try {
    const updatedTopic = await prisma.topic.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
            followers: true,
          },
        },
      },
    })

    revalidatePath('/control/topics')
    return updatedTopic
  } catch (error) {
    console.error('updateTopic error:', error)
    throw new Error('Failed to update topic')
  }
}

export async function deleteTopic(id: string) {
  try {
    await prisma.topic.delete({
      where: { id },
    })

    revalidatePath('/control/topics')
    return true
  } catch (error) {
    console.error('deleteTopic error:', error)
    throw new Error('Failed to delete topic')
  }
}

export async function getReviews() {
  try {
    return await prisma.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      select: {
        id: true,
        name: true,
        email: true,
        content: true,
        rating: true,
        createdAt: true,

        articleId: true,
        parentId: true,

        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },

        parent: {
          select: {
            id: true,
            name: true,
            content: true,
          },
        },
      },
    })
  } catch (error) {
    console.error('getReviews error:', error)

    return []
  }
}

export async function deleteReview(id: string) {
  try {
    const review = await prisma.review.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
      },
    })

    if (!review) {
      throw new Error('Review not found')
    }
    const idsToDelete = new Set<string>([id])

    let currentParentIds = [id]

    while (currentParentIds.length > 0) {
      const children = await prisma.review.findMany({
        where: {
          parentId: {
            in: currentParentIds,
          },
        },

        select: {
          id: true,
        },
      })

      if (children.length === 0) {
        break
      }

      const nextParentIds: string[] = []

      for (const child of children) {
        if (!idsToDelete.has(child.id)) {
          idsToDelete.add(child.id)
          nextParentIds.push(child.id)
        }
      }

      currentParentIds = nextParentIds
    }

    const ids = Array.from(idsToDelete)

    await prisma.$transaction(async (tx) => {
      const remaining = new Set(ids)

      while (remaining.size > 0) {
        const removable = await tx.review.findMany({
          where: {
            id: {
              in: Array.from(remaining),
            },
          },

          select: {
            id: true,
            parentId: true,
          },
        })

        const remainingIds = new Set(remaining)

        const idsThatHaveChildren = new Set<string>()

        for (const item of removable) {
          if (item.parentId && remaining.has(item.parentId)) {
            idsThatHaveChildren.add(item.parentId)
          }
        }

        const deleteNow = removable
          .filter((item) => !idsThatHaveChildren.has(item.id))
          .map((item) => item.id)

        if (deleteNow.length === 0) {
          throw new Error('Unable to safely delete review thread.')
        }

        await tx.review.deleteMany({
          where: {
            id: {
              in: deleteNow,
            },
          },
        })

        for (const deleteId of deleteNow) {
          remainingIds.delete(deleteId)
        }

        remaining.clear()

        for (const remainingId of remainingIds) {
          remaining.add(remainingId)
        }
      }
    })

    revalidatePath('/control/reviews')

    return true
  } catch (error) {
    console.error('deleteReview error:', error)

    throw new Error('Failed to delete review')
  }
}

export async function getUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
            savedArticles: true,
            followers: true,
            following: true,
          },
        },
      },
    })
  } catch (error) {
    console.error('getUsers error:', error)
    return []
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    })

    revalidatePath('/control/users')
    return true
  } catch (error) {
    console.error('deleteUser error:', error)
    throw new Error('Failed to delete user')
  }
}

export async function getContacts() {
  try {
    return await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        createdAt: true,
      },
    })
  } catch (error) {
    console.error('getContacts error:', error)
    return []
  }
}

export async function deleteSingleContact(id: string) {
  try {
    await prisma.contact.delete({
      where: { id },
    })

    revalidatePath('/control/contacts')
    return true
  } catch (error) {
    console.error('deleteContact error:', error)
    throw new Error('Failed to delete contact message')
  }
}

export async function getAdminProfile() {
  try {
    return await prisma.admin.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
      },
    })
  } catch (error) {
    console.error('getAdminProfile error:', error)
    return null
  }
}

interface UpdateAdminInput {
  id: string
  name: string
  email: string
  password?: string
}

export async function updateAdminProfile(data: UpdateAdminInput) {
  try {
    const updatePayload: { name: string; email: string; password?: string } = {
      name: data.name,
      email: data.email,
    }

    if (data.password && data.password.trim().length > 0) {
      updatePayload.password = data.password
    }

    const updated = await prisma.admin.update({
      where: { id: data.id },
      data: updatePayload,
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    revalidatePath('/control/settings')
    return updated
  } catch (error) {
    console.error('updateAdminProfile error:', error)
    throw new Error('Failed to update admin profile')
  }
}
