'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { FiX, FiCheck, FiEdit3, FiSend } from 'react-icons/fi'
import { createReview } from '@/utils/actions'

interface ReviewInput {
  name: string
  email: string
  content: string
  rating: number
  articleId: string
}

export default function InteractionRail({ articleId }: { articleId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', content: '' })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setIsModalOpen(false)
        setTimeout(() => {
          setSubmitted(false)
          setFormData({ name: '', email: '', content: '' })
          setRating(5)
        }, 300)
      }, 2200)
      return () => clearTimeout(timer)
    }
  }, [submitted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const reviewData: ReviewInput = { ...formData, rating, articleId }

    startTransition(async () => {
      try {
        await createReview(reviewData)
        setSubmitted(true)
      } catch (err) {
        console.error('Failed to submit review:', err)
      }
    })
  }

  const activeRating = hoverRating !== null ? hoverRating : rating

  const modalContent = isModalOpen ? (
    <div className='fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto'>
      <div
        className='fixed inset-0 bg-zinc-950/80 backdrop-blur-md transition-opacity duration-300'
        onClick={() => !isPending && !submitted && setIsModalOpen(false)}
      />

      <div className='relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200/80 overflow-hidden z-10 animate-in zoom-in-95 fade-in duration-300 my-auto'>
        {submitted ? (
          <div className='p-10 sm:p-14 text-center flex flex-col items-center justify-center space-y-4'>
            <div className='w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center shadow-inner animate-bounce'>
              <FiCheck size={30} />
            </div>
            <div className='space-y-1'>
              <h3 className='text-2xl font-serif font-bold text-zinc-950'>
                Review Published
              </h3>
              <p className='text-sm text-zinc-500 font-serif italic'>
                Thank you for sharing your thoughts with our reader community.
              </p>
            </div>
          </div>
        ) : (
          <div className='p-6 sm:p-8 space-y-6'>
            <div className='flex items-start justify-between border-b border-zinc-100 pb-5'>
              <div className='space-y-1'>
                <span className='inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60'>
                  Community Feedback
                </span>
                <h3 className='text-2xl sm:text-3xl font-serif font-bold text-zinc-950 leading-tight'>
                  Share Your{' '}
                  <span className='italic font-normal text-zinc-500'>
                    Review
                  </span>
                </h3>
              </div>
              <button
                type='button'
                onClick={() => setIsModalOpen(false)}
                className='p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors'
                aria-label='Close modal'
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='flex items-center justify-between bg-zinc-50/80 p-4 rounded-2xl border border-zinc-100'>
                <span className='text-xs font-bold text-zinc-700 uppercase tracking-wider'>
                  Overall Score
                </span>
                <div className='flex gap-1'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type='button'
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className='p-1 text-xl sm:text-2xl transition-transform hover:scale-110 focus:outline-none'
                    >
                      {star <= activeRating ? (
                        <AiFillStar className='text-emerald-500' />
                      ) : (
                        <AiOutlineStar className='text-zinc-300' />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='block text-xs font-bold text-zinc-700 ml-1'>
                    Full Name
                  </label>
                  <input
                    required
                    type='text'
                    placeholder='Jane Doe'
                    className='w-full bg-zinc-50 border border-zinc-200 p-3.5 rounded-xl text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className='space-y-1.5'>
                  <label className='block text-xs font-bold text-zinc-700 ml-1'>
                    Email Address
                  </label>
                  <input
                    required
                    type='email'
                    placeholder='jane@example.com'
                    className='w-full bg-zinc-50 border border-zinc-200 p-3.5 rounded-xl text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='block text-xs font-bold text-zinc-700 ml-1'>
                  Your Feedback
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder='What did you think of this piece? Share your thoughts...'
                  className='w-full bg-zinc-50 border border-zinc-200 p-3.5 rounded-xl text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none resize-none transition-all'
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </div>

              <button
                type='submit'
                disabled={isPending}
                className='w-full py-4 bg-zinc-950 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed'
              >
                {isPending ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Submit Review</span>
                    <FiSend size={14} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  ) : null

  return (
    <>
      <div className='flex flex-col items-center gap-2 group'>
        <button
          type='button'
          onClick={() => setIsModalOpen(true)}
          className='relative w-12 h-12 rounded-full bg-white border border-zinc-200/80 flex items-center justify-center text-zinc-600 hover:text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50/50 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95'
          aria-label='Write a review'
        >
          <FiEdit3
            size={18}
            className='transition-transform duration-300 group-hover:scale-110'
          />
        </button>
        <span className='text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-900 transition-colors'>
          Write Review
        </span>
      </div>

      {mounted && modalContent
        ? createPortal(modalContent, document.body)
        : null}
    </>
  )
}
