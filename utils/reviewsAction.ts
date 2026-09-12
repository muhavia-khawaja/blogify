'use server'

import prisma from '@/prisma/script'

type CreateReviewInput = {
  articleId: string
  content: string
  name: string
  email: string
  rating: number | null
  parentId: string | null
}

export async function createReviewAction(data: CreateReviewInput) {
  try {
    const content = data.content.trim()
    const name = data.name.trim()
    const email = data.email.trim()

    if (!content || !name || !email) {
      return {
        success: false,
        message: 'Please fill in all required fields.',
      }
    }

    if (data.parentId) {
      const parent = await prisma.review.findUnique({
        where: {
          id: data.parentId,
        },
        select: {
          id: true,
          articleId: true,
        },
      })

      if (!parent) {
        return {
          success: false,
          message: 'The comment you are replying to no longer exists.',
        }
      }

      if (parent.articleId !== data.articleId) {
        return {
          success: false,
          message: 'Invalid reply.',
        }
      }
    }

    const rating = data.parentId
      ? null
      : Math.min(5, Math.max(1, Number(data.rating) || 5))

    const review = await prisma.review.create({
      data: {
        content,
        name,
        email,
        rating,
        articleId: data.articleId,
        parentId: data.parentId || null,
      },
    })

    return {
      success: true,
      message: data.parentId
        ? 'Reply submitted successfully.'
        : 'Review submitted successfully.',
      review: {
        id: review.id,
        content: review.content,
        name: review.name,
        email: review.email,
        rating: review.rating,
        createdAt: review.createdAt,
        articleId: review.articleId,
        parentId: review.parentId,
        replies: [],
      },
    }
  } catch (error) {
    console.error('Create review error:', error)

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    }
  }
}
