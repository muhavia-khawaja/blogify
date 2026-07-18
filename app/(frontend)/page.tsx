import BlogSection from '@/components/BlogComponent'
import JsonLd from '@/components/JsonLd'
import { getAllArticles } from '@/utils/actions'
import {
  buildMetadata,
  getAbsoluteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
} from '@/utils/seo'
import React from 'react'

export const revalidate = 0

export async function generateMetadata() {
  return buildMetadata({
    title: `Home`,
    description: SITE_DESCRIPTION,
    path: '/',
    type: 'website',
  })
}

export default async function Page() {
  const articles = await getAllArticles()

  const blogData = {
    heroPost: articles.find((post) => post.mainPost) || articles[0],

    featuredPosts: articles
      .filter((post) => post.featured && !post.mainPost)
      .slice(0, 3),

    latestPosts: articles
      .filter((post) => !post.mainPost)
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
      .slice(0, 6),
  }
  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: getAbsoluteUrl('/'),
    description: SITE_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: getAbsoluteUrl('/'),
      logo: getAbsoluteUrl('/images/logo.png'),
    },
  }

  return (
    <>
      <JsonLd data={homeJsonLd} />
      <BlogSection data={blogData} />
    </>
  )
}
