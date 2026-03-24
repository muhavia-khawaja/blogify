'use server'

import prisma from '@/prisma/script'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export const createCategory = async (formData: FormData) => {
  const title = formData.get('title') as string
  const short_desc = formData.get('short_desc') as string
  const long_desc = formData.get('long_desc') as string
  const image = formData.get('image') as File

  let imageUrl = ''

  if (image && image.size > 0) {
    try {
      const imageBuffer = await image.arrayBuffer()
      const imageBuff = Buffer.from(imageBuffer)

      const imageResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'geology/categories',
              resource_type: 'image',
            },
            (error, result) => {
              if (error || !result) {
                return reject(error || new Error('Upload failed'))
              }
              resolve(result)
            },
          )
          stream.end(imageBuff)
        },
      )
      imageUrl = imageResult.secure_url
    } catch (error) {
      console.error('Cloudinary Error:', error)
    }
  }

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  await prisma.category.create({
    data: { title, short_desc, long_desc, slug, image: imageUrl },
  })

  revalidatePath('/control/categories')
  redirect('/control/categories?success=true')
}

export const getCategoryBySlug = async (slug: string) => {
  return await prisma.category.findUnique({
    where: { slug },
  })
}

export const updateCategory = async (formData: FormData) => {
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const short_desc = formData.get('short_desc') as string
  const long_desc = formData.get('long_desc') as string
  const image = formData.get('image') as File | null

  const newSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')

  let imageUrl = undefined

  if (image && image.size > 0) {
    const imageBuffer = await image.arrayBuffer()
    const imageBuff = Buffer.from(imageBuffer)
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'geology/categories' },
        (err, res) => (err ? reject(err) : resolve(res!)),
      )
      stream.end(imageBuff)
    })
    imageUrl = result.secure_url
  }

  await prisma.category.update({
    where: { id },
    data: {
      title,
      short_desc,
      long_desc,
      slug: newSlug,
      ...(imageUrl && { image: imageUrl }),
    },
  })

  revalidatePath('/control/categories')
  redirect('/control/categories')
}

export const deleteCategory = async (formData: FormData) => {
  const id = formData.get('id') as string

  try {
    await prisma.category.delete({
      where: { id },
    })

    revalidatePath('/control/categories')
  } catch (error) {
    console.error('Delete Error:', error)
  }
}

export const getAllArticles = async (query?: string) => {
  return await prisma.article.findMany({
    where: query
      ? {
          title: { contains: query, mode: 'insensitive' },
        }
      : {},
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
}

export const createArticle = async (formData: FormData) => {
  const title = formData.get('title') as string
  const short_desc = formData.get('short_desc') as string
  const long_desc = formData.get('long_desc') as string
  const categoryId = formData.get('categoryId') as string
  const authorId = formData.get('authorId') as string
  const tagsStr = formData.get('tags') as string

  const featured = formData.get('featured') === 'on'
  const mainPost = formData.get('mainPost') === 'on'

  const intent = formData.get('intent') as string
  const published = intent === 'publish'

  const image = formData.get('image') as File

  const words = long_desc.split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  const readTime = `${minutes} min read`

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()) : []

  let imageUrl = ''
  if (image && image.size > 0) {
    const imageBuffer = await image.arrayBuffer()
    const imageBuff = Buffer.from(imageBuffer)

    const imageResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'geology/articles',
            resource_type: 'image',
          },
          (error, result) => {
            if (error || !result)
              return reject(error || new Error('Upload failed'))
            resolve(result)
          },
        )
        stream.end(imageBuff)
      },
    )
    imageUrl = imageResult.secure_url
  }

  await prisma.article.create({
    data: {
      title,
      short_desc,
      long_desc,
      categoryId: categoryId || null,
      authorId: authorId || null,
      featured,
      mainPost,
      published,
      image: imageUrl,
      tags,
      slug,
      readTime,
    },
  })

  revalidatePath('/control/articles')
  revalidatePath('/blog')
  redirect('/control/articles?success=true')
}
export const deleteArticle = async (formData: FormData) => {
  const id = formData.get('id') as string
  await prisma.article.delete({ where: { id } })
  revalidatePath('/control/articles')
}

export const updateArticle = async (formData: FormData) => {
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const short_desc = formData.get('short_desc') as string
  const long_desc = formData.get('long_desc') as string
  const categoryId = formData.get('categoryId') as string
  const authorId = formData.get('authorId') as string
  const tagsStr = formData.get('tags') as string

  const featured = formData.get('featured') === 'on'
  const mainPost = formData.get('mainPost') === 'on'

  const intent = formData.get('intent') as string
  const isPublished = intent === 'publish'
  const image = formData.get('image') as File | null

  const words = long_desc.split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  const readTime = `${minutes} min read`

  const tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()) : []
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')

  let imageUrl = undefined

  if (image && image.size > 0) {
    const imageBuffer = await image.arrayBuffer()
    const imageBuff = Buffer.from(imageBuffer)
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'geology/articles' },
        (err, res) => (err ? reject(err) : resolve(res!)),
      )
      stream.end(imageBuff)
    })
    imageUrl = result.secure_url
  }

  if (mainPost) {
    await prisma.article.updateMany({
      where: { mainPost: true, id: { not: id } },
      data: { mainPost: false },
    })
  }

  await prisma.article.update({
    where: { id },
    data: {
      title,
      short_desc,
      long_desc,
      categoryId: categoryId || null,
      authorId: authorId || null,
      featured,
      mainPost,
      readTime,
      published: isPublished,
      slug,
      tags,
      ...(imageUrl && { image: imageUrl }),
    },
  })

  revalidatePath('/control/articles')
  revalidatePath('/blog')
  redirect('/control/articles')
}

export const getArticleBySlug = async (slug: string) => {
  return await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: true,
      author: true,
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

    revalidatePath(`/blog/[slug]`, 'page')

    return { success: true, data: review }
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

export const login = async (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await prisma.admin.findUnique({ where: { email } })
  if (!user) redirect('/login?error=Invalid credentials')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) redirect('/login?error=Invalid credentials')

  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const token = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(secret)

  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })

  redirect('/control')
}

export const logout = async () => {
  cookies().delete('token')
  redirect('/control/login')
}

export async function createFirstAdmin() {
  const isAlreadyAdmin = await prisma.admin.findFirst()

  if (isAlreadyAdmin) {
    throw new Error('Admin ALready exists.')
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

export const getDashboardStats = async () => {
  const [totalArticles, totalCategories, totalReviews, totalAdmins] =
    await Promise.all([
      prisma.article.count(),
      prisma.category.count(),
      prisma.review.count(),
      prisma.admin.count(),
    ])
  return { totalArticles, totalCategories, totalReviews, totalAdmins }
}

export const getRecentArticles = async () => {
  const published = await prisma.article.findMany({
    where: { published: true },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })

  const drafts = await prisma.article.findMany({
    where: { published: false },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })

  return { published, drafts }
}

export const getBlogData = async () => {
  const [heroPost, featuredPosts, latestPosts] = await Promise.all([
    prisma.article.findFirst({
      where: {
        published: true,
        mainPost: true,
      },
      include: { category: true, author: true },
      orderBy: { createdAt: 'desc' },
    }),

    prisma.article.findMany({
      where: {
        published: true,
        featured: true,
        mainPost: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: { category: true, author: true },
    }),

    prisma.article.findMany({
      where: {
        published: true,
        mainPost: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { category: true, author: true },
    }),
  ])

  return { heroPost, featuredPosts, latestPosts }
}

export async function getBlogPageData(searchParams: {
  page?: string
  category?: string
  search?: string
  author?: string
}) {
  const limit = 12
  const page = Number(searchParams.page) || 1
  const skip = (page - 1) * limit

  const where: any = {
    published: true,
  }

  if (searchParams.category) {
    where.category = {
      slug: searchParams.category,
    }
  }

  if (searchParams.author) {
    where.author = {
      name: { contains: searchParams.author, mode: 'insensitive' },
    }
  }

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { short_desc: { contains: searchParams.search, mode: 'insensitive' } },
      {
        author: {
          name: { contains: searchParams.search, mode: 'insensitive' },
        },
      },
    ]
  }

  const [blogs, totalCount, categories] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true, author: true },
    }),
    prisma.article.count({ where }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { published: true } } },
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

export async function getRelatedPosts(
  categoryId?: string,
  currentPostId?: string,
  limit: number = 2,
) {
  try {
    const relatedPosts = await prisma.article.findMany({
      where: {
        categoryId: categoryId,
        id: { not: currentPostId },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        createdAt: true,
        category: { select: { title: true, slug: true } },
      },
    })

    if (relatedPosts.length === 0) {
      return await prisma.article.findMany({
        where: {
          id: { not: currentPostId },
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          createdAt: true,
          category: { select: { title: true, slug: true } },
        },
      })
    }

    return relatedPosts
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

export const createAuthor = async (formData: FormData) => {
  const name = formData.get('name') as string
  const bio = formData.get('bio') as string
  const image = formData.get('image') as File

  let imageUrl = undefined

  if (image && image.size > 0) {
    const imageBuffer = await image.arrayBuffer()
    const imageBuff = Buffer.from(imageBuffer)
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'geology/categories' },
        (err, res) => (err ? reject(err) : resolve(res!)),
      )
      stream.end(imageBuff)
    })
    imageUrl = result.secure_url
  }
  try {
    await prisma.author.create({
      data: {
        name,
        bio,
        image: imageUrl,
      },
    })
  } catch (error) {
    console.error('Failed to create author:', error)
    return
  }

  revalidatePath('/control/author')
  revalidatePath('/blog')

  redirect('/control/author')
}

export const getAllAuthors = async () => {
  try {
    const authors = await prisma.author.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return authors
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getAuthor = async (id: string) => {
  return await prisma.author.findUnique({
    where: {
      id,
    },
  })
}

export const updateAuthor = async (formData: FormData) => {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const bio = formData.get('bio') as string
  const image = formData.get('image') as File | null

  let imageUrl = undefined

  if (image && image.size > 0) {
    const imageBuffer = await image.arrayBuffer()
    const imageBuff = Buffer.from(imageBuffer)

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'geology/authors',
          transformation: [{ width: 400, height: 400, crop: 'fill' }],
        },
        (err, res) => (err ? reject(err) : resolve(res!)),
      )
      stream.end(imageBuff)
    })
    imageUrl = result.secure_url
  }

  await prisma.author.update({
    where: { id },
    data: {
      name,
      bio,
      ...(imageUrl && { image: imageUrl }),
    },
  })

  revalidatePath('/control/author')
  revalidatePath('/blog')
  redirect('/control/author')
}

export const sendMessage = async (formData: FormData) => {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  if (!name || !email || !message) {
    throw new Error('All Fields are required!')
  }

  // await prisma

  revalidatePath('/contact')
  redirect('"/contact?success="true"')
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
