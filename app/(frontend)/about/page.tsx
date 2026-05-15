import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { FiBookOpen, FiUsers, FiTrendingUp, FiArrowRight } from 'react-icons/fi'

export const metadata: Metadata = {
  title: 'Our Mission | The Archive',
  description:
    'Dedicated to providing premium educational resources for Pakistani students, fostering a modern learning ecosystem.',
}

export default function AboutPage() {
  return (
    <section className='bg-[#FCFBF9] min-h-screen antialiased text-[#1A1A1A] pt-32 pb-20'>
      <div className='max-w-6xl mx-auto px-6 lg:px-8'>
        <div className='grid gap-20 lg:grid-cols-2 lg:items-start'>
          <div>
            <div className='flex items-center gap-3 mb-6'>
              <span className='h-px w-8 bg-emerald-500'></span>
              <span className='text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600'>
                Our Manifesto
              </span>
            </div>

            <h1 className='text-5xl md:text-6xl font-serif font-bold leading-[1.1] tracking-tight mb-8'>
              Elevating the standard of{' '}
              <span className='italic font-medium'>digital learning.</span>
            </h1>

            <p className='text-xl font-serif italic text-gray-500 leading-relaxed mb-12'>
              Education with Hamza is more than a repository; it is a curated
              ecosystem designed for the next generation of Pakistani scholars,
              developers, and thinkers.
            </p>

            <div className='space-y-10'>
              <div className='flex items-start gap-6 group'>
                <div className='w-12 h-12 shrink-0 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500'>
                  <FiBookOpen size={20} />
                </div>
                <div>
                  <h3 className='text-sm font-black uppercase tracking-widest mb-2'>
                    Curated Exhibits
                  </h3>
                  <p className='text-sm text-gray-500 leading-relaxed font-serif'>
                    Every lesson is meticulously crafted to move beyond static
                    text, offering interactive insights that bridge the gap
                    between theory and practice.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-6 group'>
                <div className='w-12 h-12 shrink-0 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500'>
                  <FiUsers size={20} />
                </div>
                <div>
                  <h3 className='text-sm font-black uppercase tracking-widest mb-2'>
                    Student-Centric Logic
                  </h3>
                  <p className='text-sm text-gray-500 leading-relaxed font-serif'>
                    Our architecture is shaped by real student feedback,
                    ensuring that every tool—from AI planners to math
                    solvers—solves a genuine need.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-6 group'>
                <div className='w-12 h-12 shrink-0 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500'>
                  <FiTrendingUp size={20} />
                </div>
                <div>
                  <h3 className='text-sm font-black uppercase tracking-widest mb-2'>
                    Infinite Iteration
                  </h3>
                  <p className='text-sm text-gray-500 leading-relaxed font-serif'>
                    The Archive is a living entity. We update existing resources
                    and deploy new pedagogical tools every week to keep you at
                    the forefront.
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-16 flex flex-col sm:flex-row gap-6'>
              <Link
                href='/blog'
                className='inline-flex items-center justify-center gap-3 rounded-full bg-black px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-600 transition-all duration-500 shadow-xl'
              >
                Enter the Archive <FiArrowRight />
              </Link>
              <Link
                href='/register'
                className='inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-10 py-4 text-[10px] font-black uppercase tracking-widest text-black hover:border-black transition-all'
              >
                Join the Community
              </Link>
            </div>
          </div>

          <div className='sticky top-32'>
            <div className='relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl group'>
              <div className='absolute inset-0 bg-[#1A1A1A]'>
                <div className='absolute inset-0 opacity-40 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]'></div>
              </div>

              <div className='absolute inset-0 flex items-center justify-center p-12'>
                <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 text-center transform group-hover:scale-105 transition-transform duration-700'>
                  <div className='w-16 h-1 w-16 bg-emerald-500 mx-auto mb-8 rounded-full'></div>
                  <h2 className='text-3xl font-serif font-bold text-white mb-6 leading-tight'>
                    Transforming curiosity into{' '}
                    <span className='italic'>competence.</span>
                  </h2>
                  <p className='text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-8'>
                    Established MMXXIV
                  </p>
                  <div className='pt-8 border-t border-white/10'>
                    <p className='text-sm text-white/70 italic font-serif leading-relaxed'>
                      The archive flourishes when the archivist is complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
