'use client'

import Link from 'next/link'
import { useState } from 'react'
import { registerUser } from '@/utils/actions'
import { useRouter } from 'next/navigation'
import { FiArrowLeft } from 'react-icons/fi'

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      return setError('Secrets do not match.')
    }

    setLoading(true)

    try {
      const result = await registerUser(formData)
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
    <div className='min-h-screen bg-[#FCFBF9] antialiased text-[#1A1A1A] flex'>
      <div className='hidden lg:flex lg:w-1/2 relative bg-[#0F0F0F] flex-col justify-between p-14 overflow-hidden'>
        <div
          className='absolute inset-0 opacity-[0.04]'
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className='absolute bottom-0 right-0 text-[22rem] font-serif font-bold leading-none text-white/[0.03] select-none pointer-events-none'>
          J
        </div>

        <div>
          <span className='text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500'>
            The Journal
          </span>
        </div>

        <div className='space-y-8 relative z-10'>
          <div className='h-px w-12 bg-emerald-500' />
          <blockquote className='font-serif text-3xl font-bold text-white leading-snug max-w-xs'>
            Every great author began with a single signature.
          </blockquote>
          <p className='text-[11px] font-black uppercase tracking-[0.3em] text-white/30'>
            Join the Archive
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

      <div className='flex-1 flex flex-col justify-center px-6 py-16 lg:px-20 xl:px-28'>
        <nav className='absolute top-0 left-0 w-full p-8 lg:hidden'>
          <Link
            href='/'
            className='group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all'
          >
            <FiArrowLeft className='group-hover:-translate-x-1 transition-transform' />
            Return to Archive
          </Link>
        </nav>
        <nav className='absolute top-0 right-0 p-8 hidden lg:block'>
          <Link
            href='/'
            className='group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all'
          >
            <FiArrowLeft className='group-hover:-translate-x-1 transition-transform' />
            Return to Archive
          </Link>
        </nav>

        <div className='max-w-sm w-full mx-auto'>
          <div className='mb-10'>
            <span className='text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600 block mb-5'>
              New Enrollment
            </span>
            <h1 className='text-4xl font-serif font-bold tracking-tight leading-tight mb-3'>
              Join the{' '}
              <span className='italic font-normal text-gray-400'>Journal.</span>
            </h1>
            <p className='text-gray-400 font-serif italic'>
              Create your unique signature today.
            </p>
          </div>

          {error && (
            <div className='mb-6 px-5 py-4 bg-red-50 border-l-4 border-red-400 rounded-xl text-red-600 text-[11px] font-bold uppercase tracking-widest'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='space-y-1.5'>
              <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1'>
                Legal Name
              </label>
              <input
                type='text'
                name='name'
                required
                placeholder='John Doe'
                className='w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-serif outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all placeholder:text-gray-300 text-[#1A1A1A]'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1'>
                Email Identifier
              </label>
              <input
                type='email'
                name='email'
                required
                placeholder='you@example.com'
                className='w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-serif outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all placeholder:text-gray-300 text-[#1A1A1A]'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1'>
                Secret Key
              </label>
              <input
                type='password'
                name='password'
                required
                placeholder='••••••••'
                className='w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-serif outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all placeholder:text-gray-300 text-[#1A1A1A]'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1'>
                Confirm Secret
              </label>
              <input
                type='password'
                name='confirmPassword'
                required
                placeholder='••••••••'
                className='w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-serif outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all placeholder:text-gray-300 text-[#1A1A1A]'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='group relative w-full py-5 mt-2 bg-[#0F0F0F] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50'
            >
              <span className='relative z-10'>
                {loading ? 'Processing...' : 'Register Signature'}
              </span>
              <div className='absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500' />
            </button>
          </form>

          <div className='relative my-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-100' />
            </div>
            <div className='relative flex justify-center'>
              <span className='px-4 bg-[#FCFBF9] text-[9px] font-black uppercase tracking-[0.2em] text-gray-300'>
                Already enrolled?
              </span>
            </div>
          </div>

          <Link
            href='/login'
            className='block w-full text-center py-4 border border-gray-200 hover:border-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-emerald-600 text-gray-500'
          >
            Authorize Existing Account
          </Link>
        </div>
      </div>
    </div>
  )
}
