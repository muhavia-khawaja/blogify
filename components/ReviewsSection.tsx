'use client'

import { FormEvent, useMemo, useState } from 'react'
import { CheckCircle2, MessageCircle, Reply, Send, Star, X } from 'lucide-react'

type Review = {
  id: string
  content: string
  name: string
  email: string
  rating: number | null
  createdAt: string | Date
  articleId?: string | null
  parentId?: string | null
  replies?: Review[]
}

type ReviewsSectionProps = {
  reviews: Review[]
  articleId: string
  createReview: (data: {
    articleId: string
    content: string
    name: string
    email: string
    rating: number | null
    parentId: string | null
  }) => Promise<{
    success: boolean
    message?: string
    review?: Review
  }>
}

function getInitial(name: string) {
  return name?.trim()?.charAt(0)?.toUpperCase() || '?'
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function buildTree(reviews: Review[]) {
  const map = new Map<string, Review>()
  const roots: Review[] = []

  reviews.forEach((review) => {
    map.set(review.id, {
      ...review,
      replies: [],
    })
  })

  reviews.forEach((review) => {
    const current = map.get(review.id)!

    if (!review.parentId) {
      roots.push(current)
      return
    }

    const parent = map.get(review.parentId)

    if (parent) {
      if (!parent.replies) {
        parent.replies = []
      }

      parent.replies.push(current)
    } else {
      // Safety fallback if the parent was deleted
      roots.push(current)
    }
  })

  return roots
}

export default function ReviewsSection({
  reviews,
  articleId,
  createReview,
}: ReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false)

  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(5)

  const [replyName, setReplyName] = useState('')
  const [replyEmail, setReplyEmail] = useState('')
  const [replyContent, setReplyContent] = useState('')

  const [hoverRating, setHoverRating] = useState(0)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const reviewTree = useMemo(() => buildTree(reviews), [reviews])

  const averageRating = useMemo(() => {
    const ratedReviews = reviews.filter(
      (review) => typeof review.rating === 'number',
    )

    if (!ratedReviews.length) return 0

    return (
      ratedReviews.reduce((total, review) => total + (review.rating || 0), 0) /
      ratedReviews.length
    )
  }, [reviews])

  const displayedReviews = showAll ? reviewTree : reviewTree.slice(0, 3)

  async function handleCreateReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim() || !email.trim() || !content.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const result = await createReview({
        articleId,
        content: content.trim(),
        name: name.trim(),
        email: email.trim(),
        rating,
        parentId: null,
      })

      if (!result.success) {
        setError(result.message || 'Unable to submit your review.')
        return
      }

      setContent('')
      setRating(5)
      setSuccess('Your review has been submitted successfully.')

      setTimeout(() => {
        setSuccess('')
      }, 4000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleReply(
    event: FormEvent<HTMLFormElement>,
    parentId: string,
  ) {
    event.preventDefault()

    if (!replyName.trim() || !replyEmail.trim() || !replyContent.trim()) {
      setError('Please fill in all reply fields.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const result = await createReview({
        articleId,
        content: replyContent.trim(),
        name: replyName.trim(),
        email: replyEmail.trim(),
        rating: null,
        parentId,
      })

      if (!result.success) {
        setError(result.message || 'Unable to submit your reply.')
        return
      }

      setReplyContent('')
      setReplyingTo(null)

      setSuccess('Your reply has been submitted successfully.')

      setTimeout(() => {
        setSuccess('')
      }, 4000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function startReply(reviewId: string) {
    setReplyingTo(reviewId)
    setError('')
  }

  function cancelReply() {
    setReplyingTo(null)
    setReplyContent('')
  }

  function renderStars(value: number | null, interactive = false) {
    const currentValue = interactive ? hoverRating || rating : value || 0

    return (
      <div className='flex items-center gap-1'>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && setRating(star)}
            className={
              interactive
                ? 'transition-transform hover:scale-110'
                : 'cursor-default'
            }
            aria-label={interactive ? `Rate ${star} out of 5` : undefined}
          >
            <Star
              className={`h-5 w-5 ${
                star <= currentValue
                  ? 'fill-[#f18701] text-[#f18701]'
                  : 'text-gray-200'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  function ReviewItem({
    review,
    depth = 0,
  }: {
    review: Review
    depth?: number
  }) {
    const isReplying = replyingTo === review.id

    return (
      <div className='relative'>
        <div
          className={`
            rounded-2xl border border-gray-200 bg-white p-5
            transition hover:border-[#7678ed]/30 hover:shadow-sm
            sm:p-6
            ${depth > 0 ? 'mt-3' : ''}
          `}
        >
          <div className='flex flex-col gap-4'>
            {/* Header */}
            <div className='flex items-start justify-between gap-4'>
              <div className='flex min-w-0 items-center gap-3'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3d348b]/10 text-sm font-bold text-[#3d348b]'>
                  {getInitial(review.name)}
                </div>

                <div className='min-w-0'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <h3 className='truncate text-sm font-bold text-gray-950'>
                      {review.name}
                    </h3>

                    <span className='inline-flex items-center gap-1 rounded-full bg-[#3d348b]/5 px-2 py-0.5 text-[10px] font-bold text-[#3d348b]'>
                      <CheckCircle2 className='h-3 w-3' />
                      Reader
                    </span>
                  </div>

                  <p className='mt-0.5 text-[11px] text-gray-400'>
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>

              {/* Rating only for actual reviews */}
              {review.rating !== null && review.rating !== undefined && (
                <div className='flex shrink-0 items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1.5'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= review.rating!
                          ? 'fill-[#f18701] text-[#f18701]'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}

                  <span className='ml-1 text-xs font-bold text-gray-700'>
                    {review.rating}.0
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <p className='border-l-2 border-[#7678ed] pl-4 text-sm leading-7 text-gray-600'>
              &ldquo;{review.content}&rdquo;
            </p>

            {/* Actions */}
            <div className='flex items-center'>
              <button
                type='button'
                onClick={() =>
                  isReplying ? cancelReply() : startReply(review.id)
                }
                className='inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-[#3d348b] transition hover:bg-[#3d348b]/5'
              >
                {isReplying ? (
                  <>
                    <X className='h-3.5 w-3.5' />
                    Cancel
                  </>
                ) : (
                  <>
                    <Reply className='h-3.5 w-3.5' />
                    Reply
                  </>
                )}
              </button>
            </div>

            {/* Reply form */}
            {isReplying && (
              <form
                onSubmit={(event) => handleReply(event, review.id)}
                className='mt-2 rounded-xl border border-[#7678ed]/20 bg-[#7678ed]/5 p-4'
              >
                <div className='mb-3 flex items-center gap-2'>
                  <Reply className='h-4 w-4 text-[#3d348b]' />

                  <p className='text-sm font-bold text-[#3d348b]'>
                    Reply to {review.name}
                  </p>
                </div>

                <div className='grid gap-3 sm:grid-cols-2'>
                  <input
                    type='text'
                    value={replyName}
                    onChange={(e) => setReplyName(e.target.value)}
                    placeholder='Your name'
                    className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7678ed] focus:ring-2 focus:ring-[#7678ed]/10'
                    required
                  />

                  <input
                    type='email'
                    value={replyEmail}
                    onChange={(e) => setReplyEmail(e.target.value)}
                    placeholder='Your email'
                    className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7678ed] focus:ring-2 focus:ring-[#7678ed]/10'
                    required
                  />
                </div>

                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder='Write your reply...'
                  rows={3}
                  className='mt-3 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7678ed] focus:ring-2 focus:ring-[#7678ed]/10'
                  required
                />

                <div className='mt-3 flex justify-end'>
                  <button
                    type='submit'
                    disabled={submitting}
                    className='inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#302a70] disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    <Send className='h-3.5 w-3.5' />

                    {submitting ? 'Sending...' : 'Post Reply'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Nested replies */}
        {review.replies && review.replies.length > 0 && (
          <div
            className={`
                relative mt-3 space-y-3
                border-l-2 border-[#7678ed]/15
                pl-3 sm:pl-6
              `}
          >
            {review.replies.map((reply) => (
              <ReviewItem key={reply.id} review={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <section id='reviews' className='mt-16 border-t border-gray-200 pt-10'>
      {/* Header */}
      <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
        <div>
          <div className='mb-2 flex items-center gap-2'>
            <MessageCircle className='h-4 w-4 text-[#7678ed]' />

            <span className='text-xs font-bold uppercase tracking-widest text-[#3d348b]'>
              Community feedback
            </span>
          </div>

          <h2 className='text-2xl font-black tracking-tight text-gray-950 sm:text-3xl'>
            Reader Reviews
          </h2>

          <p className='mt-1 text-sm text-gray-500'>
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Average rating */}
        {reviews.length > 0 && (
          <div className='flex w-fit items-center gap-2 rounded-xl bg-[#f7b801]/10 px-4 py-2.5'>
            <div className='flex text-[#f18701]'>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>★</span>
              ))}
            </div>

            <span className='text-sm font-bold text-gray-800'>
              {averageRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Global messages */}
      {error && (
        <div className='mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
          {error}
        </div>
      )}

      {success && (
        <div className='mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
          {success}
        </div>
      )}

      {/* Reviews */}
      {reviews.length > 0 ? (
        <div className='mt-8 space-y-4'>
          {displayedReviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}

          {/* View all */}
          {reviewTree.length > 3 && (
            <div className='pt-2 text-center'>
              <button
                type='button'
                onClick={() => setShowAll((value) => !value)}
                className='rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-[#3d348b] transition hover:border-[#7678ed]/40 hover:bg-[#3d348b]/5'
              >
                {showAll
                  ? 'Show fewer reviews'
                  : `View all ${reviewTree.length} reviews`}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className='mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#3d348b]/10'>
            <MessageCircle className='h-5 w-5 text-[#3d348b]' />
          </div>

          <h3 className='mt-4 font-bold text-gray-900'>No reviews yet</h3>

          <p className='mt-2 text-sm text-gray-500'>
            Be the first reader to share your thoughts.
          </p>
        </div>
      )}

      {/* New review form */}
      <div className='mt-10 rounded-2xl border border-gray-200 bg-gray-50/70 p-5 sm:p-6'>
        <div className='mb-5'>
          <h3 className='text-lg font-black text-gray-950'>Leave a review</h3>

          <p className='mt-1 text-sm text-gray-500'>
            Share your thoughts about this article.
          </p>
        </div>

        <form onSubmit={handleCreateReview} className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-1.5 block text-xs font-bold text-gray-700'>
                Name
              </label>

              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Your name'
                className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7678ed] focus:ring-2 focus:ring-[#7678ed]/10'
                required
              />
            </div>

            <div>
              <label className='mb-1.5 block text-xs font-bold text-gray-700'>
                Email
              </label>

              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='you@example.com'
                className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7678ed] focus:ring-2 focus:ring-[#7678ed]/10'
                required
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className='mb-2 block text-xs font-bold text-gray-700'>
              Your rating
            </label>

            <div className='flex items-center gap-2'>
              {renderStars(rating, true)}

              <span className='text-xs font-semibold text-gray-500'>
                {rating}/5
              </span>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className='mb-1.5 block text-xs font-bold text-gray-700'>
              Review
            </label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='What did you think about this article?'
              rows={5}
              className='w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#7678ed] focus:ring-2 focus:ring-[#7678ed]/10'
              required
            />
          </div>

          <div className='flex justify-end'>
            <button
              type='submit'
              disabled={submitting}
              className='inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#302a70] disabled:cursor-not-allowed disabled:opacity-60'
            >
              <Send className='h-4 w-4' />

              {submitting ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
