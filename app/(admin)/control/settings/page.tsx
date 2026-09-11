'use client'

import React, { useEffect, useState } from 'react'
import {
  Settings,
  Shield,
  User,
  Mail,
  Key,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { getAdminProfile, updateAdminProfile } from '@/utils/admin/action'

interface AdminData {
  id: string
  name: string
  email: string
}

interface StatusMessage {
  type: 'success' | 'error'
  text: string
}

export default function SettingsPage() {
  const [admin, setAdmin] = useState<AdminData | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)

  const loadAdminProfile = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      setStatusMessage(null)

      const result = await getAdminProfile()

      if (!result) {
        setAdmin(null)
        setName('')
        setEmail('')
        return
      }

      setAdmin(result)
      setName(result.name || '')
      setEmail(result.email || '')
    } catch (error) {
      console.error('Failed to load admin profile:', error)

      setStatusMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Failed to load admin profile.',
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadAdminProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!admin?.id) {
      setStatusMessage({
        type: 'error',
        text: 'Administrator profile could not be found.',
      })
      return
    }

    if (!name.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Full name is required.',
      })
      return
    }

    if (!email.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Email address is required.',
      })
      return
    }

    if (newPassword && newPassword.length < 6) {
      setStatusMessage({
        type: 'error',
        text: 'New password must be at least 6 characters long.',
      })
      return
    }

    try {
      setIsSaving(true)
      setStatusMessage(null)

      const result = await updateAdminProfile({
        id: admin.id,
        name: name.trim(),
        email: email.trim(),
        password: newPassword.trim() || undefined,
      })

      /*
       * Supports both:
       * - actions that return nothing
       * - actions that return { success, error, message }
       */
      if (
        result &&
        typeof result === 'object' &&
        'success' in result &&
        result.success === false
      ) {
        throw new Error(
          'error' in result && typeof result.error === 'string'
            ? result.error
            : 'Failed to update admin profile.',
        )
      }

      setAdmin((prev) =>
        prev
          ? {
              ...prev,
              name: name.trim(),
              email: email.trim(),
            }
          : prev,
      )

      setNewPassword('')

      setStatusMessage({
        type: 'success',
        text: 'Admin settings updated successfully.',
      })

      setTimeout(() => {
        setStatusMessage(null)
      }, 4000)
    } catch (error) {
      console.error('Failed to update admin profile:', error)

      setStatusMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Failed to update admin profile.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-[#F8F6F0] p-4 text-[#1A1A18] sm:p-6 md:p-10'>
        <div className='mx-auto max-w-4xl'>
          <div className='flex min-h-[500px] items-center justify-center rounded-3xl border border-[#E0DCD5] bg-white shadow-sm'>
            <div className='flex flex-col items-center gap-3 text-center'>
              <Loader2 size={30} className='animate-spin text-amber-600' />

              <div>
                <p className='text-sm font-semibold text-[#1A1A18]'>
                  Loading settings
                </p>

                <p className='mt-1 text-xs text-[#8C887B]'>
                  Please wait while we load your administrator profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!admin) {
    return (
      <div className='min-h-screen bg-[#F8F6F0] p-4 text-[#1A1A18] sm:p-6 md:p-10'>
        <div className='mx-auto max-w-4xl'>
          <div className='rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm'>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600'>
              <AlertCircle size={25} />
            </div>

            <h2 className='mt-4 text-base font-bold text-[#1A1A18]'>
              Administrator profile not found
            </h2>

            <p className='mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#8C887B]'>
              We could not load your administrator account information. Try
              refreshing the profile.
            </p>

            <button
              type='button'
              onClick={() => loadAdminProfile(true)}
              disabled={isRefreshing}
              className='mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1A1A18] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50'
            >
              <RefreshCw
                size={15}
                className={isRefreshing ? 'animate-spin' : ''}
              />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#F8F6F0] p-4 text-[#1A1A18] sm:p-6 md:p-10'>
      <div className='mx-auto max-w-4xl space-y-6'>
        {/* Header */}
        <div className='rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-3'>
              <div className='rounded-2xl bg-amber-50 p-3 text-amber-600'>
                <Settings size={22} />
              </div>

              <div>
                <h1 className='font-serif text-xl font-bold text-[#1A1A18] sm:text-2xl'>
                  System Settings
                </h1>

                <p className='mt-0.5 text-xs italic text-[#6B6860]'>
                  Manage administrator credentials and platform configuration
                </p>
              </div>
            </div>

            <button
              type='button'
              onClick={() => loadAdminProfile(true)}
              disabled={isRefreshing || isSaving}
              className='inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-4 py-2.5 text-xs font-semibold text-[#4A4843] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto'
            >
              <RefreshCw
                size={15}
                className={isRefreshing ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Status */}
        {statusMessage && (
          <div
            className={`flex items-start gap-3 rounded-2xl border p-4 text-xs font-medium ${
              statusMessage.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={17} className='mt-0.5 shrink-0' />
            ) : (
              <AlertCircle size={17} className='mt-0.5 shrink-0' />
            )}

            <span className='leading-relaxed'>{statusMessage.text}</span>
          </div>
        )}

        {/* Account Form */}
        <form
          onSubmit={handleSubmit}
          className='space-y-6 rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'
        >
          {/* Account Header */}
          <div className='flex items-center gap-2 border-b border-[#E0DCD5] pb-4'>
            <Shield size={18} className='text-amber-600' />

            <div>
              <h2 className='font-serif text-base font-bold text-[#1A1A18]'>
                Admin Account
              </h2>

              <p className='mt-0.5 text-[11px] text-[#8C887B]'>
                Update your administrator account information.
              </p>
            </div>
          </div>

          {/* Name + Email */}
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
            {/* Name */}
            <div>
              <label
                htmlFor='admin-name'
                className='mb-1.5 block text-xs font-semibold text-[#6B6860]'
              >
                Full Name
              </label>

              <div className='relative'>
                <User
                  size={16}
                  className='absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C887B]'
                />

                <input
                  id='admin-name'
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSaving}
                  placeholder='Enter your full name'
                  className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] py-2.5 pl-10 pr-4 text-sm text-[#1A1A18] placeholder-[#8C887B] transition focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60'
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor='admin-email'
                className='mb-1.5 block text-xs font-semibold text-[#6B6860]'
              >
                Email Address
              </label>

              <div className='relative'>
                <Mail
                  size={16}
                  className='absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C887B]'
                />

                <input
                  id='admin-email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSaving}
                  placeholder='admin@example.com'
                  className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] py-2.5 pl-10 pr-4 text-sm text-[#1A1A18] placeholder-[#8C887B] transition focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60'
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className='space-y-4 border-t border-[#E0DCD5] pt-5'>
            <div className='flex items-center gap-2'>
              <Key size={18} className='text-amber-600' />

              <div>
                <h2 className='font-serif text-base font-bold text-[#1A1A18]'>
                  Change Password
                </h2>

                <p className='mt-0.5 text-[11px] text-[#8C887B]'>
                  Leave the field empty if you do not want to change your
                  password.
                </p>
              </div>
            </div>

            <div className='max-w-md'>
              <label
                htmlFor='new-password'
                className='mb-1.5 block text-xs font-semibold text-[#6B6860]'
              >
                New Password
              </label>

              <input
                id='new-password'
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder='••••••••'
                minLength={6}
                disabled={isSaving}
                autoComplete='new-password'
                className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#1A1A18] placeholder-[#8C887B] transition focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60'
              />

              <p className='mt-1.5 text-[11px] text-[#8C887B]'>
                Use at least 6 characters.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className='flex flex-col gap-3 border-t border-[#E0DCD5] pt-5 sm:flex-row sm:items-center sm:justify-between'>
            <p className='text-[11px] leading-relaxed text-[#8C887B]'>
              Changes to your email or password may affect your next login.
            </p>

            <button
              type='submit'
              disabled={isSaving}
              className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1A18] px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
            >
              {isSaving ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                <Save size={16} />
              )}

              {isSaving ? 'Saving Changes...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
