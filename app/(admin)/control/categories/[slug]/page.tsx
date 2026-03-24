import React from 'react'
import { getCategoryBySlug, updateCategory } from '@/utils/actions'
import {
  Type,
  AlignLeft,
  FileText,
  Send,
  Layers,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import { notFound } from 'next/navigation'
import Image from 'next/image'

interface UpdateProps {
  params: { slug: string }
}

export default async function UpdateCategoryPage({ params }: UpdateProps) {
  const { slug } = params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  return (
    <div className='max-w-5xl mx-auto py-8 px-4'>
      <div className='flex items-center gap-4 mb-8'>
        <Link
          href='/control/categories'
          className='p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600'
        >
          <ArrowLeft size={20} />
        </Link>
        <div className='p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200'>
          <Layers size={28} />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Update Category</h1>
          <p className='text-gray-500 text-sm italic'>
            Editing: {category.title}
          </p>
        </div>
      </div>

      <form
        action={updateCategory}
        encType='multipart/form-data'
        className='grid grid-cols-1 lg:grid-cols-3 gap-8'
      >
        <input type='hidden' name='id' value={category.id} />

        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8'>
            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <Type size={16} className='text-blue-500' /> Category Name
              </label>
              <input
                name='title'
                type='text'
                defaultValue={category.title}
                required
                className='w-full px-0 py-2 text-2xl font-bold border-b-2 border-gray-100 focus:border-blue-500 outline-none transition-colors'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <AlignLeft size={16} className='text-blue-500' /> Short
                Description
              </label>
              <textarea
                name='short_desc'
                rows={3}
                defaultValue={category.short_desc || ''}
                required
                className='w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <FileText size={16} className='text-blue-500' /> Full
                Description
              </label>
              <textarea
                name='long_desc'
                rows={8}
                defaultValue={category.long_desc || ''}
                className='w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg leading-relaxed'
              />
            </div>
          </div>
        </div>

        <div className='lg:col-span-1 space-y-6'>
          <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 sticky top-8'>
            <ImageUpload name='image' />

            <div className='border border-dotted'>
              {category.image && (
                <Image
                  src={category.image}
                  alt={category.title}
                  width={300}
                  height={300}
                />
              )}
            </div>

            <hr className='border-gray-50' />

            <div className='pt-2 space-y-3'>
              <button
                type='submit'
                className='w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98]'
              >
                <Send size={18} />
                Update Category
              </button>
              <Link
                href='/control/categories'
                className='w-full inline-block text-center py-2 text-sm font-medium text-gray-500'
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
