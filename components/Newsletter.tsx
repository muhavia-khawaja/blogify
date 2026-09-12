'use client'

import { FormEvent, useEffect, useState } from 'react'
import { FiArrowRight, FiCheck, FiMail, FiX } from 'react-icons/fi'

type SaveSubscriptionResult =
  | {
      success: true
      message?: string
    }
  | {
      success: false
      message?: string
    }

type NewsletterModalProps = {
  saveSubscription: (email: string) => Promise<SaveSubscriptionResult>
  delay?: number
}

const DISMISSED_KEY = 'ewh_newsletter_dismissed_at'
const SUBSCRIBED_KEY = 'ewh_newsletter_subscribed'
const DISMISS_DAYS = 5

export default function NewsletterModal({
  saveSubscription,
  delay = 5000,
}: NewsletterModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const subscribed = localStorage.getItem(SUBSCRIBED_KEY)

    if (subscribed === 'true') {
      return
    }

    const dismissedAt = localStorage.getItem(DISMISSED_KEY)

    if (dismissedAt) {
      const dismissedTime = Number(dismissedAt)

      if (!Number.isNaN(dismissedTime)) {
        const fiveDays = DISMISS_DAYS * 24 * 60 * 60 * 1000
        const timePassed = Date.now() - dismissedTime

        if (timePassed < fiveDays) {
          return
        }

        localStorage.removeItem(DISMISSED_KEY)
      }
    }

    const timer = window.setTimeout(() => {
      setIsOpen(true)
    }, delay)

    return () => window.clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  const closeModal = () => {
    if (loading) return

    setIsOpen(false)

    if (!success) {
      localStorage.setItem(DISMISSED_KEY, Date.now().toString())
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')

    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail) {
      setError('Please enter your email address.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    try {
      setLoading(true)

      const result = await saveSubscription(cleanEmail)

      if (!result.success) {
        setError(result.message || 'Something went wrong. Please try again.')
        return
      }

      localStorage.setItem(SUBSCRIBED_KEY, 'true')
      localStorage.removeItem(DISMISSED_KEY)

      setSuccess(true)
      setEmail('')
    } catch (error) {
      console.error('Newsletter subscription error:', error)

      setError('Unable to subscribe right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || !isOpen) {
    return null
  }

  return (
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6'
      role='dialog'
      aria-modal='true'
      aria-labelledby='newsletter-title'
    >
      {/* Backdrop */}
      <button
        type='button'
        aria-label='Close newsletter'
        onClick={closeModal}
        className='absolute inset-0 cursor-default bg-black/55 backdrop-blur-sm'
      />

      {/* Modal */}
      <div className='relative z-10 w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/20 bg-[#FCFBF9] shadow-[0_30px_100px_rgba(0,0,0,0.28)]'>
        {/* Decorative background */}
        <div className='pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#7678ed]/15 blur-3xl' />
        <div className='pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-[#f7b801]/15 blur-3xl' />

        {/* Close */}
        <button
          type='button'
          onClick={closeModal}
          disabled={loading}
          aria-label='Close'
          className='absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#1A1A1A]/10 bg-white/80 text-[#1A1A1A] transition hover:bg-[#1A1A1A] hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
        >
          <FiX size={18} />
        </button>

        {success ? (
          <SuccessContent onClose={closeModal} />
        ) : (
          <div className='relative grid md:grid-cols-[0.85fr_1.15fr]'>
            {/* Left visual panel */}
            <div className='relative hidden min-h-[430px] overflow-hidden bg-[#3d348b] p-8 text-white md:flex md:flex-col md:justify-between'>
              <div className='absolute inset-0 opacity-[0.08]'>
                <div
                  className='absolute inset-0'
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
                    backgroundSize: '34px 34px',
                  }}
                />
              </div>

              <div className='relative'>
                <div className='mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20'>
                  <FiMail size={22} />
                </div>

                <p className='mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/60'>
                  The Journal
                </p>

                <h2 className='font-serif text-4xl leading-[1.05] tracking-tight'>
                  Good things,
                  <br />
                  delivered.
                </h2>
              </div>

              <div className='relative'>
                <div className='mb-5 h-px w-16 bg-white/30' />

                <p className='max-w-xs text-sm leading-6 text-white/70'>
                  Get useful articles, educational resources, updates and ideas
                  from Education With Hamza.
                </p>
              </div>
            </div>

            {/* Right content */}
            <div className='relative px-6 py-10 sm:px-10 sm:py-12 md:px-10'>
              {/* Mobile icon */}
              <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3d348b] text-white md:hidden'>
                <FiMail size={21} />
              </div>

              <p className='mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#3d348b]'>
                Stay in the loop
              </p>

              <h1
                id='newsletter-title'
                className='max-w-md font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-[#1A1A1A] sm:text-5xl'
              >
                Subscribe to our newsletter.
              </h1>

              <p className='mt-5 max-w-md text-sm leading-6 text-[#1A1A1A]/60 sm:text-base'>
                Join our readers and receive the latest articles, educational
                resources and useful updates directly in your inbox.
              </p>

              <form onSubmit={handleSubmit} className='mt-8'>
                <label
                  htmlFor='newsletter-email'
                  className='mb-2 block text-sm font-medium text-[#1A1A1A]'
                >
                  Email address
                </label>

                <div className='flex flex-col gap-3 sm:flex-row'>
                  <div className='relative flex-1'>
                    <FiMail
                      className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/35'
                      size={18}
                    />

                    <input
                      id='newsletter-email'
                      type='email'
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError('')
                      }}
                      placeholder='you@example.com'
                      autoComplete='email'
                      disabled={loading}
                      className='h-12 w-full rounded-xl border border-[#1A1A1A]/10 bg-white pl-11 pr-4 text-sm text-[#1A1A1A] outline-none transition placeholder:text-[#1A1A1A]/35 focus:border-[#3d348b] focus:ring-4 focus:ring-[#3d348b]/10 disabled:cursor-not-allowed disabled:opacity-60'
                    />
                  </div>

                  <button
                    type='submit'
                    disabled={loading}
                    className='flex h-12 items-center justify-center gap-2 rounded-xl bg-[#3d348b] px-6 text-sm font-semibold text-white transition hover:bg-[#302873] disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    {loading ? (
                      <>
                        <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Subscribe
                        <FiArrowRight size={17} />
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <p
                    role='alert'
                    className='mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'
                  >
                    {error}
                  </p>
                )}
              </form>

              <div className='mt-6 flex items-start gap-3'>
                <div className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3d348b]/10 text-[#3d348b]'>
                  <FiCheck size={12} />
                </div>

                <p className='text-xs leading-5 text-[#1A1A1A]/50'>
                  No spam. Just useful content. You can unsubscribe anytime.
                </p>
              </div>

              <p className='mt-5 text-[11px] leading-5 text-[#1A1A1A]/35'>
                By subscribing, you agree to receive emails from Education With
                Hamza.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SuccessContent({ onClose }: { onClose: () => void }) {
  return (
    <div className='relative flex min-h-[430px] flex-col items-center justify-center px-6 py-12 text-center sm:px-12'>
      <div className='absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#7678ed]/15 blur-3xl' />
      <div className='absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#f7b801]/15 blur-3xl' />

      <div className='relative flex h-20 w-20 items-center justify-center rounded-full bg-[#3d348b]/10 text-[#3d348b]'>
        <div className='flex h-14 w-14 items-center justify-center rounded-full bg-[#3d348b] text-white shadow-lg'>
          <FiCheck size={28} />
        </div>
      </div>

      <p className='relative mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#3d348b]'>
        Youre subscribed
      </p>

      <h2 className='relative mt-3 font-serif text-4xl font-semibold tracking-tight text-[#1A1A1A] sm:text-5xl'>
        Welcome aboard.
      </h2>

      <p className='relative mt-4 max-w-md text-sm leading-6 text-[#1A1A1A]/60 sm:text-base'>
        Thanks for subscribing. We&apos;ll send the latest articles, resources and
        updates straight to your inbox.
      </p>

      <button
        type='button'
        onClick={onClose}
        className='relative mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-[#1A1A1A] px-6 text-sm font-semibold text-white transition hover:bg-[#3d348b]'
      >
        Continue reading
      </button>
    </div>
  )
}
