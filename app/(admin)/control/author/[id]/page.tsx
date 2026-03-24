import React from 'react'
import { getAuthor, updateAuthor } from '@/utils/actions'
import { Type, AlignLeft, User, Send, ArrowLeft, Camera } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import { notFound } from 'next/navigation'
import Image from 'next/image'

interface UpdateProps {
  params: { id: string }
}

export default async function UpdateAuthorPage({ params }: UpdateProps) {
  const { id } = params
  const author = await getAuthor(id)

  if (!author) {
    notFound()
  }

  return (
    <div className='max-w-5xl mx-auto py-8 px-4'>
      <div className='flex items-center gap-4 mb-8'>
        <Link
          href='/control/authors'
          className='p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600'
        >
          <ArrowLeft size={20} />
        </Link>
        <div className='p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100'>
          <User size={28} />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Edit Author</h1>
          <p className='text-gray-500 text-sm'>
            Updating profile for{' '}
            <span className='font-semibold text-indigo-600'>{author.name}</span>
          </p>
        </div>
      </div>

      <form
        action={updateAuthor}
        encType='multipart/form-data'
        className='grid grid-cols-1 lg:grid-cols-3 gap-8'
      >
        <input type='hidden' name='id' value={author.id} />

        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8'>
            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <Type size={16} className='text-indigo-500' /> Author Name
              </label>
              <input
                name='name'
                type='text'
                defaultValue={author.name}
                required
                className='w-full px-0 py-2 text-2xl font-bold border-b-2 border-gray-100 focus:border-indigo-600 outline-none transition-colors'
                placeholder='Full Name'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <AlignLeft size={16} className='text-indigo-500' /> Biography
              </label>
              <textarea
                name='bio'
                rows={8}
                defaultValue={author.bio || ''}
                className='w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg leading-relaxed'
                placeholder='Tell the readers about this author...'
              />
            </div>
          </div>
        </div>

        <div className='lg:col-span-1 space-y-6'>
          <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 sticky top-8'>
            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-4'>
                <Camera size={16} className='text-indigo-500' /> Profile Photo
              </label>
              <ImageUpload name='image' />
            </div>

            <div className='flex flex-col items-center py-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200'>
              <p className='text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest'>
                Current Avatar
              </p>
              <div className='relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-md'>
                {author.image ? (
                  <Image
                    src={author.image}
                    alt={author.name}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-gray-200 text-gray-400'>
                    <User size={40} />
                  </div>
                )}
              </div>
            </div>

            <hr className='border-gray-50' />

            <div className='pt-2 space-y-3'>
              <button
                type='submit'
                className='w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]'
              >
                <Send size={18} />
                Save Profile
              </button>
              <Link
                href='/control/authors'
                className='w-full inline-block text-center py-2 text-sm font-medium text-gray-500 hover:text-gray-800'
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
