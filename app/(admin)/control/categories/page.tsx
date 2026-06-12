import React from 'react'
import {
  Plus,
  FolderTree,
  Pencil,
  Trash2,
  Layers,
  Calendar,
  Hash,
  ArrowRight,
} from 'lucide-react'
import { deleteCategory, getAllCategories } from '@/utils/actions'
import Link from 'next/link'
import Image from 'next/image'

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div className='min-h-screen bg-[#FCFBF9] antialiased text-[#1A1A1A]'>
      <div className='max-w-7xl mx-auto px-6 py-12 space-y-12'>
        <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-6'>
          <div>
            <span className='text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600 block mb-3'>
              Control Panel
            </span>
            <h1 className='text-4xl md:text-5xl font-serif font-bold leading-tight text-[#1A1A1A]'>
              Content{' '}
              <span className='italic font-normal text-gray-400'>
                Departments.
              </span>
            </h1>
            <p className='text-gray-400 font-serif italic mt-2'>
              {categories.length} department{categories.length !== 1 ? 's' : ''}{' '}
              in the archive
            </p>
          </div>

          <Link
            href='/control/categories/new'
            className='group relative inline-flex items-center gap-3 bg-[#0F0F0F] text-white rounded-2xl px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shrink-0'
          >
            <Plus size={14} strokeWidth={3} className='relative z-10' />
            <span className='relative z-10'>New Department</span>
            <div className='absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500' />
          </Link>
        </div>

        {/* ── Empty state ── */}
        {categories.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-32 px-8 rounded-[3rem] border-2 border-dashed border-gray-100 bg-white/50 text-center'>
            <div className='w-20 h-20 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6'>
              <FolderTree size={32} className='text-gray-300' />
            </div>
            <span className='text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600 block mb-3'>
              Archive Empty
            </span>
            <h3 className='text-2xl font-serif font-bold text-[#1A1A1A] mb-2'>
              No departments yet
            </h3>
            <p className='text-gray-400 font-serif italic max-w-xs mb-8 leading-relaxed'>
              Create your first department to begin organising the archive.
            </p>
            <Link
              href='/control/categories/new'
              className='group relative inline-flex items-center gap-3 bg-[#0F0F0F] text-white rounded-2xl px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] overflow-hidden transition-all'
            >
              <Plus size={13} strokeWidth={3} className='relative z-10' />
              <span className='relative z-10'>Create First Department</span>
              <div className='absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500' />
            </Link>
          </div>
        ) : (
          <>
            {/* ── Stats row ── */}
            <div className='grid grid-cols-3 gap-4'>
              {[
                { label: 'Total Departments', value: categories.length },
                { label: 'Active', value: categories.length },
                {
                  label: 'Last Added',
                  value: new Date(
                    categories[categories.length - 1]?.createdAt,
                  ).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                  }),
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className='bg-white rounded-2xl border border-gray-100 px-6 py-5 shadow-sm'
                >
                  <p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1'>
                    {s.label}
                  </p>
                  <p className='text-2xl font-serif font-bold text-[#1A1A1A]'>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Grid ── */}
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
              {categories.map((cat, i) => (
                <div
                  key={cat.id}
                  className='group bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300'
                >
                  {/* Image */}
                  <div className='relative h-44 bg-gray-50 overflow-hidden'>
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-[1.5s]'
                      />
                    ) : (
                      <div className='absolute inset-0 flex items-center justify-center'>
                        {/* Decorative index number */}
                        <span className='text-[6rem] font-serif font-bold text-gray-100 select-none leading-none'>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

                    {/* Action buttons — appear on hover */}
                    <div className='absolute top-3 right-3 flex gap-2 translate-y-[-8px] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300'>
                      <Link
                        href={`/control/categories/${cat.slug}`}
                        className='w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-50 hover:text-emerald-600 text-gray-500 transition-colors'
                      >
                        <Pencil size={14} />
                      </Link>
                      <form action={deleteCategory}>
                        <input type='hidden' name='id' value={cat.id} />
                        <button
                          type='submit'
                          className='w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 text-gray-500 transition-colors'
                        >
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </div>

                    {/* Active badge */}
                    <div className='absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <span className='text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white px-2.5 py-1 rounded-full'>
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className='p-6 space-y-4'>
                    <div>
                      <h2 className='text-xl font-serif font-bold text-[#1A1A1A] leading-snug mb-1.5'>
                        {cat.title}
                      </h2>
                      <p className='text-sm font-serif italic text-gray-400 line-clamp-2 leading-relaxed min-h-[40px]'>
                        {cat.short_desc ||
                          'No description provided for this department.'}
                      </p>
                    </div>

                    <div className='pt-4 border-t border-gray-50 flex items-center justify-between'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-300'>
                          <Hash size={10} />
                          {cat.id.slice(-6)}
                        </div>
                        <div className='flex items-center gap-1.5 text-[10px] font-bold text-gray-400'>
                          <Calendar size={10} />
                          {new Date(cat.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </div>

                      <Link
                        href={`/control/categories/${cat.slug}`}
                        className='group/btn flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-emerald-600 transition-colors'
                      >
                        Edit
                        <ArrowRight
                          size={11}
                          className='group-hover/btn:translate-x-0.5 transition-transform'
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
