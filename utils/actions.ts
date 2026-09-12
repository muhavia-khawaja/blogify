'use server'

import prisma from '@/prisma/script'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { jwtVerify, SignJWT } from 'jose'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'

/* =========================================================
   HELPERS
========================================================= */

const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const uploadImage = async (
  image: File,
  folder: string,
  transformation?: Record<string, unknown>[],
): Promise<string> => {
  const imageBuffer = await image.arrayBuffer()
  const imageBuff = Buffer.from(imageBuffer)

  return await new Promise<string>((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      folder,
      resource_type: 'image',
    }

    if (transformation) {
      uploadOptions.transformation = transformation
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Image upload failed'))
          return
        }

        resolve(result.secure_url)
      },
    )

    stream.end(imageBuff)
  })
}

/* =========================================================
   CATEGORY
========================================================= */

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const createCategory = async (formData: FormData) => {
  const title = (formData.get('title') as string)?.trim()
  const short_desc = (formData.get('short_desc') as string)?.trim()
  const long_desc = (formData.get('long_desc') as string)?.trim()
  const image = formData.get('image') as File | null

  if (!title || !short_desc || !long_desc) {
    throw new Error(
      'Title, short description and long description are required.',
    )
  }

  let imageUrl = ''

  if (image && image.size > 0) {
    try {
      imageUrl = await uploadImage(image, 'geology/categories')
    } catch (error) {
      console.error('Cloudinary Error:', error)
    }
  }

  const slug = createSlug(title)

  await prisma.category.create({
    data: {
      title,
      short_desc,
      long_desc,
      slug,
      image: imageUrl || null,
    },
  })

  revalidatePath('/control/categories')
  redirect('/control/categories?success=true')
}

export const getCategoryBySlug = async (slug: string) => {
  return await prisma.category.findUnique({
    where: {
      slug,
    },
  })
}

export const updateCategory = async (formData: FormData) => {
  const id = formData.get('id') as string
  const title = (formData.get('title') as string)?.trim()
  const short_desc = (formData.get('short_desc') as string)?.trim()
  const long_desc = (formData.get('long_desc') as string)?.trim()
  const image = formData.get('image') as File | null

  if (!id || !title || !short_desc || !long_desc) {
    throw new Error('Required category information is missing.')
  }

  const newSlug = createSlug(title)

  let imageUrl: string | undefined

  if (image && image.size > 0) {
    imageUrl = await uploadImage(image, 'geology/categories')
  }

  await prisma.category.update({
    where: {
      id,
    },
    data: {
      title,
      short_desc,
      long_desc,
      slug: newSlug,
      ...(imageUrl ? { image: imageUrl } : {}),
    },
  })

  revalidatePath('/control/categories')
  redirect('/control/categories')
}

export const deleteCategory = async (formData: FormData) => {
  const id = formData.get('id') as string

  if (!id) {
    throw new Error('Category ID is required.')
  }

  try {
    await prisma.category.delete({
      where: {
        id,
      },
    })

    revalidatePath('/control/categories')
  } catch (error) {
    console.error('Delete Category Error:', error)
    throw new Error('Unable to delete category.')
  }
}

/* =========================================================
   ARTICLES
========================================================= */

/**
 * Get all published articles.
 *
 * IMPORTANT:
 * Article creator is now `user`, not `author`.
 */
export const getAllArticles = async (query?: string) => {
  const search = query?.trim()

  return await prisma.article.findMany({
    where: {
      published: true,
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                short_desc: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                user: {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          }
        : {}),
    },

    include: {
      category: true,
      user: true,
      topics: {
        include: {
          topic: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const getArticles = async () => {
  return await prisma.article.findMany({
    include: {
      user: true,
      category: true,
      topics: {
        include: {
          topic: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const createArticle = async (formData: FormData) => {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser?.id) {
      return {
        success: false,
        error: 'Authentication required.',
      }
    }

    const title = (formData.get('title') as string)?.trim()
    const short_desc = (formData.get('short_desc') as string)?.trim()
    const long_desc = (formData.get('long_desc') as string)?.trim()
    const categoryId = (formData.get('categoryId') as string)?.trim()
    const tagsStr = (formData.get('tags') as string)?.trim()

    const image = formData.get('image') as File | null

    const topicIds = Array.from(
      new Set(
        formData
          .getAll('topicIds')
          .map((id) => String(id).trim())
          .filter(Boolean),
      ),
    )

    if (!title) {
      return {
        success: false,
        error: 'Title is required.',
      }
    }

    if (!short_desc) {
      return {
        success: false,
        error: 'Short description is required.',
      }
    }

    if (!long_desc) {
      return {
        success: false,
        error: 'Article content is required.',
      }
    }

    if (!categoryId) {
      return {
        success: false,
        error: 'Please select a category.',
      }
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
      },
    })

    if (!category) {
      return {
        success: false,
        error: 'Selected category does not exist.',
      }
    }

    let validTopicIds: string[] = []

    if (topicIds.length > 0) {
      const existingTopics = await prisma.topic.findMany({
        where: {
          id: {
            in: topicIds,
          },
        },
        select: {
          id: true,
        },
      })

      validTopicIds = existingTopics.map((topic) => topic.id)
    }

    const adminRecord = await prisma.admin.findUnique({
      where: {
        email: currentUser.email,
      },
      select: {
        id: true,
      },
    })

    const isAdmin = !!adminRecord

    const intent = (formData.get('intent') as string)?.trim()

    const status = isAdmin && intent === 'publish' ? 'PUBLISHED' : 'PENDING'

    const published = status === 'PUBLISHED'

    const plainText = long_desc
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    const words = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0

    const minutes = Math.max(1, Math.ceil(words / 200))

    const readTime = `${minutes} min read`

    const baseSlug = createSlug(title)

    const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`

    const tags = tagsStr
      ? Array.from(
          new Set(
            tagsStr
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean),
          ),
        )
      : []

    let imageUrl = ''

    if (image && image instanceof File && image.size > 0) {
      try {
        imageUrl = await uploadImage(image, 'education/articles')
      } catch (error) {
        console.error('Cloudinary article image upload failed:', error)

        imageUrl = ''
      }
    }

    const article = await prisma.article.create({
      data: {
        title,
        short_desc,
        long_desc,

        categoryId,

        userId: currentUser.id,

        featured: isAdmin && formData.get('featured') === 'on',

        mainPost: isAdmin && formData.get('mainPost') === 'on',

        status,
        published,

        image: imageUrl || null,

        tags,

        slug,

        readTime,

        ...(validTopicIds.length > 0
          ? {
              topics: {
                create: validTopicIds.map((topicId) => ({
                  topic: {
                    connect: {
                      id: topicId,
                    },
                  },
                })),
              },
            }
          : {}),
      },

      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        published: true,
      },
    })

    revalidatePath('/latest')
    revalidatePath('/for-you')
    revalidatePath('/following')
    revalidatePath('/library')

    revalidatePath(`/profile/${currentUser.id}`)

    revalidatePath(`/articles/${article.slug}`)

    if (isAdmin) {
      revalidatePath('/control/articles')

      redirect(`/control/articles?success=true`)
    }

    redirect(`/profile/${currentUser.id}?submitted=true`)
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof (error as { digest?: unknown }).digest === 'string' &&
      (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error
    }

    console.error('createArticle error:', error)

    return {
      success: false,
      error: 'Something went wrong while creating the article.',
    }
  }
}


export const deleteArticle = async (formData: FormData) => {
  const id = formData.get('id') as string

  if (!id) {
    throw new Error('Article ID is required.')
  }

  await prisma.article.delete({
    where: {
      id,
    },
  })

  revalidatePath('/control/articles')
  revalidatePath('/blog')
  revalidatePath('/following')
  revalidatePath('/for-you')
}

/* =========================================================
   UPDATE ARTICLE
========================================================= */

export const updateArticle = async (formData: FormData) => {
  const id = formData.get('id') as string

  const title = (formData.get('title') as string)?.trim()
  const short_desc = (formData.get('short_desc') as string)?.trim()
  const long_desc = (formData.get('long_desc') as string)?.trim()
  const categoryId = (formData.get('categoryId') as string)?.trim()

  /*
   * OLD SYSTEM:
   * authorId
   *
   * NEW SYSTEM:
   * userId
   *
   * We support both field names here so your existing admin
   * form does not immediately break.
   */
  const userId =
    (formData.get('userId') as string)?.trim() ||
    (formData.get('authorId') as string)?.trim() ||
    ''

  const tagsStr = (formData.get('tags') as string)?.trim()

  const featured = formData.get('featured') === 'on'
  const mainPost = formData.get('mainPost') === 'on'

  const intent = formData.get('intent') as string

  const isPublished = intent === 'publish'

  const image = formData.get('image') as File | null

  if (!id || !title || !short_desc || !long_desc) {
    throw new Error('Required article information is missing.')
  }

  const words = long_desc.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  const readTime = `${minutes} min read`

  const tags = tagsStr
    ? tagsStr
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    : []

  const slug = createSlug(title)

  let imageUrl: string | undefined

  if (image && image.size > 0) {
    imageUrl = await uploadImage(image, 'education/articles')
  }

  if (mainPost) {
    await prisma.article.updateMany({
      where: {
        mainPost: true,
        id: {
          not: id,
        },
      },
      data: {
        mainPost: false,
      },
    })
  }

  /*
   * Optional topic IDs.
   */
  const topicIds = formData
    .getAll('topicIds')
    .map((topicId) => String(topicId).trim())
    .filter(Boolean)

  /*
   * Update article first.
   */
  await prisma.article.update({
    where: {
      id,
    },

    data: {
      title,
      short_desc,
      long_desc,

      categoryId: categoryId || null,

      /*
       * Only change the creator if a userId/authorId
       * was actually supplied.
       */
      ...(userId
        ? {
            userId,
          }
        : {}),

      featured,
      mainPost,
      readTime,

      published: isPublished,
      status: isPublished ? 'PUBLISHED' : 'PENDING',

      slug,
      tags,

      ...(imageUrl
        ? {
            image: imageUrl,
          }
        : {}),
    },
  })

  if (topicIds.length > 0) {
    await prisma.articleTopic.deleteMany({
      where: {
        articleId: id,
      },
    })

    await prisma.articleTopic.createMany({
      data: topicIds.map((topicId) => ({
        articleId: id,
        topicId,
      })),
    })
  }

  revalidatePath('/control/articles')
  revalidatePath('/blog')
  revalidatePath('/following')
  revalidatePath('/for-you')

  redirect('/control/articles')
}

export const getArticleBySlug = async (slug: string) => {
  return await prisma.article.findUnique({
    where: {
      slug,
    },

    include: {
      category: true,
      reviews: true,

      user: true,

      topics: {
        include: {
          topic: true,
        },
      },
    },
  })
}

export interface ReviewInput {
  name: string
  email: string
  content: string
  rating: number
  articleId: string
}

export const createReview = async (data: ReviewInput) => {
  try {
    const review = await prisma.review.create({
      data: {
        name: data.name,
        email: data.email,
        content: data.content,
        rating: data.rating,
        articleId: data.articleId,
      },
    })

    revalidatePath('/blog/[slug]', 'page')

    return {
      success: true,
      data: review,
    }
  } catch (error) {
    console.error('Review creation error:', error)

    throw new Error('Could not save review')
  }
}

export const getAllReviews = async () => {
  return await prisma.review.findMany({
    orderBy: {
      createdAt: 'desc',
    },

    include: {
      article: true,
    },
  })
}

export const deleteReview = async (formData: FormData) => {
  const reviewId = formData.get('reviewId')

  if (!reviewId || typeof reviewId !== 'string') {
    throw new Error('No Review Id Provided or invalid type')
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  })

  revalidatePath('/control/reviews')
}

/* =========================================================
   ADMIN LOGIN
========================================================= */

export const login = async (formData: FormData) => {
  const email = (formData.get('email') as string)?.trim()

  const password = formData.get('password') as string

  const user = await prisma.admin.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    redirect('/login?error=Invalid credentials')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    redirect('/login?error=Invalid credentials')
  }

  const secret = new TextEncoder().encode(JWT_SECRET)

  const token = await new SignJWT({
    id: user.id,
  })
    .setProtectedHeader({
      alg: 'HS256',
    })
    .setExpirationTime('2h')
    .sign(secret)

  const cookieStore = await cookies()

  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  })

  redirect('/control')
}

export const logout = async () => {
  const cookieStore = await cookies()

  cookieStore.delete('token')

  redirect('/control/login')
}

/* =========================================================
   CREATE FIRST ADMIN
========================================================= */

export async function createFirstAdmin() {
  const isAlreadyAdmin = await prisma.admin.findFirst()

  if (isAlreadyAdmin) {
    throw new Error('Admin already exists.')
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10)

  const admin = await prisma.admin.create({
    data: {
      name: 'Admin',
      email: 'admin@blogify.com',
      password: hashedPassword,
    },
  })

  return admin
}

/* =========================================================
   DASHBOARD
========================================================= */

export const getDashboardStats = async () => {
  const [
    totalArticles,
    totalCategories,
    totalReviews,
    totalAdmins,
    totalUsers,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.category.count(),
    prisma.review.count(),
    prisma.admin.count(),
    prisma.user.count(),
  ])

  return {
    totalArticles,
    totalCategories,
    totalReviews,
    totalAdmins,
    totalUsers,
  }
}

export const getRecentArticles = async () => {
  const published = await prisma.article.findMany({
    where: {
      published: true,
    },

    take: 5,

    orderBy: {
      createdAt: 'desc',
    },

    include: {
      category: true,
      user: true,
    },
  })

  const drafts = await prisma.article.findMany({
    where: {
      published: false,
    },

    take: 5,

    orderBy: {
      createdAt: 'desc',
    },

    include: {
      category: true,
      user: true,
    },
  })

  return {
    published,
    drafts,
  }
}

/* =========================================================
   BLOG HOME DATA
========================================================= */

export const getBlogData = async () => {
  const [heroPost, featuredPosts, latestPosts] = await Promise.all([
    prisma.article.findFirst({
      where: {
        published: true,
        mainPost: true,
      },

      include: {
        category: true,
        user: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    }),

    prisma.article.findMany({
      where: {
        published: true,
        featured: true,
        mainPost: false,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 4,

      include: {
        category: true,
        user: true,
      },
    }),

    prisma.article.findMany({
      where: {
        published: true,
        mainPost: false,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 5,

      include: {
        category: true,
        user: true,
      },
    }),
  ])

  return {
    heroPost,
    featuredPosts,
    latestPosts,
  }
}

/* =========================================================
   BLOG PAGE
========================================================= */

export async function getBlogPageData(searchParams: {
  page?: string
  category?: string
  search?: string
  author?: string
}) {
  const limit = 12

  const page = Math.max(1, Number(searchParams.page) || 1)

  const skip = (page - 1) * limit

  const where: any = {
    published: true,
  }

  if (searchParams.category) {
    where.category = {
      slug: searchParams.category,
    }
  }

  /*
   * `author` query parameter now searches
   * the User who created the article.
   */
  if (searchParams.author) {
    where.user = {
      name: {
        contains: searchParams.author,
        mode: 'insensitive',
      },
    }
  }

  if (searchParams.search) {
    where.OR = [
      {
        title: {
          contains: searchParams.search,
          mode: 'insensitive',
        },
      },

      {
        short_desc: {
          contains: searchParams.search,
          mode: 'insensitive',
        },
      },

      {
        user: {
          name: {
            contains: searchParams.search,
            mode: 'insensitive',
          },
        },
      },

      {
        tags: {
          has: searchParams.search,
        },
      },
    ]
  }

  const [blogs, totalCount, categories] = await Promise.all([
    prisma.article.findMany({
      where,

      skip,
      take: limit,

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        category: true,
        user: true,
        topics: {
          include: {
            topic: true,
          },
        },
      },
    }),

    prisma.article.count({
      where,
    }),

    prisma.category.findMany({
      include: {
        _count: {
          select: {
            articles: {
              where: {
                published: true,
              },
            },
          },
        },
      },
    }),
  ])

  return {
    blogs,

    categories: categories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.title,
      count: cat._count.articles,
      short: cat.short_desc,
      long: cat.long_desc,
    })),

    totalPages: Math.ceil(totalCount / limit),

    currentPage: page,
  }
}

/* =========================================================
   RELATED POSTS
========================================================= */

export async function getRelatedPosts(
  categoryId?: string,
  currentPostId?: string,
  limit: number = 2,
) {
  try {
    const relatedPosts = await prisma.article.findMany({
      where: {
        ...(categoryId
          ? {
              categoryId,
            }
          : {}),

        ...(currentPostId
          ? {
              id: {
                not: currentPostId,
              },
            }
          : {}),

        published: true,
      },

      take: limit,

      orderBy: {
        createdAt: 'desc',
      },

      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        createdAt: true,

        category: {
          select: {
            title: true,
            slug: true,
          },
        },

        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    if (relatedPosts.length === 0) {
      return await prisma.article.findMany({
        where: {
          ...(currentPostId
            ? {
                id: {
                  not: currentPostId,
                },
              }
            : {}),

          published: true,
        },

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          createdAt: true,

          category: {
            select: {
              title: true,
              slug: true,
            },
          },

          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })
    }

    return relatedPosts
  } catch (error) {
    console.error('Error fetching related posts:', error)

    return []
  }
}

/* =========================================================
   USER AUTHENTICATION
========================================================= */

export const registerUser = async (formData: FormData) => {
  const name = (formData.get('name') as string)?.trim()

  const email = (formData.get('email') as string)?.trim().toLowerCase()

  const password = formData.get('password') as string

  const confirmPassword = formData.get('confirmPassword') as string

  if (!name || !email || !password || !confirmPassword) {
    return {
      error: 'All fields are required to join the archive.',
    }
  }

  if (password !== confirmPassword) {
    return {
      error: 'Secrets do not match.',
    }
  }

  if (password.length < 6) {
    return {
      error: 'Secret must be at least 6 characters.',
    }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return {
        error: 'This identity is already cataloged.',
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    const secret = new TextEncoder().encode(JWT_SECRET)

    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
    })
      .setProtectedHeader({
        alg: 'HS256',
      })
      .setExpirationTime('7d')
      .sign(secret)

    const cookieStore = await cookies()

    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
  } catch (err) {
    console.error(err)

    return {
      error: 'The system failed to register your signature.',
    }
  }

  revalidatePath('/')

  redirect('/?status=registered')
}

export const loginUser = async (formData: FormData) => {
  const email = (formData.get('email') as string)?.trim().toLowerCase()

  const password = formData.get('password') as string

  if (!email || !password) {
    return {
      error: 'Identity and secret are required.',
    }
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return {
        error: 'Invalid identity or secret.',
      }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return {
        error: 'Invalid identity or secret.',
      }
    }

    const secret = new TextEncoder().encode(JWT_SECRET)

    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
    })
      .setProtectedHeader({
        alg: 'HS256',
      })
      .setExpirationTime('7d')
      .sign(secret)

    const cookieStore = await cookies()

    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
  } catch (err) {
    console.error(err)

    return {
      error: 'Authentication protocol failed.',
    }
  }

  revalidatePath('/')

  redirect('/')
}

export const logoutUser = async () => {
  const cookieStore = await cookies()

  cookieStore.delete('auth_token')

  revalidatePath('/')

  redirect('/')
}

/* =========================================================
   CURRENT USER
========================================================= */

export const getCurrentUser = async () => {
  const cookieStore = await cookies()

  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return null
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET)

    const { payload } = await jwtVerify(token, secret)

    const userId = payload.userId as string

    if (!userId) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      include: {
        _count: {
          select: {
            likes: true,
            citations: true,
            articles: true,
            followers: true,
            following: true,
            topicFollows: true,
          },
        },

        articles: true,
      },
    })

    return user
  } catch (error) {
    console.error('getCurrentUser error:', error)

    return null
  }
}

export const getUserById = async (userId: string) => {
  if (!userId) {
    return null
  }

  return await prisma.user.findUnique({
    where: {
      id: userId,
    },

    include: {
      _count: {
        select: {
          articles: true,
          followers: true,
          following: true,
          likes: true,
        },
      },
    },
  })
}

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  })
}

export const updateProfile = async (formData: FormData) => {
  const currentUser = await getCurrentUser()
  const name = (formData.get('name') as string)?.trim()
  const image = formData.get('image') as File | null

  if (!currentUser) redirect('/login')
  if (!name) throw new Error('Your name is required.')

  let imageUrl: string | undefined
  if (image && image.size > 0) imageUrl = await uploadImage(image, 'authors')

  await prisma.user.update({
    where: { id: currentUser.id },
    data: { name, ...(imageUrl ? { image: imageUrl } : {}) },
  })

  revalidatePath('/profile')
  revalidatePath(`/profile/${currentUser.id}`)
  redirect('/profile?updated=1')
}

/* =========================================================
   FOLLOW USER
========================================================= */

/**
 * Follow another user.
 *
 * currentUser -> targetUser
 */
export const followUser = async (targetUserId: string) => {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return {
        error: 'You must be logged in to follow users.',
      }
    }

    if (!targetUserId) {
      return {
        error: 'User ID is required.',
      }
    }

    if (currentUser.id === targetUserId) {
      return {
        error: 'You cannot follow yourself.',
      }
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
    })

    if (!targetUser) {
      return {
        error: 'User not found.',
      }
    }

    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      },
    })

    if (existingFollow) {
      return {
        success: true,
        following: true,
      }
    }

    await prisma.userFollow.create({
      data: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    })

    revalidatePath('/profile')
    revalidatePath(`/profile/${targetUserId}`)
    revalidatePath('/following')
    revalidatePath('/for-you')

    return {
      success: true,
      following: true,
    }
  } catch (error) {
    console.error('Follow user error:', error)

    return {
      error: 'Failed to follow this user.',
    }
  }
}

/* =========================================================
   UNFOLLOW USER
========================================================= */

export const unfollowUser = async (targetUserId: string) => {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return {
        error: 'You must be logged in to unfollow users.',
      }
    }

    if (!targetUserId) {
      return {
        error: 'User ID is required.',
      }
    }

    await prisma.userFollow.deleteMany({
      where: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    })

    revalidatePath('/profile')
    revalidatePath(`/profile/${targetUserId}`)
    revalidatePath('/following')
    revalidatePath('/for-you')

    return {
      success: true,
      following: false,
    }
  } catch (error) {
    console.error('Unfollow user error:', error)

    return {
      error: 'Failed to unfollow this user.',
    }
  }
}

/* =========================================================
   TOGGLE USER FOLLOW
========================================================= */

export const toggleFollowUser = async (targetUserId: string) => {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return {
        error: 'You must be logged in to follow users.',
      }
    }

    if (!targetUserId) {
      return {
        error: 'User ID is required.',
      }
    }

    if (currentUser.id === targetUserId) {
      return {
        error: 'You cannot follow yourself.',
      }
    }

    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      },
    })

    if (existingFollow) {
      await prisma.userFollow.delete({
        where: {
          id: existingFollow.id,
        },
      })

      revalidatePath('/profile')
      revalidatePath(`/profile/${targetUserId}`)
      revalidatePath('/following')
      revalidatePath('/for-you')

      return {
        success: true,
        following: false,
      }
    }

    await prisma.userFollow.create({
      data: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    })

    revalidatePath('/profile')
    revalidatePath(`/profile/${targetUserId}`)
    revalidatePath('/following')
    revalidatePath('/for-you')

    return {
      success: true,
      following: true,
    }
  } catch (error) {
    console.error('Toggle follow error:', error)

    return {
      error: 'Failed to update follow status.',
    }
  }
}

/* =========================================================
   CHECK FOLLOWING
========================================================= */

export async function isFollowingUser(followingId: string) {
  const user = await getCurrentUser()

  if (!user?.id) return false

  const follow = await prisma.userFollow.findUnique({
    where: {
      followerId_followingId: {
        followerId: user.id,
        followingId,
      },
    },
  })

  return !!follow
}

/* =========================================================
   FOLLOWER / FOLLOWING COUNTS
========================================================= */

export const getFollowerCount = async (userId: string) => {
  if (!userId) {
    return 0
  }

  return await prisma.userFollow.count({
    where: {
      followingId: userId,
    },
  })
}

export const getFollowingCount = async (userId: string) => {
  if (!userId) {
    return 0
  }

  return await prisma.userFollow.count({
    where: {
      followerId: userId,
    },
  })
}

/* =========================================================
   GET FOLLOWERS
========================================================= */

export const getFollowers = async (userId: string) => {
  if (!userId) {
    return []
  }

  const follows = await prisma.userFollow.findMany({
    where: {
      followingId: userId,
    },

    orderBy: {
      createdAt: 'desc',
    },

    include: {
      follower: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      },
    },
  })

  return follows.map((follow) => follow.follower)
}

/* =========================================================
   GET FOLLOWING
========================================================= */

export const getFollowing = async (userId: string) => {
  if (!userId) {
    return []
  }

  const follows = await prisma.userFollow.findMany({
    where: {
      followerId: userId,
    },

    orderBy: {
      createdAt: 'desc',
    },

    include: {
      following: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      },
    },
  })

  return follows.map((follow) => follow.following)
}

/* =========================================================
   FOLLOWING FEED
========================================================= */

/**
 * Gets articles from users that the current
 * logged-in user follows.
 */
export async function getFollowingFeed() {
  const user = await getCurrentUser()

  if (!user?.id) {
    return []
  }

  const following = await prisma.userFollow.findMany({
    where: {
      followerId: user.id,
    },
    select: {
      followingId: true,
    },
  })

  const followingIds = following.map((item) => item.followingId)

  if (followingIds.length === 0) {
    return []
  }

  return await prisma.article.findMany({
    where: {
      published: true,
      userId: {
        in: followingIds,
      },
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },

      category: true,

      topics: {
        include: {
          topic: true,
        },
      },

      _count: {
        select: {
          likes: true,
          reviews: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },

    take: 30,
  })
}

/* =========================================================
   TOPICS
========================================================= */

export const getAllTopics = async () => {
  return await prisma.topic.findMany({
    orderBy: {
      name: 'asc',
    },

    include: {
      _count: {
        select: {
          followers: true,
          articles: true,
        },
      },
    },
  })
}

export const getTopicBySlug = async (slug: string) => {
  return await prisma.topic.findUnique({
    where: {
      slug,
    },

    include: {
      articles: {
        include: {
          article: {
            include: {
              user: true,
              category: true,
            },
          },
        },
      },

      _count: {
        select: {
          followers: true,
        },
      },
    },
  })
}

/* =========================================================
   CREATE TOPIC
========================================================= */

export const createTopic = async (formData: FormData) => {
  const name = (formData.get('name') as string)?.trim()

  if (!name) {
    return {
      error: 'Topic name is required.',
    }
  }

  const slug = createSlug(name)

  try {
    const existingTopic = await prisma.topic.findUnique({
      where: {
        slug,
      },
    })

    if (existingTopic) {
      return {
        error: 'This topic already exists.',
      }
    }

    const topic = await prisma.topic.create({
      data: {
        name,
        slug,
      },
    })

    revalidatePath('/topics')

    return {
      success: true,
      topic,
    }
  } catch (error) {
    console.error('Create topic error:', error)

    return {
      error: 'Failed to create topic.',
    }
  }
}

/* =========================================================
   FOLLOW TOPIC
========================================================= */

export const followTopic = async (topicId: string) => {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return {
        error: 'You must be logged in to follow topics.',
      }
    }

    if (!topicId) {
      return {
        error: 'Topic ID is required.',
      }
    }

    const topic = await prisma.topic.findUnique({
      where: {
        id: topicId,
      },
    })

    if (!topic) {
      return {
        error: 'Topic not found.',
      }
    }

    const existing = await prisma.userTopic.findUnique({
      where: {
        userId_topicId: {
          userId: currentUser.id,
          topicId,
        },
      },
    })

    if (existing) {
      return {
        success: true,
        following: true,
      }
    }

    await prisma.userTopic.create({
      data: {
        userId: currentUser.id,
        topicId,
      },
    })

    revalidatePath('/topics')
    revalidatePath('/following')
    revalidatePath('/for-you')

    return {
      success: true,
      following: true,
    }
  } catch (error) {
    console.error('Follow topic error:', error)

    return {
      error: 'Failed to follow this topic.',
    }
  }
}

/* =========================================================
   UNFOLLOW TOPIC
========================================================= */

export const unfollowTopic = async (topicId: string) => {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return {
        error: 'You must be logged in to unfollow topics.',
      }
    }

    if (!topicId) {
      return {
        error: 'Topic ID is required.',
      }
    }

    await prisma.userTopic.deleteMany({
      where: {
        userId: currentUser.id,
        topicId,
      },
    })

    revalidatePath('/topics')
    revalidatePath('/following')
    revalidatePath('/for-you')

    return {
      success: true,
      following: false,
    }
  } catch (error) {
    console.error('Unfollow topic error:', error)

    return {
      error: 'Failed to unfollow this topic.',
    }
  }
}

export async function toggleFollowTopic(topicId: string) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return {
        success: false,
        message: 'Please log in to follow topics.',
      }
    }

    const existing = await prisma.userTopic.findUnique({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId,
        },
      },
    })

    if (existing) {
      await prisma.userTopic.delete({ where: { id: existing.id } })
    } else {
      await prisma.userTopic.create({
        data: { userId: user.id, topicId },
      })
    }

    revalidatePath('/topics')
    revalidatePath('/following')
    revalidatePath('/for-you')

    return {
      success: true,
      following: !existing,
    }
  } catch (error) {
    console.error('Toggle topic follow error:', error)
    return {
      success: false,
      error: 'Failed to update this topic.',
    }
  }
}

/* =========================================================
   CHECK TOPIC FOLLOW
========================================================= */

export async function isFollowingTopic(topicId: string) {
  const user = await getCurrentUser()

  if (!user?.id) {
    return false
  }

  const follow = await prisma.userTopic.findUnique({
    where: {
      userId_topicId: {
        userId: user.id,
        topicId: topicId,
      },
    },
  })

  return !!follow
}
/* =========================================================
   USER'S FOLLOWED TOPICS
========================================================= */

export const getUserTopics = async (userId?: string) => {
  const targetUserId = userId || (await getCurrentUser())?.id

  if (!targetUserId) {
    return []
  }

  const follows = await prisma.userTopic.findMany({
    where: {
      userId: targetUserId,
    },

    orderBy: {
      createdAt: 'desc',
    },

    include: {
      topic: true,
    },
  })

  return follows.map((follow) => follow.topic)
}

/* =========================================================
   TOPIC FEED
========================================================= */

export async function getTopicFeed(topicId: string) {
  const articles = await prisma.article.findMany({
    where: {
      published: true,
      topics: {
        some: {
          topicId: topicId,
        },
      },
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },

      category: true,

      topics: {
        include: {
          topic: true,
        },
      },

      _count: {
        select: {
          likes: true,
          reviews: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },

    take: 30,
  })

  return articles
}

/* =========================================================
   FOR YOU FEED
========================================================= */

/**
 * Initial personalized feed.
 *
 * Combines:
 *
 * 1. Articles from followed users
 * 2. Articles from followed topics
 * 3. Recent popular/published articles as fallback
 *
 * This is intentionally simple for the first version.
 * Later we can rank it using views, likes, read time,
 * scroll depth and impressions.
 */
export async function getForYouFeed() {
  const user = await getCurrentUser()

  const where: any = {
    published: true,
  }

  if (user?.id) {
    const following = await prisma.userFollow.findMany({
      where: {
        followerId: user.id,
      },
      select: {
        followingId: true,
      },
    })

    const topicFollows = await prisma.userTopic.findMany({
      where: {
        userId: user.id,
      },
      select: {
        topicId: true,
      },
    })

    const followingIds = following.map((item) => item.followingId)

    const topicIds = topicFollows.map((item) => item.topicId)

    const personalizedConditions: any[] = []

    if (followingIds.length > 0) {
      personalizedConditions.push({
        userId: {
          in: followingIds,
        },
      })
    }

    if (topicIds.length > 0) {
      personalizedConditions.push({
        topics: {
          some: {
            topicId: {
              in: topicIds,
            },
          },
        },
      })
    }

    if (personalizedConditions.length > 0) {
      where.OR = personalizedConditions
    }
  }

  const articles = await prisma.article.findMany({
    where,

    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },

      category: true,

      topics: {
        include: {
          topic: true,
        },
      },

      _count: {
        select: {
          likes: true,
          reviews: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },

    take: 20,
  })

  return articles
}

export const toggleLike = async (articleId: string) => {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: 'Authorization required to record preference.',
      }
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        articleId_userId: {
          articleId,
          userId: user.id,
        },
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })
    } else {
      await prisma.like.create({
        data: {
          articleId,
          userId: user.id,
        },
      })
    }

    revalidatePath('/blog/[slug]', 'page')
    revalidatePath('/for-you')
    revalidatePath('/library/liked')

    return {
      success: true,
      liked: !existingLike,
    }
  } catch (error) {
    console.error('Like toggle error:', error)

    return {
      error: 'Failed to update system logs.',
    }
  }
}

export const getArticleLikes = async (articleId: string) => {
  return await prisma.like.count({
    where: {
      articleId,
    },
  })
}

export const isArticleLikedByUser = async (articleId: string) => {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  const like = await prisma.like.findUnique({
    where: {
      articleId_userId: {
        articleId,
        userId: user.id,
      },
    },
  })

  return !!like
}

export const toggleSavedArticle = async (articleId: string) => {
  try {
    const user = await getCurrentUser()
    if (!user) return { error: 'You must be logged in to save articles.' }

    const existing = await prisma.savedArticle.findUnique({
      where: { articleId_userId: { articleId, userId: user.id } },
    })

    if (existing) {
      await prisma.savedArticle.delete({ where: { id: existing.id } })
    } else {
      await prisma.savedArticle.create({ data: { articleId, userId: user.id } })
    }

    revalidatePath('/library')
    return { success: true, saved: !existing }
  } catch (error) {
    console.error('Save toggle error:', error)
    return { error: 'Failed to update saved articles.' }
  }
}

export const isArticleSavedByUser = async (articleId: string) => {
  const user = await getCurrentUser()
  if (!user) return false

  const saved = await prisma.savedArticle.findUnique({
    where: { articleId_userId: { articleId, userId: user.id } },
  })

  return !!saved
}

export const addCitation = async (articleId: string, format: string) => {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: 'Authentication required to log citation.',
      }
    }

    await prisma.citation.create({
      data: {
        articleId,
        userId: user.id,
        format,
      },
    })

    revalidatePath('/blog/[slug]', 'page')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Citation error:', error)

    return {
      error: 'The citation registry is currently unavailable.',
    }
  }
}

export const getCitationFormat = async (
  articleId: string,
  format: string,
): Promise<string> => {
  const article = await prisma.article.findUnique({
    where: {
      id: articleId,
    },

    include: {
      user: true,
    },
  })

  if (!article) {
    return ''
  }

  const authorName = article.user?.name || 'Anonymous'

  const year = article.createdAt.getFullYear()

  const fullDate = article.createdAt.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://blogifyguides.vercel.app'

  const url = `${baseUrl}/blog/${article.slug}`

  switch (format) {
    case 'APA':
      return `${authorName}. (${year}). ${article.title}. Retrieved from ${url}`

    case 'MLA':
      return `${authorName}. "${article.title}." Journal Archive, ${fullDate}, ${url}.`

    case 'Chicago':
      return `${authorName}. "${article.title}." Accessed ${fullDate}. ${url}.`

    case 'Harvard':
      return `${authorName}, ${year}. '${article.title}', Journal Archive. [online] Available at: ${url} [Accessed ${fullDate}].`

    default:
      return ''
  }
}

export const subscribeToNewsletter = async (formData: FormData) => {
  const email = (formData.get('email') as string)?.trim().toLowerCase()

  if (!email) {
    throw new Error('Email is required')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format')
  }

  const existingSubscription = await prisma.subscription.findUnique({
    where: {
      email,
    },
  })

  if (existingSubscription) {
    throw new Error('Email already subscribed')
  }

  await prisma.subscription.create({
    data: {
      email,
    },
  })

  return {
    success: true,
  }
}

export const sendMessage = async (formData: FormData) => {
  const name = (formData.get('name') as string)?.trim()

  const email = (formData.get('email') as string)?.trim()

  const message = (formData.get('message') as string)?.trim()

  if (!name || !email || !message) {
    throw new Error('All Fields are required!')
  }

  await prisma.contact.create({
    data: {
      name,
      email,
      message,
    },
  })

  revalidatePath('/contact')

  redirect('/contact?success=true')
}

export const getContacts = async () => {
  return await prisma.contact.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const deleteContact = async (formData: FormData) => {
  const id = formData.get('id') as string

  if (!id) {
    throw new Error('Contact ID is required.')
  }

  await prisma.contact.delete({
    where: {
      id,
    },
  })

  revalidatePath('/control/contacts')
}

export const sendEmailReply = async (formData: FormData) => {
  const email = formData.get('email') as string

  const message = formData.get('message') as string

  console.log(`Sending email to ${email}: ${message}`)

  return {
    success: true,
  }
}

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    include: {
      articles: true,

      _count: {
        select: {
          articles: true,
          likes: true,
          citations: true,
          followers: true,
          following: true,
          topicFollows: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const getAllAuthors = async () => {
  return await getAllUsers()
}

export const getAuthor = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  })

  return user
    ? ({
        ...user,
        bio: null,
      } as typeof user & { bio?: string | null })
    : null
}

export const createAuthor = async (formData: FormData) => {
  const name = (formData.get('name') as string)?.trim()
  const bio = (formData.get('bio') as string)?.trim()
  const image = formData.get('image') as File | null

  if (!name) {
    throw new Error('Author name is required.')
  }

  let imageUrl: string | null = null

  if (image && image.size > 0) {
    imageUrl = await uploadImage(image, 'authors')
  }

  const email = `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`
  const password = 'temporary-password'

  await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      image: imageUrl,
    },
  })

  revalidatePath('/control/author')
  redirect('/control/author')
}

export const updateAuthor = async (formData: FormData) => {
  const id = (formData.get('id') as string)?.trim()
  const name = (formData.get('name') as string)?.trim()
  const bio = (formData.get('bio') as string)?.trim()
  const image = formData.get('image') as File | null

  if (!id || !name) {
    throw new Error('Author ID and name are required.')
  }

  let imageUrl: string | undefined

  if (image && image.size > 0) {
    imageUrl = await uploadImage(image, 'authors')
  }

  await prisma.user.update({
    where: { id },
    data: {
      name,
      ...(imageUrl ? { image: imageUrl } : {}),
    },
  })

  revalidatePath('/control/author')
  redirect('/control/author')
}

export const getUserArticles = async (userId: string) => {
  if (!userId) {
    return []
  }

  return await prisma.article.findMany({
    where: {
      userId,
      published: true,
    },

    orderBy: {
      createdAt: 'desc',
    },

    include: {
      category: true,

      user: true,

      topics: {
        include: {
          topic: true,
        },
      },
    },
  })
}

export const getUserProfileData = async (userId: string) => {
  if (!userId) {
    return null
  }

  const [user, articles, followersCount, followingCount] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    }),

    prisma.article.findMany({
      where: {
        userId,
        published: true,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        category: true,
        user: true,

        topics: {
          include: {
            topic: true,
          },
        },
      },
    }),

    prisma.userFollow.count({
      where: {
        followingId: userId,
      },
    }),

    prisma.userFollow.count({
      where: {
        followerId: userId,
      },
    }),
  ])

  if (!user) {
    return null
  }

  const currentUser = await getCurrentUser()

  let isFollowing = false

  if (currentUser && currentUser.id !== userId) {
    isFollowing = await isFollowingUser(userId)
  }

  return {
    user,
    articles,
    followersCount,
    followingCount,
    isFollowing,
  }
}

export async function getLatestArticles() {
  return await prisma.article.findMany({
    where: {
      published: true,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },

      category: true,

      topics: {
        include: {
          topic: true,
        },
      },

      _count: {
        select: {
          likes: true,
          reviews: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },

    take: 30,
  })
}

export async function getLibraryArticles() {
  const user = await getCurrentUser()

  if (!user?.id) {
    return []
  }

  const articles = await prisma.article.findMany({
    where: {
      published: true,

      savedArticles: {
        some: {
          userId: user.id,
        },
      },
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },

      category: true,

      topics: {
        include: {
          topic: true,
        },
      },

      _count: {
        select: {
          likes: true,
          reviews: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },

    take: 50,
  })

  return articles
}

export async function getLikedArticles() {
  const user = await getCurrentUser()

  if (!user?.id) {
    return []
  }

  const articles = await prisma.article.findMany({
    where: {
      published: true,
      likes: {
        some: {
          userId: user.id,
        },
      },
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },

      category: true,

      topics: {
        include: {
          topic: true,
        },
      },

      _count: {
        select: {
          likes: true,
          reviews: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },

    take: 50,
  })

  return articles
}

export async function getMyProfile() {
  const user = await getCurrentUser()

  if (!user?.id) {
    return null
  }

  const profile = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,

      _count: {
        select: {
          articles: true,
          followers: true,
          following: true,
          topicFollows: true,
          likes: true,
        },
      },

      articles: {
        where: {
          published: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 30,

        include: {
          category: true,

          topics: {
            include: {
              topic: true,
            },
          },

          _count: {
            select: {
              likes: true,
              reviews: true,
            },
          },
        },
      },
    },
  })

  return profile
}

export async function getLandingPageArticles() {
  return await prisma.article.findMany({
    where: {
      published: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },

      category: true,

      topics: {
        include: {
          topic: true,
        },
      },

      _count: {
        select: {
          likes: true,
          reviews: true,
        },
      },
    },

    orderBy: [
      {
        featured: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],

    take: 6,
  })
}

export async function getLandingPageTopics() {
  return await prisma.topic.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 6,
    select: {
      id: true,
      name: true,
      slug: true,

      _count: {
        select: {
          followers: true,
          articles: true,
        },
      },
    },
  })
}

export async function getPublicProfile(userId: string) {
  try {
    if (!userId) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,

        _count: {
          select: {
            articles: true,
            followers: true,
            following: true,
            topicFollows: true,
          },
        },

        articles: {
          where: {
            published: true,
          },

          orderBy: {
            createdAt: 'desc',
          },

          take: 30,

          include: {
            category: true,

            topics: {
              include: {
                topic: true,
              },
            },

            _count: {
              select: {
                likes: true,
                reviews: true,
              },
            },
          },
        },
      },
    })

    return user
  } catch (error) {
    console.error('getPublicProfile error:', error)
    return null
  }
}
