'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiShield } from 'react-icons/fi'
import { loginUser } from '@/utils/actions'

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
        router.push('/dashboard')
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
    <div className='min-h-screen bg-[#FCFBF9] antialiased text-[#1A1A1A] flex flex-col justify-center px-6 py-12'>
      <nav className='fixed top-0 w-full p-8'>
        <Link
          href='/'
          className='group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all'
        >
          <FiArrowLeft className='group-hover:-translate-x-1 transition-transform' />
          Return to Archive
        </Link>
      </nav>

      <div className='max-w-md w-full mx-auto'>
        <div className='text-center mb-12'>
          <div className='flex justify-center mb-8'>
            <div className='w-14 h-14 bg-white border border-gray-100 rounded-3xl flex items-center justify-center shadow-xl rotate-3'>
              <FiShield className='text-emerald-500' size={24} />
            </div>
          </div>

          <span className='text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 block mb-4'>
            Member Access
          </span>
          <h1 className='text-5xl font-serif font-bold tracking-tight mb-4'>
            Welcome{' '}
            <span className='italic font-normal text-gray-400'>Back.</span>
          </h1>
          <p className='text-gray-400 font-serif italic text-lg'>
            Sign in to manage your perspectives.
          </p>
        </div>

        <div className='bg-white border border-gray-100 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]'>
          {error && (
            <div className='mb-8 p-4 bg-red-50 border-l-4 border-red-400 text-red-600 text-[11px] font-bold uppercase tracking-widest'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-8'>
            <div className='space-y-3'>
              <label className='block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2'>
                Identity (Email)
              </label>
              <input
                type='email'
                name='email'
                required
                placeholder='you@example.com'
                className='w-full px-6 py-5 bg-[#F9F8F6] border-none rounded-2xl text-sm font-serif outline-none focus:ring-2 ring-emerald-100 transition-all placeholder:text-gray-300'
              />
            </div>

            <div className='space-y-3'>
              <div className='flex justify-between items-center px-2'>
                <label className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
                  Secret Key
                </label>
                <Link
                  href='/forgot'
                  className='text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700'
                >
                  Forgot?
                </Link>
              </div>
              <input
                type='password'
                name='password'
                required
                placeholder='••••••••'
                className='w-full px-6 py-5 bg-[#F9F8F6] border-none rounded-2xl text-sm font-serif outline-none focus:ring-2 ring-emerald-100 transition-all placeholder:text-gray-300'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='group relative w-full py-6 bg-black text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50'
            >
              <span className='relative z-10'>
                {loading ? 'Verifying...' : 'Authorize Access'}
              </span>
              <div className='absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500' />
            </button>
          </form>

          <div className='relative my-10'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-100'></div>
            </div>
            <div className='relative flex justify-center text-[9px] font-black uppercase tracking-[0.2em]'>
              <span className='px-4 bg-white text-gray-300'>Outsider?</span>
            </div>
          </div>

          <Link
            href='/signup'
            className='block w-full text-center py-5 border-2 border-gray-100 hover:border-emerald-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-emerald-600'
          >
            Create New Account
          </Link>
        </div>

        <div className='mt-12 text-center'>
          <p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-300'>
            Journal System v2.0
          </p>
        </div>
      </div>
    </div>
  )
}
