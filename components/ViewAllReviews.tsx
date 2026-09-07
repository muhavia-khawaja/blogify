'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FiX } from 'react-icons/fi'
import { AiFillStar } from 'react-icons/ai'
import { ChevronRight, MessageSquare, User } from 'lucide-react'

interface Review {
  id: string | number
  name: string
  rating: number
  content: string
  createdAt: string | Date
  avatar?: string
}

function ReviewsModal({
  reviews,
  onClose,
}: {
  reviews: Review[]
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className='fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-zinc-950/70 backdrop-blur-md p-0 sm:p-4 md:p-6 transition-all duration-300'
      role='dialog'
      aria-modal='true'
      aria-label='All reader reviews'
    >
      <div className='relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200/80 animate-in fade-in slide-in-from-bottom-6 duration-300'>
        <div className='flex items-center justify-between px-6 sm:px-8 pt-6 pb-5 border-b border-zinc-100 shrink-0 bg-zinc-50/50'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <span className='inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
              <p className='text-[10px] font-extrabold uppercase tracking-widest text-emerald-700'>
                Community Feedback
              </p>
            </div>
            <h2 className='text-xl sm:text-2xl font-serif font-extrabold text-zinc-950'>
              Reader Reviews
            </h2>
          </div>

          <div className='flex items-center gap-3 sm:gap-5'>
            <span className='px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold tracking-tight'>
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
            <button
              onClick={onClose}
              className='w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 flex items-center justify-center transition-all shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500'
              aria-label='Close modal'
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        <div className='overflow-y-auto flex-1 px-6 sm:px-8 py-6 space-y-8 divide-y divide-zinc-100'>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className='pt-8 first:pt-0 group'>
                <div className='flex flex-wrap sm:flex-nowrap justify-between items-start gap-2 mb-3'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0'>
                      {review.avatar ? (
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className='w-full h-full rounded-full object-cover'
                        />
                      ) : (
                        <User size={18} className='text-emerald-700' />
                      )}
                    </div>
                    <div>
                      <h3 className='font-serif font-bold text-base sm:text-lg text-zinc-950 leading-snug'>
                        {review.name}
                      </h3>

                      <div className='flex items-center gap-0.5 mt-0.5'>
                        {[...Array(5)].map((_, i) => (
                          <AiFillStar
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? 'text-emerald-500'
                                : 'text-zinc-200'
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className='text-[11px] font-semibold text-zinc-600 bg-zinc-100/80 px-2.5 py-1 rounded-md shrink-0'>
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <blockquote className='mt-3'>
                  <p className='text-zinc-800 text-base leading-relaxed font-serif italic pl-4 border-l-2 border-emerald-300 group-hover:border-emerald-600 transition-colors duration-300 break-words'>
                    &ldquo;{review.content}&rdquo;
                  </p>
                </blockquote>
              </div>
            ))
          ) : (
            <div className='py-16 text-center space-y-3'>
              <div className='w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto'>
                <MessageSquare size={22} />
              </div>
              <p className='text-zinc-700 font-serif italic text-base'>
                No reviews recorded yet.
              </p>
              <p className='text-xs font-bold uppercase tracking-wider text-emerald-700'>
                Be the first to leave a review!
              </p>
            </div>
          )}
        </div>

        <div className='px-6 sm:px-8 py-4 bg-zinc-50 border-t border-zinc-100 text-right shrink-0'>
          <button
            onClick={onClose}
            className='px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ViewAllReviewsButton({
  reviews,
}: {
  reviews: Review[]
}) {
  const [open, setOpen] = useState(false)

  if (!reviews || reviews.length === 0) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider transition-all duration-200 group cursor-pointer shadow-sm hover:shadow'
      >
        <span>View all {reviews.length} reviews</span>
        <ChevronRight
          size={14}
          className='text-emerald-700 group-hover:translate-x-1 transition-transform'
        />
      </button>

      {open && (
        <ReviewsModal reviews={reviews} onClose={() => setOpen(false)} />
      )}
    </>
  )
}
