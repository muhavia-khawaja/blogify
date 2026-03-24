'use client'

import React, { useState } from 'react'
import { Send, X, MessageCircle } from 'lucide-react'
import { sendEmailReply } from '@/utils/actions'

export default function ReplyModal({
  targetEmail,
  targetName,
}: {
  targetEmail: string
  targetName: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await sendEmailReply(formData)
    setLoading(false)
    setIsOpen(false)
    alert('Reply sent successfully!')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='p-3 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-xl transition-colors flex items-center gap-2 font-bold text-sm'
      >
        <MessageCircle size={20} />
        <span className='md:hidden lg:inline'>Reply</span>
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4'>
          <div className='bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200'>
            <div className='p-8'>
              <div className='flex justify-between items-center mb-6'>
                <h3 className='text-xl font-black text-gray-900'>
                  Reply to {targetName.split(' ')[0]}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className='p-2 hover:bg-gray-100 rounded-full'
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <input type='hidden' name='email' value={targetEmail} />

                <div>
                  <label className='text-xs font-bold uppercase text-gray-400 tracking-widest mb-2 block'>
                    To
                  </label>
                  <div className='px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100'>
                    {targetEmail}
                  </div>
                </div>

                <div>
                  <label className='text-xs font-bold uppercase text-gray-400 tracking-widest mb-2 block'>
                    Message
                  </label>
                  <textarea
                    name='message'
                    required
                    rows={5}
                    placeholder='Type your response here...'
                    className='w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-amber-500 outline-none text-sm'
                  ></textarea>
                </div>

                <button
                  disabled={loading}
                  type='submit'
                  className='w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors disabled:opacity-50'
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={18} /> Send Email
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
