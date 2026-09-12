'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Star,
  MessageSquareQuote,
  Trash2,
  Loader2,
  RefreshCw,
  MessageCircleReply,
  ExternalLink,
} from 'lucide-react'

import { getReviews, deleteReview } from '@/utils/admin/action'

interface ReviewItem {
  id: string
  name: string
  email: string
  content: string
  rating: number | null
  createdAt: string | Date

  article?: {
    id: string
    title: string
    slug: string
  } | null

  articleId?: string | null
  parentId?: string | null

  parent?: {
    id: string
    name: string
    content: string
  } | null
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([])

  const [ratingFilter, setRatingFilter] = useState<number | 'ALL'>('ALL')

  const [typeFilter, setTypeFilter] = useState<'ALL' | 'REVIEWS' | 'REPLIES'>(
    'ALL',
  )

  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadReviews = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      setError('')

      const result = await getReviews()

      setReviews(result ?? [])
    } catch (error) {
      console.error('Failed to load reviews:', error)

      setError(
        error instanceof Error ? error.message : 'Failed to load reviews.',
      )
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [])

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const isReply = Boolean(review.parentId)

      if (typeFilter === 'REVIEWS' && isReply) {
        return false
      }

      if (typeFilter === 'REPLIES' && !isReply) {
        return false
      }

      if (ratingFilter !== 'ALL') {
        if (review.rating === null || review.rating !== ratingFilter) {
          return false
        }
      }

      return true
    })
  }, [reviews, ratingFilter, typeFilter])

  const handleDelete = async (id: string) => {
    const review = reviews.find((item) => item.id === id)

    const hasReplies = reviews.some((item) => item.parentId === id)

    const message = hasReplies
      ? 'This comment has replies. Deleting it will also delete its entire reply thread. Are you sure?'
      : review?.parentId
        ? 'Are you sure you want to delete this reply? This action cannot be undone.'
        : 'Are you sure you want to delete this review? This action cannot be undone.'

    const confirmed = window.confirm(message)

    if (!confirmed) return

    setIsDeleting(id)
    setError('')
    setSuccess('')

    try {
      await deleteReview(id)

      /*
       * Remove the deleted item and all of its descendants
       * from the local state.
       */
      setReviews((prev) => {
        const idsToRemove = new Set<string>([id])

        let changed = true

        while (changed) {
          changed = false

          for (const item of prev) {
            if (
              item.parentId &&
              idsToRemove.has(item.parentId) &&
              !idsToRemove.has(item.id)
            ) {
              idsToRemove.add(item.id)
              changed = true
            }
          }
        }

        return prev.filter((item) => !idsToRemove.has(item.id))
      })

      setSuccess(
        hasReplies
          ? 'Review and its reply thread deleted successfully.'
          : 'Review deleted successfully.',
      )

      setTimeout(() => {
        setSuccess('')
      }, 3500)
    } catch (error) {
      console.error('Failed to delete review:', error)

      setError(
        error instanceof Error ? error.message : 'Failed to delete review.',
      )
    } finally {
      setIsDeleting(null)
    }
  }

  const renderStars = (rating: number | null) => {
    if (rating === null || rating === undefined) {
      return (
        <span className='inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-500'>
          No rating
        </span>
      )
    }

    return (
      <div
        className='flex items-center gap-0.5'
        aria-label={`${rating} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            }
          />
        ))}
      </div>
    )
  }

  const formatDate = (date: string | Date) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return 'Unknown date'
    }
  }

  const formatDateTime = (date: string | Date) => {
    try {
      return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    } catch {
      return 'Unknown date'
    }
  }

  const topLevelReviews = useMemo(
    () => reviews.filter((review) => !review.parentId),
    [reviews],
  )

  const replies = useMemo(
    () => reviews.filter((review) => Boolean(review.parentId)),
    [reviews],
  )

  const ratedReviews = useMemo(
    () =>
      reviews.filter(
        (review) => review.rating !== null && review.rating !== undefined,
      ),
    [reviews],
  )

  const totalReviews = reviews.length

  const averageRating =
    ratedReviews.length > 0
      ? (
          ratedReviews.reduce(
            (total, review) => total + Number(review.rating),
            0,
          ) / ratedReviews.length
        ).toFixed(1)
      : '0.0'

  const fiveStarReviews = ratedReviews.filter(
    (review) => review.rating === 5,
  ).length

  const oneStarReviews = ratedReviews.filter(
    (review) => review.rating === 1,
  ).length

  return (
    <div className='min-h-screen bg-[#F8F6F0] p-4 text-[#1A1A18] sm:p-6 md:p-10'>
      <div className='mx-auto max-w-[1600px] space-y-6'>
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className='rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'>
          <div className='flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between'>
            <div className='flex items-start gap-3'>
              <div className='shrink-0 rounded-2xl bg-amber-50 p-3 text-amber-600'>
                <MessageSquareQuote size={22} />
              </div>

              <div>
                <h1 className='font-serif text-xl font-bold text-[#1A1A18] sm:text-2xl'>
                  Reviews & Discussions
                </h1>

                <p className='mt-0.5 text-xs italic text-[#6B6860]'>
                  Monitor reader feedback, ratings, and threaded article
                  discussions
                </p>
              </div>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
              {/* TYPE FILTER */}

              <div className='flex items-center gap-2'>
                <span className='whitespace-nowrap text-xs font-semibold text-[#6B6860]'>
                  Type:
                </span>

                <select
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(
                      event.target.value as 'ALL' | 'REVIEWS' | 'REPLIES',
                    )
                  }
                  className='rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#1A1A18] outline-none transition focus:border-amber-500'
                >
                  <option value='ALL'>All Discussions</option>

                  <option value='REVIEWS'>Top-level Reviews</option>

                  <option value='REPLIES'>Replies Only</option>
                </select>
              </div>

              {/* RATING FILTER */}

              <div className='flex items-center gap-2'>
                <span className='whitespace-nowrap text-xs font-semibold text-[#6B6860]'>
                  Rating:
                </span>

                <select
                  value={ratingFilter}
                  onChange={(event) => {
                    const value = event.target.value

                    setRatingFilter(value === 'ALL' ? 'ALL' : Number(value))
                  }}
                  className='rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#1A1A18] outline-none transition focus:border-amber-500'
                >
                  <option value='ALL'>All Ratings</option>

                  <option value='5'>5 Stars</option>

                  <option value='4'>4 Stars</option>

                  <option value='3'>3 Stars</option>

                  <option value='2'>2 Stars</option>

                  <option value='1'>1 Star</option>
                </select>
              </div>

              {/* REFRESH */}

              <button
                type='button'
                onClick={() => loadReviews(true)}
                disabled={isRefreshing || isLoading}
                className='inline-flex items-center justify-center gap-2 rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-4 py-2 text-xs font-semibold text-[#4A4843] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50'
              >
                <RefreshCw
                  size={14}
                  className={isRefreshing ? 'animate-spin' : ''}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================
            ALERTS
        ====================================================== */}

        {error && (
          <div className='rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
            {error}
          </div>
        )}

        {success && (
          <div className='rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
            {success}
          </div>
        )}

        {/* ======================================================
            STATISTICS
        ====================================================== */}

        <div className='grid grid-cols-2 gap-3 lg:grid-cols-6'>
          {/* TOTAL */}

          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <p className='text-xs font-medium text-[#8C887B]'>Total</p>

            <p className='mt-1 text-2xl font-bold text-[#1A1A18]'>
              {totalReviews}
            </p>
          </div>

          {/* REVIEWS */}

          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <p className='text-xs font-medium text-[#8C887B]'>Reviews</p>

            <p className='mt-1 text-2xl font-bold text-[#3d348b]'>
              {topLevelReviews.length}
            </p>
          </div>

          {/* REPLIES */}

          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <p className='text-xs font-medium text-[#8C887B]'>Replies</p>

            <p className='mt-1 text-2xl font-bold text-[#7678ed]'>
              {replies.length}
            </p>
          </div>

          {/* AVERAGE */}

          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <p className='text-xs font-medium text-[#8C887B]'>Average Rating</p>

            <div className='mt-1 flex items-center gap-2'>
              <p className='text-2xl font-bold text-[#1A1A18]'>
                {averageRating}
              </p>

              <Star size={18} className='fill-amber-400 text-amber-400' />
            </div>
          </div>

          {/* FIVE STAR */}

          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <p className='text-xs font-medium text-[#8C887B]'>5 Star</p>

            <p className='mt-1 text-2xl font-bold text-emerald-600'>
              {fiveStarReviews}
            </p>
          </div>

          {/* ONE STAR */}

          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <p className='text-xs font-medium text-[#8C887B]'>1 Star</p>

            <p className='mt-1 text-2xl font-bold text-rose-600'>
              {oneStarReviews}
            </p>
          </div>
        </div>

        {/* ======================================================
            REVIEWS TABLE
        ====================================================== */}

        <div className='overflow-hidden rounded-3xl border border-[#E0DCD5] bg-white shadow-sm'>
          {/* MOBILE HEADER */}

          <div className='flex items-center justify-between border-b border-[#E0DCD5] bg-[#FAF8F5] px-5 py-4 lg:hidden'>
            <div>
              <h2 className='text-sm font-bold text-[#1A1A18]'>Discussions</h2>

              <p className='mt-0.5 text-xs text-[#8C887B]'>
                {filteredReviews.length}{' '}
                {filteredReviews.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          {/* LOADING */}

          {isLoading ? (
            <div className='flex min-h-[300px] items-center justify-center'>
              <div className='flex flex-col items-center gap-3'>
                <Loader2 size={28} className='animate-spin text-amber-600' />

                <p className='text-sm text-[#8C887B]'>Loading discussions...</p>
              </div>
            </div>
          ) : filteredReviews.length === 0 ? (
            /* EMPTY */
            <div className='flex min-h-[300px] items-center justify-center px-6'>
              <div className='text-center'>
                <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#8C887B]'>
                  <MessageSquareQuote size={22} />
                </div>

                <h3 className='text-sm font-semibold text-[#1A1A18]'>
                  No discussions found
                </h3>

                <p className='mt-1 text-xs text-[#8C887B]'>
                  There are no discussions matching the selected filters.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* ==================================================
                  DESKTOP TABLE
              ================================================== */}

              <div className='hidden overflow-x-auto lg:block'>
                <table className='w-full min-w-[1200px] border-collapse text-left'>
                  <thead>
                    <tr className='border-b border-[#E0DCD5] bg-[#FAF8F5] text-xs font-semibold text-[#6B6860]'>
                      <th className='p-4 pl-6'>Participant</th>

                      <th className='p-4'>Type</th>

                      <th className='p-4'>Rating</th>

                      <th className='min-w-[300px] p-4'>Content</th>

                      <th className='p-4'>Article</th>

                      <th className='p-4'>Date</th>

                      <th className='p-4 pr-6 text-right'>Action</th>
                    </tr>
                  </thead>

                  <tbody className='divide-y divide-[#E0DCD5] text-sm'>
                    {filteredReviews.map((review) => {
                      const isReply = Boolean(review.parentId)

                      return (
                        <tr
                          key={review.id}
                          className={`transition-colors hover:bg-[#FAF8F5] ${
                            isReply ? 'bg-[#FCFBFF]' : ''
                          }`}
                        >
                          {/* PARTICIPANT */}

                          <td className='p-4 pl-6'>
                            <div className='max-w-[210px]'>
                              <div className='flex items-center gap-2'>
                                {isReply && (
                                  <MessageCircleReply
                                    size={14}
                                    className='shrink-0 text-[#7678ed]'
                                  />
                                )}

                                <div className='truncate font-medium text-[#1A1A18]'>
                                  {review.name}
                                </div>
                              </div>

                              <div
                                className='mt-0.5 truncate font-mono text-xs text-[#8C887B]'
                                title={review.email}
                              >
                                {review.email}
                              </div>
                            </div>
                          </td>

                          {/* TYPE */}

                          <td className='p-4'>
                            {isReply ? (
                              <span className='inline-flex items-center gap-1.5 rounded-lg bg-[#7678ed]/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#3d348b]'>
                                <MessageCircleReply size={12} />
                                Reply
                              </span>
                            ) : (
                              <span className='inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-amber-700'>
                                <MessageSquareQuote size={12} />
                                Review
                              </span>
                            )}
                          </td>

                          {/* RATING */}

                          <td className='p-4 whitespace-nowrap'>
                            {renderStars(review.rating)}
                          </td>

                          {/* CONTENT */}

                          <td className='max-w-md p-4'>
                            {isReply && review.parent && (
                              <div className='mb-2 rounded-lg border-l-2 border-[#7678ed]/40 bg-[#7678ed]/5 px-3 py-2'>
                                <p className='text-[10px] font-bold uppercase tracking-wide text-[#7678ed]'>
                                  Replying to {review.parent.name}
                                </p>

                                <p className='mt-0.5 line-clamp-1 text-[11px] text-gray-500'>
                                  {review.parent.content}
                                </p>
                              </div>
                            )}

                            <p
                              className='line-clamp-3 text-xs leading-relaxed text-[#4A4843]'
                              title={review.content}
                            >
                              {review.content}
                            </p>
                          </td>

                          {/* ARTICLE */}

                          <td className='p-4 text-xs'>
                            {review.article ? (
                              <a
                                href={`/control/articles/${review.article.slug}`}
                                className='inline-flex max-w-[220px] items-center gap-1 truncate font-medium text-amber-700 hover:underline'
                                title={review.article.title}
                              >
                                <span className='truncate'>
                                  {review.article.title}
                                </span>

                                <ExternalLink size={11} className='shrink-0' />
                              </a>
                            ) : (
                              <span className='italic text-[#8C887B]'>
                                General / None
                              </span>
                            )}
                          </td>

                          {/* DATE */}

                          <td className='p-4 whitespace-nowrap text-xs text-[#8C887B]'>
                            <span title={formatDateTime(review.createdAt)}>
                              {formatDate(review.createdAt)}
                            </span>
                          </td>

                          {/* ACTION */}

                          <td className='p-4 pr-6 text-right'>
                            <button
                              type='button'
                              onClick={() => handleDelete(review.id)}
                              disabled={isDeleting === review.id}
                              className='inline-flex items-center justify-center rounded-xl p-2 text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50'
                              title={isReply ? 'Delete Reply' : 'Delete Review'}
                            >
                              {isDeleting === review.id ? (
                                <Loader2 size={16} className='animate-spin' />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className='divide-y divide-[#E0DCD5] lg:hidden'>
                {filteredReviews.map((review) => {
                  const isReply = Boolean(review.parentId)

                  return (
                    <div key={review.id} className='p-5'>
                      <div className='flex items-start justify-between gap-3'>
                        <div className='min-w-0'>
                          <div className='flex items-center gap-2'>
                            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3d348b]/10 text-xs font-bold text-[#3d348b]'>
                              {review.name.trim().charAt(0).toUpperCase()}
                            </div>

                            <div className='min-w-0'>
                              <h3 className='truncate text-sm font-bold text-[#1A1A18]'>
                                {review.name}
                              </h3>

                              <p className='truncate text-[11px] text-[#8C887B]'>
                                {review.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          type='button'
                          onClick={() => handleDelete(review.id)}
                          disabled={isDeleting === review.id}
                          className='shrink-0 rounded-xl p-2 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50'
                          title='Delete'
                        >
                          {isDeleting === review.id ? (
                            <Loader2 size={16} className='animate-spin' />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>

                      <div className='mt-4 flex flex-wrap items-center gap-2'>
                        {isReply ? (
                          <span className='inline-flex items-center gap-1.5 rounded-lg bg-[#7678ed]/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#3d348b]'>
                            <MessageCircleReply size={12} />
                            Reply
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-amber-700'>
                            <MessageSquareQuote size={12} />
                            Review
                          </span>
                        )}

                        {renderStars(review.rating)}
                      </div>

                      {isReply && review.parent && (
                        <div className='mt-4 rounded-xl border-l-2 border-[#7678ed] bg-[#7678ed]/5 px-3 py-2.5'>
                          <p className='text-[10px] font-bold uppercase tracking-wide text-[#7678ed]'>
                            Replying to {review.parent.name}
                          </p>

                          <p className='mt-1 line-clamp-2 text-xs text-gray-500'>
                            {review.parent.content}
                          </p>
                        </div>
                      )}

                      <div className='mt-4 rounded-xl bg-[#FAF8F5] p-4'>
                        <p className='text-sm leading-6 text-[#4A4843]'>
                          {review.content}
                        </p>
                      </div>

                      <div className='mt-4 flex flex-col gap-2'>
                        {review.article && (
                          <a
                            href={`/control/articles/${review.article.slug}`}
                            className='flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:underline'
                          >
                            <span className='truncate'>
                              {review.article.title}
                            </span>

                            <ExternalLink size={11} className='shrink-0' />
                          </a>
                        )}

                        <p className='text-[11px] text-[#8C887B]'>
                          {formatDateTime(review.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {!isLoading && filteredReviews.length > 0 && (
          <div className='text-center text-xs text-[#8C887B]'>
            Showing {filteredReviews.length} of {reviews.length} discussions
          </div>
        )}
      </div>
    </div>
  )
}
