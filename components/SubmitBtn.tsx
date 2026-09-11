'use client'
import { ArrowRight, Loader2 } from 'lucide-react'
import React from 'react'
import { useFormStatus } from 'react-dom'

export default function SubmitBtn() {
  const { pending } = useFormStatus()

  return (
    <div>
      <button
        type='submit'
        disabled={pending}
        className={`btn w-full border-none text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.98] transition-all duration-200 mt-2 ${
          pending ? 'btn-disabled opacity-60' : ''
        }`}
      >
        {pending ? (
          <>
            <Loader2 size={16} className='animate-spin' />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <span>Submit</span>
            <ArrowRight
              size={16}
              className='transition-transform group-hover:translate-x-0.5'
            />
          </>
        )}
      </button>
    </div>
  )
}
