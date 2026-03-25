import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BiSearch } from 'react-icons/bi'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { getBlogPageData } from '@/utils/actions'
import { Flame, BookOpen, Hash } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string; category?: string; search?: string }
}): Promise<Metadata> {
  const params = searchParams

  const { categories = [] } = await getBlogPageData(params)

  const activeCategory = categories.find((cat) => cat.slug === params.category)

  if (activeCategory) {
    return {
      title: `${activeCategory.name} Articles | Blogify`,
      description:
        activeCategory.short ||
        `Explore articles related to ${activeCategory.name}.`,
      keywords: [
        activeCategory.name,
        `${activeCategory.name} articles`,
        'study guides',
        'education blog',
      ],
    }
  }

  if (params.search) {
    return {
      title: `Search "${params.search}" | Blogify`,
      description: `Browse results for "${params.search}" articles and guides.`,
    }
  }

  return {
    title: 'Blogify Articles & Insights',
    description:
      'Read the latest articles, tips, and study guides across all categories.',
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>
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
    <section className='bg-white min-h-screen font-sans antialiased pb-20'>
      <div className='max-w-7xl mx-auto px-6 pt-16 pb-10'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h1 className='text-3xl font-bold text-[#0f172a] mb-2'>
              {params.search ? 'Search Results' : 'Discover Nice Articles Here'}
            </h1>
            <p className='text-gray-400 text-sm max-w-xl leading-relaxed'>
              {params.search
                ? `Showing results for "${params.search}"`
                : 'All the articles and contents of the site have been updated today.'}
            </p>
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-4 mt-8'>
          <form action='/blog' method='GET' className='relative w-full md:w-72'>
            <BiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              name='search'
              defaultValue={params.search}
              type='text'
              placeholder='Search articles...'
              className='w-full bg-gray-100/80 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 ring-blue-100 outline-none'
            />
          </form>

          <div className='flex items-center gap-2 overflow-x-auto no-scrollbar'>
            <Link
              href='/blog'
              className={`px-5 py-2 rounded-full text-xs font-medium transition-colors ${
                !params.category
                  ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-200'
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  params.category === cat.slug
                    ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-200'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6'>
        {!params.category && !params.search && blogs.length > 0 ? (
          <Link href={`/blog/${blogs[0].slug}`} className='block mb-16'>
            <div className='relative w-full aspect-[21/9] rounded-[2.5rem] bg-[#c2e7ff] overflow-hidden group shadow-sm transition-transform hover:scale-[1.01] duration-500'>
              <div className='absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10'>
                <div className='flex items-center gap-2 mb-4 bg-white/30 backdrop-blur-md px-3 py-1 rounded-full'>
                  <Flame size={14} className='text-orange-600' />
                  <span className='text-[10px] font-bold uppercase tracking-widest text-[#0f172a]'>
                    Featured Post
                  </span>
                </div>
                <h2 className='text-3xl md:text-5xl font-black text-[#0f172a] mb-4 max-w-3xl leading-tight'>
                  {blogs[0].title}
                </h2>
                <p className='text-[#1e293b]/70 text-base max-w-2xl line-clamp-2 font-medium'>
                  {blogs[0].short_desc}
                </p>
              </div>
            </div>
          </Link>
        ) : params.category && activeCategory ? (
          <div className='mb-16 p-10 md:p-16 rounded-[2.5rem] bg-gray-50 border border-gray-100 relative overflow-hidden'>
            <div className='absolute -right-10 -top-10 text-gray-100 opacity-50 rotate-12'>
              <Hash size={200} />
            </div>
            <div className='relative z-10'>
              <span className='text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 block'>
                Category Archive
              </span>
              <h2 className='text-4xl md:text-5xl font-black text-[#0f172a] mb-6'>
                {activeCategory.name}
              </h2>
              <p className='text-gray-600 text-lg font-semibold max-w-3xl mb-6 leading-relaxed'>
                {activeCategory.short}
              </p>
            </div>
          </div>
        ) : null}

        <h3 className='text-lg font-bold text-gray-800 mb-10 flex items-center justify-center'>
          <span className='h-px w-12 bg-gray-100 mr-4'></span>
          {params.category
            ? `Browse ${activeCategory?.name}`
            : 'Recent Publications'}
          <span className='h-px w-12 bg-gray-100 ml-4'></span>
        </h3>

        {blogs.length > 0 ? (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
              {(params.category || params.search ? blogs : blogs.slice(1)).map(
                (blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className='group'
                  >
                    <article className='flex flex-col h-full bg-white rounded-[2.5rem] transition-all hover:-translate-y-2'>
                      <div className='relative w-full overflow-hidden rounded-[2.5rem] bg-gray-100 mb-6'>
                        <div className='relative aspect-video overflow-hidden bg-gray-100'>
                          <Image
                            src={blog.image || '/placeholder.jpg'}
                            alt={blog.title}
                            fill
                            sizes='(max-width: 768px) 100vw, 33vw'
                            className='object-cover group-hover:scale-110 transition-transform duration-700'
                          />
                        </div>

                        <div className='absolute bottom-5 left-5 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md'>
                          <div className='relative w-6 h-6 rounded-full overflow-hidden border border-gray-100 bg-gray-50'>
                            <Image
                              src={blog.author?.image || '/default-avatar.png'}
                              alt='author'
                              fill
                              className='object-cover'
                            />
                          </div>
                          <span className='text-[10px] font-bold text-gray-800 uppercase tracking-tight'>
                            {blog.author?.name || 'Author'}
                          </span>
                        </div>
                      </div>

                      <div className='px-4'>
                        <h2 className='text-xl font-extrabold text-[#1e293b] leading-tight mb-3 group-hover:text-blue-600 transition-colors'>
                          {blog.title}
                        </h2>
                        <p className='text-gray-400 text-xs leading-relaxed line-clamp-2 font-medium mb-4'>
                          {blog.short_desc}
                        </p>
                      </div>
                    </article>
                  </Link>
                ),
              )}
            </div>

            <div
              className=' leading-[1.8] text-lg selection:bg-blue-50 whitespace-pre-line text-black    border-l-4 border-blue-400 pl-6 italic mt-8'
              dangerouslySetInnerHTML={{ __html: activeCategory?.long || '' }}
            />

            {totalPages > 1 && (
              <div className='mt-20 flex justify-center items-center gap-3'>
                <Link
                  href={createPageUrl(currentPage - 1)}
                  className={`p-3 rounded-full border border-gray-100 ${currentPage <= 1 ? 'pointer-events-none opacity-30' : 'hover:bg-gray-50 hover:border-blue-200'}`}
                >
                  <FiChevronLeft size={20} />
                </Link>

                {[...Array(totalPages)].map((_, i) => (
                  <Link
                    key={i}
                    href={createPageUrl(i + 1)}
                    className={`w-11 h-11 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                      currentPage === i + 1
                        ? 'bg-[#00aaff] text-white shadow-lg shadow-blue-100 scale-110'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </Link>
                ))}

                <Link
                  href={createPageUrl(currentPage + 1)}
                  className={`p-3 rounded-full border border-gray-100 ${currentPage >= totalPages ? 'pointer-events-none opacity-30' : 'hover:bg-gray-50 hover:border-blue-200'}`}
                >
                  <FiChevronRight size={20} />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className='text-center py-32 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200'>
            <BookOpen size={48} className='mx-auto text-gray-200 mb-4' />
            <p className='text-gray-400 font-medium italic'>
              Oops! We couldn&apos;t find any articles matching your selection.
            </p>
            <Link
              href='/blog'
              className='text-blue-500 font-bold text-sm mt-4 inline-block hover:underline'
            >
              Clear all filters
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
