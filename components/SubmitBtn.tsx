'use client'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useFormStatus } from 'react-dom'

export default function SubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <div>
      <button
        type='submit'
        disabled={pending}
        className={`className='w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 active:scale-95 mt-2' ${
          pending ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        {pending ? 'Submitting...' : 'Submit'}
        <ArrowRight
          size={16}
          className='group-hover:translate-x-0.5 transition-transform'
        />
      </button>
    </div>
  )
}
