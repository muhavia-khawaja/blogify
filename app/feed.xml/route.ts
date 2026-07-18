import { NextResponse } from 'next/server'
import { getAllArticles } from '@/utils/actions'
import { getAbsoluteUrl, SITE_DESCRIPTION, SITE_NAME } from '@/utils/seo'

export async function GET() {
  const articles = await getAllArticles()

  const items = articles
    .slice(0, 10)
    .map((article) => {
      const url = getAbsoluteUrl(`/blog/${article.slug}`)
      const pubDate =
        article.createdAt?.toISOString() || new Date().toISOString()
      const description =
        article.short_desc || article.long_desc || SITE_DESCRIPTION
      return `
        <item>
          <title>${article.title}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <description>${description}</description>
          <pubDate>${pubDate}</pubDate>
        </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${SITE_NAME}</title>
      <link>${getAbsoluteUrl('/')}</link>
      <description>${SITE_DESCRIPTION}</description>
      ${items}
    </channel>
  </rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
