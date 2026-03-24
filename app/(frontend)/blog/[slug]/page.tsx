import React from 'react'
import Link from 'next/link'
import { FiArrowLeft, FiClock, FiShare2, FiUser } from 'react-icons/fi'
import { getArticleBySlug, getRelatedPosts } from '@/utils/actions'
import { notFound } from 'next/navigation'
import InteractionRail from '@/components/InteractionRail'
import ReadAloud from '@/components/ReadAloud'
import Image from 'next/image'

const wrapWordsInHtml = (html: string) => {
  let wordCount = 0
  return html.replace(/(<[^>]+>)|([^<>\s]+)/g, (match, tag, word) => {
    if (tag) return tag
    const span = `<span class="read-word" data-word-idx="${wordCount}">${word}</span>`
    wordCount++
    return span
  })
}

export default async function BlogDetail({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params
  const blog = await getArticleBySlug(slug)

  if (!blog) notFound()

  const processedContent = wrapWordsInHtml(blog.long_desc)

  const relatedPosts = await getRelatedPosts(blog.category?.id, blog.id)

  return (
    <article className='bg-white min-h-screen font-sans antialiased text-[#111827]'>
      <nav className='bg-white py-6 border-b border-gray-50'>
        <div className='max-w-4xl mx-auto px-6 flex justify-between items-center'>
          <Link
            href='/blog'
            className='flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#2563EB] transition-colors'
          >
            <FiArrowLeft />
            All Posts
          </Link>
          <div className='flex items-center gap-4 text-gray-400'>
            <FiShare2
              className='cursor-pointer hover:text-[#2563EB]'
              size={20}
            />
          </div>
        </div>
      </nav>

      <header className='pt-16 pb-12 bg-white'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <div className='flex items-center justify-center gap-3 mb-6'>
            <span className='text-[#2563EB] text-sm font-bold uppercase tracking-widest'>
              {blog.category?.title || 'Design'}
            </span>
            <span className='text-gray-300'>•</span>
            <span className='text-gray-500 text-sm font-medium'>
              {new Date(blog.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className='text-4xl md:text-5xl font-bold text-[#111827] mb-8 leading-[1.2] tracking-tight'>
            {blog.title}
          </h1>

          <div className='flex items-center justify-center gap-6 mb-12'>
            <div className='flex items-center gap-2 text-gray-400 text-sm'>
              <FiClock /> {blog.readTime}
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-5xl mx-auto px-6 mb-20'>
        <div className='relative aspect-video rounded-3xl overflow-hidden shadow-sm'>
          <Image
            src={blog.image || '/placeholder.jpg'}
            alt={blog.title}
            fill
            priority
            className='object-cover'
          />
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 pb-24'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
          <aside className='lg:col-span-2 hidden lg:flex flex-col items-end sticky top-32 h-fit'>
            <InteractionRail articleId={blog.id} />
            <ReadAloud text={blog.long_desc} />
          </aside>

          <main className='lg:col-span-8'>
            <div className='prose  max-w-none'>
              <div
                className='text-[#374151] text-lg selection:bg-blue-50 whitespace-pre-line'
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>

            <div className='mt-16 p-8 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col md:flex-row gap-6 items-start'>
              <div className='w-16 h-16 rounded-2xl overflow-hidden bg-white relative flex-shrink-0 shadow-sm border border-blue-100'>
                {blog.author?.image ? (
                  <Image
                    src={blog.author.image}
                    alt={blog.author.name}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-blue-300'>
                    <FiUser size={24} />
                  </div>
                )}
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <h4 className='font-bold text-[#111827]'>
                    About {blog.author?.name || 'the Author'}
                  </h4>
                  <span className='px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded uppercase'>
                    Author
                  </span>
                </div>
                <p className='text-gray-600 text-sm leading-relaxed'>
                  {blog.author?.bio ||
                    'Expert contributor at Geology Insights. Specializing in design systems, emerging technologies, and user-centric storytelling.'}
                </p>
                <Link
                  href={`/blog/?author=${blog?.author?.name}`}
                  className='inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors pt-2'
                >
                  View all posts by {blog.author?.name?.split(' ')[0]} →
                </Link>
              </div>
            </div>

            <section className='mt-24 pt-16 border-t border-gray-100'>
              <div className='flex items-center justify-between mb-10'>
                <h2 className='text-2xl font-bold text-[#111827]'>
                  Community Insights
                </h2>
                <span className='px-4 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-bold'>
                  {blog.reviews?.length || 0} Reviews
                </span>
              </div>

              {blog.reviews && blog.reviews.length > 0 ? (
                <div className='space-y-6'>
                  {blog.reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className='p-8 rounded-2xl bg-white border border-gray-100 shadow-sm'
                    >
                      <div className='flex justify-between items-start mb-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-bold'>
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className='text-sm font-bold text-[#111827]'>
                              {review.name}
                            </h4>
                            <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className='flex gap-0.5'>
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < review.rating
                                  ? 'text-[#2563EB]'
                                  : 'text-gray-200'
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className='text-gray-600 leading-relaxed text-sm italic border-l-2 border-blue-100 pl-4'>
                        {review.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-12 bg-[#F9FAFB] rounded-2xl border border-dashed border-gray-200'>
                  <p className='text-gray-400 text-sm italic'>
                    No reviews yet. Be the first to share your thoughts.
                  </p>
                </div>
              )}
            </section>

            <div className='mt-24 p-12 bg-[#F9FAFB] rounded-3xl border border-gray-100 text-center'>
              <h3 className='text-2xl font-bold mb-3'>
                Subscribe to newsletter
              </h3>
              <p className='text-gray-500 mb-8'>
                The latest blog posts delivered to your inbox every week.
              </p>
              <form className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'>
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-blue-100'
                />
                <button className='bg-[#111827] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2563EB] transition-all'>
                  Subscribe
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>

      <section className='bg-[#F9FAFB] py-24 border-t border-gray-100'>
        <div className='max-w-6xl mx-auto px-6'>
          <h2 className='text-2xl font-bold text-[#111827] mb-12 text-center'>
            Recommended articles
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {relatedPosts.slice(0, 3).map((post: any) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className='group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all'
              >
                <div className='aspect-video overflow-hidden'>
                  <img
                    src={post.image}
                    alt=''
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                </div>
                <div className='p-6'>
                  <p className='text-[#2563EB] text-xs font-bold uppercase mb-2'>
                    {post.category?.title}
                  </p>
                  <h3 className='text-lg font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors leading-snug'>
                    {post.title}
                  </h3>
                  <p className='text-gray-400 text-xs mt-4'>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
