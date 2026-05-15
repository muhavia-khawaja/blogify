import BlogSection from '@/components/BlogComponent'
import { getAllArticles } from '@/utils/actions'
import React from 'react'

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
  return <BlogSection data={blogData} />
}
