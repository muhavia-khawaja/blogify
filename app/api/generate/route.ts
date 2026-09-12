import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import prisma from '@/prisma/script'

export const maxDuration = 60

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop'

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function calculateReadTime(html: string) {
  const plainText = stripHtml(html)

  const words = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0

  const minutes = Math.max(1, Math.ceil(words / 200))

  return `${minutes} min read`
}

function containsForbiddenHtml(value: string) {
  const forbiddenPatterns = [
    /<script\b/i,
    /<\/script>/i,
    /javascript:/i,
    /<iframe\b/i,
    /<style\b/i,
    /\bonerror\s*=/i,
    /\bonclick\s*=/i,
    /\bonload\s*=/i,
    /\bonmouseover\s*=/i,
    /\bonfocus\s*=/i,
    /\bonmouseenter\s*=/i,
  ]

  return forbiddenPatterns.some((pattern) => pattern.test(value))
}

function cleanTags(tags: unknown) {
  if (!Array.isArray(tags)) {
    return []
  }

  return tags
    .map((tag) => String(tag).trim().replace(/^#/, ''))
    .filter(Boolean)
    .filter(
      (tag, index, array) =>
        array.findIndex((item) => item.toLowerCase() === tag.toLowerCase()) ===
        index,
    )
    .slice(0, 20)
}

async function generateArticle(
  topic: string,
  category: string,
  keywords: string,
) {
  const prompt = `
You are an expert educational content writer and HTML content designer for "Education With Hamza (EWH)", a Pakistani educational platform that provides study resources, notes, exam preparation guides, educational articles, and academic information.

Write a high-quality, SEO-friendly educational blog article about:

"${topic}"

Category:
"${category}"

Focus keywords:
"${keywords || 'Use relevant SEO keywords naturally based on the topic.'}"

The article is intended for publication on the Education With Hamza blog.

IMPORTANT OUTPUT RULES:

Return ONLY a valid JSON object.

Do NOT use Markdown.

Do NOT use code fences.

Do NOT add explanations before or after the JSON.

The JSON must contain exactly these four properties:

{
  "title": "...",
  "short_desc": "...",
  "long_desc": "...",
  "tags": ["...", "..."]
}

==================================================
TITLE REQUIREMENTS
==================================================

Create a natural, attractive, SEO-friendly title.

Requirements:

- Clearly describe the topic.
- Keep it suitable for an educational website.
- Avoid clickbait.
- Prefer approximately 50-70 characters when possible.
- If appropriate, include relevant terms such as:
  Pakistan
  Matric
  Intermediate
  9th Class
  10th Class
  1st Year
  2nd Year
  Board Exams
  Students
  Study Tips
  Exam Preparation
  Career

- Do not unnecessarily include "EWH" in every title.
- Do not use emojis.

==================================================
SHORT DESCRIPTION
==================================================

Create a compelling one-sentence description.

Requirements:

- Maximum 160 characters.
- Clearly explain what the article covers.
- Naturally include the main keyword when possible.
- No HTML.
- No emojis.
- No keyword stuffing.

==================================================
LONG DESCRIPTION
==================================================

Generate at least 900 words.

Target approximately 1000-1400 words when appropriate.

The content MUST be returned as HTML.

Use semantic HTML such as:

<p>
<h2>
<h3>
<strong>
<ul>
<ol>
<li>
<table>
<thead>
<tbody>
<tr>
<th>
<td>
<a>
<section>
<div>

Do NOT use:

<html>
<head>
<body>
<script>
<style>
<iframe>
<form>

Do not use JavaScript.

Do not use Markdown.

Do not use inline CSS.

Do not include an outer <article> element.

==================================================
EWH DESIGN SYSTEM
==================================================

Use the professional Education With Hamza visual style.

Normal text:

class="text-black leading-8 mb-5"

Main headings:

class="text-3xl font-bold text-gray-900 mb-4"

Subheadings:

class="text-2xl font-semibold text-gray-900 mb-3"

Important keywords:

class="text-amber-600"

Strong amber:

class="text-amber-700"

Amber background:

class="bg-amber-50"

Light amber:

class="bg-amber-100"

Amber border:

class="border-amber-200"

Accent border:

class="border-amber-500"

Supporting colors:

text-gray-700
bg-gray-50
border-gray-200
border-gray-300

IMPORTANT:

- Normal article text must be black or dark gray.
- Amber is the primary accent.
- Use amber for important keywords, tips and highlights.
- Do not make the entire article amber.
- Do not use blue, purple, pink, red or green unnecessarily.
- Do not use gradients.
- Keep the design academic and professional.

==================================================
HEADINGS
==================================================

Use:

<h2 class="text-3xl font-bold text-gray-900 mb-4">
  Section Heading
</h2>

Use:

<h3 class="text-2xl font-semibold text-gray-900 mb-3">
  Subheading
</h3>

Use descriptive headings.

==================================================
PARAGRAPHS
==================================================

Use:

<p class="text-black leading-8 mb-5">
  Content...
</p>

For introductory paragraphs:

<p class="text-black text-lg leading-8 mb-6">
  Content...
</p>

Keep paragraphs readable.

==================================================
IMPORTANT CALLOUT
==================================================

When useful:

<div class="border-l-4 border-amber-500 bg-amber-50 px-5 py-4 rounded-r-lg mb-6">
  <p class="text-black leading-7">
    <strong class="text-amber-700">
      EWH Tip:
    </strong>
    Important information...
  </p>
</div>

Use callout boxes only when useful.

==================================================
LISTS
==================================================

Unordered:

<ul class="list-disc pl-6 space-y-2 text-black mb-6">
  <li>...</li>
</ul>

Ordered:

<ol class="list-decimal pl-6 space-y-2 text-black mb-6">
  <li>...</li>
</ol>

==================================================
CARDS
==================================================

When useful:

<div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
  <div class="border border-gray-200 rounded-xl p-5 bg-gray-50">
    <h3 class="text-xl font-bold text-gray-900 mb-2">
      Example
    </h3>
    <p class="text-black leading-7">
      Content...
    </p>
  </div>
</div>

Do not overuse cards.

==================================================
TABLES
==================================================

When comparison or structured information is useful:

<div class="overflow-x-auto mb-8">
  <table class="w-full border-collapse border border-gray-300 text-black">
    <thead>
      <tr class="bg-amber-100">
        <th class="border border-gray-300 px-4 py-3 text-left font-bold">
          Category
        </th>
        <th class="border border-gray-300 px-4 py-3 text-left font-bold">
          Details
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border border-gray-300 px-4 py-3">
          ...
        </td>
        <td class="border border-gray-300 px-4 py-3">
          ...
        </td>
      </tr>
    </tbody>
  </table>
</div>

==================================================
INTERNAL LINKS
==================================================

ONLY use these approved EWH URLs:

Homepage:
https://www.ewhamza.com/

Notes:
https://www.ewhamza.com/notes-pdf

9th Class:
https://www.ewhamza.com/grades/9th-class

10th Class:
https://www.ewhamza.com/grades/10th-class

1st Year:
https://www.ewhamza.com/grades/1st-year

2nd Year:
https://www.ewhamza.com/grades/2nd-year

NEVER invent URLs.

Use approximately 2-5 relevant links.

Example:

<a
  href="https://www.ewhamza.com/grades/10th-class"
  class="text-amber-600 font-semibold hover:underline"
>
  10th Class Resources
</a>

==================================================
RESOURCE SECTION
==================================================

When relevant:

<h2 class="text-3xl font-bold text-gray-900 mb-4">
  Explore More <span class="text-amber-600">EWH Resources</span>
</h2>

Include useful internal links.

==================================================
CONCLUSION
==================================================

Finish with:

<h2 class="text-3xl font-bold text-gray-900 mb-4">
  Conclusion
</h2>

Summarize the most important points.

Do not simply repeat the article.

==================================================
FINAL CTA
==================================================

When appropriate:

<section class="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-10">
  <h2 class="text-2xl font-bold text-gray-900 mb-3">
    Keep Learning with EWH
  </h2>
  <p class="text-black leading-7 mb-5">
    Explore free educational resources, notes, and study material at Education With Hamza.
  </p>
  <a
    href="https://www.ewhamza.com/"
    class="inline-block bg-amber-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-amber-400 transition"
  >
    Explore EWH Resources
  </a>
</section>

==================================================
SEO
==================================================

- Identify the primary keyword.
- Use it naturally in the title.
- Use it naturally in the introduction.
- Use related keywords throughout.
- Use descriptive H2/H3 headings.
- Avoid keyword stuffing.
- Answer likely reader questions.
- Write for Pakistani students, parents and educators when relevant.

==================================================
PAKISTAN EDUCATION
==================================================

When relevant:

- Use terminology familiar to Pakistani students.
- Mention Matric, SSC, Intermediate, HSSC, 1st Year and 2nd Year where appropriate.
- Do not assume all Pakistani boards have identical policies.
- Do not invent examination dates.
- Do not invent fees.
- Do not invent admission requirements.
- Do not guarantee marks, admissions, jobs or salaries.

==================================================
CONTENT QUALITY
==================================================

The article must:

- Be original.
- Be informative.
- Be practical.
- Be easy to read.
- Avoid unnecessary repetition.
- Avoid generic AI filler.
- Avoid fabricated statistics.
- Avoid fabricated policies.
- Avoid fabricated dates.
- Avoid fabricated fees.
- Avoid unsupported claims.

==================================================
TAGS
==================================================

Return 5-12 useful SEO tags.

Rules:

- Plain text only.
- No # symbol.
- Short and relevant.
- Include the main topic naturally.
- Avoid duplicate tags.

==================================================
FINAL VALIDATION
==================================================

Before returning:

1. Valid JSON.
2. Exactly title, short_desc, long_desc and tags.
3. short_desc <= 160 characters.
4. long_desc >= 900 words.
5. Valid HTML.
6. No Markdown.
7. No script.
8. No style.
9. No JavaScript.
10. No iframe.
11. Tailwind classes used.
12. Black/dark gray normal text.
13. Amber primary accent.
14. Correct H2/H3 hierarchy.
15. Only approved EWH URLs.
16. Useful educational content.

Return ONLY JSON.
`

  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-5.6-luna',
    messages: [
      {
        role: 'system',
        content: prompt,
      },
    ],
    response_format: {
      type: 'json_object',
    },
    max_completion_tokens: 4000,
  })

  const raw = aiResponse.choices[0]?.message?.content?.trim() || '{}'

  if (!raw || raw === '{}') {
    throw new Error('AI did not return any article content. Please try again.')
  }

  let parsed: {
    title?: string
    short_desc?: string
    long_desc?: string
    tags?: unknown
  }

  try {
    parsed = JSON.parse(raw)
  } catch (error) {
    console.error('AI JSON Parse Error:', error)

    throw new Error('AI returned invalid article data. Please try again.')
  }

  if (!parsed.title || !parsed.short_desc || !parsed.long_desc) {
    throw new Error('AI returned incomplete article content. Please try again.')
  }

  const title = String(parsed.title).trim()

  let shortDesc = String(parsed.short_desc).trim()

  const longDesc = String(parsed.long_desc).trim()

  if (shortDesc.length > 160) {
    shortDesc = `${shortDesc.slice(0, 157).trim()}...`
  }

  if (!title || !shortDesc || !longDesc) {
    throw new Error('AI returned empty article content. Please try again.')
  }

  if (containsForbiddenHtml(longDesc)) {
    throw new Error('AI generated unsupported HTML content. Please try again.')
  }

  const tags = cleanTags(parsed.tags)

  const slug = createSlug(title)

  return {
    title,
    slug,
    short_desc: shortDesc,
    long_desc: longDesc,
    tags,
  }
}

async function createUniqueSlug(baseSlug: string) {
  let slug = baseSlug || `article-${Date.now()}`

  const existing = await prisma.article.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  })

  if (!existing) {
    return slug
  }

  let counter = 2

  while (true) {
    const candidate = `${baseSlug}-${counter}`

    const found = await prisma.article.findUnique({
      where: {
        slug: candidate,
      },
      select: {
        id: true,
      },
    })

    if (!found) {
      return candidate
    }

    counter++
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const action = String(body?.action || 'generate')

    // =====================================================
    // GENERATE
    // =====================================================

    if (action === 'generate') {
      const topic = String(body?.topic || '').trim()
      const categoryId = String(body?.categoryId || '').trim()

      const keywords = String(body?.keywords || '').trim()

      if (!topic || !categoryId) {
        return NextResponse.json(
          {
            error: 'Topic and Category are required.',
          },
          {
            status: 400,
          },
        )
      }

      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
        select: {
          id: true,
          title: true,
        },
      })

      if (!category) {
        return NextResponse.json(
          {
            error: 'Selected category was not found.',
          },
          {
            status: 404,
          },
        )
      }

      // Check exact title first.
      const existingTitle = await prisma.article.findFirst({
        where: {
          title: {
            equals: topic,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          title: true,
          short_desc: true,
          slug: true,
          status: true,
          published: true,
          readTime: true,
          image: true,
        },
      })

      if (existingTitle) {
        return NextResponse.json({
          success: true,
          alreadyExists: true,
          message: 'An article with this topic already exists.',
          article: existingTitle,
        })
      }

      const generated = await generateArticle(topic, category.title, keywords)

      return NextResponse.json({
        success: true,
        alreadyExists: false,
        article: generated,
      })
    }

    // =====================================================
    // SAVE
    // =====================================================

    if (action === 'save') {
      const title = String(body?.title || '').trim()

      const requestedSlug = String(body?.slug || '').trim()

      const shortDesc = String(body?.short_desc || '').trim()

      const longDesc = String(body?.long_desc || '').trim()

      const categoryId = String(body?.categoryId || '').trim()

      const status = body?.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT'

      const tags = cleanTags(body?.tags)

      if (!title) {
        return NextResponse.json(
          {
            error: 'Article title is required.',
          },
          {
            status: 400,
          },
        )
      }

      if (!shortDesc) {
        return NextResponse.json(
          {
            error: 'Short description is required.',
          },
          {
            status: 400,
          },
        )
      }

      if (!longDesc) {
        return NextResponse.json(
          {
            error: 'Article content is required.',
          },
          {
            status: 400,
          },
        )
      }

      if (!categoryId) {
        return NextResponse.json(
          {
            error: 'Category is required.',
          },
          {
            status: 400,
          },
        )
      }

      if (containsForbiddenHtml(longDesc)) {
        return NextResponse.json(
          {
            error: 'Article contains unsupported HTML.',
          },
          {
            status: 422,
          },
        )
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
        return NextResponse.json(
          {
            error: 'Selected category was not found.',
          },
          {
            status: 404,
          },
        )
      }

      /*
       * IMPORTANT:
       *
       * This matches your existing schema where User
       * can be connected using email.
       *
       * If your admin user email is different,
       * change this value or replace it with your
       * authenticated-user lookup.
       */

      const adminEmail = 'kh.muhavia1@gmail.com'

      const user = await prisma.user.findUnique({
        where: {
          email: adminEmail,
        },
        select: {
          id: true,
        },
      })

      if (!user) {
        return NextResponse.json(
          {
            error: 'Admin user account could not be found.',
          },
          {
            status: 404,
          },
        )
      }

      const baseSlug = createSlug(requestedSlug || title)

      const slug = await createUniqueSlug(baseSlug)

      const readTime = calculateReadTime(longDesc)

      const article = await prisma.article.create({
        data: {
          title,

          slug,

          short_desc: shortDesc,

          long_desc: longDesc,

          tags,

          category: {
            connect: {
              id: category.id,
            },
          },

          user: {
            connect: {
              id: user.id,
            },
          },

          status,

          published: status === 'PUBLISHED',

          featured: false,

          mainPost: false,

          image: DEFAULT_IMAGE,

          readTime,
        },

        select: {
          id: true,
          title: true,
          slug: true,
          short_desc: true,
          long_desc: true,
          tags: true,
          status: true,
          published: true,
          image: true,
          readTime: true,
          categoryId: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return NextResponse.json({
        success: true,
        message:
          status === 'PUBLISHED'
            ? 'Article published successfully.'
            : 'Article saved as draft successfully.',
        article,
      })
    }

    return NextResponse.json(
      {
        error: 'Invalid action.',
      },
      {
        status: 400,
      },
    )
  } catch (error) {
    console.error('AI Article Route Error:', error)

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          error: error.message || 'OpenAI request failed.',
        },
        {
          status: error.status || 500,
        },
      )
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Internal system error. Please try again.',
      },
      {
        status: 500,
      },
    )
  }
}
