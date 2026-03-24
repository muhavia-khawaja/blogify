'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { FiArrowLeft, FiMail, FiCheck } from 'react-icons/fi'

export default function SubscribePage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmitted(true)
    setEmail('')
    setLoading(false)

    // Reset after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <section className='bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12'>
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-12'
        >
          <FiArrowLeft size={18} />
          Back to Home
        </Link>

        <div className='bg-white rounded-2xl shadow-xl p-8 sm:p-12'>
          {submitted ? (
            <div className='text-center'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <FiCheck className='w-8 h-8 text-green-600' />
              </div>
              <h1 className='text-3xl font-bold text-gray-900 mb-3'>
                Thank You!
              </h1>
              <p className='text-gray-600 mb-6'>
                We&apos;ve sent a confirmation email to <strong>{email}</strong>
                . Please check your inbox to verify your subscription.
              </p>
              <Link
                href='/'
                className='inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all'
              >
                Return to Home
              </Link>
            </div>
          ) : (
            <>
              <div className='mb-8'>
                <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                  Subscribe to Our Newsletter
                </h1>
                <p className='text-xl text-gray-600'>
                  Get the latest articles, insights, and updates delivered to
                  your inbox weekly. No spam, just great content.
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-semibold text-gray-900 mb-2'
                  >
                    Email Address
                  </label>
                  <div className='relative'>
                    <FiMail
                      className='absolute left-4 top-4 text-gray-400'
                      size={20}
                    />
                    <input
                      type='email'
                      id='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder='you@example.com'
                      className='w-full pl-12 pr-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900'
                    />
                  </div>
                </div>

                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <p className='text-sm text-gray-700'>
                    ✓ Weekly insights from industry experts
                    <br />
                    ✓ Never miss important updates
                    <br />✓ Unsubscribe anytime
                  </p>
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed'
                >
                  {loading ? 'Subscribing...' : 'Subscribe Now'}
                </button>

                <p className='text-center text-sm text-gray-600'>
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>

              <div className='mt-12 pt-8 border-t border-gray-200'>
                <h2 className='text-lg font-bold text-gray-900 mb-4'>
                  Why Subscribe?
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      📚 Expert Content
                    </h3>
                    <p className='text-sm text-gray-600'>
                      Learn from industry leaders and experienced developers
                    </p>
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      ⚡ Stay Updated
                    </h3>
                    <p className='text-sm text-gray-600'>
                      Get the latest trends and best practices delivered to you
                    </p>
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      💡 Practical Tips
                    </h3>
                    <p className='text-sm text-gray-600'>
                      Actionable insights you can apply to your projects
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
