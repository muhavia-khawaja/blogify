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
    <div className='min-h-screen flex items-center justify-center bg-base-200 px-4 py-8 relative overflow-hidden'>
      <div className='absolute top-10 -left-20 w-40 h-40 bg-amber-200/40 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute bottom-20 -right-20 w-40 h-40 bg-amber-100/60 rounded-full blur-3xl pointer-events-none' />

      <div className='w-full max-w-md z-10'>
        <div className='card bg-base-100 shadow-xl border border-base-300 overflow-hidden rounded-3xl'>
          <div className='h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300' />

          <div className='card-body p-8 sm:p-10'>
            <div className='text-center mb-6'>
              <div className='inline-flex items-center justify-center w-14 h-14 bg-amber-50 rounded-2xl mb-4 shadow-sm border border-amber-200/60'>
                <Lock className='text-amber-500' size={28} />
              </div>

              <p className='text-white text-sm sm:text-base font-serif italic'>
                Secure entry for content administrators
              </p>
            </div>

            {searchParams.error && (
              <div
                role='alert'
                className='alert alert-error mb-6 flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200/60 text-rose-800 p-4 shadow-sm'
              >
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600'>
                  <svg
                    className='h-4 w-4 stroke-current'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                    />
                  </svg>
                </div>
                <span className='text-xs sm:text-sm font-semibold uppercase'>
                  {decodeURIComponent(searchParams.error)}
                </span>
              </div>
            )}

            <form action={login} className='space-y-5'>
              <div className='form-control'>
                <label htmlFor='email' className='label pb-1'>
                  <span className='label-text text-xs font-black uppercase tracking-[0.2em] text-white'>
                    Email Address
                  </span>
                </label>
                <div className='relative group'>
                  <Mail
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50 group-focus-within:text-amber-600 transition-colors z-10 text-amber-600'
                    size={18}
                  />
                  <input
                    id='email'
                    name='email'
                    type='email'
                    required
                    placeholder='admin@example.com'
                    autoComplete='email'
                    className='input input-bordered w-full pl-12 pr-4 py-3.5 bg-base-100 rounded-xl text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 shadow-sm'
                  />
                </div>
              </div>

              <div className='form-control'>
                <label htmlFor='password' className='label pb-1'>
                  <span className='label-text text-xs font-black uppercase tracking-[0.2em] text-white'>
                    Password
                  </span>
                </label>
                <div className='relative group'>
                  <Lock
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50 group-focus-within:text-amber-600 transition-colors z-10 text-amber-600'
                    size={18}
                  />
                  <input
                    id='password'
                    name='password'
                    type='password'
                    required
                    placeholder='••••••••'
                    autoComplete='current-password'
                    className='input input-bordered w-full pl-12 pr-4 py-3.5 bg-base-100 rounded-xl text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 shadow-sm'
                  />
                </div>
              </div>

              <SubmitBtn />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
