import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BiSearch } from 'react-icons/bi'
import { FiArrowUpRight } from 'react-icons/fi'
import { getBlogData } from '@/utils/actions'
import { User } from 'lucide-react'

export const revalidate = 0

export default async function BlogSection() {
  const { heroPost, featuredPosts = [], latestPosts = [] } = await getBlogData()

  if (!heroPost && !latestPosts.length) return null

  return (
    <section className='bg-white py-20'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        <div className='flex flex-col items-center text-center mb-20'>
          <h1 className='text-4xl md:text-5xl font-bold text-[#111827] mb-6 tracking-tight'>
            Inside Design: Stories and interviews
          </h1>
          <p className='text-gray-500 mb-10 max-w-2xl font-medium'>
            Subscribe to learn about new product features, the latest in
            technology, and updates.
          </p>

          <form
            action='/blog'
            method='GET'
            className='w-full max-w-lg relative group'
          >
            <div className='relative flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 ring-blue-100 transition-all'>
              <BiSearch className='ml-4 text-gray-400 text-xl' />
              <input
                name='q'
                type='text'
                placeholder='Search the archive...'
                className='w-full pl-3 pr-4 py-3 text-sm outline-none'
              />
              <button
                type='submit'
                className='mr-1.5 bg-[#111827] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#2563EB] transition-colors'
              >
                Search
              </button>
            </div>
          </form>
        </div>

        <div className='mb-10'>
          <h2 className='text-xl font-bold text-[#111827]'>
            Recent blog posts
          </h2>
        </div>

        {/* HERO & FEATURED SIDEBAR */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20'>
          {/* LEFT: MAIN HERO POST */}
          <div className='lg:col-span-7'>
            {heroPost ? (
              <Link href={`/blog/${heroPost.slug}`} className='group block'>
                <article>
                  <div className='relative overflow-hidden rounded-2xl mb-6 aspect-[16/10] bg-gray-100'>
                    <Image
                      src={heroPost.image || '/placeholder.jpg'}
                      alt={heroPost.title}
                      fill
                      sizes='(max-width: 1024px) 100vw, 60vw'
                      priority
                      className='object-cover group-hover:scale-105 transition-transform duration-700 ease-out'
                    />
                  </div>
                  <div className='space-y-3'>
                    <p className='text-sm font-semibold text-[#2563EB]'>
                      {heroPost.author?.name || 'Editorial Team'} •{' '}
                      {new Date(heroPost.createdAt).toLocaleDateString('en-GB')}
                    </p>
                    <div className='flex justify-between items-start gap-4'>
                      <h3 className='text-3xl font-bold text-[#111827] leading-tight group-hover:text-[#2563EB] transition-colors'>
                        {heroPost.title}
                      </h3>
                      <FiArrowUpRight className='text-2xl text-gray-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform' />
                    </div>
                    <p className='text-gray-500 leading-relaxed text-base line-clamp-2'>
                      {heroPost.short_desc}
                    </p>
                    <div className='flex gap-2 pt-2'>
                      {heroPost.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className='px-3 py-1 bg-gray-50 text-gray-600 text-[11px] font-semibold rounded-full border border-gray-100'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            ) : (
              <div className='h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl text-gray-400'>
                No hero post selected.
              </div>
            )}
          </div>

          {/* RIGHT: FEATURED POSTS LIST */}
          <div className='lg:col-span-5 flex flex-col gap-8'>
            {featuredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className='group'>
                <article className='grid grid-cols-1 sm:grid-cols-12 gap-6 items-center'>
                  <div className='sm:col-span-5 relative overflow-hidden rounded-xl aspect-square bg-gray-100'>
                    <Image
                      src={post.image || '/placeholder.jpg'}
                      alt={post.title}
                      fill
                      sizes='(max-width: 1024px) 40vw, 20vw'
                      className='object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                  </div>
                  <div className='sm:col-span-7 space-y-2'>
                    <p className='text-xs font-semibold text-[#2563EB]'>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <h4 className='text-md font-bold text-[#111827] leading-snug group-hover:text-[#2563EB] transition-colors line-clamp-2'>
                      {post.title}
                    </h4>
                    <p className='text-xs text-gray-500 line-clamp-2 leading-relaxed'>
                      {post.short_desc}
                    </p>
                    <span className='inline-block px-2 py-0.5 bg-blue-50 text-[#2563EB] text-[10px] font-bold rounded-md'>
                      {post.category?.title || 'General'}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* BOTTOM: LATEST POSTS GRID */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 pt-16 border-t border-gray-100'>
          {latestPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className='group'>
              <article className='space-y-5'>
                <div className='relative aspect-video overflow-hidden rounded-2xl bg-gray-100'>
                  <Image
                    src={post.image || '/placeholder.jpg'}
                    alt={post.title}
                    fill
                    sizes='(max-width: 768px) 100vw, 33vw'
                    className='object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                </div>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs font-bold text-[#2563EB] uppercase tracking-wider'>
                      {post.category?.title || 'Article'}
                    </span>
                    <span className='text-gray-300'>•</span>
                    <span className='text-xs font-medium text-gray-400'>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className='text-xl font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors leading-tight'>
                    {post.title}
                  </h4>
                  <p className='text-sm text-gray-500 line-clamp-3 leading-relaxed'>
                    {post.short_desc}
                  </p>
                  <div className='flex items-center gap-2 pt-2'>
                    <div className='w-6 h-6 rounded-full overflow-hidden relative bg-gray-100'>
                      {post?.author?.image ? (
                        <Image
                          src={post.author?.image}
                          alt={post.author?.name}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <User className='h-4 w-4 text-white' />
                      )}
                    </div>
                    <span className='text-xs font-semibold text-gray-700'>
                      {post.author?.name}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
