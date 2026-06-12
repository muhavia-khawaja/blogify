import React from 'react'
import { Lock, Mail, Zap } from 'lucide-react'
import { login } from '@/utils/actions'
import SubmitBtn from '@/components/SubmitBtn'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9F8F6] via-[#F5F3F0] to-[#F1EEEB] px-4 py-8'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-3xl shadow-xl border border-[#E0DCD5] overflow-hidden'>
          <div className='h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500' />

          <div className='p-8 sm:p-10'>
            <div className='text-center mb-8 sm:mb-10'>
              <div className='inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl mb-4 shadow-sm border border-emerald-200/50'>
                <Zap className='text-emerald-600' size={28} />
              </div>

              <h1 className='text-3xl sm:text-4xl font-serif font-bold text-[#1A1A18] tracking-tight mb-2'>
                Registry Access
              </h1>
              <p className='text-[#6B6860] text-sm sm:text-base font-serif italic'>
                Secure entry for content administrators
              </p>
            </div>

            {searchParams.error && (
              <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl'>
                <div className='flex gap-3'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-5 w-5 text-red-500'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <p className='text-sm text-red-700 font-medium'>
                    {decodeURIComponent(searchParams.error)}
                  </p>
                </div>
              </div>
            )}

            <form action={login} className='space-y-5'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-xs font-black uppercase tracking-[0.2em] text-[#9B9890] mb-2.5'
                >
                  Email Address
                </label>
                <div className='relative group'>
                  <Mail
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-[#9B9890] group-focus-within:text-emerald-600 transition-colors'
                    size={18}
                  />
                  <input
                    id='email'
                    name='email'
                    type='email'
                    required
                    placeholder='admin@example.com'
                    autoComplete='email'
                    className='w-full pl-12 pr-4 py-3.5 bg-[#FEFDFB] border border-[#E0DCD5] rounded-xl text-[#1A1A18] placeholder-[#B0ADA6] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-200 shadow-sm'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-xs font-black uppercase tracking-[0.2em] text-[#9B9890] mb-2.5'
                >
                  Password
                </label>
                <div className='relative group'>
                  <Lock
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-[#9B9890] group-focus-within:text-emerald-600 transition-colors'
                    size={18}
                  />
                  <input
                    id='password'
                    name='password'
                    type='password'
                    required
                    placeholder='••••••••'
                    autoComplete='current-password'
                    className='w-full pl-12 pr-4 py-3.5 bg-[#FEFDFB] border border-[#E0DCD5] rounded-xl text-[#1A1A18] placeholder-[#B0ADA6] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-200 shadow-sm'
                  />
                </div>
              </div>

              <div className='flex items-center gap-2 pt-1 pb-3'>
                <div className='w-1 h-1 rounded-full bg-emerald-500' />
                <p className='text-[10px] font-semibold text-[#9B9890] uppercase tracking-widest'>
                  Protected by JWT authentication
                </p>
              </div>

              <SubmitBtn />
            </form>

            <div className='mt-8 pt-8 border-t border-[#E8E4DC]'>
              <p className='text-center text-[10px] text-[#9B9890] font-semibold uppercase tracking-widest'>
                Admin Portal
              </p>
              <p className='text-center text-xs text-[#B0ADA6] mt-2 font-serif italic'>
                For authorized administrators only
              </p>
            </div>
          </div>
        </div>

        <div className='absolute top-10 -left-20 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-20 pointer-events-none' />
        <div className='absolute bottom-20 -right-20 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-20 pointer-events-none' />
      </div>
    </div>
  )
}
