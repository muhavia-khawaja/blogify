import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BiSearch } from 'react-icons/bi'
import { FiChevronLeft, FiChevronRight, FiArrowUpRight } from 'react-icons/fi'
import { getBlogPageData } from '@/utils/actions'
import { Flame, BookOpen, Hash, ArrowRight } from 'lucide-react'

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

  return (
    <section className='bg-[#FCFBF9] min-h-screen pb-24'>
      <div className='max-w-7xl mx-auto px-6 pt-24 pb-12'>
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16'>
          <div className='max-w-2xl'>
            <h1 className='text-5xl md:text-6xl font-serif font-medium text-black mb-6 italic'>
              {params.search ? `Results for "${params.search}"` : 'The Archive'}
            </h1>
            <p className='text-gray-500 text-lg font-serif italic'>
              {params.category
                ? `Exploring the nuances of ${activeCategory?.name}.`
                : 'A curated collection of thoughts, tutorials, and digital explorations.'}
            </p>
          </div>

          <form
            action='/blog'
            method='GET'
            className='relative w-full md:w-80 group'
          >
            <BiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors' />
            <input
              name='search'
              defaultValue={params.search}
              type='text'
              placeholder='Search articles...'
              className='w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 ring-emerald-50 shadow-sm outline-none transition-all'
            />
          </form>
        </div>

        <div className='flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 border-b border-gray-200'>
          <Link
            href='/blog'
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              !params.category
                ? 'bg-black text-white shadow-xl'
                : 'bg-white border border-gray-100 text-gray-400 hover:border-black hover:text-black'
            }`}
          >
            All posts
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                params.category === cat.slug
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                  : 'bg-white border border-gray-100 text-gray-400 hover:border-emerald-500 hover:text-emerald-600'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6'>
        {!params.category && !params.search && blogs.length > 0 && (
          <Link href={`/blog/${blogs[0].slug}`} className='group block mb-24'>
            <div className='relative w-full aspect-[21/10] rounded-[3rem] overflow-hidden shadow-2xl'>
              <Image
                src={blogs[0].image || '/placeholder.jpg'}
                alt={blogs[0].title}
                fill
                className='object-cover group-hover:scale-105 transition-transform duration-1000'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12'>
                <div className='flex items-center gap-2 mb-4 bg-emerald-500 text-white w-fit px-4 py-1 rounded-full'>
                  <Flame size={14} />
                  <span className='text-[10px] font-bold uppercase tracking-widest'>
                    Today&apos;s Highlight
                  </span>
                </div>
                <h2 className='text-4xl md:text-6xl font-serif text-white mb-4 max-w-3xl leading-tight'>
                  {blogs[0].title}
                </h2>
                <p className='text-gray-300 text-lg max-w-2xl line-clamp-2 font-serif italic'>
                  {blogs[0].short_desc}
                </p>
              </div>
            </div>
          </Link>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20'>
          {(params.category || params.search ? blogs : blogs.slice(1)).map(
            (blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className='group'>
                <article className='flex flex-col h-full'>
                  <div className='relative aspect-video (16/9) overflow-hidden rounded-2xl bg-gray-100 mb-5 shadow-sm group-hover:shadow-2xl group-hover:shadow-emerald-100/50 transition-all duration-500 border border-gray-100'>
                    <Image
                      src={blog.image || '/placeholder.jpg'}
                      alt={blog.title}
                      fill
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      className='object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out'
                    />

                    <div className='absolute top-3 left-3'>
                      <span className='backdrop-blur-md bg-white/80 text-[10px] font-black uppercase tracking-widest text-emerald-700 px-3 py-1.5 rounded-lg border border-white/50 shadow-sm'>
                        {blog.category?.title}
                      </span>
                    </div>
                  </div>

                  <div className='space-y-4 px-2'>
                    <div className='flex items-center gap-3'>
                      <span className='text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600'>
                        {blog.category?.title || 'Article'}
                      </span>
                      <span className='h-px w-8 bg-gray-200'></span>
                      <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                        {Math.ceil(blog.short_desc.length / 200)} min read
                      </span>
                    </div>

                    <h2 className='text-2xl font-serif font-bold text-black leading-tight group-hover:text-emerald-700 transition-colors'>
                      {blog.title}
                    </h2>

                    <div className='flex items-center gap-3 pt-4 border-t border-gray-100'>
                      <div className='w-8 h-8 rounded-full overflow-hidden relative grayscale'>
                        {blog.user?.image ? (
                          <Image
                            src={blog.user.image}
                            alt={blog.user.name}
                            fill
                            className='object-cover'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center bg-gray-200 text-gray-400'>
                            <BookOpen size={16} />
                          </div>
                        )}
                      </div>
                      <span className='text-xs font-bold text-black uppercase tracking-tighter'>
                        By {blog.user?.name}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ),
          )}
        </div>

        {totalPages > 1 && (
          <div className='mt-32 flex justify-center items-center gap-2'>
            <Link
              href={createPageUrl(currentPage - 1)}
              className={`w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 ${currentPage <= 1 ? 'opacity-20 pointer-events-none' : 'hover:bg-black hover:text-white transition-all'}`}
            >
              <FiChevronLeft />
            </Link>

            {[...Array(totalPages)].map((_, i) => (
              <Link
                key={i}
                href={createPageUrl(i + 1)}
                className={`w-12 h-12 flex items-center justify-center rounded-full text-xs font-black transition-all ${
                  currentPage === i + 1
                    ? 'bg-black text-white'
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </Link>
            ))}

            <Link
              href={createPageUrl(currentPage + 1)}
              className={`w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 ${currentPage >= totalPages ? 'opacity-20 pointer-events-none' : 'hover:bg-black hover:text-white transition-all'}`}
            >
              <FiChevronRight />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
