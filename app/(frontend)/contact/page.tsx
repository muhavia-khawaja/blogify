'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FiMail, FiMessageCircle, FiArrowRight, FiCheck, FiSend, FiCornerDownRight } from 'react-icons/fi'
import { sendMessage } from '@/utils/actions'
import { getAbsoluteUrl, SITE_NAME } from '@/utils/seo'
import JsonLd from '@/components/JsonLd'

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

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Blogify',
    url: getAbsoluteUrl('/contact'),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: getAbsoluteUrl('/'),
      logo: getAbsoluteUrl('/images/logo.png'),
    },
  }

  return (
    <>
      <JsonLd data={contactJsonLd} />
      <section className='min-h-screen bg-[#FAF9F5] text-[#1C1B18] antialiased selection:bg-emerald-200 selection:text-emerald-950 relative overflow-hidden pt-28 sm:pt-36 pb-24'>
        {/* Subtle Background Pattern */}
        <div className='absolute inset-0 bg-[radial-gradient(#e5e0d8_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none' />

        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div className='grid gap-12 lg:gap-16 lg:grid-cols-12 items-start'>
            {/* Left Column: Heading & Contact Info */}
            <div className='lg:col-span-5 space-y-10'>
              <div>
                <div className='inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 mb-6'>
                  <span className='w-2 h-2 rounded-full bg-emerald-600 animate-pulse' />
                  <span className='text-[10px] font-black uppercase tracking-[0.25em] text-emerald-800'>
                    Get In Touch
                  </span>
                </div>

                <h1 className='text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-[#161513] leading-[1.08] tracking-tight mb-5'>
                  Initiate a{' '}
                  <span className='italic font-normal text-emerald-900 block sm:inline'>
                    dialogue.
                  </span>
                </h1>

                <p className='text-[#58544D] text-base sm:text-lg font-serif leading-relaxed'>
                  Whether you are a fellow developer, a curious student, or a
                  future collaborator, we welcome your inquiries and insights.
                </p>
              </div>

              {/* Direct Mail Cards */}
              <div className='space-y-4 pt-2'>
                <a
                  href='mailto:educationwithhamza@gmail.com'
                  className='group flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#E8E3DA] hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300'
                >
                  <div className='w-12 h-12 bg-[#FAF9F5] group-hover:bg-emerald-900 border border-[#E3DFD7] group-hover:border-emerald-900 rounded-xl flex items-center justify-center text-[#58544D] group-hover:text-emerald-300 transition-colors duration-300 shrink-0'>
                    <FiMail size={20} />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-[10px] font-black uppercase tracking-widest text-emerald-800 mb-0.5'>
                      Technical Inquiries
                    </p>
                    <p className='text-sm sm:text-base font-serif font-semibold text-[#161513] truncate group-hover:text-emerald-900 transition-colors'>
                      educationwithhamza@gmail.com
                    </p>
                  </div>
                </a>

                <a
                  href='mailto:educationwithhamza@gmail.com'
                  className='group flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#E8E3DA] hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300'
                >
                  <div className='w-12 h-12 bg-[#FAF9F5] group-hover:bg-emerald-900 border border-[#E3DFD7] group-hover:border-emerald-900 rounded-xl flex items-center justify-center text-[#58544D] group-hover:text-emerald-300 transition-colors duration-300 shrink-0'>
                    <FiMessageCircle size={20} />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-[10px] font-black uppercase tracking-widest text-emerald-800 mb-0.5'>
                      General Feedback
                    </p>
                    <p className='text-sm sm:text-base font-serif font-semibold text-[#161513] truncate group-hover:text-emerald-900 transition-colors'>
                      educationwithhamza@gmail.com
                    </p>
                  </div>
                </a>
              </div>

              <div className='pt-4'>
                <Link
                  href='/blog'
                  className='inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#161513] hover:text-emerald-800 group transition-colors'
                >
                  <span>Return to Archive</span>
                  <FiCornerDownRight className='group-hover:translate-x-1 group-hover:translate-y-0.5 transition-transform' />
                </Link>
              </div>
            </div>

            {/* Right Column: Dynamic Form Card */}
            <div className='lg:col-span-7 bg-white rounded-3xl sm:rounded-[2.5rem] border border-[#E8E3DA] p-6 sm:p-10 lg:p-12 shadow-xl relative'>
              {submitted ? (
                <div className='text-center py-12 sm:py-16 space-y-6'>
                  <div className='w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50 shadow-inner'>
                    <FiCheck size={38} />
                  </div>
                  <div className='space-y-2'>
                    <h2 className='text-3xl font-serif font-medium text-[#161513]'>
                      Transmission Received
                    </h2>
                    <p className='text-[#666259] font-serif italic max-w-md mx-auto text-base'>
                      Your message has been logged in our archive. We will review
                      it and respond shortly.
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={() => setSubmitted(false)}
                    className='mt-4 inline-flex items-center justify-center rounded-2xl bg-[#161513] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-emerald-900 transition-colors shadow-sm'
                  >
                    Send Another Entry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='space-y-1.5'>
                    <h3 className='text-xl font-serif font-medium text-[#161513]'>
                      Send a Message
                    </h3>
                    <p className='text-xs text-[#8A8478] uppercase tracking-wider font-semibold'>
                      Fill in the details below to dispatch your message directly
                    </p>
                  </div>

                  <div className='grid gap-6 sm:grid-cols-2 pt-2'>
                    <div className='space-y-2'>
                      <label className='block text-[11px] font-bold uppercase tracking-wider text-[#58544D] ml-1'>
                        Full Name
                      </label>
                      <input
                        value={formState.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                        placeholder='e.g. Haider'
                        className='w-full rounded-2xl border border-[#E3DFD7] bg-[#FAF9F5] px-5 py-3.5 text-sm text-[#161513] placeholder-[#9E988D] outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all'
                      />
                    </div>

                    <div className='space-y-2'>
                      <label className='block text-[11px] font-bold uppercase tracking-wider text-[#58544D] ml-1'>
                        Email Address
                      </label>
                      <input
                        type='email'
                        value={formState.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                        placeholder='your@email.com'
                        className='w-full rounded-2xl border border-[#E3DFD7] bg-[#FAF9F5] px-5 py-3.5 text-sm text-[#161513] placeholder-[#9E988D] outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='block text-[11px] font-bold uppercase tracking-wider text-[#58544D] ml-1'>
                      Your Inquiry
                    </label>
                    <textarea
                      value={formState.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      required
                      rows={5}
                      placeholder='Describe your thoughts or feedback…'
                      className='w-full rounded-2xl border border-[#E3DFD7] bg-[#FAF9F5] p-5 text-sm text-[#161513] placeholder-[#9E988D] outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none'
                    />
                  </div>

                  <button
                    type='submit'
                    disabled={loading}
                    className='w-full rounded-2xl bg-[#161513] hover:bg-emerald-900 px-6 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all duration-300 disabled:opacity-50 group flex items-center justify-center gap-2.5'
                  >
                    {loading ? (
                      'Transmitting…'
                    ) : (
                      <>
                        <span>Dispatch Message</span>
                        <FiSend size={14} className='group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform' />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}