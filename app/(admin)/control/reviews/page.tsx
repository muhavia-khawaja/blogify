'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Star,
  MessageSquareQuote,
  Trash2,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { getReviews, deleteReview } from '@/utils/admin/action'

interface ReviewItem {
  id: string
  name: string
  email: string
  content: string
  rating: number
  createdAt: string | Date
  article?: {
    id: string
    title: string
    slug: string
  } | null
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [ratingFilter, setRatingFilter] = useState<number | 'ALL'>('ALL')

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
    if (ratingFilter === 'ALL') {
      return reviews
    }

    return reviews.filter((review) => review.rating === ratingFilter)
  }, [reviews, ratingFilter])

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this review? This action cannot be undone.',
    )

    if (!confirmed) return

    setIsDeleting(id)
    setError('')
    setSuccess('')

    try {
      await deleteReview(id)

      setReviews((prev) => prev.filter((review) => review.id !== id))

      setSuccess('Review deleted successfully.')

      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (error) {
      console.error('Failed to delete review:', error)

      setError(
        error instanceof Error ? error.message : 'Failed to delete review.',
      )
    } finally {
      setIsDeleting(null)
    }
  }

  const renderStars = (rating: number) => {
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

  const totalReviews = reviews.length

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((total, review) => total + review.rating, 0) /
          totalReviews
        ).toFixed(1)
      : '0.0'

  const fiveStarReviews = reviews.filter((review) => review.rating === 5).length

  const oneStarReviews = reviews.filter((review) => review.rating === 1).length

  return (
    <div className='min-h-screen bg-[#F8F6F0] p-4 text-[#1A1A18] sm:p-6 md:p-10'>
      <div className='mx-auto max-w-[1600px] space-y-6'>
        <div className='rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'>
          <div className='flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between'>
            <div className='flex items-start gap-3'>
              <div className='shrink-0 rounded-2xl bg-amber-50 p-3 text-amber-600'>
                <MessageSquareQuote size={22} />
              </div>

              <div>
                <h1 className='font-serif text-xl font-bold text-[#1A1A18] sm:text-2xl'>
                  Reviews
                </h1>

                <p className='mt-0.5 text-xs italic text-[#6B6860]'>
                  Monitor feedback, reader ratings, and article discussions
                </p>
              </div>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
              <div className='flex items-center gap-2'>
                <span className='whitespace-nowrap text-xs font-semibold text-[#6B6860]'>
                  Filter Rating:
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

        <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <p className='text-xs font-medium text-[#8C887B]'>Total Reviews</p>

            <p className='mt-1 text-2xl font-bold text-[#1A1A18]'>
              {totalReviews}
            </p>
          </div>

          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <p className='text-xs font-medium text-[#8C887B]'>Average Rating</p>

            <div className='mt-1 flex items-center gap-2'>
              <p className='text-2xl font-bold text-[#1A1A18]'>
                {averageRating}
              </p>

              <Star size={18} className='fill-amber-400 text-amber-400' />
            </div>
          </div>

          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <p className='text-xs font-medium text-[#8C887B]'>5 Star Reviews</p>

            <p className='mt-1 text-2xl font-bold text-emerald-600'>
              {fiveStarReviews}
            </p>
          </div>

          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <p className='text-xs font-medium text-[#8C887B]'>1 Star Reviews</p>

            <p className='mt-1 text-2xl font-bold text-rose-600'>
              {oneStarReviews}
            </p>
          </div>
        </div>

        <div className='overflow-hidden rounded-3xl border border-[#E0DCD5] bg-white shadow-sm'>
          <div className='flex items-center justify-between border-b border-[#E0DCD5] bg-[#FAF8F5] px-5 py-4 lg:hidden'>
            <div>
              <h2 className='text-sm font-bold text-[#1A1A18]'>Reviews</h2>

              <p className='mt-0.5 text-xs text-[#8C887B]'>
                {filteredReviews.length} review
                {filteredReviews.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className='flex min-h-[300px] items-center justify-center'>
              <div className='flex flex-col items-center gap-3'>
                <Loader2 size={28} className='animate-spin text-amber-600' />

                <p className='text-sm text-[#8C887B]'>Loading reviews...</p>
              </div>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className='flex min-h-[300px] items-center justify-center px-6'>
              <div className='text-center'>
                <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#8C887B]'>
                  <MessageSquareQuote size={22} />
                </div>

                <h3 className='text-sm font-semibold text-[#1A1A18]'>
                  No reviews found
                </h3>

                <p className='mt-1 text-xs text-[#8C887B]'>
                  There are no reviews matching the selected filter.
                </p>
              </div>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[1000px] border-collapse text-left'>
                <thead>
                  <tr className='border-b border-[#E0DCD5] bg-[#FAF8F5] text-xs font-semibold text-[#6B6860]'>
                    <th className='p-4 pl-6'>Reviewer</th>

                    <th className='p-4'>Rating</th>

                    <th className='min-w-[280px] p-4'>Review Content</th>

                    <th className='p-4'>Article</th>

                    <th className='p-4'>Date</th>

                    <th className='p-4 pr-6 text-right'>Action</th>
                  </tr>
                </thead>

                <tbody className='divide-y divide-[#E0DCD5] text-sm'>
                  {filteredReviews.map((review) => (
                    <tr
                      key={review.id}
                      className='transition-colors hover:bg-[#FAF8F5]'
                    >
                      <td className='p-4 pl-6'>
                        <div className='max-w-[200px]'>
                          <div className='truncate font-medium text-[#1A1A18]'>
                            {review.name}
                          </div>

                          <div
                            className='truncate font-mono text-xs text-[#8C887B]'
                            title={review.email}
                          >
                            {review.email}
                          </div>
                        </div>
                      </td>

                      <td className='p-4 whitespace-nowrap'>
                        {renderStars(review.rating)}
                      </td>

                      <td className='max-w-md p-4'>
                        <p
                          className='line-clamp-3 text-xs leading-relaxed text-[#4A4843]'
                          title={review.content}
                        >
                          {review.content}
                        </p>
                      </td>

                      <td className='p-4 text-xs'>
                        {review.article ? (
                          <a
                            href={`/control/articles/${review.article.slug}`}
                            className='inline-flex max-w-[220px] truncate font-medium text-amber-700 hover:underline'
                            title={review.article.title}
                          >
                            {review.article.title}
                          </a>
                        ) : (
                          <span className='italic text-[#8C887B]'>
                            General / None
                          </span>
                        )}
                      </td>

                      <td className='p-4 whitespace-nowrap text-xs text-[#8C887B]'>
                        {formatDate(review.createdAt)}
                      </td>

                      <td className='p-4 pr-6 text-right'>
                        <button
                          type='button'
                          onClick={() => handleDelete(review.id)}
                          disabled={isDeleting === review.id}
                          className='inline-flex items-center justify-center rounded-xl p-2 text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50'
                          title='Delete Review'
                        >
                          {isDeleting === review.id ? (
                            <Loader2 size={16} className='animate-spin' />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!isLoading && filteredReviews.length > 0 && (
          <div className='text-center text-xs text-[#8C887B]'>
            Showing {filteredReviews.length} of {reviews.length} reviews
          </div>
        )}
      </div>
    </div>
  )
}
