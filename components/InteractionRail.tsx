'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { FiX, FiCheck, FiEdit3 } from 'react-icons/fi'
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

  const [rating, setRating] = useState<number>(5)
  const [formData, setFormData] = useState({ name: '', email: '', content: '' })

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
      }, 2500)
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
        console.error(err)
      }
    })
  }

  return (
    <>
      <div className='flex flex-col items-center gap-4'>
        <button
          onClick={() => setIsModalOpen(true)}
          className='group w-14 h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-500 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1'
        >
          <FiEdit3 size={18} />
        </button>
        <span className='hidden lg:block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors'>
          Review
        </span>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 z-[9999] flex justify-center items-start sm:items-center overflow-y-auto bg-[#0A0A0A]/90 backdrop-blur-xl p-4 sm:p-6'>
          <div
            className='fixed inset-0 cursor-zoom-out'
            onClick={() => !isPending && !submitted && setIsModalOpen(false)}
          />

          <div className='relative bg-white w-full max-w-xl my-auto rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 z-10 slide-in-from-bottom-10 duration-500'>
            {submitted ? (
              <div className='p-12 sm:p-20 text-center flex flex-col items-center'>
                <div className='w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-8 animate-bounce'>
                  <FiCheck size={32} className='text-white' />
                </div>
                <h3 className='text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-2'>
                  Note Received.
                </h3>
                <p className='text-gray-400 font-serif italic text-sm'>
                  Your perspective has been added to our records.
                </p>
              </div>
            ) : (
              <div className='p-8 sm:p-12'>
                <div className='flex justify-between items-start mb-8 sm:mb-12'>
                  <div className='space-y-2'>
                    <span className='text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] block'>
                      Correspondence
                    </span>
                    <h3 className='text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight'>
                      Leave a{' '}
                      <span className='italic font-normal text-gray-400'>
                        signature.
                      </span>
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className='p-2 hover:bg-gray-50 rounded-full transition-colors'
                  >
                    <FiX size={20} className='text-gray-400' />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='flex items-center justify-between pb-6 border-b border-gray-100'>
                    <span className='text-[10px] font-black uppercase text-gray-400 tracking-widest'>
                      Merit Rating
                    </span>
                    <div className='flex gap-1 sm:gap-2'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type='button'
                          onClick={() => setRating(star)}
                          className='text-xl sm:text-2xl transition-all hover:scale-125'
                        >
                          {star <= rating ? (
                            <AiFillStar className='text-emerald-500' />
                          ) : (
                            <AiOutlineStar className='text-gray-200' />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                    <div className='space-y-1.5'>
                      <label className='text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2'>
                        Identity
                      </label>
                      <input
                        required
                        placeholder='Your Name'
                        className='w-full bg-gray-50 border-none p-4 sm:p-5 rounded-2xl text-sm font-serif outline-none focus:ring-2 ring-emerald-100 transition-all'
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className='space-y-1.5'>
                      <label className='text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2'>
                        Electronic Mail
                      </label>
                      <input
                        required
                        type='email'
                        placeholder='email@example.com'
                        className='w-full bg-gray-50 border-none p-4 sm:p-5 rounded-2xl text-sm font-serif outline-none focus:ring-2 ring-emerald-100 transition-all'
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className='space-y-1.5'>
                    <label className='text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2'>
                      The Perspective
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder='Write your thoughts on this piece...'
                      className='w-full bg-gray-50 border-none p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] text-sm font-serif leading-relaxed outline-none resize-none focus:ring-2 ring-emerald-100 transition-all'
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                    />
                  </div>

                  <button
                    disabled={isPending}
                    className='group relative w-full py-5 sm:py-6 bg-black text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden transition-all hover:bg-emerald-600 disabled:opacity-50'
                  >
                    <span className='relative z-10'>
                      {isPending ? 'Cataloging...' : 'Submit to Archive'}
                    </span>
                    <div className='absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500' />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
