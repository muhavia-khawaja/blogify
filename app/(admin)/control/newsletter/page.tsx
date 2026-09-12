'use client'

import React from 'react'
import {
  Mail,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Eye,
  FileText,
  Users,
  Search,
  ExternalLink,
  Clock,
  Image as ImageIcon,
  X,
  Check,
} from 'lucide-react'

import { getArticles, getSubscribers } from '@/utils/actions'

interface Article {
  id: string
  title: string
  short_desc: string
  slug: string
  readTime?: string | null
  image?: string | null
  published?: boolean
  status?: string
  createdAt?: string | Date
  category?: {
    id: string
    title: string
  } | null
  user?: {
    id: string
    name: string
    email: string
  } | null
}

interface Subscriber {
  id: string
  email: string
  status: boolean
  createdAt: string | Date
}

interface Message {
  type: 'success' | 'error'
  text: string
}

export default function NewsletterPage() {
  const [articles, setArticles] = React.useState<Article[]>([])
  const [subscribers, setSubscribers] = React.useState<Subscriber[]>([])

  // Multiple selected articles
  const [selectedArticleIds, setSelectedArticleIds] = React.useState<string[]>(
    [],
  )

  const [articleSearch, setArticleSearch] = React.useState('')

  const [loadingData, setLoadingData] = React.useState(true)
  const [isSending, setIsSending] = React.useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false)

  const [message, setMessage] = React.useState<Message | null>(null)

  const fetchData = React.useCallback(async () => {
    try {
      setLoadingData(true)

      const [fetchedArticles, fetchedSubscribers] = await Promise.all([
        getArticles(),
        getSubscribers(),
      ])

      console.log('Newsletter articles:', fetchedArticles)
      console.log('Newsletter subscribers:', fetchedSubscribers)

      setArticles(
        Array.isArray(fetchedArticles) ? (fetchedArticles as Article[]) : [],
      )

      setSubscribers(
        Array.isArray(fetchedSubscribers)
          ? (fetchedSubscribers as Subscriber[])
          : [],
      )
    } catch (error) {
      console.error('Failed to load newsletter data:', error)

      setMessage({
        type: 'error',
        text: 'Failed to load articles or subscribers.',
      })

      setArticles([])
      setSubscribers([])
    } finally {
      setLoadingData(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  /*
   * Toggle one article.
   *
   * Clicking an unselected article adds it.
   * Clicking a selected article removes it.
   */
  const toggleArticle = (articleId: string) => {
    setSelectedArticleIds((current) => {
      if (current.includes(articleId)) {
        return current.filter((id) => id !== articleId)
      }

      return [...current, articleId]
    })

    setMessage(null)
  }

  /*
   * Remove an article from selection.
   */
  const removeArticle = (articleId: string) => {
    setSelectedArticleIds((current) => current.filter((id) => id !== articleId))
  }

  /*
   * Select every currently filtered article.
   */
  const selectAllFiltered = () => {
    const filteredIds = filteredArticles.map((article) => article.id)

    setSelectedArticleIds((current) => {
      const merged = new Set([...current, ...filteredIds])

      return Array.from(merged)
    })
  }

  /*
   * Clear all selections.
   */
  const clearSelection = () => {
    setSelectedArticleIds([])
  }

  /*
   * Selected article objects.
   */
  const selectedArticles = React.useMemo(() => {
    return selectedArticleIds
      .map((id) => articles.find((article) => article.id === id))
      .filter((article): article is Article => Boolean(article))
  }, [selectedArticleIds, articles])

  /*
   * Search articles.
   */
  const filteredArticles = React.useMemo(() => {
    const query = articleSearch.trim().toLowerCase()

    if (!query) {
      return articles
    }

    return articles.filter((article) => {
      return (
        article.title.toLowerCase().includes(query) ||
        article.slug.toLowerCase().includes(query) ||
        article.short_desc.toLowerCase().includes(query) ||
        article.category?.title?.toLowerCase().includes(query) ||
        article.user?.name?.toLowerCase().includes(query)
      )
    })
  }, [articles, articleSearch])

  /*
   * Send newsletter containing ALL selected articles.
   */
  const handleSendNewsletter = async () => {
    if (selectedArticles.length === 0) {
      setMessage({
        type: 'error',
        text: 'Please select at least one article.',
      })
      return
    }

    const activeSubscribers = subscribers.filter(
      (subscriber) => subscriber.status,
    )

    if (activeSubscribers.length === 0) {
      setMessage({
        type: 'error',
        text: 'No active subscribers found. Enable subscribers before sending.',
      })
      return
    }

    if (isSending) return

    const confirmed = window.confirm(
      `Send ${selectedArticles.length} ${
        selectedArticles.length === 1 ? 'article' : 'articles'
      } to ${activeSubscribers.length} active subscribers?`,
    )

    if (!confirmed) return

    setIsSending(true)
    setMessage(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleIds: selectedArticleIds,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error || 'Failed to send newsletter emails.')
      }

      setMessage({
        type: 'success',
        text: `Successfully sent the newsletter containing ${
          selectedArticles.length
        } ${
          selectedArticles.length === 1 ? 'article' : 'articles'
        } to ${result?.sentCount ?? 0} subscribers.`,
      })

      // Clear selection after successful send
      setSelectedArticleIds([])

      // Refresh subscriber statuses
      await fetchData()
    } catch (error) {
      console.error('Send newsletter error:', error)

      setMessage({
        type: 'error',
        text:
          error instanceof Error ? error.message : 'Error sending newsletter.',
      })
    } finally {
      setIsSending(false)
    }
  }

  /*
   * Enable / disable all subscribers.
   */
  const handleToggleAllStatus = async (targetStatus: boolean) => {
    if (isUpdatingStatus) return

    setIsUpdatingStatus(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/subscriptions/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: targetStatus,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result?.error || 'Failed to update subscriber statuses.',
        )
      }

      setMessage({
        type: 'success',
        text: `Updated ${result?.count ?? 0} subscribers to ${
          targetStatus ? 'ACTIVE' : 'INACTIVE'
        }.`,
      })

      await fetchData()
    } catch (error) {
      console.error('Status update error:', error)

      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Error updating subscriber statuses.',
      })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const activeCount = subscribers.filter(
    (subscriber) => subscriber.status,
  ).length

  const inactiveCount = subscribers.length - activeCount

  return (
    <div className='min-h-screen bg-[#F8F6F0] px-3 py-4 text-[#1A1A18] sm:px-6 sm:py-8 lg:px-10'>
      <div className='mx-auto max-w-[1500px]'>
        {/* Header */}
        <div className='mb-6 rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'>
          <div className='flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between'>
            <div className='flex min-w-0 items-center gap-3'>
              <div className='shrink-0 rounded-2xl bg-amber-50 p-3 text-amber-600'>
                <Mail size={24} />
              </div>

              <div className='min-w-0'>
                <h1 className='font-serif text-xl font-bold sm:text-2xl'>
                  Newsletter Dispatcher
                </h1>

                <p className='mt-1 text-xs leading-5 text-[#6B6860] sm:text-sm'>
                  Select one or multiple articles and send them together in a
                  single newsletter.
                </p>
              </div>
            </div>

            <div className='flex flex-wrap gap-2'>
              <button
                type='button'
                onClick={() => handleToggleAllStatus(true)}
                disabled={isUpdatingStatus || loadingData}
                className='flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none'
              >
                {isUpdatingStatus ? (
                  <RefreshCw size={15} className='animate-spin' />
                ) : (
                  <ToggleRight size={16} className='text-emerald-600' />
                )}
                Enable All
              </button>

              <button
                type='button'
                onClick={() => handleToggleAllStatus(false)}
                disabled={isUpdatingStatus || loadingData}
                className='flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-800 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none'
              >
                {isUpdatingStatus ? (
                  <RefreshCw size={15} className='animate-spin' />
                ) : (
                  <ToggleLeft size={16} className='text-rose-600' />
                )}
                Reset All
              </button>

              <button
                type='button'
                onClick={fetchData}
                disabled={loadingData}
                className='flex items-center justify-center gap-1.5 rounded-xl border border-[#E0DCD5] bg-white px-3 py-2.5 text-xs font-semibold text-[#4A4843] transition hover:bg-[#FAF8F5] disabled:opacity-50'
              >
                <RefreshCw
                  size={15}
                  className={loadingData ? 'animate-spin' : ''}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Notification */}
        {message && (
          <div
            className={`mb-6 flex items-start justify-between gap-3 rounded-2xl border p-4 text-xs font-medium ${
              message.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}
          >
            <div className='flex min-w-0 items-start gap-2'>
              {message.type === 'success' ? (
                <CheckCircle2
                  size={18}
                  className='mt-0.5 shrink-0 text-emerald-600'
                />
              ) : (
                <AlertCircle
                  size={18}
                  className='mt-0.5 shrink-0 text-rose-600'
                />
              )}

              <span className='leading-5'>{message.text}</span>
            </div>

            <button
              type='button'
              onClick={() => setMessage(null)}
              className='shrink-0 text-lg font-bold leading-none opacity-60 hover:opacity-100'
            >
              ×
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className='mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4'>
          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <div className='mb-2 flex items-center justify-between'>
              <FileText size={18} className='text-amber-600' />

              <span className='text-[10px] font-bold uppercase tracking-wider text-[#8C887B]'>
                Articles
              </span>
            </div>

            <p className='text-2xl font-bold'>{articles.length}</p>

            <p className='mt-1 text-[10px] text-[#8C887B]'>Available</p>
          </div>

          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <div className='mb-2 flex items-center justify-between'>
              <Check size={18} className='text-blue-600' />

              <span className='text-[10px] font-bold uppercase tracking-wider text-[#8C887B]'>
                Selected
              </span>
            </div>

            <p className='text-2xl font-bold text-blue-700'>
              {selectedArticles.length}
            </p>

            <p className='mt-1 text-[10px] text-[#8C887B]'>
              Newsletter articles
            </p>
          </div>

          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <div className='mb-2 flex items-center justify-between'>
              <Users size={18} className='text-emerald-600' />

              <span className='text-[10px] font-bold uppercase tracking-wider text-[#8C887B]'>
                Active
              </span>
            </div>

            <p className='text-2xl font-bold text-emerald-700'>{activeCount}</p>

            <p className='mt-1 text-[10px] text-[#8C887B]'>Subscribers</p>
          </div>

          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <div className='mb-2 flex items-center justify-between'>
              <Send size={18} className='text-purple-600' />

              <span className='text-[10px] font-bold uppercase tracking-wider text-[#8C887B]'>
                Queue
              </span>
            </div>

            <p className='text-2xl font-bold'>{activeCount}</p>

            <p className='mt-1 text-[10px] text-[#8C887B]'>Recipients</p>
          </div>
        </div>

        {/* Main */}
        <div className='grid grid-cols-1 gap-6 xl:grid-cols-12'>
          {/* Left */}
          <div className='space-y-6 xl:col-span-5'>
            {/* Article Selection */}
            <div className='rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'>
              <div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <h2 className='flex items-center gap-2 font-serif text-base font-bold'>
                  <FileText size={18} className='text-amber-600' />
                  Select Newsletter Articles
                </h2>

                <span className='w-fit rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700'>
                  {selectedArticles.length} Selected
                </span>
              </div>

              {/* Search */}
              <div className='mb-4'>
                <label className='mb-2 block text-xs font-semibold text-[#6B6860]'>
                  Search Articles
                </label>

                <div className='relative'>
                  <Search
                    size={16}
                    className='absolute left-3 top-1/2 -translate-y-1/2 text-[#8C887B]'
                  />

                  <input
                    type='text'
                    value={articleSearch}
                    onChange={(event) => setArticleSearch(event.target.value)}
                    placeholder='Search articles...'
                    className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] py-3 pl-9 pr-4 text-xs outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100'
                  />
                </div>
              </div>

              {/* Select / Clear buttons */}
              <div className='mb-4 flex gap-2'>
                <button
                  type='button'
                  onClick={selectAllFiltered}
                  disabled={filteredArticles.length === 0}
                  className='flex-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[10px] font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50'
                >
                  Select All
                </button>

                <button
                  type='button'
                  onClick={clearSelection}
                  disabled={selectedArticles.length === 0}
                  className='flex-1 rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-3 py-2.5 text-[10px] font-bold text-[#6B6860] transition hover:bg-[#F0ECE1] disabled:opacity-50'
                >
                  Clear Selection
                </button>
              </div>

              {/* Article List */}
              {loadingData ? (
                <div className='flex items-center justify-center gap-2 rounded-2xl border border-[#E0DCD5] bg-[#FAF8F5] p-8 text-xs text-[#8C887B]'>
                  <RefreshCw size={16} className='animate-spin' />
                  Loading articles...
                </div>
              ) : articles.length === 0 ? (
                <div className='rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center text-xs leading-5 text-amber-800'>
                  No articles found.
                  <br />
                  Check your <strong>getArticles()</strong> action and database.
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className='rounded-2xl border border-[#E0DCD5] bg-[#FAF8F5] p-5 text-center text-xs text-[#8C887B]'>
                  No articles match your search.
                </div>
              ) : (
                <div className='max-h-[520px] space-y-2 overflow-y-auto pr-1'>
                  {filteredArticles.map((article) => {
                    const isSelected = selectedArticleIds.includes(article.id)

                    return (
                      <button
                        key={article.id}
                        type='button'
                        onClick={() => toggleArticle(article.id)}
                        className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                          isSelected
                            ? 'border-amber-400 bg-amber-50 ring-1 ring-amber-200'
                            : 'border-[#E0DCD5] bg-[#FAF8F5] hover:border-amber-200 hover:bg-amber-50/40'
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                            isSelected
                              ? 'border-amber-600 bg-amber-600 text-white'
                              : 'border-[#D5D0C8] bg-white text-transparent'
                          }`}
                        >
                          <Check size={14} />
                        </div>

                        {/* Thumbnail */}
                        {article.image ? (
                          <img
                            src={article.image}
                            alt=''
                            className='h-12 w-16 shrink-0 rounded-lg object-cover'
                          />
                        ) : (
                          <div className='flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-[#EAE6DE] text-[#AAA59B]'>
                            <ImageIcon size={17} />
                          </div>
                        )}

                        {/* Info */}
                        <div className='min-w-0 flex-1'>
                          <p className='line-clamp-2 text-xs font-bold leading-4 text-[#1A1A18]'>
                            {article.title}
                          </p>

                          <div className='mt-1 flex flex-wrap items-center gap-2'>
                            {article.category?.title && (
                              <span className='truncate text-[9px] font-semibold text-amber-700'>
                                {article.category.title}
                              </span>
                            )}

                            {article.readTime && (
                              <span className='flex items-center gap-1 text-[9px] text-[#8C887B]'>
                                <Clock size={9} />
                                {article.readTime}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Selected Articles */}
            {selectedArticles.length > 0 && (
              <div className='rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'>
                <div className='mb-4 flex items-center justify-between'>
                  <div>
                    <h2 className='font-serif text-base font-bold'>
                      Newsletter Contents
                    </h2>

                    <p className='mt-1 text-[10px] text-[#8C887B]'>
                      {selectedArticles.length}{' '}
                      {selectedArticles.length === 1 ? 'article' : 'articles'}{' '}
                      will be included.
                    </p>
                  </div>

                  <button
                    type='button'
                    onClick={clearSelection}
                    className='text-[10px] font-bold text-rose-600 hover:underline'
                  >
                    Clear All
                  </button>
                </div>

                <div className='space-y-2'>
                  {selectedArticles.map((article, index) => (
                    <div
                      key={article.id}
                      className='flex items-center gap-3 rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] p-2.5'
                    >
                      <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[9px] font-bold text-amber-700'>
                        {index + 1}
                      </span>

                      {article.image ? (
                        <img
                          src={article.image}
                          alt=''
                          className='h-10 w-12 shrink-0 rounded-lg object-cover'
                        />
                      ) : (
                        <div className='flex h-10 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EAE6DE] text-[#AAA59B]'>
                          <ImageIcon size={15} />
                        </div>
                      )}

                      <p className='min-w-0 flex-1 truncate text-xs font-semibold'>
                        {article.title}
                      </p>

                      <button
                        type='button'
                        onClick={() => removeArticle(article.id)}
                        className='shrink-0 rounded-lg p-1.5 text-[#8C887B] transition hover:bg-rose-50 hover:text-rose-600'
                        title='Remove article'
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subscriber Status */}
            <div className='rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'>
              <div className='mb-4 flex items-center justify-between'>
                <div>
                  <h2 className='font-serif text-base font-bold'>
                    Subscriber Status
                  </h2>

                  <p className='mt-1 text-[10px] text-[#8C887B]'>
                    {subscribers.length} total subscribers
                  </p>
                </div>

                <span className='rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700'>
                  {activeCount} Active
                </span>
              </div>

              <div className='max-h-[300px] overflow-y-auto rounded-xl border border-[#E0DCD5] bg-[#FAF8F5]'>
                {subscribers.length === 0 ? (
                  <div className='p-8 text-center text-xs text-[#8C887B]'>
                    No subscribers found.
                  </div>
                ) : (
                  <div className='divide-y divide-[#E0DCD5]'>
                    {subscribers.map((subscriber) => (
                      <div
                        key={subscriber.id}
                        className='flex items-center justify-between gap-3 p-3'
                      >
                        <p className='min-w-0 truncate font-mono text-[10px]'>
                          {subscriber.email}
                        </p>

                        {subscriber.status ? (
                          <span className='shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-700'>
                            Active
                          </span>
                        ) : (
                          <span className='shrink-0 rounded-full bg-gray-100 px-2 py-1 text-[9px] font-bold text-gray-500'>
                            Inactive
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - Preview */}
          <div className='min-w-0 rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6 xl:col-span-7'>
            <div className='mb-4 flex flex-col gap-3 border-b border-[#E0DCD5] pb-3 sm:flex-row sm:items-center sm:justify-between'>
              <h2 className='flex items-center gap-2 font-serif text-base font-bold'>
                <Eye size={18} className='text-amber-600' />
                Newsletter Preview
              </h2>

              <span className='w-fit rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700'>
                {selectedArticles.length}{' '}
                {selectedArticles.length === 1 ? 'Article' : 'Articles'}
              </span>
            </div>

            {selectedArticles.length === 0 ? (
              <div className='flex min-h-[500px] flex-col items-center justify-center px-6 text-center text-[#8C887B]'>
                <div className='mb-4 rounded-2xl bg-[#FAF8F5] p-5'>
                  <Mail size={34} className='text-[#AAA59B]' />
                </div>

                <p className='text-xs font-semibold'>
                  Select one or more articles
                </p>

                <p className='mt-2 max-w-sm text-[10px] leading-5 text-[#AAA59B]'>
                  Every selected article will appear in the same newsletter
                  email.
                </p>
              </div>
            ) : (
              <>
                {/* Email Preview */}
                <div className='overflow-x-auto rounded-2xl bg-[#F4F4F0] p-3 sm:p-6 lg:p-8'>
                  <table
                    role='presentation'
                    cellPadding={0}
                    cellSpacing={0}
                    width='100%'
                    style={{
                      maxWidth: '560px',
                      margin: '0 auto',
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #E0DCD5',
                      fontFamily: 'Georgia, serif',
                      color: '#1A1A18',
                    }}
                  >
                    <tbody>
                      {/* Email Header */}
                      <tr>
                        <td
                          style={{
                            padding: '28px 24px 18px',
                            borderBottom: '1px solid #F0ECE1',
                          }}
                        >
                          <table width='100%' cellPadding={0} cellSpacing={0}>
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  Education With Hamza
                                </td>

                                <td
                                  align='right'
                                  style={{
                                    fontSize: '10px',
                                    color: '#8C887B',
                                    fontFamily: 'Arial, sans-serif',
                                  }}
                                >
                                  NEWSLETTER
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      {/* Intro */}
                      <tr>
                        <td
                          style={{
                            padding: '24px 24px 10px',
                          }}
                        >
                          <h1
                            style={{
                              margin: 0,
                              fontSize: '24px',
                              lineHeight: '1.3',
                              fontWeight: 'bold',
                              color: '#1A1A18',
                            }}
                          >
                            Latest from Education With Hamza
                          </h1>

                          <p
                            style={{
                              margin: '8px 0 0 0',
                              fontSize: '13px',
                              lineHeight: '1.6',
                              color: '#6B6860',
                              fontFamily: 'Arial, sans-serif',
                            }}
                          >
                            Here are our latest educational articles for you.
                          </p>
                        </td>
                      </tr>

                      {/* Articles */}
                      {selectedArticles.map((article, index) => (
                        <React.Fragment key={article.id}>
                          <tr>
                            <td
                              style={{
                                padding: '18px 24px 24px',
                              }}
                            >
                              {article.image && (
                                <img
                                  src={article.image}
                                  alt={article.title}
                                  width='100%'
                                  style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '240px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    display: 'block',
                                    marginBottom: '18px',
                                  }}
                                />
                              )}

                              <div
                                style={{
                                  fontSize: '10px',
                                  color: '#B27A00',
                                  fontFamily: 'Arial, sans-serif',
                                  fontWeight: 'bold',
                                  textTransform: 'uppercase',
                                  marginBottom: '7px',
                                }}
                              >
                                {article.category?.title ||
                                  `Article ${index + 1}`}
                              </div>

                              <h2
                                style={{
                                  margin: '0 0 10px 0',
                                  fontSize: '20px',
                                  lineHeight: '1.35',
                                  fontWeight: 'bold',
                                  color: '#1A1A18',
                                }}
                              >
                                {article.title}
                              </h2>

                              <p
                                style={{
                                  margin: '0 0 16px 0',
                                  fontSize: '13px',
                                  lineHeight: '1.6',
                                  color: '#4A4843',
                                  fontFamily: 'Arial, sans-serif',
                                }}
                              >
                                {article.short_desc}
                              </p>

                              <table cellPadding={0} cellSpacing={0}>
                                <tbody>
                                  <tr>
                                    <td
                                      align='center'
                                      style={{
                                        backgroundColor: '#1A1A18',
                                        borderRadius: '6px',
                                      }}
                                    >
                                      <a
                                        href={`https://www.blog.ewhamza.com/articles/${article.slug}`}
                                        target='_blank'
                                        rel='noreferrer'
                                        style={{
                                          display: 'inline-block',
                                          padding: '11px 20px',
                                          fontSize: '12px',
                                          color: '#ffffff',
                                          textDecoration: 'none',
                                          fontWeight: 'bold',
                                          fontFamily: 'Arial, sans-serif',
                                        }}
                                      >
                                        Read Article →
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>

                          {/* Divider */}
                          {index < selectedArticles.length - 1 && (
                            <tr>
                              <td
                                style={{
                                  padding: '0 24px',
                                }}
                              >
                                <div
                                  style={{
                                    borderTop: '1px solid #F0ECE1',
                                  }}
                                />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}

                      {/* Footer */}
                      <tr>
                        <td
                          style={{
                            backgroundColor: '#FAF8F5',
                            padding: '24px',
                            borderTop: '1px solid #F0ECE1',
                            borderRadius: '0 0 12px 12px',
                            textAlign: 'center',
                            fontSize: '11px',
                            lineHeight: '1.6',
                            color: '#8C887B',
                            fontFamily: 'Arial, sans-serif',
                          }}
                        >
                          You are receiving this email because you subscribed to
                          Education With Hamza updates.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className='mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='text-xs text-[#6B6860]'>
                    <strong className='text-[#1A1A18]'>
                      {selectedArticles.length}
                    </strong>{' '}
                    {selectedArticles.length === 1 ? 'article' : 'articles'}{' '}
                    will be sent to{' '}
                    <strong className='text-[#1A1A18]'>{activeCount}</strong>{' '}
                    active subscribers.
                  </div>

                  <button
                    type='button'
                    onClick={handleSendNewsletter}
                    disabled={
                      isSending ||
                      selectedArticles.length === 0 ||
                      activeCount === 0
                    }
                    className='flex items-center justify-center gap-2 rounded-xl bg-[#1A1A18] px-5 py-3 text-xs font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    {isSending ? (
                      <>
                        <RefreshCw size={15} className='animate-spin' />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={15} className='text-amber-400' />
                        Send Newsletter
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {selectedArticles.length > 0 && (
              <div className='mt-5 border-t border-[#E0DCD5] pt-4'>
                <div className='space-y-2'>
                  {selectedArticles.map((article) => (
                    <a
                      key={article.id}
                      href={`https://www.blog.ewhamza.com/articles/${article.slug}`}
                      target='_blank'
                      rel='noreferrer'
                      className='flex items-center gap-2 rounded-xl bg-[#FAF8F5] px-3 py-2.5 text-[10px] font-semibold text-[#4A4843] transition hover:bg-[#F0ECE1]'
                    >
                      <ExternalLink size={13} />

                      <span className='min-w-0 flex-1 truncate'>
                        {article.title}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
