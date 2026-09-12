import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { v2 as cloudinary } from 'cloudinary'
import prisma from '@/prisma/script'

export const runtime = 'nodejs'
export const maxDuration = 120

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface RequestBody {
  articleId?: string
}

function uploadToCloudinary(
  buffer: Buffer,
  publicId: string,
): Promise<{
  secure_url: string
  public_id: string
}> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'education/articles',
        public_id: publicId,
        resource_type: 'image',
        format: 'png',
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }

        if (!result?.secure_url) {
          reject(new Error('Cloudinary did not return an image URL'))
          return
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        })
      },
    )

    stream.end(buffer)
  })
}

function cleanText(value: string | null | undefined, maxLength: number) {
  if (!value) return ''

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

function createPublicId(title: string, articleId: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

  return `${slug || 'article'}-${articleId}`
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'OPENAI_API_KEY is not configured.',
        },
        { status: 500 },
      )
    }

    if (
      !process.env.CLOUDINARY_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cloudinary environment variables are not configured.',
        },
        { status: 500 },
      )
    }

    const body = (await request.json()) as RequestBody

    const articleId = body.articleId?.trim()

    if (!articleId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Article ID is required.',
        },
        { status: 400 },
      )
    }

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
      select: {
        id: true,
        title: true,
        short_desc: true,
        long_desc: true,
        tags: true,
        image: true,
        category: {
          select: {
            title: true,
          },
        },
      },
    })

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: 'Article not found.',
        },
        { status: 404 },
      )
    }

    const title = cleanText(article.title, 200)

    const shortDescription = cleanText(article.short_desc, 500)

    const content = cleanText(article.long_desc, 1500)

    const category = cleanText(article.category?.title, 100)

    const tags = Array.isArray(article.tags)
      ? article.tags
          .map((tag) => cleanText(tag, 50))
          .filter(Boolean)
          .slice(0, 10)
          .join(', ')
      : ''

    const prompt = `
Create a premium editorial featured image for an educational blog article.

Website:
Education With Hamza

Article title:
"${title}"

Category:
"${category || 'Education'}"

Short description:
"${shortDescription}"

Relevant article content:
"${content}"

Tags:
"${tags}"

IMAGE REQUIREMENTS:

- Create a professional editorial/blog hero image.
- The image must visually represent the article topic.
- Suitable for Pakistani students and education readers.
- Modern, clean and premium educational website aesthetic.
- Wide landscape composition.
- Strong visual hierarchy.
- Professional lighting.
- High-quality realistic or polished editorial illustration depending on the topic.
- Use relevant educational objects, environments, diagrams, books, classroom elements, technology or subject-specific visual elements when appropriate.
- Make the main subject visually clear.
- Leave some clean negative space so the image works well as a website hero image.
- Use a sophisticated colour palette.
- Do NOT include people unless they are genuinely useful for representing the topic.
- Do NOT include logos.
- Do NOT include brand names.
- Do NOT include watermarks.
- Do NOT include website URLs.
- Do NOT include fake UI screenshots.
- Do NOT include random text.
- Do NOT put the article title as text on the image.
- Do NOT create a poster.
- Do NOT create an advertisement.
- Do NOT create a book cover.

The final result should look like a professionally designed featured image for a high-quality education website.
`

    const imageResponse = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: '1536x1024',
      quality: 'medium',
      output_format: 'png',
    })

    const imageData = imageResponse.data?.[0]?.b64_json

    if (!imageData) {
      console.error('OpenAI image response:', imageResponse)

      return NextResponse.json(
        {
          success: false,
          error: 'OpenAI did not return an image.',
        },
        { status: 500 },
      )
    }

    const imageBuffer = Buffer.from(imageData, 'base64')

    if (!imageBuffer.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Generated image is empty.',
        },
        { status: 500 },
      )
    }

    const publicId = createPublicId(article.title, article.id)

    const cloudinaryResult = await uploadToCloudinary(imageBuffer, publicId)

    const updatedArticle = await prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        image: cloudinaryResult.secure_url,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        image: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Image generated, uploaded and attached successfully.',
      article: updatedArticle,
      image: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
    })
  } catch (error) {
    console.error('IMAGE GENERATION ERROR:', error)

    let message = 'Failed to generate article image.'

    if (error instanceof Error) {
      message = error.message
    }

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    )
  }
}
