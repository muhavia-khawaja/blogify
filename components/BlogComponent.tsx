'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BiSearch } from 'react-icons/bi'
import { FiArrowUpRight } from 'react-icons/fi'
import { User, Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BlogSection({ data }: any) {
  const { heroPost, featuredPosts = [], latestPosts = [] } = data

  if (!heroPost && !latestPosts.length) return null

  return (
    <section className='bg-[#FCFBF9] py-24'>
      {' '}
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        <div className='flex flex-col items-center text-center mb-24'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className='text-5xl md:text-7xl font-serif font-medium text-[#1a1a1a] mb-8 tracking-tight italic'
          >
            Insights &{' '}
            <span className='font-sans font-bold not-italic'>Stories.</span>
          </motion.h1>
          <p className='text-gray-500 mb-12 max-w-xl text-lg leading-relaxed'>
            Exploring the intersection of design, technology, and the future of
            digital ecosystems.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32'>
          <div className='lg:col-span-8'>
            <Link href={`/blog/${heroPost.slug}`} className='group block'>
              <article className='relative'>
                <div className='relative overflow-hidden rounded-[2rem] mb-8 aspect-[16/9] bg-gray-100 shadow-2xl shadow-black/5'>
                  <Image
                    src={heroPost.image || '/placeholder.jpg'}
                    alt={heroPost.title}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-1000 ease-out'
                  />
                  <div className='absolute top-6 left-6'>
                    <span className='bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-black shadow-sm'>
                      Featured Story
                    </span>
                  </div>
                </div>

                <div className='space-y-4 max-w-3xl'>
                  <div className='flex items-center gap-3 text-sm text-gray-400'>
                    <span className='font-bold text-black uppercase tracking-tighter'>
                      01.
                    </span>
                    <span>
                      {new Date(heroPost.createdAt).toLocaleDateString(
                        'en-US',
                        { month: 'long', day: 'numeric', year: 'numeric' },
                      )}
                    </span>
                  </div>
                  <h3 className='text-4xl md:text-5xl font-serif font-semibold text-[#111827] leading-[1.1] group-hover:underline decoration-1 underline-offset-8'>
                    {heroPost.title}
                  </h3>
                  <p className='text-gray-500 text-lg leading-relaxed line-clamp-2'>
                    {heroPost.short_desc}
                  </p>
                </div>
              </article>
            </Link>
          </div>

          <div className='lg:col-span-4 space-y-12'>
            <h2 className='text-xs font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-200 pb-4'>
              Curated Picks
            </h2>
            {featuredPosts.map((post: any, idx: any) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className='group block'
              >
                <article className='flex gap-6 items-start'>
                  <span className='text-gray-300 font-serif italic text-2xl'>
                    0{idx + 2}
                  </span>
                  <div className='space-y-2'>
                    <h4 className='text-lg font-bold leading-snug group-hover:text-emerald-600 transition-colors'>
                      {post.title}
                    </h4>
                    <p className='text-xs text-gray-400 uppercase font-bold tracking-widest'>
                      {post.category?.title} • 4 min read
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        <div className='border-t border-gray-200 pt-20'>
          <div className='flex justify-between items-end mb-16'>
            <h2 className='text-3xl font-serif font-bold italic'>
              The Latest Feed
            </h2>
            <Link
              href='/ablogrchive'
              className='text-sm font-bold flex items-center gap-1 border-b-2 border-black pb-1'
            >
              View All Archive <FiArrowUpRight />
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20'>
            {latestPosts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className='group'>
                <article className='flex flex-col h-full'>
                  <div className='relative aspect-video (16/9) overflow-hidden rounded-2xl bg-gray-100 mb-5 shadow-sm group-hover:shadow-2xl group-hover:shadow-emerald-100/50 transition-all duration-500 border border-gray-100'>
                    <Image
                      src={post.image || '/placeholder.jpg'}
                      alt={post.title}
                      fill
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      className='object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out'
                    />

                    <div className='absolute top-3 left-3'>
                      <span className='backdrop-blur-md bg-white/80 text-[10px] font-black uppercase tracking-widest text-emerald-700 px-3 py-1.5 rounded-lg border border-white/50 shadow-sm'>
                        {post.category?.title}
                      </span>
                    </div>
                  </div>

                  <div className='flex flex-col flex-1 px-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='text-[10px] text-gray-400 font-bold uppercase tracking-tighter flex items-center gap-1'>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h4 className='text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors leading-snug line-clamp-2 mb-2'>
                      {post.title}
                    </h4>

                    <p className='text-xs text-gray-500 line-clamp-2 leading-relaxed opacity-80'>
                      {post.short_desc}
                    </p>

                    <div className='mt-4 flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0'>
                      View Story <span>→</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
