'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FiX } from 'react-icons/fi'
import { AiFillStar } from 'react-icons/ai'
import { ChevronRight } from 'lucide-react'

function ReviewsModal({
  reviews,
  onClose,
}: {
  reviews: any[]
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      className='fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-0 sm:px-6'
      role='dialog'
      aria-modal='true'
      aria-label='All reviews'
    >
      <div className='relative w-full sm:max-w-2xl max-h-[90vh] bg-[#FCFBF9] rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden'>
        {/* Modal header */}
        <div className='flex items-center justify-between px-8 pt-8 pb-6 border-b border-gray-100 shrink-0'>
          <div>
            <p className='text-[9px] font-black uppercase tracking-[0.35em] text-emerald-600 mb-1'>
              Public Response
            </p>
            <h2 className='text-2xl font-serif font-bold text-[#1A1A1A]'>
              The Reader&apos;s Gallery
            </h2>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-5xl font-serif italic text-gray-100 tabular-nums select-none'>
              {reviews.length.toString().padStart(2, '0')}
            </span>
            <button
              onClick={onClose}
              className='w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0 cursor-pointer'
              aria-label='Close reviews'
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable list */}
        <div className='overflow-y-auto flex-1 px-8 py-8 space-y-12'>
          {reviews.length > 0 ? (
            reviews.map((review: any) => (
              <div key={review.id} className='group'>
                <div className='flex justify-between items-start mb-5'>
                  <div className='space-y-1.5'>
                    <h4 className='font-serif font-bold text-xl text-gray-900'>
                      {review.name}
                    </h4>
                    <div className='flex gap-0.5'>
                      {[...Array(5)].map((_, i) => (
                        <AiFillStar
                          key={i}
                          size={13}
                          className={
                            i < review.rating
                              ? 'text-emerald-500'
                              : 'text-gray-200'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <span className='text-[10px] font-bold text-gray-300 uppercase tracking-widest shrink-0 ml-4 mt-1'>
                    {new Date(review.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <blockquote>
                  <p className='text-base sm:text-lg md:text-xl text-gray-500 font-serif italic leading-relaxed border-l-2 border-emerald-50 pl-4 sm:pl-7 group-hover:border-emerald-500 transition-all duration-700 break-words max-w-full'>
                    {review.content}
                  </p>
                </blockquote>
              </div>
            ))
          ) : (
            <div className='py-20 text-center'>
              <p className='text-gray-400 font-serif italic text-lg'>
                The gallery is silent.
              </p>
              <span className='text-xs not-italic font-sans font-bold uppercase tracking-widest text-emerald-600 mt-3 inline-block'>
                Be the first to share your perspective
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ViewAllReviewsButton({ reviews }: { reviews: any[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='mt-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 hover:text-emerald-800 transition-colors group cursor-pointer'
      >
        View all {reviews.length} reviews
        <ChevronRight
          size={13}
          className='group-hover:translate-x-1 transition-transform'
        />
      </button>

      {open && (
        <ReviewsModal reviews={reviews} onClose={() => setOpen(false)} />
      )}
    </>
  )
}
