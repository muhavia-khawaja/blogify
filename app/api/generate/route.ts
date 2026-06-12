import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import prisma from '@/prisma/script'

export const maxDuration = 60

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { topic, categoryId } = await req.json()

    if (!topic || !categoryId) {
      return NextResponse.json(
        { error: 'Topic and Category are required' },
        { status: 400 },
      )
    }

    const prompt = `
      You are an expert educational content creator for "Journal", a professional blog platform.
      Generate a high-quality blog article about: ${topic}.

      Return ONLY a raw JSON object — no markdown, no backticks, no extra text:
      {
        "title": "A catchy, academic-style title",
        "short_desc": "A one-sentence poetic or intriguing summary (max 160 chars)",
        "long_desc": "Full HTML content with <p>, <h2>, <h3>, <strong>, <ul>, <li> tags. Minimum 600 words. Educational and engaging."
      }
    `

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      response_format: { type: 'json_object' },
    })

    const raw = aiResponse.choices[0].message.content || '{}'
    const content = JSON.parse(raw)

    if (!content.title || !content.short_desc || !content.long_desc) {
      return NextResponse.json(
        { error: 'AI returned incomplete content. Please try again.' },
        { status: 422 },
      )
    }

    const slug =
      content.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') +
      '-' +
      Date.now().toString().slice(-4)

    const words = content.long_desc.replace(/<[^>]+>/g, '').split(/\s+/).length
    const readTime = `${Math.ceil(words / 200)} min read`

    const status = 'PENDING'
    const published = false

    const article = await prisma.article.create({
      data: {
        title: content.title,
        short_desc: content.short_desc,
        long_desc: content.long_desc,
        category: {
          connect: { id: categoryId },
        },
        user: {
          connect: { email: 'kh.muhavia1@gmail.com' },
        },
        status,
        published,
        featured: false,
        mainPost: false,
        image:
          'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop',
        tags: [topic],
        slug,
        readTime,
      },
    })

    return NextResponse.json({
      success: true,
      article: {
        id: article.id,
        title: article.title,
        short_desc: article.short_desc,
        slug: article.slug,
        status: article.status,
      },
    })
  } catch (error) {
    console.error('Generation Error:', error)
    return NextResponse.json(
      { error: 'Internal system error. Please try again.' },
      { status: 500 },
    )
  }
}
