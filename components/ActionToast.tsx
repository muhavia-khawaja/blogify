'use client'

import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'

export default function ActionToast({
  initialMessage,
}: {
  initialMessage?: string
}) {
  const [message, setMessage] = useState(initialMessage || '')

  useEffect(() => {
    const handleToast = (event: Event) =>
      setMessage((event as CustomEvent<string>).detail)
    window.addEventListener('app:toast', handleToast)
    return () => window.removeEventListener('app:toast', handleToast)
  }, [])

  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => setMessage(''), 3200)
    return () => window.clearTimeout(timer)
  }, [message])

  if (!message) return null

  return (
    <div className='fixed bottom-5 right-5 z-[100] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-2xl shadow-gray-900/15 animate-in slide-in-from-right-4 fade-in'>
      <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600'>
        <Check className='h-4 w-4' />
      </span>
      <span>{message}</span>
      <button
        type='button'
        onClick={() => setMessage('')}
        aria-label='Dismiss notification'
        className='ml-1 text-gray-400 transition hover:text-gray-800'
      >
        <X className='h-4 w-4' />
      </button>
    </div>
  )
}
