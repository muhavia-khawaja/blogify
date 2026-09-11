'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft } from 'react-icons/fi'
import { loginUser } from '@/utils/actions'
import { GraduationCap, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await loginUser(formData)

      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else {
        router.push('/profile')
        router.refresh()
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred',
      )
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen bg-[#f8f9fc] text-gray-950 antialiased'>
      <div className='relative hidden overflow-hidden bg-[#211b59] p-10 lg:flex lg:w-[48%] lg:flex-col lg:justify-between xl:p-16'>
        <div
          className='absolute inset-0 opacity-[0.04]'
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className='pointer-events-none absolute -bottom-12 -right-8 select-none font-serif text-[20rem] font-bold leading-none text-white/[0.04] xl:text-[25rem]'>
          E
        </div>

        <div className='relative z-10 flex items-center gap-3'>
          <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7b801] text-[#211b59] shadow-lg shadow-black/10'>
            <GraduationCap className='h-5 w-5' />
          </div>
          <div className='leading-tight'>
            <p className='text-sm font-extrabold tracking-tight text-white'>
              Education
            </p>
            <p className='text-xs font-medium text-white/60'>With Hamza</p>
          </div>
        </div>

        <div className='space-y-8 relative z-10'>
          <div className='flex items-center gap-2 text-[#f7b801]'>
            <Sparkles className='h-4 w-4' />
            <span className='text-[10px] font-black uppercase tracking-[0.3em]'>
              Your learning space
            </span>
          </div>
          <blockquote className='max-w-md font-serif text-3xl font-bold leading-snug text-white xl:text-4xl'>
            Come back to the ideas that make learning easier.
          </blockquote>
          <p className='max-w-sm text-sm leading-6 text-white/60'>
            Follow thoughtful writers, save useful articles, and keep building a
            library that belongs to you.
          </p>
        </div>

        <div className='flex gap-10 relative z-10'>
          {[
            ['∞', 'Articles'],
            ['24h', 'Publishing'],
            ['Open', 'Access'],
          ].map(([val, label]) => (
            <div key={label}>
              <p className='text-2xl font-serif font-bold text-white'>{val}</p>
              <p className='text-[9px] font-black uppercase tracking-widest text-white/30 mt-1'>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-1 flex-col justify-center px-5 py-20 sm:px-8 lg:px-14 xl:px-24'>
        <nav className='absolute left-0 top-0 w-full p-5 sm:p-8 lg:hidden'>
          <Link
            href='/'
            className='group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 transition-all hover:text-[#3d348b]'
          >
            <FiArrowLeft className='group-hover:-translate-x-1 transition-transform' />
            Return to Archive
          </Link>
        </nav>

        <nav className='absolute right-0 top-0 hidden p-8 lg:block'>
          <Link
            href='/'
            className='group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 transition-all hover:text-[#3d348b]'
          >
            <FiArrowLeft className='group-hover:-translate-x-1 transition-transform' />
            Return to Archive
          </Link>
        </nav>

        <div className='mx-auto w-full max-w-md'>
          <div className='mb-9'>
            <span className='mb-5 block text-[9px] font-black uppercase tracking-[0.4em] text-[#7678ed]'>
              Member Access
            </span>
            <h1 className='mb-3 font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl'>
              Welcome{' '}
              <span className='italic font-normal text-gray-400'>Back.</span>
            </h1>
            <p className='font-serif italic text-gray-500'>
              Sign in to manage your perspectives.
            </p>
          </div>

          {error && (
            <div className='mb-6 rounded-xl border-l-4 border-red-400 bg-red-50 px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-red-600'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='space-y-1.5'>
              <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1'>
                Email Identifier
              </label>
              <input
                type='email'
                name='email'
                required
                placeholder='you@example.com'
                className='w-full rounded-xl border border-gray-200 bg-white px-5 py-4 font-serif text-sm text-gray-950 outline-none transition-all placeholder:text-gray-300 focus:border-[#7678ed] focus:ring-4 focus:ring-[#7678ed]/10'
              />
            </div>

            <div className='space-y-1.5'>
              <div className='flex justify-between items-center ml-1'>
                <label className='text-[9px] font-black uppercase tracking-[0.25em] text-gray-400'>
                  Secret Key
                </label>
              </div>
              <input
                type='password'
                name='password'
                required
                placeholder='••••••••'
                className='w-full rounded-xl border border-gray-200 bg-white px-5 py-4 font-serif text-sm text-gray-950 outline-none transition-all placeholder:text-gray-300 focus:border-[#7678ed] focus:ring-4 focus:ring-[#7678ed]/10'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='group relative mt-2 w-full overflow-hidden rounded-xl bg-[#3d348b] py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-[#3d348b]/20 transition-all active:scale-[0.98] disabled:opacity-50'
            >
              <span className='relative z-10'>
                {loading ? 'Verifying...' : 'Authorize Access'}
              </span>
              <div className='absolute inset-0 translate-y-full bg-[#f7b801] transition-transform duration-500 group-hover:translate-y-0' />
            </button>
          </form>

          <div className='relative my-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-100' />
            </div>
            <div className='relative flex justify-center'>
              <span className='bg-[#f8f9fc] px-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400'>
                New here?
              </span>
            </div>
          </div>

          <Link
            href='/signup'
            className='block w-full rounded-xl border border-gray-200 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 transition-all hover:border-[#7678ed] hover:bg-[#3d348b]/5 hover:text-[#3d348b]'
          >
            Create New Account
          </Link>

          <p className='mt-10 text-center text-[9px] font-black uppercase tracking-[0.3em] text-gray-300'>
            Education With Hamza
          </p>
        </div>
      </div>
    </div>
  )
}
