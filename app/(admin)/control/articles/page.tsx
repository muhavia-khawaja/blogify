'use client'

import React, { useCallback, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Search,
  FileText,
  Star,
  Eye,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  BarChart2,
  Bookmark,
  X,
  AlertTriangle,
  Loader2,
} from 'lucide-react'

import {
  getArticles,
  getCategoryOptions,
  toggleArticlePublish,
  toggleArticleFeatured,
  toggleArticleMainPost,
  deleteArticle,
} from '@/utils/admin/action'

interface Article {
  id: string
  title: string
  createdAt: string | Date
  slug: string
  published: boolean
  featured: boolean
  mainPost: boolean
  category?: {
    id?: string
    title?: string
  } | null
  user?: {
    name?: string
  } | null
  analytics?: {
    totalViews?: number
  } | null
}

interface Category {
  id: string
  title: string
}

interface ArticlesResponse {
  articles?: Article[]
  totalPages?: number
  totalCount?: number
}

type ActionResult = {
  success?: boolean
  error?: string
  message?: string
}

const DEFAULT_PAGE_SIZE = 10

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')
  const [categoryId, setCategoryId] = useState('ALL')
  const [page, setPage] = useState(1)

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isPending, startTransition] = useTransition()

  const [activeDeleteArticle, setActiveDeleteArticle] =
    useState<Article | null>(null)
  const [activeAnalyticsArticle, setActiveAnalyticsArticle] =
    useState<Article | null>(null)

  const [isDeleting, setIsDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setLoadError('')

    try {
      const [articlesResult, categoriesResult] = await Promise.all([
        getArticles({
          query: query.trim(),
          status,
          categoryId,
          page,
          limit: DEFAULT_PAGE_SIZE,
        }),
        getCategoryOptions(),
      ])

      const result = (articlesResult ?? {}) as ArticlesResponse

      setArticles(Array.isArray(result.articles) ? result.articles : [])
      setTotalPages(Math.max(1, Number(result.totalPages) || 1))
      setTotalCount(Math.max(0, Number(result.totalCount) || 0))

      setCategories(
        Array.isArray(categoriesResult) ? (categoriesResult as Category[]) : [],
      )
    } catch (error) {
      console.error('Failed to load articles:', error)
      setLoadError(
        error instanceof Error
          ? error.message
          : 'Failed to load articles. Please try again.',
      )
      setArticles([])
    } finally {
      setIsLoading(false)
    }
  }, [query, status, categoryId, page])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const updateArticleInState = (
    articleId: string,
    updates: Partial<Article>,
  ) => {
    setArticles((current) =>
      current.map((article) =>
        article.id === articleId ? { ...article, ...updates } : article,
      ),
    )

    setActiveAnalyticsArticle((current) =>
      current?.id === articleId ? { ...current, ...updates } : current,
    )

    setActiveDeleteArticle((current) =>
      current?.id === articleId ? { ...current, ...updates } : current,
    )
  }

  const runArticleAction = (
    action: () => Promise<unknown>,
    articleId: string,
    updates: Partial<Article>,
  ) => {
    setActionError('')

    startTransition(async () => {
      try {
        const result = (await action()) as ActionResult | undefined

        if (result && result.success === false) {
          throw new Error(
            result.error || result.message || 'The action failed.',
          )
        }

        updateArticleInState(articleId, updates)
      } catch (error) {
        console.error('Article action failed:', error)
        setActionError(
          error instanceof Error
            ? error.message
            : 'The action could not be completed.',
        )
      }
    })
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    setActionError('')

    try {
      const result = (await deleteArticle(id)) as ActionResult | undefined

      if (result && result.success === false) {
        throw new Error(
          result.error || result.message || 'Failed to delete article.',
        )
      }

      setActiveDeleteArticle(null)

      if (articles.length === 1 && page > 1) {
        setPage((current) => current - 1)
      } else {
        await loadData()
      }
    } catch (error) {
      console.error('Delete article failed:', error)
      setActionError(
        error instanceof Error
          ? error.message
          : 'Failed to delete article. Please try again.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFilterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPage(1)
  }

  const clearFilters = () => {
    setQuery('')
    setStatus('ALL')
    setCategoryId('ALL')
    setPage(1)
  }

  const closeModals = () => {
    if (!isDeleting && !isPending) {
      setActiveDeleteArticle(null)
      setActiveAnalyticsArticle(null)
    }
  }

  return (
    <div className='min-h-screen space-y-6 bg-[#F8F6F0] p-4 text-[#1A1A18] sm:p-6 md:p-10'>
      <div className='rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='font-serif text-2xl font-bold text-[#1A1A18] sm:text-3xl'>
              Articles Management
            </h1>

            <p className='mt-1 font-serif text-xs italic text-[#6B6860] sm:text-sm'>
              Manage, filter, publish, and track all editorial content. (
              {totalCount} total)
            </p>
          </div>

          <Link
            href='/control/articles'
            className='inline-flex w-fit items-center gap-2 rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-4 py-2 text-xs font-semibold text-[#4A473F] transition hover:bg-[#F0ECE1]'
          >
            <FileText size={15} />
            Refresh page
          </Link>
        </div>
      </div>

      <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
        <form
          method='GET'
          onSubmit={handleFilterSubmit}
          className='flex w-full flex-col gap-3 lg:flex-row'
        >
          <div className='relative min-w-0 flex-1'>
            <Search
              size={18}
              className='absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C887B]'
            />

            <input
              type='text'
              name='q'
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Search by title...'
              className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] py-2.5 pl-10 pr-4 text-sm text-[#1A1A18] outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10'
            />
          </div>

          <select
            name='status'
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
            className='rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-3 py-2.5 text-sm text-[#1A1A18] outline-none focus:border-amber-500'
          >
            <option value='ALL'>All Statuses</option>
            <option value='PUBLISHED'>Published</option>
            <option value='DRAFT'>Drafts</option>
          </select>

          <select
            name='category'
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value)
              setPage(1)
            }}
            className='rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-3 py-2.5 text-sm text-[#1A1A18] outline-none focus:border-amber-500'
          >
            <option value='ALL'>All Categories</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>

          <div className='flex gap-2'>
            <button
              type='submit'
              disabled={isLoading}
              className='inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1A1A18] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none'
            >
              {isLoading ? (
                <Loader2 size={16} className='animate-spin' />
              ) : null}
              Filter
            </button>

            {(query || status !== 'ALL' || categoryId !== 'ALL') && (
              <button
                type='button'
                onClick={clearFilters}
                className='rounded-xl border border-[#E0DCD5] bg-white px-4 py-2.5 text-sm font-semibold text-[#6B6860] transition hover:bg-[#FAF8F5]'
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {(loadError || actionError) && (
        <div className='flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700'>
          <AlertTriangle size={18} className='mt-0.5 shrink-0' />
          <div className='min-w-0 flex-1'>
            <p className='font-semibold'>Something went wrong</p>
            <p className='mt-1 break-words'>{loadError || actionError}</p>
          </div>

          <button
            type='button'
            onClick={() => {
              setLoadError('')
              setActionError('')
              void loadData()
            }}
            className='shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-sm'
          >
            Retry
          </button>
        </div>
      )}

      <div className='overflow-hidden rounded-3xl border border-[#E0DCD5] bg-white shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[850px] border-collapse text-left'>
            <thead>
              <tr className='border-b border-[#E0DCD5] bg-[#FAF8F5] text-xs font-bold uppercase text-[#8C887B]'>
                <th className='px-4 py-4'>Title</th>
                <th className='px-4 py-4'>Category</th>
                <th className='px-4 py-4'>Author</th>
                <th className='px-4 py-4'>Views</th>
                <th className='px-4 py-4'>Badges</th>
                <th className='px-4 py-4'>Status</th>
                <th className='px-4 py-4 text-right'>Actions</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-[#E0DCD5]'>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className='py-16 text-center'>
                    <Loader2
                      size={30}
                      className='mx-auto animate-spin text-amber-500'
                    />
                    <p className='mt-3 text-sm text-[#6B6860]'>
                      Loading articles...
                    </p>
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={7} className='py-16 text-center text-[#6B6860]'>
                    <FileText
                      size={36}
                      className='mx-auto mb-3 text-[#8C887B]'
                    />
                    <p className='text-sm font-semibold'>No articles found</p>
                    <p className='mt-1 text-xs'>
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr
                    key={article.id}
                    className='transition-colors hover:bg-[#FAF8F5]'
                  >
                    <td className='max-w-xs px-4 py-4'>
                      <div
                        className='truncate text-sm font-semibold text-[#1A1A18]'
                        title={article.title}
                      >
                        {article.title}
                      </div>

                      <div className='truncate text-xs text-[#8C887B]'>
                        {formatDate(article.createdAt)}
                      </div>
                    </td>

                    <td className='whitespace-nowrap px-4 py-4'>
                      <span className='inline-block rounded-md bg-[#F0ECE1] px-2.5 py-1 text-xs font-medium text-[#4A473F]'>
                        {article.category?.title || 'Uncategorized'}
                      </span>
                    </td>

                    <td className='whitespace-nowrap px-4 py-4 text-xs font-medium text-[#4A473F]'>
                      {article.user?.name || 'Admin'}
                    </td>

                    <td className='whitespace-nowrap px-4 py-4 text-xs font-medium text-[#4A473F]'>
                      <span className='inline-flex items-center gap-1'>
                        <Eye size={14} className='text-[#8C887B]' />
                        {formatNumber(article.analytics?.totalViews)}
                      </span>
                    </td>

                    <td className='whitespace-nowrap px-4 py-4'>
                      <div className='flex items-center gap-1.5'>
                        <button
                          type='button'
                          disabled={isPending}
                          title={
                            article.featured
                              ? 'Remove Featured'
                              : 'Mark as Featured'
                          }
                          onClick={() =>
                            runArticleAction(
                              () =>
                                toggleArticleFeatured(
                                  article.id,
                                  article.featured,
                                ),
                              article.id,
                              { featured: !article.featured },
                            )
                          }
                          className={`rounded-lg border p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            article.featured
                              ? 'border-amber-200 bg-amber-50 text-amber-600'
                              : 'border-gray-200 bg-gray-50 text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          <Star
                            size={14}
                            fill={article.featured ? 'currentColor' : 'none'}
                          />
                        </button>

                        <button
                          type='button'
                          disabled={isPending}
                          title={
                            article.mainPost
                              ? 'Remove Main Post'
                              : 'Mark as Main Post'
                          }
                          onClick={() =>
                            runArticleAction(
                              () =>
                                toggleArticleMainPost(
                                  article.id,
                                  article.mainPost,
                                ),
                              article.id,
                              { mainPost: !article.mainPost },
                            )
                          }
                          className={`rounded-lg border p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            article.mainPost
                              ? 'border-blue-200 bg-blue-50 text-blue-600'
                              : 'border-gray-200 bg-gray-50 text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          <Bookmark
                            size={14}
                            fill={article.mainPost ? 'currentColor' : 'none'}
                          />
                        </button>
                      </div>
                    </td>

                    <td className='whitespace-nowrap px-4 py-4'>
                      {article.published ? (
                        <span className='inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700'>
                          <CheckCircle size={12} />
                          Published
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700'>
                          <XCircle size={12} />
                          Draft
                        </span>
                      )}
                    </td>

                    <td className='whitespace-nowrap px-4 py-4 text-right'>
                      <div className='flex items-center justify-end gap-1.5'>
                        <button
                          type='button'
                          disabled={isPending}
                          onClick={() =>
                            runArticleAction(
                              () =>
                                toggleArticlePublish(
                                  article.id,
                                  article.published,
                                ),
                              article.id,
                              { published: !article.published },
                            )
                          }
                          className='rounded-md px-2 py-1 text-xs font-medium text-[#6B6860] transition hover:bg-[#FAF8F5] hover:text-[#1A1A18] disabled:opacity-50'
                        >
                          {article.published ? 'Unpublish' : 'Publish'}
                        </button>

                        <button
                          type='button'
                          onClick={() => setActiveAnalyticsArticle(article)}
                          className='rounded-lg p-1.5 text-[#6B6860] transition hover:bg-[#FAF8F5] hover:text-amber-600'
                          title='View Detailed Analytics'
                        >
                          <BarChart2 size={16} />
                        </button>

                        <Link
                          href={`/control/articles/${encodeURIComponent(article.slug)}`}
                          className='rounded-lg p-1.5 text-[#6B6860] transition hover:bg-[#FAF8F5] hover:text-amber-600'
                          title='Edit Article'
                        >
                          <Edit size={16} />
                        </Link>

                        <button
                          type='button'
                          onClick={() => setActiveDeleteArticle(article)}
                          className='rounded-lg p-1.5 text-[#8C887B] transition hover:bg-rose-50 hover:text-rose-600'
                          title='Delete Article'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className='flex flex-col gap-3 border-t border-[#E0DCD5] bg-[#FAF8F5] p-4 sm:flex-row sm:items-center sm:justify-between'>
          <span className='text-xs text-[#6B6860]'>
            Page {page} of {totalPages}
            {totalCount > 0 ? ` • ${totalCount} articles` : ''}
          </span>

          <div className='flex items-center justify-between gap-2 sm:justify-end'>
            <button
              type='button'
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className='inline-flex items-center gap-1 rounded-xl border border-[#E0DCD5] bg-white px-3 py-2 text-xs font-semibold transition hover:bg-[#FAF8F5] disabled:cursor-not-allowed disabled:opacity-40'
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            <span className='rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#6B6860]'>
              {page} / {totalPages}
            </span>

            <button
              type='button'
              disabled={page >= totalPages || isLoading}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className='inline-flex items-center gap-1 rounded-xl border border-[#E0DCD5] bg-white px-3 py-2 text-xs font-semibold transition hover:bg-[#FAF8F5] disabled:cursor-not-allowed disabled:opacity-40'
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {activeDeleteArticle && (
        <ModalOverlay onClose={closeModals}>
          <div className='relative w-full max-w-md space-y-4 rounded-3xl border border-[#E0DCD5] bg-white p-6 shadow-2xl'>
            <button
              type='button'
              onClick={() => setActiveDeleteArticle(null)}
              disabled={isDeleting}
              className='absolute right-4 top-4 rounded-lg p-1 text-[#8C887B] transition hover:bg-gray-100 hover:text-[#1A1A18] disabled:opacity-50'
              aria-label='Close delete modal'
            >
              <X size={18} />
            </button>

            <div className='flex items-center gap-3 text-rose-600'>
              <div className='rounded-xl bg-rose-50 p-2'>
                <AlertTriangle size={24} />
              </div>

              <h3 className='text-lg font-bold text-[#1A1A18]'>
                Delete Article
              </h3>
            </div>

            <p className='break-words text-sm text-[#6B6860]'>
              Are you sure you want to delete{' '}
              <span className='font-semibold text-[#1A1A18]'>
                &quot;{activeDeleteArticle.title}&quot;
              </span>
              ?
            </p>

            <div className='rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700'>
              This action cannot be undone.
            </div>

            {actionError && (
              <p className='text-xs font-medium text-rose-600'>{actionError}</p>
            )}

            <div className='flex justify-end gap-2 pt-2'>
              <button
                type='button'
                onClick={() => setActiveDeleteArticle(null)}
                disabled={isDeleting}
                className='rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-200 disabled:opacity-50'
              >
                Cancel
              </button>

              <button
                type='button'
                disabled={isDeleting}
                onClick={() => void handleDelete(activeDeleteArticle.id)}
                className='inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isDeleting ? (
                  <Loader2 size={14} className='animate-spin' />
                ) : null}
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {activeAnalyticsArticle && (
        <ModalOverlay onClose={closeModals}>
          <div className='relative w-full max-w-md space-y-4 rounded-3xl border border-[#E0DCD5] bg-white p-6 shadow-2xl'>
            <button
              type='button'
              onClick={() => setActiveAnalyticsArticle(null)}
              className='absolute right-4 top-4 rounded-lg p-1 text-[#8C887B] transition hover:bg-gray-100 hover:text-[#1A1A18]'
              aria-label='Close analytics modal'
            >
              <X size={18} />
            </button>

            <div className='flex items-center gap-2'>
              <BarChart2 className='text-amber-500' size={20} />
              <h3 className='text-lg font-bold text-[#1A1A18]'>
                Article Analytics
              </h3>
            </div>

            <div className='rounded-2xl border border-[#E0DCD5] bg-[#FAF8F5] p-4'>
              <p className='truncate text-sm font-semibold text-[#1A1A18]'>
                {activeAnalyticsArticle.title}
              </p>

              <div className='mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <div className='rounded-xl border border-[#E0DCD5] bg-white p-3'>
                  <span className='block text-xs text-[#8C887B]'>
                    Total Views
                  </span>
                  <span className='mt-1 block text-lg font-bold text-[#1A1A18]'>
                    {formatNumber(activeAnalyticsArticle.analytics?.totalViews)}
                  </span>
                </div>

                <div className='rounded-xl border border-[#E0DCD5] bg-white p-3'>
                  <span className='block text-xs text-[#8C887B]'>
                    Created Date
                  </span>
                  <span className='mt-1 block text-xs font-semibold text-[#1A1A18]'>
                    {formatDate(activeAnalyticsArticle.createdAt)}
                  </span>
                </div>

                <div className='rounded-xl border border-[#E0DCD5] bg-white p-3'>
                  <span className='block text-xs text-[#8C887B]'>Status</span>
                  <span className='mt-1 block text-xs font-semibold text-[#1A1A18]'>
                    {activeAnalyticsArticle.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className='rounded-xl border border-[#E0DCD5] bg-white p-3'>
                  <span className='block text-xs text-[#8C887B]'>Category</span>
                  <span className='mt-1 block truncate text-xs font-semibold text-[#1A1A18]'>
                    {activeAnalyticsArticle.category?.title || 'Uncategorized'}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex justify-end pt-2'>
              <button
                type='button'
                onClick={() => setActiveAnalyticsArticle(null)}
                className='rounded-xl bg-[#1A1A18] px-4 py-2 text-xs font-semibold text-white transition hover:bg-black'
              >
                Close
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  )
}

function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
      role='dialog'
      aria-modal='true'
    >
      {children}
    </div>
  )
}

function formatNumber(value?: number) {
  const number = Number(value) || 0
  return number.toLocaleString()
}

function formatDate(value: string | Date) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date'
  }

  return date.toLocaleDateString()
}
