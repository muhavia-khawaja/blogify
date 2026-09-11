import { notFound } from 'next/navigation'

import { getArticleBySlug, getCategoryOptions } from '@/utils/admin/action'
import SingleArticleUI from '@/components/SingleArticleUI'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function AdminSingleArticlePage({ params }: PageProps) {
  const { slug } = await params

  console.log(slug)

  if (!slug) {
    notFound()
  }

  try {
    const [article, categories] = await Promise.all([
      getArticleBySlug(slug),
      getCategoryOptions(),
    ])

    if (!article) {
      notFound()
    }

    return <SingleArticleUI article={article} categories={categories ?? []} />
  } catch (error) {
    console.error('Failed to load article:', error)

    notFound()
  }
}
