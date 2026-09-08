import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import prisma from '@/prisma/script'

export const maxDuration = 60

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp',
        transformation: [
          {
            width: 1600,
            height: 900,
            crop: 'fill',
            gravity: 'auto',
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Cloudinary upload failed'))
        }

        resolve(result)
      },
    )

    stream.end(buffer)
  })
}

export async function POST(req: Request) {
  try {
    const { topic, categoryId } = await req.json()

    if (!topic || !categoryId) {
      return NextResponse.json(
        {
          error: 'Topic and Category are required',
        },
        {
          status: 400,
        },
      )
    }

    const cleanTopic = String(topic).trim()
    const cleanCategoryId = String(categoryId).trim()

    if (!cleanTopic || !cleanCategoryId) {
      return NextResponse.json(
        {
          error: 'Topic and Category are required',
        },
        {
          status: 400,
        },
      )
    }

    // ---------------------------------------------------
    // ARTICLE PROMPT
    // ---------------------------------------------------

    const prompt = `
You are an expert educational content writer and HTML content designer for "Education With Hamza (EWH)", a Pakistani educational platform that provides study resources, notes, exam preparation guides, educational articles, and academic information.

Write a high-quality, SEO-friendly educational blog article about:

"${cleanTopic}"

The article is intended for publication on the Education With Hamza blog.

IMPORTANT:

Return ONLY a valid raw JSON object.

Do NOT use markdown.
Do NOT use code fences.
Do NOT add explanations before or after the JSON.

The JSON must contain exactly these three properties:

{
  "title": "...",
  "short_desc": "...",
  "long_desc": "..."
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

Generate a minimum of 900 words.

Target approximately 1000-1400 words when appropriate.

The content must be returned as HTML.

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

You may also use:

<section>
<div>

Do NOT use:

<html>
<head>
<body>
<script>
<style>
iframe
form
JavaScript
Markdown
External CSS
Inline CSS

Do NOT include an outer <article> element.

==================================================
EWH DESIGN SYSTEM
==================================================

The article must use a professional Education With Hamza visual style.

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
- Do not use random colors.
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

Use responsive tables when comparison or structured information is useful.

Example:

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

      <tr class="bg-gray-50">

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

ONLY use these approved EWH URLs.

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

When appropriate, finish with:

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
FINAL VALIDATION
==================================================

Before returning:

1. Valid JSON.
2. Exactly title, short_desc and long_desc.
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

    // ---------------------------------------------------
    // GENERATE ARTICLE
    // ---------------------------------------------------

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',

      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],

      response_format: {
        type: 'json_object',
      },

      temperature: 0.7,
    })

    const raw = aiResponse.choices[0]?.message?.content?.trim() || '{}'

    if (!raw || raw === '{}') {
      return NextResponse.json(
        {
          error: 'AI did not return any article content. Please try again.',
        },
        {
          status: 422,
        },
      )
    }

    // ---------------------------------------------------
    // PARSE ARTICLE JSON
    // ---------------------------------------------------

    let content: {
      title?: string
      short_desc?: string
      long_desc?: string
    }

    try {
      content = JSON.parse(raw)
    } catch (error) {
      console.error('AI JSON Parse Error:', error)
      console.error('Raw response:', raw)

      return NextResponse.json(
        {
          error: 'AI returned invalid article data. Please try again.',
        },
        {
          status: 422,
        },
      )
    }

    // ---------------------------------------------------
    // VALIDATE ARTICLE
    // ---------------------------------------------------

    if (!content.title || !content.short_desc || !content.long_desc) {
      return NextResponse.json(
        {
          error: 'AI returned incomplete article content. Please try again.',
        },
        {
          status: 422,
        },
      )
    }

    const title = content.title.trim()
    const shortDesc = content.short_desc.trim()
    const longDesc = content.long_desc.trim()

    if (!title || !shortDesc || !longDesc) {
      return NextResponse.json(
        {
          error: 'AI returned empty article content. Please try again.',
        },
        {
          status: 422,
        },
      )
    }

    // ---------------------------------------------------
    // SHORT DESCRIPTION VALIDATION
    // ---------------------------------------------------

    if (shortDesc.length > 160) {
      return NextResponse.json(
        {
          error: 'AI generated a short description longer than 160 characters.',
        },
        {
          status: 422,
        },
      )
    }

    // ---------------------------------------------------
    // BASIC HTML SECURITY CHECK
    // ---------------------------------------------------

    const forbiddenPatterns = [
      /<script\b/i,
      /<\/script>/i,
      /javascript:/i,
      /<iframe\b/i,
      /<style\b/i,
      /onerror\s*=/i,
      /onclick\s*=/i,
      /onload\s*=/i,
      /onmouseover\s*=/i,
    ]

    const containsForbiddenContent = forbiddenPatterns.some((pattern) =>
      pattern.test(longDesc),
    )

    if (containsForbiddenContent) {
      return NextResponse.json(
        {
          error: 'AI generated unsupported HTML content. Please try again.',
        },
        {
          status: 422,
        },
      )
    }

    // ---------------------------------------------------
    // GENERATE SLUG
    // ---------------------------------------------------

    const baseSlug = title
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')

    const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`

    // ---------------------------------------------------
    // CALCULATE READING TIME
    // ---------------------------------------------------

    const plainText = longDesc
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, ' ')
      .trim()

    const words = plainText ? plainText.split(/\s+/).length : 0

    const readingMinutes = Math.max(1, Math.ceil(words / 200))

    const readTime = `${readingMinutes} min read`

    // ===================================================
    // GENERATE FEATURED IMAGE
    // ===================================================

    let imageUrl =
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop'

    try {
      console.log(`Generating featured image for: ${title}`)

      const imagePrompt = `
Create a premium professional featured image for an educational blog article.

ARTICLE TITLE:
"${title}"

TOPIC:
"${cleanTopic}"

BRAND:
Education With Hamza (EWH)

VISUAL STYLE:

- Modern educational editorial design
- Professional and trustworthy
- Suitable for a Pakistani education website
- High-end website hero/featured image
- Clean composition
- Dark navy to black atmospheric background
- EWH-inspired amber/golden accent lighting
- Subtle educational visual elements
- Books, notebooks, classroom elements, academic symbols, technology or other topic-relevant objects when appropriate
- Strong depth and realistic lighting
- Premium photography/editorial illustration style
- Clean background
- Sophisticated composition
- High contrast
- Visually engaging but not cluttered

COLOR PALETTE:

- Black
- Dark navy
- Amber/golden
- Warm neutral tones

IMPORTANT:

- Do not use bright rainbow colors.
- Do not use excessive text.
- Do not put paragraphs or sentences inside the image.
- Prefer NO text in the image.
- If text is absolutely necessary, only use a very short title-like phrase.
- Do not create fake logos.
- Do not create watermarks.
- Do not include social media icons.
- Do not include website URLs.
- Do not include UI screenshots.
- Do not make the image look like a generic stock photo.

COMPOSITION:

Create a strong 16:9 landscape composition suitable for a blog featured image.

Keep important visual elements away from the extreme edges.

The image should work well as a website thumbnail and article hero image.

The visual should communicate the article topic immediately.

Generate a polished, professional, publication-ready image.
`

      const imageResponse = await openai.images.generate({
        model: 'gpt-image-2',
        prompt: imagePrompt,
        size: '1536x1024',
        quality: 'medium',
        output_format: 'webp',
        background: 'opaque',
      })

      const imageBase64 = imageResponse.data?.[0]?.b64_json

      if (!imageBase64) {
        throw new Error('OpenAI did not return generated image data.')
      }

      // Convert base64 → Buffer
      const imageBuffer = Buffer.from(imageBase64, 'base64')

      console.log('Uploading generated image to Cloudinary...')

      // Upload to Cloudinary
      const imageResult = await uploadBufferToCloudinary(
        imageBuffer,
        'education/articles',
      )

      imageUrl = imageResult.secure_url

      console.log('Image uploaded successfully:', imageUrl)
    } catch (imageError) {
      console.error('AI Image Generation / Cloudinary Error:', imageError)

      // IMPORTANT:
      // We don't fail the entire article if image generation fails.
      // The article will use the fallback image.
    }

    // ===================================================
    // CREATE ARTICLE
    // ===================================================

    const status = 'PENDING'
    const published = false

    const article = await prisma.article.create({
      data: {
        title,
        short_desc: shortDesc,
        long_desc: longDesc,

        category: {
          connect: {
            id: cleanCategoryId,
          },
        },

        user: {
          connect: {
            email: 'kh.muhavia1@gmail.com',
          },
        },

        status,
        published,
        featured: false,
        mainPost: false,

        image: imageUrl,

        tags: [cleanTopic],

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
        readTime: article.readTime,
        image: article.image,
      },
    })
  } catch (error) {
    console.error('Generation Error:', error)

    if (error instanceof Error) {
      console.error('Error Message:', error.message)
    }

    return NextResponse.json(
      {
        error: 'Internal system error. Please try again.',
      },
      {
        status: 500,
      },
    )
  }
}
