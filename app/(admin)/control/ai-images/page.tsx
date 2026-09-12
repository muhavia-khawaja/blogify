'use client'

import { getAllArticles } from '@/utils/actions'
import {
  AlertCircle,
  CheckCircle2,
  ImageIcon,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

interface Article {
  id: string
  title: string
  slug: string
  short_desc: string
  long_desc: string
  image: string | null
  published: boolean
  status: string
  createdAt: string | Date
  updatedAt: string | Date
  tags: string[]
  readTime: string | null
  category?: {
    id: string
    title: string
  } | null
  user?: {
    id: string
    name: string
    email: string
    image?: string | null
  } | null
  topics?: Array<{
    id: string
    topic?: {
      id: string
      name?: string
      title?: string
    } | null
  }>
}

export default function ArticleImagesPage() {
  const [articles, setArticles] = useState<Article[]>([])

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')

  const [generatingId, setGeneratingId] = useState<string | null>(null)

  const [error, setError] = useState('')

  const [success, setSuccess] = useState('')

  async function loadArticles() {
    try {
      setLoading(true)
      setError('')

      const result = await getAllArticles()

      setArticles(result as Article[])
    } catch (error) {
      console.error('Failed to load articles:', error)

      setError(
        error instanceof Error ? error.message : 'Failed to load articles.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [])

  async function handleGenerateImage(article: Article) {
    if (generatingId) return

    try {
      setGeneratingId(article.id)

      setError('')
      setSuccess('')

      const response = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId: article.id,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate image.')
      }

      const imageUrl = data.image

      if (!imageUrl) {
        throw new Error('Image was generated but no image URL was returned.')
      }

      // Update the article immediately
      setArticles((currentArticles) =>
        currentArticles.map((item) =>
          item.id === article.id
            ? {
                ...item,
                image: imageUrl,
              }
            : item,
        ),
      )

      setSuccess(`Image generated successfully for "${article.title}".`)

      window.setTimeout(() => {
        setSuccess('')
      }, 5000)
    } catch (error) {
      console.error('Generate image error:', error)

      setError(
        error instanceof Error ? error.message : 'Failed to generate image.',
      )
    } finally {
      setGeneratingId(null)
    }
  }

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return articles
    }

    return articles.filter((article) => {
      return (
        article.title.toLowerCase().includes(query) ||
        article.slug.toLowerCase().includes(query) ||
        article.short_desc?.toLowerCase().includes(query) ||
        article.category?.title?.toLowerCase().includes(query) ||
        article.user?.name?.toLowerCase().includes(query)
      )
    })
  }, [articles, search])

  // =========================================================
  // STATS
  // =========================================================

  const totalArticles = articles.length

  const articlesWithImages = articles.filter((article) =>
    Boolean(article.image),
  ).length

  const articlesWithoutImages = totalArticles - articlesWithImages

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className='min-h-screen bg-[#faf8f3]'>
        <div className='mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4'>
          <div className='flex flex-col items-center gap-4'>
            <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100'>
              <Loader2 className='h-7 w-7 animate-spin text-amber-600' />
            </div>

            <p className='text-sm font-semibold text-stone-500'>
              Loading articles...
            </p>
          </div>
        </div>
      </main>
    )
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className='min-h-screen bg-[#faf8f3]'>
      <div className='mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:px-8 lg:py-10'>
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className='mb-8'>
          <div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
            <div>
              <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-amber-700'>
                <Sparkles className='h-3.5 w-3.5' />
                AI Image Studio
              </div>

              <h1 className='text-3xl font-black tracking-tight text-stone-900 sm:text-4xl'>
                Article Images
              </h1>

              <p className='mt-2 max-w-2xl text-sm leading-6 text-stone-500 sm:text-base'>
                Generate AI-powered featured images for your published articles.
              </p>
            </div>

            <button
              type='button'
              onClick={loadArticles}
              disabled={loading || Boolean(generatingId)}
              className='inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-sm font-bold text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <RefreshCw className='h-4 w-4' />
              Refresh
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className='mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800'>
            <AlertCircle className='mt-0.5 h-5 w-5 shrink-0' />

            <div className='min-w-0 flex-1'>
              <p className='font-bold'>Something went wrong</p>

              <p className='mt-1 text-sm'>{error}</p>
            </div>

            <button
              type='button'
              onClick={() => setError('')}
              className='rounded-lg p-1 transition hover:bg-red-100'
            >
              <X className='h-4 w-4' />
            </button>
          </div>
        )}

        {/* ================================================= */}
        {/* SUCCESS */}
        {/* ================================================= */}

        {success && (
          <div className='mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800'>
            <CheckCircle2 className='mt-0.5 h-5 w-5 shrink-0' />

            <div className='min-w-0 flex-1'>
              <p className='font-bold'>Success</p>

              <p className='mt-1 text-sm'>{success}</p>
            </div>

            <button
              type='button'
              onClick={() => setSuccess('')}
              className='rounded-lg p-1 transition hover:bg-emerald-100'
            >
              <X className='h-4 w-4' />
            </button>
          </div>
        )}

        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {/* Total */}
          <div className='rounded-2xl border border-stone-200 bg-white p-5 shadow-sm'>
            <div className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100'>
                <ImageIcon className='h-5 w-5 text-stone-600' />
              </div>

              <div>
                <p className='text-xs font-bold uppercase tracking-wide text-stone-400'>
                  Total Articles
                </p>

                <p className='mt-1 text-2xl font-black text-stone-900'>
                  {totalArticles}
                </p>
              </div>
            </div>
          </div>

          {/* With image */}
          <div className='rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm'>
            <div className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100'>
                <CheckCircle2 className='h-5 w-5 text-emerald-700' />
              </div>

              <div>
                <p className='text-xs font-bold uppercase tracking-wide text-emerald-600'>
                  With Images
                </p>

                <p className='mt-1 text-2xl font-black text-emerald-900'>
                  {articlesWithImages}
                </p>
              </div>
            </div>
          </div>

          {/* Without image */}
          <div className='rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm'>
            <div className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100'>
                <Sparkles className='h-5 w-5 text-amber-700' />
              </div>

              <div>
                <p className='text-xs font-bold uppercase tracking-wide text-amber-600'>
                  Need Images
                </p>

                <p className='mt-1 text-2xl font-black text-amber-900'>
                  {articlesWithoutImages}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* SEARCH */}
        {/* ================================================= */}

        <div className='mb-6 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm'>
          <div className='relative'>
            <Search className='pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400' />

            <input
              type='search'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder='Search articles...'
              className='h-12 w-full rounded-xl border border-stone-200 bg-stone-50 pl-11 pr-4 text-sm font-medium text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100'
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* DESKTOP */}
        {/* ================================================= */}

        <div className='hidden overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm md:block'>
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[900px]'>
              <thead>
                <tr className='border-b border-stone-200 bg-stone-50'>
                  <th className='px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-stone-500'>
                    Article
                  </th>

                  <th className='px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-stone-500'>
                    Category
                  </th>

                  <th className='px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-stone-500'>
                    Image
                  </th>

                  <th className='px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-stone-500'>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-stone-100'>
                {filteredArticles.map((article) => {
                  const isGenerating = generatingId === article.id

                  return (
                    <tr
                      key={article.id}
                      className='transition hover:bg-stone-50'
                    >
                      {/* Article */}
                      <td className='px-5 py-5'>
                        <div className='flex items-center gap-4'>
                          <div className='relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100'>
                            {article.image ? (
                              <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                sizes='96px'
                                className='object-cover'
                              />
                            ) : (
                              <div className='flex h-full w-full items-center justify-center'>
                                <ImageIcon className='h-6 w-6 text-stone-300' />
                              </div>
                            )}
                          </div>

                          <div className='min-w-0'>
                            <h2 className='max-w-[450px] truncate text-sm font-black text-stone-900'>
                              {article.title}
                            </h2>

                            <p className='mt-1 max-w-[450px] truncate text-xs text-stone-400'>
                              {article.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className='px-5 py-5'>
                        <span className='inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600'>
                          {article.category?.title || 'Uncategorized'}
                        </span>
                      </td>

                      {/* Image status */}
                      <td className='px-5 py-5'>
                        {article.image ? (
                          <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700'>
                            <CheckCircle2 className='h-3.5 w-3.5' />
                            Ready
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700'>
                            <Sparkles className='h-3.5 w-3.5' />
                            Missing
                          </span>
                        )}
                      </td>

                      {/* Button */}
                      <td className='px-5 py-5 text-right'>
                        <button
                          type='button'
                          disabled={Boolean(generatingId)}
                          onClick={() => handleGenerateImage(article)}
                          className='inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 text-xs font-black text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className='h-4 w-4 animate-spin' />
                              Generating...
                            </>
                          ) : article.image ? (
                            <>
                              <RefreshCw className='h-4 w-4' />
                              Regenerate
                            </>
                          ) : (
                            <>
                              <Sparkles className='h-4 w-4' />
                              Generate Image
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================= */}
        {/* MOBILE */}
        {/* ================================================= */}

        <div className='space-y-4 md:hidden'>
          {filteredArticles.map((article) => {
            const isGenerating = generatingId === article.id

            return (
              <article
                key={article.id}
                className='overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm'
              >
                {/* Image */}
                <div className='relative aspect-[16/9] w-full bg-stone-100'>
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes='100vw'
                      className='object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full flex-col items-center justify-center gap-2'>
                      <ImageIcon className='h-9 w-9 text-stone-300' />

                      <span className='text-xs font-bold text-stone-400'>
                        No image
                      </span>
                    </div>
                  )}

                  <div className='absolute left-3 top-3'>
                    {article.image ? (
                      <span className='inline-flex rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-black text-white shadow'>
                        IMAGE READY
                      </span>
                    ) : (
                      <span className='inline-flex rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-black text-white shadow'>
                        NO IMAGE
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className='p-4'>
                  <span className='text-[10px] font-black uppercase tracking-wider text-amber-600'>
                    {article.category?.title || 'Uncategorized'}
                  </span>

                  <h2 className='mt-1 line-clamp-2 text-base font-black leading-6 text-stone-900'>
                    {article.title}
                  </h2>

                  <p className='mt-2 line-clamp-2 text-xs leading-5 text-stone-500'>
                    {article.short_desc}
                  </p>

                  <button
                    type='button'
                    disabled={Boolean(generatingId)}
                    onClick={() => handleGenerateImage(article)}
                    className='mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 text-sm font-black text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        Generating Image...
                      </>
                    ) : article.image ? (
                      <>
                        <RefreshCw className='h-4 w-4' />
                        Regenerate Image
                      </>
                    ) : (
                      <>
                        <Sparkles className='h-4 w-4' />
                        Generate Image
                      </>
                    )}
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        {filteredArticles.length === 0 && (
          <div className='rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-20 text-center'>
            <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100'>
              <Search className='h-7 w-7 text-stone-400' />
            </div>

            <h2 className='mt-5 text-xl font-black text-stone-900'>
              No articles found
            </h2>

            <p className='mt-2 text-sm text-stone-500'>
              Try a different search term.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
