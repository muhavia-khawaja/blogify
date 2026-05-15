import OpenAI from 'openai'
import { createArticle } from '@/utils/actions'
import { NextResponse } from 'next/server'
import { isRedirectError } from 'next/dist/client/components/redirect'

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
      You are an expert educational content creator for "Journal" which is a blog site.
      Generate a professional, high-quality blog article about: ${topic}.
      
      Return the response ONLY as a JSON object with these exact keys:
      {
        "title": "A catchy, academic-style title",
        "short_desc": "A one-sentence poetic or intriguing summary",
        "long_desc": "Full HTML content with <p>, <h2>, <h3>, and <strong> tags. Focus on educational value. Minimum 500 words."
      }
    `

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      response_format: { type: 'json_object' },
    })

    const content = JSON.parse(aiResponse.choices[0].message.content || '{}')

    const placeholderImage =
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDb9ggFEFtQs43VDw76JME4dVCFFlcqWWwUg&s'
    const slug = content.title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')

    const formData = new FormData()
    formData.append('title', content.title)
    formData.append('short_desc', content.short_desc)
    formData.append('long_desc', content.long_desc)
    formData.append('image', placeholderImage)
    formData.append('categoryId', categoryId)
    formData.append('slug', slug)
    formData.append('published', 'true')

    const result = await createArticle(formData)

    return NextResponse.json({
      success: true,
      article: result,
    })
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    console.error('CMS Generation Error:', error)
    return NextResponse.json(
      { error: 'Internal System Error' },
      { status: 500 },
    )
  }
}
