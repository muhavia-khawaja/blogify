import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BiSearch } from 'react-icons/bi'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { getBlogPageData } from '@/utils/actions'
import { Flame, BookOpen, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import {
  buildMetadata,
  getAbsoluteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
} from '@/utils/seo'
import JsonLd from '@/components/JsonLd'

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; search?: string }>
}): Promise<Metadata> {
  const params = await searchParams
  const title = params?.category
    ? `Category: ${params.category}`
    : params?.search
      ? `Search: ${params.search}`
      : 'Blog Archive'
  return buildMetadata({
    title,
    description: params?.search
      ? `Search results for ${params.search} in the Blogify archive.`
      : 'Browse the full Blogify archive of articles, essays, and stories.',
    path: '/blog',
    type: 'website',
  })
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: any
}) {
  const params = await searchParams
  const {
    blogs = [],
    categories = [],
    totalPages = 1,
    currentPage = 1,
  } = await getBlogPageData(params)
  const activeCategory = categories.find((cat) => cat.slug === params.category)

  const createPageUrl = (pageNumber: number) => {
    const p = new URLSearchParams()
    if (params.category) p.set('category', params.category)
    if (params.search) p.set('search', params.search)
    p.set('page', pageNumber.toString())
    return `/blog?${p.toString()}`
  }

  const readTime = (text: string) => Math.max(1, Math.ceil(text.length / 200))

  const blogIndexJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog Archive',
    url: getAbsoluteUrl('/blog'),
    description: SITE_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: getAbsoluteUrl('/'),
      logo: getAbsoluteUrl('/images/logo.png'),
    },
  }

  return (
    <>
      <JsonLd data={blogIndexJsonLd} />
      <section className='bg-[#F7F5F0] min-h-screen'>
        <div className='relative overflow-hidden bg-[#F7F5F0] border-b border-[#E8E4DC]'>
          <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-10 sm:pb-14'>
            <p className='text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-4 sm:mb-5'>
              The Archive
            </p>

            <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12'>
              <div className='max-w-xl'>
                <h1 className='text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-[#1A1A18] leading-[1.1] mb-3 sm:mb-4'>
                  {params.search ? (
                    <>
                      <em className='italic'>Results for</em>
                      <br /> {params.search}
                    </>
                  ) : (
                    <>
                      <em className='italic'>Thoughts,</em>
                      <br />
                      tutorials &amp; ideas
                    </>
                  )}
                </h1>
                <p className='text-[#6B6860] text-base sm:text-lg font-serif leading-relaxed'>
                  {params.category
                    ? `Exploring the nuances of ${activeCategory?.name ?? 'this topic'}.`
                    : 'A curated collection of essays, deep-dives, and digital explorations.'}
                </p>
              </div>

              <form
                action='/blog'
                method='GET'
                className='w-full lg:w-72 xl:w-80 shrink-0'
              >
                <div className='relative group'>
                  <BiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-[#9B9890] group-focus-within:text-emerald-600 transition-colors text-[18px]' />
                  <input
                    name='search'
                    defaultValue={params.search}
                    type='text'
                    placeholder='Search articles…'
                    className='w-full bg-white border border-[#E0DCD5] rounded-2xl py-3.5 sm:py-4 pl-11 pr-4 text-sm text-[#1A1A18] placeholder-[#B0ADA6] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all shadow-sm'
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className='sticky top-0 z-20 bg-[#F7F5F0]/90 backdrop-blur-sm border-b border-[#E8E4DC]'>
          <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center gap-2 overflow-x-auto no-scrollbar py-3 sm:py-4'>
              <Link
                href='/blog'
                className={`shrink-0 px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                  !params.category
                    ? 'bg-[#1A1A18] text-white shadow-md'
                    : 'bg-white border border-[#E0DCD5] text-[#8B8880] hover:border-[#1A1A18] hover:text-[#1A1A18]'
                }`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className={`shrink-0 px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                    params.category === cat.slug
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                      : 'bg-white border border-[#E0DCD5] text-[#8B8880] hover:border-emerald-400 hover:text-emerald-700'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14'>
          {!params.category && !params.search && blogs.length > 0 && (
            <Link
              href={`/blog/${blogs[0].slug}`}
              className='group block mb-14 sm:mb-20'
            >
              <div className='relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl aspect-[4/3] sm:aspect-[21/9]'>
                <Image
                  src={blogs[0].image || '/placeholder.jpg'}
                  alt={blogs[0].title}
                  fill
                  priority
                  className='object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-in-out'
                />

                <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent' />

                <div className='absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14'>
                  <div className='flex items-center gap-2 mb-3 sm:mb-4'>
                    <span className='inline-flex items-center gap-1.5 bg-emerald-500 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full'>
                      <Flame size={11} />
                      Today&apos;s Highlight
                    </span>
                  </div>

                  <h2 className='text-2xl sm:text-4xl lg:text-5xl font-serif text-white leading-tight mb-2 sm:mb-3 max-w-3xl'>
                    {blogs[0].title}
                  </h2>

                  <p className='text-white/70 text-sm sm:text-base font-serif italic max-w-xl line-clamp-2 mb-4 sm:mb-6 hidden sm:block'>
                    {blogs[0].short_desc}
                  </p>

                  <div className='flex items-center gap-3'>
                    <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden relative ring-2 ring-white/30 bg-white/20'>
                      {blogs[0].user?.image ? (
                        <Image
                          src={blogs[0].user.image}
                          alt={blogs[0].user.name}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-white/60'>
                          <BookOpen size={14} />
                        </div>
                      )}
                    </div>
                    <span className='text-white/80 text-xs font-bold uppercase tracking-wide'>
                      {blogs[0].user?.name || 'Unknown Author'}
                    </span>
                    <span className='text-white/40 text-xs'>·</span>
                    <span className='text-white/60 text-xs flex items-center gap-1'>
                      <Clock size={11} />
                      {readTime(blogs[0].short_desc)} min read
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {blogs.length === 0 ? (
            <div className='text-center py-24'>
              <p className='text-[#9B9890] text-lg font-serif italic'>
                No articles found.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-12 sm:gap-y-16'>
              {(params.category || params.search ? blogs : blogs.slice(1)).map(
                (blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className='group'
                  >
                    <article className='flex flex-col h-full'>
                      <div className='relative aspect-video overflow-hidden rounded-xl sm:rounded-2xl bg-[#EAE7E0] mb-4 sm:mb-5 shadow-sm group-hover:shadow-lg transition-shadow duration-500'>
                        <Image
                          src={blog.image || '/placeholder.jpg'}
                          alt={blog.title}
                          fill
                          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                          className='object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out'
                        />

                        <div className='absolute top-3 left-3'>
                          <span className='bg-white/90 backdrop-blur-sm text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-700 px-2.5 py-1 rounded-lg shadow-sm border border-white/60'>
                            {blog.category?.title}
                          </span>
                        </div>
                      </div>

                      <div className='flex flex-col flex-1 space-y-3'>
                        <div className='flex items-center gap-2.5'>
                          <span className='text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600'>
                            {blog.category?.title || 'Article'}
                          </span>
                          <span className='w-5 h-px bg-[#D5D2CB]' />
                          <span className='text-[10px] font-bold text-[#9B9890] uppercase tracking-widest flex items-center gap-1'>
                            <Clock size={10} />
                            {readTime(blog.short_desc)} min
                          </span>
                        </div>

                        <h2 className='text-xl sm:text-2xl font-serif font-semibold text-[#1A1A18] leading-snug group-hover:text-emerald-700 transition-colors duration-200 flex-1'>
                          {blog.title}
                        </h2>

                        <p className='text-[#6B6860] text-sm font-serif leading-relaxed line-clamp-2 hidden sm:block'>
                          {blog.short_desc}
                        </p>

                        <div className='flex items-center gap-2.5 pt-3 border-t border-[#E8E4DC]'>
                          <div className='w-7 h-7 rounded-full overflow-hidden relative bg-[#E8E4DC] shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500'>
                            {blog.user?.image ? (
                              <Image
                                src={blog.user.image}
                                alt={blog.user.name}
                                fill
                                className='object-cover'
                              />
                            ) : (
                              <div className='w-full h-full flex items-center justify-center text-[#9B9890]'>
                                <BookOpen size={13} />
                              </div>
                            )}
                          </div>
                          <span className='text-xs font-bold text-[#4A4845] uppercase tracking-tighter truncate'>
                            {blog.user?.name || 'Unknown Author'}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ),
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className='mt-20 sm:mt-28 flex justify-center items-center gap-1.5 sm:gap-2'>
              <Link
                href={createPageUrl(currentPage - 1)}
                aria-label='Previous page'
                className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-[#E0DCD5] text-[#6B6860] transition-all ${
                  currentPage <= 1
                    ? 'opacity-25 pointer-events-none'
                    : 'hover:bg-[#1A1A18] hover:text-white hover:border-[#1A1A18]'
                }`}
              >
                <FiChevronLeft className='text-[16px]' />
              </Link>

              {[...Array(totalPages)].map((_, i) => (
                <Link
                  key={i}
                  href={createPageUrl(i + 1)}
                  aria-label={`Page ${i + 1}`}
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-[11px] sm:text-xs font-black transition-all ${
                    currentPage === i + 1
                      ? 'bg-[#1A1A18] text-white shadow-md'
                      : 'text-[#8B8880] hover:text-[#1A1A18] hover:bg-white border border-transparent hover:border-[#E0DCD5]'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </Link>
              ))}

              <Link
                href={createPageUrl(currentPage + 1)}
                aria-label='Next page'
                className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-[#E0DCD5] text-[#6B6860] transition-all ${
                  currentPage >= totalPages
                    ? 'opacity-25 pointer-events-none'
                    : 'hover:bg-[#1A1A18] hover:text-white hover:border-[#1A1A18]'
                }`}
              >
                <FiChevronRight className='text-[16px]' />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
