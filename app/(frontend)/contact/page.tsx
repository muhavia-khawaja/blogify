'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FiMail, FiMessageCircle, FiArrowRight, FiCheck } from 'react-icons/fi'
import { sendMessage } from '@/utils/actions'

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('name', formState.name)
    formData.append('email', formState.email)
    formData.append('message', formState.message)

    try {
      await sendMessage(formData)
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSubmitted(true)
      setFormState({ name: '', email: '', message: '' })
    } catch (err) {
      console.error('Transmission error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='min-h-screen bg-[#FCFBF9] antialiased text-[#1A1A1A] pt-32 pb-20'>
      <div className='max-w-6xl mx-auto px-6 lg:px-8'>
        <div className='grid gap-20 lg:grid-cols-2 lg:items-start'>
          <div>
            <div className='flex items-center gap-3 mb-6'>
              <span className='h-px w-8 bg-emerald-500'></span>
              <span className='text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600'>
                Correspondence
              </span>
            </div>

            <h1 className='text-5xl md:text-6xl font-serif font-bold leading-[1.1] tracking-tight mb-8'>
              Initiate a <span className='italic font-medium'>dialogue.</span>
            </h1>

            <p className='text-xl font-serif italic text-gray-500 leading-relaxed mb-12'>
              Whether you are a fellow developer, a curious student, or a future
              collaborator, we welcome your inquiries and insights.
            </p>

            <div className='space-y-8'>
              <div className='flex items-center gap-6 group'>
                <div className='w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500'>
                  <FiMail size={22} />
                </div>
                <div>
                  <p className='text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1'>
                    Technical Inquiries
                  </p>
                  <p className='text-lg font-serif font-bold'>
                    hello@blogifyguides.vercel.app
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-6 group'>
                <div className='w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500'>
                  <FiMessageCircle size={22} />
                </div>
                <div>
                  <p className='text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1'>
                    General Feedback
                  </p>
                  <p className='text-lg font-serif font-bold'>
                    community@blogifyguides.vercel.app
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-16'>
              <Link
                href='/blog'
                className='inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-emerald-600 hover:border-emerald-600 transition-all'
              >
                Return to Archive <FiArrowRight />
              </Link>
            </div>
          </div>

          <div className='bg-white rounded-[3rem] shadow-2xl border border-gray-50 p-10 md:p-12 relative overflow-hidden'>
            {submitted ? (
              <div className='text-center py-12 space-y-8 animate-in fade-in zoom-in duration-500'>
                <div className='w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <FiCheck size={40} />
                </div>
                <h2 className='text-3xl font-serif font-bold text-gray-900'>
                  Transmission Received
                </h2>
                <p className='text-gray-500 font-serif italic'>
                  Your message has been logged in the archive. We will respond
                  shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className='inline-flex items-center justify-center rounded-full border border-black px-10 py-4 text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all'
                >
                  Send Another Entry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-8'>
                <div className='grid gap-8 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2'>
                      Full Name
                    </label>
                    <input
                      value={formState.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                      placeholder='e.g. Haider'
                      className='w-full rounded-2xl border border-gray-100 bg-[#F9F8F6] px-6 py-4 text-sm outline-none focus:border-emerald-400 focus:bg-white transition-all duration-300'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2'>
                      Email Address
                    </label>
                    <input
                      type='email'
                      value={formState.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      placeholder='your@email.com'
                      className='w-full rounded-2xl border border-gray-100 bg-[#F9F8F6] px-6 py-4 text-sm outline-none focus:border-emerald-400 focus:bg-white transition-all duration-300'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2'>
                    Your Inquiry
                  </label>
                  <textarea
                    value={formState.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    required
                    rows={5}
                    placeholder='Describe your thoughts...'
                    className='w-full rounded-3xl border border-gray-100 bg-[#F9F8F6] px-6 py-4 text-sm outline-none focus:border-emerald-400 focus:bg-white transition-all duration-300 resize-none'
                  />
                </div>
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full rounded-2xl bg-black px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl hover:bg-emerald-600 transition-all disabled:opacity-50 group flex items-center justify-center gap-3'
                >
                  {loading ? 'Transmitting...' : 'Dispatch Message'}
                  <FiArrowRight className='group-hover:translate-x-2 transition-transform' />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
