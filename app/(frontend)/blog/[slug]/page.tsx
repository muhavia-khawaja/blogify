import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiClock, FiCheck } from 'react-icons/fi'
import { AiFillStar } from 'react-icons/ai'
import { BookOpen } from 'lucide-react'
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
    <article className='bg-[#FCFBF9] min-h-screen antialiased text-[#1A1A1A]'>
      <header className='pt-32 md:pt-48 pb-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <div className='flex flex-col items-center text-center mb-12'>
            <div className='flex items-center gap-3 mb-8'>
              <span className='h-px w-8 bg-emerald-500'></span>
              <span className='text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600'>
                {new Date(blog.createdAt).toLocaleDateString('en-GB', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className='h-px w-8 bg-emerald-500'></span>
            </div>

            <h1 className='text-4xl md:text-7xl font-serif font-bold leading-[1.1] tracking-tight mb-10'>
              {blog.title}
            </h1>

            <p className='text-lg md:text-2xl font-serif italic text-gray-400 max-w-2xl leading-relaxed'>
              {blog.short_desc}
            </p>
          </div>

          <div className='relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl bg-gray-100'>
            <Image
              src={
                blog.image && blog.image.length > 0
                  ? blog.image
                  : '/placeholder.jpg'
              }
              alt={blog.title}
              fill
              priority
              className='object-cover hover:scale-105 transition-transform duration-[3s] ease-out'
            />
          </div>
        </div>
      </header>

      <div className='lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-4 bg-white/90 backdrop-blur-xl border border-gray-100 p-3 px-6 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)]'>
        <InteractionRail articleId={blog.id} initialIsLiked={isLikedInitial} />
        <div className='w-px h-6 bg-gray-200 mx-2' />
        <ReadAloud text={blog.long_desc} />
      </div>

      <div className='max-w-7xl mx-auto px-6 pb-32'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-16'>
          <aside className='lg:col-span-3 hidden lg:flex flex-col gap-12 sticky top-32 h-fit'>
            <div className='space-y-6'>
              <div className='w-16 h-16 rounded-2xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500 shadow-xl border border-gray-100'>
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
              <div>
                <p className='text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1'>
                  Authored By
                </p>
                <h4 className='font-serif font-bold text-lg'>
                  {blog.user?.name}
                </h4>
              </div>
            </div>

            <div className='pt-8 border-t border-gray-100 flex flex-col gap-10'>
              <div className='flex items-center gap-4 text-gray-300'>
                <FiClock />
                <span className='text-[10px] font-black uppercase tracking-widest'>
                  {blog.readTime || '5 min reading'}
                </span>
              </div>

              <div className='space-y-8'>
                <InteractionRail
                  articleId={blog.id}
                  initialIsLiked={isLikedInitial}
                />
                <ReadAloud text={blog.long_desc} />
              </div>
            </div>
          </aside>

          <main className='lg:col-span-7'>
            <div className='prose prose-lg max-w-none'>
              <div
                className='font-serif text-lg md:text-xl leading-[1.9] text-[#2C2C2C] selection:bg-emerald-100 first-letter:text-8xl first-letter:font-bold first-letter:mr-4 first-letter:float-left first-letter:text-black first-letter:mt-2'
                dangerouslySetInnerHTML={{ __html: blog.long_desc }}
              />
            </div>

            <div className='mt-24 pt-12 border-t border-gray-100 '>
              <BlogInteraction articleId={blog.id} articleSlug={blog.slug} />
            </div>

            <section className='mt-32' id='reviews'>
              <div className='flex items-end justify-between mb-16'>
                <div className='space-y-4'>
                  <span className='text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600'>
                    Public Response
                  </span>
                  <h2 className='text-4xl font-serif font-bold'>
                    The Reader's Gallery
                  </h2>
                </div>
                <div className='hidden md:block'>
                  <span className='text-6xl font-serif italic text-gray-100 tabular-nums'>
                    {reviews.length.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className='space-y-16'>
                {reviews.length > 0 ? (
                  reviews.map((review: any) => (
                    <div key={review.id} className='group'>
                      <div className='flex justify-between items-start mb-6'>
                        <div className='space-y-1'>
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
                        <span className='text-[10px] font-bold text-gray-300 uppercase tracking-widest'>
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
                      <blockquote className='relative z-0'>
                        <p className='text-lg md:text-xl text-gray-500 font-serif italic leading-relaxed border-l-2 border-emerald-50 pl-8 group-hover:border-emerald-500 transition-all duration-700'>
                          "{review.content}"
                        </p>
                      </blockquote>
                    </div>
                  ))
                ) : (
                  <div className='py-20 px-8 rounded-[3rem] border-2 border-dashed border-gray-100 text-center bg-white/50'>
                    <p className='text-gray-400 font-serif italic text-lg'>
                      The gallery is silent. <br />
                      <span className='text-sm not-italic font-sans font-bold uppercase tracking-widest text-emerald-600 mt-4 inline-block'>
                        Add your perspective above
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </section>
          </main>

          <aside className='lg:col-span-2' />
        </div>
      </div>

      <section className='bg-white py-32 border-t border-gray-50'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='flex items-end justify-between mb-16'>
            <div className='space-y-4'>
              <span className='text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600'>
                Extended Archive
              </span>
              <h2 className='text-4xl font-serif font-bold'>
                Further Perspectives
              </h2>
            </div>
            <Link
              href='/blog'
              className='hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:text-emerald-600 hover:border-emerald-600 transition-all'
            >
              Consult Full Archive
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
            {relatedPosts.slice(0, 3).map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className='group'>
                <div className='aspect-video rounded-[2.5rem] overflow-hidden mb-6 relative shadow-sm group-hover:shadow-2xl transition-all duration-700'>
                  <Image
                    src={post.image || '/placeholder.jpg'}
                    alt={post.title}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-[1.5s]'
                  />
                </div>
                <span className='text-[9px] font-black uppercase tracking-widest text-emerald-500 block mb-3'>
                  {post.category?.title}
                </span>
                <h3 className='text-2xl font-serif font-bold leading-tight group-hover:text-emerald-700 transition-colors'>
                  {post.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
