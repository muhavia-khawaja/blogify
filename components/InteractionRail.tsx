'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { AiOutlineComment, AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { FiX, FiCheck } from 'react-icons/fi'
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
  })

  // Handle auto-close and reset after submission
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setIsModalOpen(false)
        // Small delay before resetting state so the exit animation looks clean
        setTimeout(() => {
          setSubmitted(false)
          setFormData({ name: '', email: '', content: '' })
          setRating(5)
        }, 300)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [submitted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const reviewData: ReviewInput = {
      name: formData.name,
      email: formData.email,
      content: formData.content,
      rating: rating,
      articleId: articleId,
    }

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
      <aside className='lg:col-span-1 hidden lg:flex flex-col items-center sticky top-32 h-fit'>
        <button
          onClick={() => setIsModalOpen(true)}
          className='group w-16 h-16 rounded-2xl bg-white border border-gray-100 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1'
        >
          <AiOutlineComment size={24} />
          <span className='text-[9px] font-black mt-1 uppercase tracking-tighter'>
            Review
          </span>
        </button>
      </aside>

      {isModalOpen && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300'>
          <div
            className='absolute inset-0 bg-gray-900/40 backdrop-blur-md'
            onClick={() => !isPending && !submitted && setIsModalOpen(false)}
          />

          <div className='relative bg-white w-full max-w-lg rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden'>
            {submitted ? (
              <div className='p-20 text-center flex flex-col items-center animate-in zoom-in-95 duration-500 ease-out'>
                <div className='w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-200'>
                  <FiCheck size={40} className='text-white' />
                </div>
                <h3 className='text-3xl font-black text-gray-900 tracking-tighter mb-2'>
                  Thank You.
                </h3>
                <p className='text-gray-400 font-medium text-sm'>
                  Your review has been added to our archive.
                </p>
              </div>
            ) : (
              <div className='p-10'>
                <div className='flex justify-between items-start mb-10'>
                  <div>
                    <span className='text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] block mb-2'>
                      Community / Review
                    </span>
                    <h3 className='text-3xl font-black text-gray-900 tracking-tighter'>
                      Share your{' '}
                      <span className='italic text-gray-400'>thoughts.</span>
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                  >
                    <FiX size={20} className='text-gray-400' />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='bg-gray-50/50 p-5 rounded-3xl border border-gray-100 flex items-center justify-between'>
                    <span className='text-[10px] font-black uppercase text-gray-400 tracking-widest'>
                      Your Rating
                    </span>
                    <div className='flex gap-1'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type='button'
                          onClick={() => setRating(star)}
                          className='text-2xl transition-transform hover:scale-125 active:scale-90'
                        >
                          {star <= rating ? (
                            <AiFillStar className='text-yellow-400' />
                          ) : (
                            <AiOutlineStar className='text-gray-200 hover:text-gray-300' />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <input
                      required
                      placeholder='Full Name'
                      className='w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-blue-200 transition-all'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <input
                      required
                      type='email'
                      placeholder='Email Address'
                      className='w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-blue-200 transition-all'
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <textarea
                    required
                    rows={4}
                    placeholder='Write your perspective...'
                    className='w-full bg-gray-50/50 border border-gray-100 p-4 rounded-3xl text-sm font-medium outline-none resize-none focus:bg-white focus:border-blue-200 transition-all'
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                  />

                  <button
                    disabled={isPending}
                    className='w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50'
                  >
                    {isPending ? 'Processing...' : 'Publish to Archive'}
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
