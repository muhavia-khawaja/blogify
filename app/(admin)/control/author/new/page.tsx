import React from 'react'
import { User, Type, FileText, Send, ArrowLeft, Camera } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import { createAuthor } from '@/utils/actions'

export default async function page() {
  return (
    <div className='max-w-5xl mx-auto py-8 px-4'>
      {/* HEADER */}
      <div className='flex items-center gap-4 mb-8'>
        <Link
          href='/control/authors'
          className='p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 lg:hidden'
        >
          <ArrowLeft size={20} />
        </Link>
        <div className='p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200'>
          <User size={28} />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Add New Author</h1>
          <p className='text-gray-500 text-sm'>
            Register a new writer to assign to your blog posts.
          </p>
        </div>
      </div>

      <form
        action={createAuthor}
        className='grid grid-cols-1 lg:grid-cols-3 gap-8'
      >
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8'>
            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <Type size={16} className='text-indigo-500' /> Author Full Name
              </label>
              <input
                name='name'
                type='text'
                placeholder='e.g. Olivia Rhye'
                required
                className='w-full px-0 py-2 text-2xl font-bold border-b-2 border-gray-100 focus:border-indigo-500 outline-none transition-colors placeholder:text-gray-300'
              />
            </div>

            {/* Author Bio */}
            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <FileText size={16} className='text-indigo-500' /> Author
                Biography
              </label>
              <textarea
                name='bio'
                rows={6}
                placeholder='Tell the readers about this author and their expertise...'
                className='w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg leading-relaxed'
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: IMAGE & ACTIONS */}
        <div className='lg:col-span-1 space-y-6'>
          <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 sticky top-8'>
            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-4'>
                <Camera size={16} className='text-indigo-500' /> Profile Picture
              </label>
              <ImageUpload name='image' />
            </div>

            <hr className='border-gray-50' />

            <div className='pt-2 space-y-3'>
              <button
                type='submit'
                className='w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]'
              >
                <Send size={18} />
                Save Author
              </button>

              <Link
                href='/control/authors'
                className='w-full inline-block text-center py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors'
              >
                Cancel
              </Link>
            </div>
          </div>

          <div className='bg-indigo-50 p-5 rounded-2xl border border-indigo-100'>
            <h4 className='text-sm font-bold text-indigo-900 mb-2'>
              Author Profiles
            </h4>
            <p className='text-xs text-indigo-700 leading-relaxed'>
              Adding a bio and a clear profile photo builds trust with your
              audience and improves SEO by establishing E-A-T (Expertise,
              Authoritativeness, and Trust).
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
