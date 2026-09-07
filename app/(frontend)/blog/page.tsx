import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BiSearch } from 'react-icons/bi'
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowUpRight,
  FiFolder,
} from 'react-icons/fi'
import { getBlogPageData } from '@/utils/actions'
import { Flame, BookOpen, Clock, Tag } from 'lucide-react'
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

interface Category {
  id: string
  title: string
  slug: string
  name?: string
}

interface BlogUser {
  name: string
  image?: string | null
}

interface Blog {
  id: string
  slug: string
  title: string
  short_desc: string
  image?: string | null
  user?: BlogUser | null
  category?: Category | null
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>
}) {
  const params = await searchParams
  const rawData = await getBlogPageData(params)

  const {
    blogs = [],
    categories = [],
    totalPages = 1,
    currentPage = 1,
  } = rawData as unknown as {
    blogs: Blog[]
    categories: Category[]
    totalPages: number
    currentPage: number
  }

  const activeCategory = categories.find((cat) => cat.slug === params.category)
  const categoryDisplayName =
    activeCategory?.title || activeCategory?.name || params.category

  const createPageUrl = (pageNumber: number) => {
    const p = new URLSearchParams()
    if (params.category) p.set('category', params.category)
    if (params.search) p.set('search', params.search)
    p.set('page', pageNumber.toString())
    return `/blog?${p.toString()}`
  }

  const readTime = (text: string) =>
    Math.max(1, Math.ceil((text || '').length / 200))

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

  const isFiltered = Boolean(params.category || params.search)
  const featuredBlog = !isFiltered && blogs.length > 0 ? blogs[0] : null
  const gridBlogs = isFiltered ? blogs : blogs.slice(1)

  return (
    <>
      <JsonLd data={blogIndexJsonLd} />

      <section className='bg-[#FAF9F5] min-h-screen text-[#1C1B18] antialiased selection:bg-emerald-200 selection:text-emerald-950 relative w-full overflow-hidden py-10'>
        <div className='absolute inset-0 bg-[radial-gradient(#e5e0d8_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none' />

        <div className='relative overflow-hidden border-b border-[#E8E3DA] bg-gradient-to-b from-[#FAF9F5] via-[#FAF9F5]/80 to-white/60'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-8 sm:pb-12 relative z-10'>
            <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12 w-full'>
              <div className='max-w-2xl flex-1'>
                <p className='text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 mb-3'>
                  Editorial Archive
                </p>
                <h1 className='text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-[#161513] leading-[1.05] tracking-tight mb-4'>
                  {params.search ? (
                    <>
                      <span className='italic font-extralight text-[#736E65] block text-2xl sm:text-3xl mb-1'>
                        Search results for
                      </span>
                      “{params.search}”
                    </>
                  ) : params.category ? (
                    <>
                      <span className='italic font-extralight text-[#736E65] block text-2xl sm:text-3xl mb-1'>
                        Exploring Topic
                      </span>
                      {categoryDisplayName}
                    </>
                  ) : (
                    <>
                      <span className='italic font-extralight text-[#736E65] block text-2xl sm:text-3xl mb-1'>
                        Curated Perspectives
                      </span>
                      Thoughts, Essays &amp; Ideas
                    </>
                  )}
                </h1>
                <p className='text-[#58544D] text-base sm:text-lg font-serif leading-relaxed max-w-xl'>
                  {params.category
                    ? `Deep-dives, tutorials, and practical articles focused on ${categoryDisplayName}.`
                    : params.search
                      ? `Browsing articles matching your search query.`
                      : 'A collection of tech guides, design breakdowns, and digital craftsmanship notes.'}
                </p>
              </div>

              <form
                action='/blog'
                method='GET'
                className='w-full max-w-md lg:w-80 shrink-0'
              >
                <div className='relative group w-full'>
                  <BiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-[#9A958C] group-focus-within:text-emerald-700 transition-colors text-xl pointer-events-none' />
                  <input
                    name='search'
                    defaultValue={params.search || ''}
                    type='text'
                    placeholder='Search articles or topics…'
                    className='w-full bg-white/90 backdrop-blur-md border border-[#E3DFD7] focus:border-emerald-600 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-[#161513] placeholder-[#9E988D] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-xs hover:border-[#D0C9BD]'
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className='sticky top-0 z-30 bg-[#FAF9F5]/90 backdrop-blur-xl border-b border-[#E8E8E6] shadow-xs py-4'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex flex-wrap items-center gap-2.5'>
              <Link
                href='/blog'
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  !params.category
                    ? 'bg-emerald-900 text-white shadow-sm ring-1 ring-emerald-950'
                    : 'bg-white border border-[#E2DDD5] text-[#58544D] hover:border-emerald-600 hover:text-emerald-900'
                }`}
              >
                <FiFolder
                  size={14}
                  className={
                    !params.category ? 'text-emerald-300' : 'text-[#8A8478]'
                  }
                />
                <span>All Topics</span>
              </Link>

              {categories.map((cat) => {
                const isActive = params.category === cat.slug
                const name = cat.title || cat.name || 'Category'
                return (
                  <Link
                    key={cat.id}
                    href={`/blog?category=${cat.slug}`}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-900 text-white shadow-sm ring-1 ring-emerald-950'
                        : 'bg-white border border-[#E2DDD5] text-[#58544D] hover:border-emerald-600 hover:text-emerald-900'
                    }`}
                  >
                    <Tag
                      size={13}
                      className={
                        isActive ? 'text-emerald-300' : 'text-[#8A8478]'
                      }
                    />
                    <span>{name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10'>
          {featuredBlog && (
            <Link
              href={`/blog/${featuredBlog.slug}`}
              className='group block mb-12 sm:mb-16'
            >
              <div className='relative w-full rounded-3xl overflow-hidden shadow-xl border border-black/5 bg-gradient-to-br from-emerald-950 via-[#161513] to-stone-900 aspect-[16/10] sm:aspect-[21/9] transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.002]'>
                {featuredBlog.image ? (
                  <Image
                    src={featuredBlog.image}
                    alt={featuredBlog.title}
                    fill
                    priority
                    sizes='100vw'
                    className='object-cover opacity-75 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700 ease-out'
                  />
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center p-8'>
                    <div className='relative w-36 h-12 opacity-80 group-hover:scale-105 transition-transform duration-500'>
                      <Image
                        src='https://www.ewhamza.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo2.0d308b88.webp&w=1920&q=75'
                        alt='Logo'
                        fill
                        className='object-contain'
                      />
                    </div>
                  </div>
                )}

                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent' />

                <div className='absolute inset-0 flex flex-col justify-end p-6 sm:p-12 lg:p-16'>
                  <div className='flex items-center gap-2 mb-3 sm:mb-5'>
                    <span className='inline-flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-lg border border-emerald-400/30'>
                      <Flame size={12} />
                      Featured Article
                    </span>
                  </div>

                  <h2 className='text-2xl sm:text-4xl lg:text-5xl font-serif font-medium text-white leading-tight mb-3 sm:mb-4 max-w-4xl group-hover:text-emerald-300 transition-colors duration-300'>
                    {featuredBlog.title}
                  </h2>

                  <p className='text-zinc-300 text-sm sm:text-base font-serif italic max-w-2xl line-clamp-2 mb-6 hidden sm:block leading-relaxed'>
                    {featuredBlog.short_desc}
                  </p>

                  <div className='flex items-center justify-between border-t border-white/20 pt-5 mt-2'>
                    <div className='flex items-center gap-3'>
                      <div className='w-9 h-9 rounded-full overflow-hidden relative ring-2 ring-emerald-400/50 bg-white/10 shrink-0'>
                        <Image
                          src={featuredBlog.user?.image || 'https://www.ewhamza.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo2.0d308b88.webp&w=1920&q=75'}
                          alt={featuredBlog.user?.name || 'Author'}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <div className='flex flex-col sm:flex-row sm:items-center sm:gap-2 text-xs'>
                        <span className='text-white font-bold uppercase tracking-wider'>
                          {featuredBlog.user?.name || 'Unknown Author'}
                        </span>
                        <span className='text-white/40 hidden sm:inline'>
                          •
                        </span>
                        <span className='text-white/80 flex items-center gap-1 font-medium'>
                          <Clock size={12} />
                          {readTime(featuredBlog.short_desc)} min read
                        </span>
                      </div>
                    </div>

                    <span className='inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 group-hover:translate-x-1.5 transition-transform duration-300'>
                      Read Essay <FiArrowUpRight size={18} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {blogs.length === 0 ? (
            <div className='text-center py-20 bg-white rounded-3xl border border-[#E8E3DA] shadow-xs px-6 max-w-2xl mx-auto'>
              <p className='text-[#666259] text-2xl font-serif italic mb-2'>
                No articles found matching your query.
              </p>
              <p className='text-xs font-sans text-[#999388] uppercase tracking-wider mb-6'>
                Try clearing your search filters or browse all topics
              </p>
              <Link
                href='/blog'
                className='inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#161513] text-white text-xs font-bold uppercase tracking-widest hover:bg-emerald-900 transition-colors shadow-xs'
              >
                Reset Search Filters
              </Link>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10'>
              {gridBlogs.map((blog) => {
                const catTitle = blog.category?.title || blog.category?.name
                return (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className='group flex'
                  >
                    <article className='flex flex-col h-full w-full bg-white rounded-3xl border border-[#E8E3DA] p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300'>
                      <div className='relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-[#161513] to-stone-900 mb-5 shadow-inner flex items-center justify-center'>
                        {blog.image ? (
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                            className='object-cover group-hover:scale-105 transition-transform duration-700 ease-out'
                          />
                        ) : (
                          <div className='relative w-24 h-8 opacity-75 group-hover:scale-105 transition-transform duration-500'>
                            <Image
                              src='https://www.ewhamza.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo2.0d308b88.webp&w=1920&q=75'
                              alt='Logo'
                              fill
                              className='object-contain'
                            />
                          </div>
                        )}

                        {catTitle && (
                          <div className='absolute top-3 left-3 z-10'>
                            <span className='bg-white/95 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-emerald-900 px-3 py-1 rounded-xl shadow-xs border border-emerald-100'>
                              {catTitle}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className='flex flex-col flex-1 space-y-3 px-1'>
                        <div className='flex items-center gap-2'>
                          <span className='text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700'>
                            {catTitle || 'Article'}
                          </span>
                          <span className='w-3 h-px bg-[#DCD8CF]' />
                          <span className='text-[10px] font-bold text-[#8A8478] uppercase tracking-widest flex items-center gap-1'>
                            <Clock size={11} />
                            {readTime(blog.short_desc)} min
                          </span>
                        </div>

                        <h2 className='text-xl font-serif font-medium text-[#161513] leading-snug group-hover:text-emerald-800 transition-colors duration-200 flex-1 line-clamp-2'>
                          {blog.title}
                        </h2>

                        <p className='text-[#58544D] text-sm font-serif leading-relaxed line-clamp-2'>
                          {blog.short_desc}
                        </p>

                        <div className='flex items-center gap-3 pt-4 border-t border-[#EDE8E0] mt-auto'>
                          <div className='w-8 h-8 rounded-full overflow-hidden relative bg-[#EFECE6] shrink-0 border border-black/5'>
                            <Image
                              src={blog.user?.image || 'https://www.ewhamza.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo2.0d308b88.webp&w=1920&q=75'}
                              alt={blog.user?.name || 'Author'}
                              fill
                              className='object-cover'
                            />
                          </div>
                          <span className='text-xs font-bold text-[#2C2B28] uppercase tracking-tight truncate'>
                            {blog.user?.name || 'Unknown Author'}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className='mt-16 sm:mt-24 flex justify-center items-center gap-2.5'>
              <Link
                href={createPageUrl(currentPage - 1)}
                aria-label='Previous page'
                className={`w-11 h-11 flex items-center justify-center rounded-2xl border border-[#E3DFD7] bg-white text-[#58544D] transition-all shadow-xs ${
                  currentPage <= 1
                    ? 'opacity-30 pointer-events-none'
                    : 'hover:bg-[#161513] hover:text-white hover:border-[#161513]'
                }`}
              >
                <FiChevronLeft size={18} />
              </Link>

              {[...Array(totalPages)].map((_, i) => (
                <Link
                  key={i}
                  href={createPageUrl(i + 1)}
                  aria-label={`Page ${i + 1}`}
                  className={`w-11 h-11 flex items-center justify-center rounded-2xl text-xs font-bold transition-all ${
                    currentPage === i + 1
                      ? 'bg-[#161513] text-white shadow-md'
                      : 'bg-white border border-[#E3DFD7] text-[#666259] hover:text-[#161513] hover:border-[#161513]'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </Link>
              ))}

              <Link
                href={createPageUrl(currentPage + 1)}
                aria-label='Next page'
                className={`w-11 h-11 flex items-center justify-center rounded-2xl border border-[#E3DFD7] bg-white text-[#58544D] transition-all shadow-xs ${
                  currentPage >= totalPages
                    ? 'opacity-30 pointer-events-none'
                    : 'hover:bg-[#161513] hover:text-white hover:border-[#161513]'
                }`}
              >
                <FiChevronRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}