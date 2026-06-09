import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiClock } from 'react-icons/fi'
import { AiFillStar } from 'react-icons/ai'
import { BookOpen, ChevronRight } from 'lucide-react'
import {
  getArticleBySlug,
  getRelatedPosts,
  getCurrentUser,
  isArticleLikedByUser,
} from '@/utils/actions'
import { notFound } from 'next/navigation'
import InteractionRail from '@/components/InteractionRail'
import ReadAloud from '@/components/ReadAloud'
import BlogInteraction from '@/components/BlogInteraction'
import ReadingProgress from '@/components/ReadingProgress'
import ViewAllReviewsButton from '@/components/ViewAllReviews'

export default async function BlogDetail({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params

  const [blog, user] = await Promise.all([
    getArticleBySlug(slug),
    getCurrentUser(),
  ])

  if (!blog) notFound()

  const [relatedPosts, isLikedInitial] = await Promise.all([
    getRelatedPosts(blog.category?.id, blog.id),
    isArticleLikedByUser(blog.id),
  ])

  const reviews = blog.reviews || []

  return (
    <>
      <ReadingProgress />

      <article className='bg-[#FCFBF9] min-h-screen antialiased text-[#1A1A1A]'>
        <header className='pt-28 md:pt-44 pb-12'>
          <div className='max-w-4xl mx-auto px-6'>
            <div className='flex flex-col items-center text-center mb-14'>
              <div className='flex items-center gap-3 mb-7'>
                <span className='h-px w-10 bg-emerald-400' />
                <span className='text-[9px] font-black uppercase tracking-[0.35em] text-emerald-600'>
                  {blog.category?.title && (
                    <span className='mr-3 pr-3 border-r border-emerald-300'>
                      {blog.category.title}
                    </span>
                  )}
                  {new Date(blog.createdAt).toLocaleDateString('en-GB', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className='h-px w-10 bg-emerald-400' />
              </div>

              <h1 className='text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.08] tracking-tight mb-8 max-w-3xl'>
                {blog.title}
              </h1>

              <p className='text-lg md:text-xl font-serif italic text-gray-400 max-w-2xl leading-relaxed'>
                {blog.short_desc}
              </p>

              <div className='mt-8 flex items-center gap-3 bg-white border border-gray-100 rounded-full px-5 py-2.5 shadow-sm'>
                <div className='w-7 h-7 rounded-full overflow-hidden relative shrink-0 bg-gray-100'>
                  {blog.user?.image ? (
                    <Image
                      src={blog.user.image}
                      alt={blog.user.name}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-gray-400'>
                      <BookOpen size={12} />
                    </div>
                  )}
                </div>
                <span className='text-[11px] font-bold text-gray-600 uppercase tracking-widest'>
                  {blog.user?.name}
                </span>
                <span className='h-3 w-px bg-gray-200' />
                <span className='text-[11px] text-gray-400 flex items-center gap-1.5'>
                  <FiClock size={11} />
                  {blog.readTime || '5 min read'}
                </span>
              </div>
            </div>

            <div className='relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-xl bg-gray-100'>
              <Image
                src={
                  blog.image && blog.image.length > 0
                    ? blog.image
                    : '/placeholder.jpg'
                }
                alt={blog.title}
                fill
                priority
                className='object-cover hover:scale-105 transition-transform duration-[4s] ease-out'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none' />
            </div>
          </div>
        </header>

        <div className='max-w-7xl mx-auto px-6 pb-32'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16'>
            <aside className='lg:col-span-3 hidden lg:flex flex-col gap-10 sticky top-28 h-fit'>
              <div className='space-y-5'>
                <div className='w-14 h-14 rounded-2xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500 shadow-md border border-gray-100'>
                  {blog.user?.image ? (
                    <Image
                      src={blog.user.image}
                      alt={blog.user.name}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center bg-gray-100 text-gray-400'>
                      <BookOpen size={14} />
                    </div>
                  )}
                </div>
                <div>
                  <p className='text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1'>
                    Authored by
                  </p>
                  <h4 className='font-serif font-bold text-lg leading-snug'>
                    {blog.user?.name}
                  </h4>
                </div>
              </div>

              <div className='pt-6 border-t border-gray-100 flex flex-col gap-8'>
                <div className='flex items-center gap-3'>
                  <FiClock size={14} className='text-gray-300' />
                  <span className='text-[9px] font-black uppercase tracking-widest text-gray-400'>
                    {blog.readTime || '5 min reading'}
                  </span>
                </div>
                <div className='space-y-6'>
                  <InteractionRail articleId={blog.id} />
                  <ReadAloud text={blog.long_desc} />
                </div>
              </div>

              {reviews.length > 0 &&
                (() => {
                  const avg =
                    reviews.reduce((s: number, r: any) => s + r.rating, 0) /
                    reviews.length
                  return (
                    <div className='pt-6 border-t border-gray-100'>
                      <p className='text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3'>
                        Readers
                      </p>
                      <div className='flex items-center gap-2 text-sm font-serif italic text-gray-500'>
                        <span>
                          {reviews.length} review
                          {reviews.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className='flex gap-0.5 mt-2 items-center'>
                        {[...Array(5)].map((_, i) => (
                          <AiFillStar
                            key={i}
                            size={11}
                            className={
                              i < Math.round(avg)
                                ? 'text-emerald-500'
                                : 'text-gray-200'
                            }
                          />
                        ))}
                        <span className='text-[10px] text-gray-400 ml-1'>
                          {avg.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )
                })()}
            </aside>

            <main className='lg:col-span-7'>
              <div
                className='prose prose-lg prose-emerald max-w-none
    prose-headings:font-serif prose-headings:font-bold prose-headings:!text-[#1A1A1A]
    prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6
    prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5
    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
    prose-p:font-serif prose-p:text-[1.15rem] prose-p:leading-[1.95] prose-p:!text-[#1A1A1A] prose-p:mb-6
    prose-blockquote:border-l-4 prose-blockquote:border-emerald-400
    prose-blockquote:pl-8 prose-blockquote:italic prose-blockquote:!text-[#4B5563]
    prose-blockquote:my-10
    prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
    prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
    prose-li:mb-2 prose-li:font-serif prose-li:text-[1.1rem] prose-li:!text-[#1A1A1A]
    prose-strong:font-bold prose-strong:!text-[#1A1A1A]
    prose-a:text-emerald-600 prose-a:underline
    !text-[#1A1A1A]
    selection:bg-emerald-100'
                dangerouslySetInnerHTML={{ __html: blog.long_desc }}
              />

              <div className='mt-20 pt-10 border-t border-gray-100'>
                <BlogInteraction articleId={blog.id} articleSlug={blog.slug} />
              </div>

              <section className='mt-28' id='reviews'>
                <div className='flex items-end justify-between mb-12'>
                  <div className='space-y-3'>
                    <span className='text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600'>
                      Public Response
                    </span>
                    <h2 className='text-3xl md:text-4xl font-serif font-bold'>
                      The Reader&apos;s Gallery
                    </h2>
                  </div>
                  <span className='hidden md:block text-6xl font-serif italic text-gray-100 tabular-nums select-none'>
                    {reviews.length.toString().padStart(2, '0')}
                  </span>
                </div>

                <div className='space-y-12'>
                  {reviews.length > 0 ? (
                    <>
                      {reviews.slice(0, 3).map((review: any) => (
                        <div key={review.id} className='group'>
                          <div className='flex justify-between items-start mb-5'>
                            <div className='space-y-1.5'>
                              <h4 className='font-serif font-bold text-xl text-gray-900'>
                                {review.name}
                              </h4>
                              <div className='flex gap-0.5'>
                                {[...Array(5)].map((_, i) => (
                                  <AiFillStar
                                    key={i}
                                    size={12}
                                    className={
                                      i < review.rating
                                        ? 'text-emerald-500'
                                        : 'text-gray-200'
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            <span className='text-[10px] font-bold text-gray-300 uppercase tracking-widest shrink-0 ml-4'>
                              {new Date(review.createdAt).toLocaleDateString(
                                'en-GB',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                },
                              )}
                            </span>
                          </div>
                          <blockquote>
                            <p className='text-base sm:text-lg md:text-xl text-gray-500 font-serif italic leading-relaxed border-l-2 border-emerald-50 pl-4 sm:pl-7 group-hover:border-emerald-500 transition-all duration-700 break-words max-w-full'>
                              {review.content}
                            </p>
                          </blockquote>
                        </div>
                      ))}

                      {reviews.length > 3 && (
                        <ViewAllReviewsButton reviews={reviews} />
                      )}
                    </>
                  ) : (
                    <div className='py-20 px-8 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-center bg-white/50'>
                      <p className='text-gray-400 font-serif italic text-lg'>
                        The gallery is silent.
                        <br />
                        <span className='text-xs not-italic font-sans font-bold uppercase tracking-widest text-emerald-600 mt-4 inline-block'>
                          Add your perspective above
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </main>

            <aside className='lg:col-span-2 hidden lg:block' />
          </div>
        </div>

        <section className='bg-white py-28 border-t border-gray-50'>
          <div className='max-w-7xl mx-auto px-6'>
            <div className='flex items-end justify-between mb-14'>
              <div className='space-y-3'>
                <span className='text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600'>
                  Extended Archive
                </span>
                <h2 className='text-3xl md:text-4xl font-serif font-bold'>
                  Further Perspectives
                </h2>
              </div>
              <Link
                href='/blog'
                className='hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:text-emerald-600 hover:border-emerald-600 transition-all group'
              >
                Consult Full Archive
                <ChevronRight
                  size={12}
                  className='group-hover:translate-x-1 transition-transform'
                />
              </Link>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
              {relatedPosts.slice(0, 3).map((post: any) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className='group'
                >
                  <div className='aspect-video rounded-[2rem] overflow-hidden mb-5 relative shadow-sm group-hover:shadow-xl transition-all duration-500'>
                    <Image
                      src={post.image || '/placeholder.jpg'}
                      alt={post.title}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-[1.5s]'
                    />
                  </div>
                  <span className='text-[9px] font-black uppercase tracking-widest text-emerald-500 block mb-2'>
                    {post.category?.title}
                  </span>
                  <h3 className='text-xl font-serif font-bold leading-snug group-hover:text-emerald-700 transition-colors'>
                    {post.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </article>
    </>
  )
}
