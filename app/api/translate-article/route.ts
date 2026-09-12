import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  ur: 'Urdu',
  hi: 'Hindi',
  pa: 'Punjabi',
  ar: 'Arabic',
  bn: 'Bengali',
  fa: 'Persian',
  tr: 'Turkish',
}

function cleanTranslatedHtml(content: string) {
  return content
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const title = typeof body.title === 'string' ? body.title.trim() : ''

    const content = typeof body.content === 'string' ? body.content.trim() : ''

    const targetLanguage =
      typeof body.targetLanguage === 'string'
        ? body.targetLanguage.trim().toLowerCase()
        : ''

    if (!title || !content || !targetLanguage) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title, content and target language are required.',
        },
        { status: 400 },
      )
    }

    const languageName = LANGUAGE_NAMES[targetLanguage]

    if (!languageName) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unsupported target language.',
        },
        { status: 400 },
      )
    }

    // English does not need an API request.
    if (targetLanguage === 'en') {
      return NextResponse.json({
        success: true,
        title,
        content,
        language: 'en',
      })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is missing from environment variables.')

      return NextResponse.json(
        {
          success: false,
          message: 'Translation service is not configured.',
        },
        { status: 500 },
      )
    }

    const systemPrompt = `
You are a professional multilingual article translator.

Translate the supplied article from English into ${languageName}.

IMPORTANT RULES:

1. Translate the title naturally and accurately.
2. Translate the article content naturally.
3. Preserve the original HTML structure exactly.
4. Do NOT remove HTML tags.
5. Do NOT add new HTML tags unless absolutely necessary.
6. Preserve all links and their href attributes.
7. Preserve all image src and alt attributes.
8. Preserve lists, headings, paragraphs, tables, blockquotes and formatting.
9. Preserve code blocks exactly. Do not translate programming code.
10. Preserve numbers, dates, formulas and technical terms when appropriate.
11. Do not translate URLs.
12. Do not translate HTML attributes.
13. Do not add explanations before or after the translation.
14. Return ONLY valid JSON.
15. The JSON must contain exactly:
   {
     "title": "translated title",
     "content": "translated HTML content"
   }

The translation should sound natural to a native ${languageName} reader rather than being a word-for-word translation.
`

    const userPrompt = `
Translate this article into ${languageName}.

TITLE:
${title}

ARTICLE HTML:
${content}
`

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_TRANSLATION_MODEL || 'gpt-5-mini',

      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],

      response_format: {
        type: 'json_object',
      },
    })

    const rawContent = completion.choices[0]?.message?.content

    if (!rawContent) {
      throw new Error('The translation model returned an empty response.')
    }

    let translated: {
      title?: string
      content?: string
    }

    try {
      translated = JSON.parse(rawContent)
    } catch (parseError) {
      console.error('Failed to parse translation JSON:', parseError, rawContent)

      throw new Error('The translation service returned invalid JSON.')
    }

    const translatedTitle =
      typeof translated.title === 'string' && translated.title.trim()
        ? translated.title.trim()
        : title

    const translatedContent =
      typeof translated.content === 'string' && translated.content.trim()
        ? cleanTranslatedHtml(translated.content)
        : content

    return NextResponse.json({
      success: true,
      title: translatedTitle,
      content: translatedContent,
      language: targetLanguage,
    })
  } catch (error) {
    console.error('Translate article API error:', error)

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || 'OpenAI translation request failed.',
        },
        { status: error.status || 500 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Unable to translate the article.',
      },
      { status: 500 },
    )
  }
}
