
import React from 'react'
import { Type, AlignLeft, FileText, ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import { createCategory } from '@/utils/actions'

export default function NewCategoryPage() {
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
              Control Panel
            </span>
            <h1 className='text-3xl font-serif font-bold text-[#1A1A1A]'>
              New{' '}
              <span className='italic font-normal text-gray-400'>
                Department.
              </span>
            </h1>
          </div>
        </div>

        
        <form
          action={createCategory}
          encType='multipart/form-data'
          className='grid grid-cols-1 lg:grid-cols-3 gap-8'
        >
          
          <div className='lg:col-span-2 space-y-5'>
            
            <div className='bg-white rounded-[2rem] border border-gray-100 shadow-sm px-8 py-7'>
              <label className='flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4'>
                <Type size={11} /> Department Name
              </label>
              <input
                name='title'
                type='text'
                placeholder='e.g. Technology, Health, Culture...'
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
                required
                placeholder='A brief poetic summary shown on category cards...'
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
                placeholder='Describe the kinds of articles that belong in this department...'
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
                <ImageUpload name='image' />
              </div>

              
              <div className='bg-[#0F0F0F] rounded-[2rem] px-6 py-7 space-y-3 relative overflow-hidden'>
                <div className='absolute bottom-0 right-0 text-[8rem] font-serif font-bold leading-none text-white/[0.03] select-none pointer-events-none'>
                  ?
                </div>
                <p className='text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 relative z-10'>
                  Why Departments?
                </p>
                <p className='text-sm font-serif italic text-white/50 leading-relaxed relative z-10'>
                  Departments help readers navigate the archive. A cover image
                  makes category pages more visual and recognisable.
                </p>
              </div>

              
              <div className='space-y-3'>
                <button
                  type='submit'
                  className='group relative w-full flex items-center justify-center gap-3 bg-[#0F0F0F] text-white rounded-2xl py-5 text-[10px] font-black uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98]'
                >
                  <Send size={13} className='relative z-10' />
                  <span className='relative z-10'>Create Department</span>
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
