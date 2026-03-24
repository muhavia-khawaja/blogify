import React from 'react'
import { Lock, Mail, ShieldCheck } from 'lucide-react'
import { login } from '@/utils/actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 bg-blue-100 flex items-center justify-center rounded-full text-blue-600 mb-4'>
            <ShieldCheck size={28} />
          </div>
          <h2 className='text-3xl font-extrabold text-gray-900'>Admin Login</h2>
          <p className='mt-2 text-sm text-gray-500'>
            Secure access for blog management
          </p>
        </div>

        {searchParams.error && (
          <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded-md'>
            <p className='text-sm text-red-700 font-medium'>
              {decodeURIComponent(searchParams.error)}
            </p>
          </div>
        )}

        <form action={login} className='mt-8 space-y-6'>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email Address
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
                  <Mail size={18} />
                </div>
                <input
                  name='email'
                  type='email'
                  required
                  placeholder='admin@notes.com'
                  className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
                  <Lock size={18} />
                </div>
                <input
                  name='password'
                  type='password'
                  required
                  placeholder='••••••••'
                  className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900'
                />
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div className='text-xs text-gray-500 italic'>
              * Protected by JWT Authentication
            </div>
          </div>

          <button
            type='submit'
            className='w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200'
          >
            Sign in to Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}
