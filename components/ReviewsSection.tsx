'use client'

import { FormEvent, useMemo, useState } from 'react'
import {
  CheckCircle2,
  Clock3,
  Mail,
  MessageCircle,
  Reply,
  Send,
  Star,
  User,
  X,
} from 'lucide-react'

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

type ReviewItemProps = {
  review: Review
  depth?: number
  replyingTo: string | null
  replyName: string
  replyEmail: string
  replyContent: string
  submitting: boolean
  onReplyNameChange: (value: string) => void
  onReplyEmailChange: (value: string) => void
  onReplyContentChange: (value: string) => void
  onStartReply: (reviewId: string) => void
  onCancelReply: () => void
  onSubmitReply: (event: FormEvent<HTMLFormElement>, parentId: string) => void
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
      // Safety fallback if parent was deleted
      roots.push(current)
    }
  })

  return roots
}

function RatingStars({
  rating,
  size = 'sm',
}: {
  rating: number
  size?: 'sm' | 'md'
}) {
  return (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={
            size === 'md'
              ? `h-4 w-4 ${
                  star <= rating
                    ? 'fill-[#f7b801] text-[#f18701]'
                    : 'text-gray-200'
                }`
              : `h-3.5 w-3.5 ${
                  star <= rating
                    ? 'fill-[#f7b801] text-[#f18701]'
                    : 'text-gray-200'
                }`
          }
        />
      ))}
    </div>
  )
}

/**
 * IMPORTANT:
 * This component is intentionally OUTSIDE ReviewsSection.
 *
 * Previously ReviewItem was declared inside ReviewsSection.
 * Every keystroke updated the parent state, causing React to
 * recreate ReviewItem and the input lost focus.
 */
function ReviewItem({
  review,
  depth = 0,
  replyingTo,
  replyName,
  replyEmail,
  replyContent,
  submitting,
  onReplyNameChange,
  onReplyEmailChange,
  onReplyContentChange,
  onStartReply,
  onCancelReply,
  onSubmitReply,
}: ReviewItemProps) {
  const isReplying = replyingTo === review.id
  const hasRating = review.rating !== null && review.rating !== undefined

  return (
    <article className='relative'>
      {/* Review card */}
      <div
        className={`
          group relative overflow-hidden rounded-2xl border
          border-gray-200/80 bg-white
          shadow-[0_2px_12px_rgba(0,0,0,0.025)]
          transition-all duration-300
          hover:border-[#7678ed]/30
          hover:shadow-[0_10px_35px_rgba(61,52,139,0.07)]
          ${depth > 0 ? 'mt-3' : ''}
        `}
      >
        {/* Subtle top accent */}
        <div
          className={`
            absolute left-0 top-0 h-full w-0.5
            ${depth === 0 ? 'bg-[#3d348b]' : 'bg-[#7678ed]/40'}
          `}
        />

        <div className='p-5 sm:p-6'>
          {/* Header */}
          <div className='flex items-start justify-between gap-4'>
            <div className='flex min-w-0 items-center gap-3'>
              {/* Avatar */}
              <div
                className='flex h-11 w-11 shrink-0 items-center justify-center
                  rounded-full bg-gradient-to-br from-[#3d348b]
                  to-[#7678ed] text-sm font-black text-white
                  shadow-sm'
              >
                {getInitial(review.name)}
              </div>

              <div className='min-w-0'>
                <div className='flex flex-wrap items-center gap-2'>
                  <h3 className='truncate text-sm font-extrabold text-gray-950 sm:text-[15px]'>
                    {review.name}
                  </h3>

                  <span
                    className='inline-flex items-center gap-1 rounded-full
                      bg-emerald-50 px-2 py-0.5 text-[10px]
                      font-bold text-emerald-700'
                  >
                    <CheckCircle2 className='h-3 w-3' />
                    Reader
                  </span>
                </div>

                <div className='mt-1 flex items-center gap-1.5 text-[11px] text-gray-400'>
                  <Clock3 className='h-3 w-3' />
                  {formatDate(review.createdAt)}
                </div>
              </div>
            </div>

            {/* Rating */}
            {hasRating && (
              <div
                className='flex shrink-0 items-center gap-1.5
                  rounded-full border border-[#f7b801]/20
                  bg-[#f7b801]/8 px-2.5 py-1.5'
              >
                <RatingStars rating={review.rating!} />

                <span className='text-xs font-extrabold text-gray-700'>
                  {review.rating}.0
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className='mt-5'>
            <div className='relative rounded-xl bg-gray-50/80 px-4 py-4'>
              <span
                className='absolute -left-1 -top-4 font-serif
                  text-4xl font-black text-[#7678ed]/20'
              >
                “
              </span>

              <p className='text-sm leading-7 text-gray-600'>
                {review.content}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className='mt-4 flex items-center'>
            <button
              type='button'
              onClick={() =>
                isReplying ? onCancelReply() : onStartReply(review.id)
              }
              className='inline-flex items-center gap-2 rounded-lg
                px-3 py-2 text-xs font-bold text-[#3d348b]
                transition-all hover:bg-[#3d348b]/6'
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
              onSubmit={(event) => onSubmitReply(event, review.id)}
              className='mt-4 overflow-hidden rounded-2xl
                border border-[#7678ed]/15
                bg-gradient-to-br from-[#7678ed]/6
                to-[#3d348b]/4'
            >
              {/* Form heading */}
              <div className='border-b border-[#7678ed]/10 px-4 py-3.5 sm:px-5'>
                <div className='flex items-center gap-2'>
                  <div
                    className='flex h-8 w-8 items-center justify-center
                      rounded-lg bg-[#3d348b]/10'
                  >
                    <Reply className='h-4 w-4 text-[#3d348b]' />
                  </div>

                  <div>
                    <p className='text-sm font-extrabold text-gray-900'>
                      Reply to {review.name}
                    </p>
                    <p className='text-[11px] text-gray-500'>
                      Join the conversation
                    </p>
                  </div>
                </div>
              </div>

              <div className='p-4 sm:p-5'>
                {/* Name + Email */}
                <div className='grid gap-3 sm:grid-cols-2'>
                  <div className='relative'>
                    <User
                      className='pointer-events-none absolute
                        left-3.5 top-1/2 h-4 w-4
                        -translate-y-1/2 text-gray-400'
                    />

                    <input
                      type='text'
                      value={replyName}
                      onChange={(event) =>
                        onReplyNameChange(event.target.value)
                      }
                      placeholder='Your name'
                      autoComplete='name'
                      className='w-full rounded-xl border
                        border-gray-200 bg-white py-3
                        pl-10 pr-4 text-sm text-gray-900
                        outline-none transition
                        placeholder:text-gray-400
                        focus:border-[#7678ed]
                        focus:ring-4
                        focus:ring-[#7678ed]/10'
                      required
                    />
                  </div>

                  <div className='relative'>
                    <Mail
                      className='pointer-events-none absolute
                        left-3.5 top-1/2 h-4 w-4
                        -translate-y-1/2 text-gray-400'
                    />

                    <input
                      type='email'
                      value={replyEmail}
                      onChange={(event) =>
                        onReplyEmailChange(event.target.value)
                      }
                      placeholder='Your email'
                      autoComplete='email'
                      className='w-full rounded-xl border
                        border-gray-200 bg-white py-3
                        pl-10 pr-4 text-sm text-gray-900
                        outline-none transition
                        placeholder:text-gray-400
                        focus:border-[#7678ed]
                        focus:ring-4
                        focus:ring-[#7678ed]/10'
                      required
                    />
                  </div>
                </div>

                {/* Reply textarea */}
                <div className='mt-3'>
                  <textarea
                    value={replyContent}
                    onChange={(event) =>
                      onReplyContentChange(event.target.value)
                    }
                    placeholder='Write your reply...'
                    rows={4}
                    className='w-full resize-y rounded-xl border
                      border-gray-200 bg-white px-4 py-3
                      text-sm leading-6 text-gray-900
                      outline-none transition
                      placeholder:text-gray-400
                      focus:border-[#7678ed]
                      focus:ring-4
                      focus:ring-[#7678ed]/10'
                    required
                  />
                </div>

                {/* Submit */}
                <div className='mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                  <p className='text-[11px] text-gray-400'>
                    Your email will not be displayed publicly.
                  </p>

                  <button
                    type='submit'
                    disabled={submitting}
                    className='inline-flex items-center
                      justify-center gap-2 rounded-xl
                      bg-[#3d348b] px-5 py-3 text-xs
                      font-extrabold text-white
                      shadow-sm transition-all
                      hover:-translate-y-0.5
                      hover:bg-[#302a70]
                      hover:shadow-md
                      disabled:cursor-not-allowed
                      disabled:opacity-60'
                  >
                    <Send className='h-3.5 w-3.5' />

                    {submitting ? 'Sending...' : 'Post Reply'}
                  </button>
                </div>
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
            <ReviewItem
              key={reply.id}
              review={reply}
              depth={depth + 1}
              replyingTo={replyingTo}
              replyName={replyName}
              replyEmail={replyEmail}
              replyContent={replyContent}
              submitting={submitting}
              onReplyNameChange={onReplyNameChange}
              onReplyEmailChange={onReplyEmailChange}
              onReplyContentChange={onReplyContentChange}
              onStartReply={onStartReply}
              onCancelReply={onCancelReply}
              onSubmitReply={onSubmitReply}
            />
          ))}
        </div>
      )}
    </article>
  )
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

  const ratedReviews = useMemo(
    () => reviews.filter((review) => typeof review.rating === 'number'),
    [reviews],
  )

  const averageRating = useMemo(() => {
    if (!ratedReviews.length) return 0

    return (
      ratedReviews.reduce((total, review) => total + (review.rating || 0), 0) /
      ratedReviews.length
    )
  }, [ratedReviews])

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
    setSuccess('')
  }

  function cancelReply() {
    setReplyingTo(null)
    setReplyContent('')
    setError('')
  }

  function renderStars(value: number, interactive = false) {
    const currentValue = interactive ? hoverRating || rating : value

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
                ? 'rounded-md p-0.5 transition-transform hover:scale-110'
                : 'cursor-default'
            }
            aria-label={interactive ? `Rate ${star} out of 5` : undefined}
          >
            <Star
              className={`h-5 w-5 ${
                star <= currentValue
                  ? 'fill-[#f7b801] text-[#f18701]'
                  : 'text-gray-200'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <section
      id='reviews'
      className='relative mt-20 border-t border-gray-200 pt-12 sm:mt-24 sm:pt-16'
    >
      {/* Decorative background */}
      <div
        className='pointer-events-none absolute left-1/2 top-20
          h-40 w-40 -translate-x-1/2 rounded-full
          bg-[#7678ed]/5 blur-3xl'
      />

      <div className='relative'>
        {/* Section heading */}
        <div className='flex flex-col justify-between gap-6 sm:flex-row sm:items-end'>
          <div>
            <div className='mb-3 inline-flex items-center gap-2 rounded-full bg-[#3d348b]/6 px-3 py-1.5'>
              <MessageCircle className='h-3.5 w-3.5 text-[#7678ed]' />

              <span className='text-[10px] font-black uppercase tracking-[0.18em] text-[#3d348b]'>
                Community
              </span>
            </div>

            <h2 className='text-3xl font-black tracking-tight text-gray-950 sm:text-4xl'>
              Reader Reviews
            </h2>

            <p className='mt-2 max-w-xl text-sm leading-6 text-gray-500'>
              See what other readers think and join the conversation.
            </p>
          </div>

          {/* Rating summary */}
          {ratedReviews.length > 0 && (
            <div
              className='flex w-fit items-center gap-3
                rounded-2xl border border-[#f7b801]/20
                bg-white px-4 py-3
                shadow-[0_5px_25px_rgba(247,184,1,0.08)]'
            >
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7b801]/10'>
                <Star className='h-5 w-5 fill-[#f7b801] text-[#f18701]' />
              </div>

              <div>
                <div className='flex items-center gap-2'>
                  <span className='text-lg font-black text-gray-950'>
                    {averageRating.toFixed(1)}
                  </span>

                  <RatingStars rating={Math.round(averageRating)} size='md' />
                </div>

                <p className='text-[10px] font-semibold text-gray-400'>
                  Based on {ratedReviews.length}{' '}
                  {ratedReviews.length === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div
            className='mt-6 flex items-start gap-3
              rounded-xl border border-red-200
              bg-red-50 px-4 py-3 text-sm text-red-700'
          >
            <X className='mt-0.5 h-4 w-4 shrink-0' />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            className='mt-6 flex items-start gap-3
              rounded-xl border border-emerald-200
              bg-emerald-50 px-4 py-3 text-sm
              text-emerald-700'
          >
            <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0' />
            <span>{success}</span>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 ? (
          <div className='mt-9 space-y-4'>
            {displayedReviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                replyingTo={replyingTo}
                replyName={replyName}
                replyEmail={replyEmail}
                replyContent={replyContent}
                submitting={submitting}
                onReplyNameChange={setReplyName}
                onReplyEmailChange={setReplyEmail}
                onReplyContentChange={setReplyContent}
                onStartReply={startReply}
                onCancelReply={cancelReply}
                onSubmitReply={handleReply}
              />
            ))}

            {/* View all */}
            {reviewTree.length > 3 && (
              <div className='pt-3 text-center'>
                <button
                  type='button'
                  onClick={() => setShowAll((value) => !value)}
                  className='inline-flex items-center
                    rounded-xl border border-gray-200
                    bg-white px-5 py-2.5 text-sm
                    font-bold text-[#3d348b]
                    shadow-sm transition-all
                    hover:border-[#7678ed]/40
                    hover:bg-[#3d348b]/5
                    hover:shadow-md'
                >
                  {showAll
                    ? 'Show fewer reviews'
                    : `View all ${reviewTree.length} conversations`}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            className='mt-9 overflow-hidden rounded-2xl
              border border-dashed border-gray-300
              bg-gradient-to-br from-white to-gray-50
              px-6 py-14 text-center'
          >
            <div
              className='mx-auto flex h-14 w-14
                items-center justify-center rounded-2xl
                bg-[#3d348b]/8'
            >
              <MessageCircle className='h-6 w-6 text-[#3d348b]' />
            </div>

            <h3 className='mt-5 text-lg font-black text-gray-900'>
              No reviews yet
            </h3>

            <p className='mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500'>
              Be the first reader to share your thoughts about this article.
            </p>
          </div>
        )}

        {/* New review */}
        <div
          className='relative mt-12 overflow-hidden
            rounded-3xl border border-gray-200
            bg-gradient-to-br from-white
            via-white to-[#7678ed]/5
            shadow-[0_10px_40px_rgba(61,52,139,0.06)]'
        >
          {/* Decorative header */}
          <div className='h-1 bg-gradient-to-r from-[#3d348b] via-[#7678ed] to-[#f7b801]' />

          <div className='p-5 sm:p-7'>
            <div className='mb-7'>
              <div className='flex items-start gap-3'>
                <div
                  className='flex h-11 w-11 shrink-0
                    items-center justify-center rounded-xl
                    bg-[#3d348b]/8'
                >
                  <MessageCircle className='h-5 w-5 text-[#3d348b]' />
                </div>

                <div>
                  <h3 className='text-xl font-black text-gray-950'>
                    Share your thoughts
                  </h3>

                  <p className='mt-1 text-sm leading-6 text-gray-500'>
                    Enjoyed the article? Tell other readers what you think.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateReview} className='space-y-5'>
              {/* Name + email */}
              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <label className='mb-2 block text-xs font-extrabold text-gray-700'>
                    Your name
                  </label>

                  <div className='relative'>
                    <User
                      className='pointer-events-none absolute
                        left-3.5 top-1/2 h-4 w-4
                        -translate-y-1/2 text-gray-400'
                    />

                    <input
                      type='text'
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder='Enter your name'
                      autoComplete='name'
                      className='w-full rounded-xl border
                        border-gray-200 bg-white py-3.5
                        pl-10 pr-4 text-sm text-gray-900
                        outline-none transition
                        placeholder:text-gray-400
                        focus:border-[#7678ed]
                        focus:ring-4
                        focus:ring-[#7678ed]/10'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className='mb-2 block text-xs font-extrabold text-gray-700'>
                    Email address
                  </label>

                  <div className='relative'>
                    <Mail
                      className='pointer-events-none absolute
                        left-3.5 top-1/2 h-4 w-4
                        -translate-y-1/2 text-gray-400'
                    />

                    <input
                      type='email'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder='you@example.com'
                      autoComplete='email'
                      className='w-full rounded-xl border
                        border-gray-200 bg-white py-3.5
                        pl-10 pr-4 text-sm text-gray-900
                        outline-none transition
                        placeholder:text-gray-400
                        focus:border-[#7678ed]
                        focus:ring-4
                        focus:ring-[#7678ed]/10'
                      required
                    />
                  </div>

                  <p className='mt-1.5 text-[10px] text-gray-400'>
                    Your email will remain private.
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className='mb-2 block text-xs font-extrabold text-gray-700'>
                  How would you rate this article?
                </label>

                <div
                  className='flex w-fit items-center gap-3
                    rounded-xl border border-gray-200
                    bg-white px-3 py-2.5'
                >
                  {renderStars(rating, true)}

                  <span
                    className='border-l border-gray-200
                      pl-3 text-xs font-extrabold
                      text-gray-600'
                  >
                    {rating}/5
                  </span>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className='mb-2 block text-xs font-extrabold text-gray-700'>
                  Your review
                </label>

                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder='What did you think about this article?'
                  rows={5}
                  className='w-full resize-y rounded-xl
                    border border-gray-200 bg-white
                    px-4 py-3.5 text-sm leading-7
                    text-gray-900 outline-none transition
                    placeholder:text-gray-400
                    focus:border-[#7678ed]
                    focus:ring-4
                    focus:ring-[#7678ed]/10'
                  required
                />
              </div>

              {/* Submit */}
              <div
                className='flex flex-col gap-4 border-t
                  border-gray-100 pt-5 sm:flex-row
                  sm:items-center sm:justify-between'
              >
                <p className='text-xs leading-5 text-gray-400'>
                  By submitting, you agree to keep the discussion respectful and
                  helpful.
                </p>

                <button
                  type='submit'
                  disabled={submitting}
                  className='inline-flex items-center
                    justify-center gap-2 rounded-xl
                    bg-[#3d348b] px-6 py-3.5
                    text-sm font-extrabold text-white
                    shadow-[0_6px_20px_rgba(61,52,139,0.2)]
                    transition-all
                    hover:-translate-y-0.5
                    hover:bg-[#302a70]
                    hover:shadow-[0_10px_25px_rgba(61,52,139,0.25)]
                    disabled:cursor-not-allowed
                    disabled:opacity-60'
                >
                  <Send className='h-4 w-4' />

                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
