import React from 'react'
import { getCategoryBySlug, updateCategory } from '@/utils/actions'
import { Type, AlignLeft, FileText, ArrowLeft, Save } from 'lucide-react'
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

  if (!category) notFound()

  return (
    <div className='min-h-screen bg-[#FCFBF9] antialiased text-[#1A1A1A]'>
      <div className='max-w-5xl mx-auto px-6 py-12'>
        <div className='flex items-center gap-4 mb-12'>
          <Link
            href='/control/categories'
            className='group w-10 h-10 rounded-xl border border-gray-100 bg-white flex items-center justify-center hover:border-gray-300 transition-all shadow-sm shrink-0'
          >
            <ArrowLeft
              size={15}
              className='text-gray-400 group-hover:-translate-x-0.5 transition-transform'
            />
          </Link>
          <div className='h-8 w-px bg-gray-100' />
          <div>
            <span className='text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600 block mb-1'>
              Editing Department
            </span>
            <h1 className='text-3xl font-serif font-bold text-[#1A1A1A] leading-tight'>
              {category.title}
            </h1>
          </div>
        </div>

        <form
          action={updateCategory}
          encType='multipart/form-data'
          className='grid grid-cols-1 lg:grid-cols-3 gap-8'
        >
          <input type='hidden' name='id' value={category.id} />

          <div className='lg:col-span-2 space-y-5'>
            <div className='bg-white rounded-[2rem] border border-gray-100 shadow-sm px-8 py-7'>
              <label className='flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4'>
                <Type size={11} /> Department Name
              </label>
              <input
                name='title'
                type='text'
                defaultValue={category.title}
                required
                className='w-full bg-transparent text-3xl font-serif font-bold text-[#1A1A1A] border-b-2 border-gray-100 focus:border-emerald-400 outline-none py-2 transition-colors placeholder:text-gray-200'
              />
            </div>

            <div className='bg-white rounded-[2rem] border border-gray-100 shadow-sm px-8 py-7'>
              <label className='flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4'>
                <AlignLeft size={11} /> Abstract
              </label>
              <textarea
                name='short_desc'
                rows={3}
                defaultValue={category.short_desc || ''}
                required
                className='w-full bg-[#FAFAF8] border border-gray-100 rounded-2xl px-5 py-4 font-serif italic text-[#1A1A1A] placeholder:text-gray-300 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all resize-none leading-relaxed'
              />
            </div>

            <div className='bg-white rounded-[2rem] border border-gray-100 shadow-sm px-8 py-7'>
              <label className='flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4'>
                <FileText size={11} /> Full Description
              </label>
              <textarea
                name='long_desc'
                rows={9}
                defaultValue={category.long_desc || ''}
                className='w-full bg-[#FAFAF8] border border-gray-100 rounded-2xl px-5 py-4 font-serif text-[1.05rem] leading-[1.9] text-[#1A1A1A] placeholder:text-gray-300 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all resize-none'
              />
            </div>
          </div>

          <div className='lg:col-span-1 space-y-5'>
            <div className='sticky top-8 space-y-5'>
              <div className='bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4'>
                <p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>
                  Cover Image
                </p>

                {category.image && (
                  <div className='relative aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50'>
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className='object-cover'
                    />
                  </div>
                )}

                <ImageUpload name='image' />

                {category.image && (
                  <p className='text-[9px] font-black uppercase tracking-widest text-gray-300 text-center'>
                    Upload to replace current image
                  </p>
                )}
              </div>

              <div className='space-y-3'>
                <button
                  type='submit'
                  className='group relative w-full flex items-center justify-center gap-3 bg-[#0F0F0F] text-white rounded-2xl py-5 text-[10px] font-black uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98]'
                >
                  <Save size={13} className='relative z-10' />
                  <span className='relative z-10'>Save Changes</span>
                  <div className='absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500' />
                </button>

                <Link
                  href='/control/categories'
                  className='block w-full text-center py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#1A1A1A] border border-gray-100 hover:border-gray-300 rounded-2xl transition-all'
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
