import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiClock, FiCalendar, FiArrowRight } from 'react-icons/fi'
import { AiFillStar } from 'react-icons/ai'
import { BookOpen, ChevronRight, Sparkles } from 'lucide-react'
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
import AnalyticsTracker from '@/components/AnalyticsTracker'
import type { Metadata } from 'next'
import { buildMetadata, getAbsoluteUrl, SITE_NAME } from '@/utils/seo'
import JsonLd from '@/components/JsonLd'

const LOGO_URL =
  'https://www.ewhamza.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo2.0d308b88.webp&w=1920&q=75'

function ArticleImage({
  src,
  alt,
  fill = true,
  className,
  priority = false,
  logoWidth = 140,
  logoHeight = 50,
}: {
  src?: string | null
  alt: string
  fill?: boolean
  className?: string
  priority?: boolean
  logoWidth?: number
  logoHeight?: number
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        className={className}
      />
    )
  }

  return (
    <div className='absolute inset-0 bg-gradient-to-br from-zinc-900 via-emerald-950 to-zinc-900 flex items-center justify-center p-3'>
      <div className='relative flex items-center justify-center w-full h-full'>
        <Image
          src={LOGO_URL}
          alt='Logo'
          width={logoWidth}
          height={logoHeight}
          className='object-contain filter drop-shadow-md brightness-110'
          unoptimized
        />
      </div>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const blog = await getArticleBySlug(slug)

  if (!blog) {
    return buildMetadata({
      title: 'Article not found',
      description: 'The requested article could not be found.',
      path: `/blog/${slug}`,
      type: 'website',
      noIndex: true,
    })
  }

  const description =
    blog.short_desc || blog.long_desc || 'Read this article on Blogify.'
  const image = blog.image || '/banner.jpg'

  return buildMetadata({
    title: blog.title,
    description,
    path: `/blog/${blog.slug}`,
    image,
    type: 'article',
    publishedTime: blog.createdAt,
    modifiedTime: blog.updatedAt,
    authors: blog.user?.name ? [blog.user.name] : [],
  })
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>
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

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: getAbsoluteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: getAbsoluteUrl('/blog'),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: blog.title,
            item: getAbsoluteUrl(`/blog/${blog.slug}`),
          },
        ],
      },
      {
        '@type': 'BlogPosting',
        headline: blog.title,
        description: blog.short_desc || blog.long_desc,
        image: blog.image
          ? getAbsoluteUrl(blog.image)
          : getAbsoluteUrl('/banner.jpg'),
        datePublished: blog.createdAt?.toISOString(),
        dateModified:
          blog.updatedAt?.toISOString() || blog.createdAt?.toISOString(),
        author: {
          '@type': 'Person',
          name: blog.user?.name || 'Blogify Author',
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: getAbsoluteUrl('/'),
          logo: getAbsoluteUrl('/images/logo.png'),
        },
        mainEntityOfPage: getAbsoluteUrl(`/blog/${blog.slug}`),
        url: getAbsoluteUrl(`/blog/${blog.slug}`),
      },
    ],
  }

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <ReadingProgress />

      <AnalyticsTracker articleId={blog.id} userId={user?.id} />

      <article className='bg-white min-h-screen text-zinc-950 antialiased selection:bg-emerald-500 selection:text-white py-10'>
        <header className='pt-10 pb-8 max-w-4xl mx-auto px-6 text-center'>
          {blog.category?.title && (
            <div className='inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-6'>
              <Sparkles size={13} className='text-emerald-600' />
              {blog.category.title}
            </div>
          )}

          <h1 className='text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-zinc-950 leading-[1.15] tracking-tight mb-6 max-w-4xl mx-auto'>
            {blog.title}
          </h1>

          {blog.short_desc && (
            <p className='text-lg md:text-xl font-serif text-zinc-700 max-w-2xl mx-auto mb-10 leading-relaxed font-normal'>
              {blog.short_desc}
            </p>
          )}

          <div className='max-w-2xl mx-auto bg-zinc-50 border border-zinc-200 rounded-2xl p-4 md:p-5 shadow-sm'>
            <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
              <div className='flex items-center gap-3.5'>
                <div className='w-12 h-12 rounded-full overflow-hidden relative bg-zinc-200 border-2 border-emerald-500 shrink-0 shadow-sm'>
                  {blog.user?.image ? (
                    <Image
                      src={blog.user.image}
                      alt={blog.user.name || 'Author'}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 via-emerald-950 to-zinc-900'>
                      <Image
                        src={LOGO_URL}
                        alt='Logo'
                        width={28}
                        height={28}
                        className='object-contain filter drop-shadow brightness-110'
                        unoptimized
                      />
                    </div>
                  )}
                </div>
                <div className='text-left'>
                  <p className='text-xs font-extrabold text-emerald-700 uppercase tracking-wider mb-0.5'>
                    Written By
                  </p>
                  <p className='text-base font-bold text-zinc-950 leading-tight'>
                    {blog.user?.name || 'Editorial Team'}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-4 text-xs font-bold text-zinc-800 border-t sm:border-t-0 sm:border-l border-zinc-200 pt-3 sm:pt-0 sm:pl-5 w-full sm:w-auto justify-center sm:justify-end'>
                <div className='flex items-center gap-1.5'>
                  <FiCalendar size={14} className='text-emerald-600' />
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <span className='h-3 w-px bg-zinc-300' />
                <div className='flex items-center gap-1.5 text-emerald-800'>
                  <FiClock size={14} className='text-emerald-600' />
                  <span>{blog.readTime || '5 min read'}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <nav className='max-w-5xl mx-auto px-6 py-8 text-xs font-semibold text-zinc-600 flex items-center gap-2'>
          <Link
            href='/blog'
            className='hover:text-emerald-600 transition-colors'
          >
            Articles
          </Link>
          <ChevronRight size={12} className='text-zinc-400' />
          <span className='text-zinc-900 font-bold truncate max-w-xs'>
            {blog.title}
          </span>
        </nav>

        <div className='max-w-5xl mx-auto px-6 mb-16'>
          <div className='relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-zinc-200 shadow-lg bg-zinc-900'>
            <ArticleImage
              src={blog.image}
              alt={blog.title}
              priority={true}
              logoWidth={220}
              logoHeight={80}
              className='object-cover'
            />
          </div>
        </div>

        <div className='max-w-6xl mx-auto px-6 pb-24'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
            <main className='lg:col-span-8'>
              <div
                className='
                  prose prose-lg md:prose-xl
                  prose-zinc prose-emerald
                  max-w-none
                  prose-headings:text-black prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight
                  prose-h1:text-black prose-h2:text-black prose-h3:text-black prose-h4:text-black
                  prose-p:leading-relaxed prose-p:font-normal prose-p:text-black
                  prose-a:no-underline hover:prose-a:underline prose-a:font-semibold prose-a:text-emerald-700
                  prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:py-2.5 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-serif
                  prose-img:rounded-2xl prose-img:border prose-img:border-zinc-200 prose-img:shadow-md
                  prose-code:text-emerald-800 prose-code:bg-emerald-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:font-mono
                  prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl prose-pre:shadow-lg
                  prose-li:marker:text-emerald-600
                '
                dangerouslySetInnerHTML={{ __html: blog.long_desc }}
              />

              <div className='mt-16 pt-8 border-t border-zinc-200'>
                <BlogInteraction articleId={blog.id} articleSlug={blog.slug} />
              </div>

              <section
                className='mt-20 pt-10 border-t border-zinc-200'
                id='reviews'
              >
                <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8'>
                  <div>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                      <span className='text-xs font-black text-emerald-700 uppercase tracking-widest'>
                        Community Feedback
                      </span>
                    </div>
                    <h3 className='text-2xl sm:text-3xl font-serif font-bold text-zinc-950'>
                      Reader Reviews ({reviews.length})
                    </h3>
                  </div>

                  {reviews.length > 0 && (
                    <div className='flex items-center gap-3 bg-emerald-50/80 border border-emerald-200/80 px-4 py-2 rounded-2xl w-fit'>
                      <div className='flex text-emerald-500'>
                        {[...Array(5)].map((_, i) => (
                          <AiFillStar key={i} size={16} />
                        ))}
                      </div>
                      <span className='text-xs font-bold text-emerald-950'>
                        {(
                          reviews.reduce(
                            (acc: number, r: any) => acc + r.rating,
                            0,
                          ) / reviews.length
                        ).toFixed(1)}{' '}
                        out of 5
                      </span>
                    </div>
                  )}
                </div>

                {reviews.length > 0 ? (
                  <div className='space-y-4'>
                    {reviews.slice(0, 3).map((review: any) => (
                      <div
                        key={review.id}
                        className='relative bg-gradient-to-b from-white to-zinc-50/50 border border-zinc-200/80 hover:border-emerald-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group'
                      >
                        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-zinc-100'>
                          <div className='flex items-center gap-3.5'>
                            <div className='w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0 shadow-xs'>
                              {review.name?.charAt(0).toUpperCase() || 'R'}
                            </div>
                            <div>
                              <div className='flex items-center gap-2'>
                                <h4 className='font-bold text-zinc-950 text-base leading-snug'>
                                  {review.name}
                                </h4>
                                <span className='inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60'>
                                  Verified Reader
                                </span>
                              </div>
                              <p className='text-[11px] text-zinc-500 font-medium'>
                                {new Date(review.createdAt).toLocaleDateString(
                                  'en-US',
                                  {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  },
                                )}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-center gap-1 bg-zinc-100/80 px-3 py-1 rounded-full w-fit'>
                            <div className='flex gap-0.5'>
                              {[...Array(5)].map((_, i) => (
                                <AiFillStar
                                  key={i}
                                  size={14}
                                  className={
                                    i < review.rating
                                      ? 'text-emerald-500'
                                      : 'text-zinc-200'
                                  }
                                />
                              ))}
                            </div>
                            <span className='text-xs font-bold text-zinc-700 ml-1'>
                              {review.rating}.0
                            </span>
                          </div>
                        </div>

                        <p className='text-zinc-800 font-serif italic text-base leading-relaxed pl-4 border-l-2 border-emerald-400 group-hover:border-emerald-600 transition-colors'>
                          &ldquo;{review.content}&rdquo;
                        </p>
                      </div>
                    ))}

                    {reviews.length > 3 && (
                      <ViewAllReviewsButton reviews={reviews} />
                    )}
                  </div>
                ) : (
                  <div className='p-10 rounded-2xl border border-dashed border-zinc-300 text-center bg-zinc-50/50 space-y-2'>
                    <p className='text-zinc-700 font-serif italic text-base'>
                      No reviews left for this article yet.
                    </p>
                    <p className='text-xs font-bold uppercase tracking-wider text-emerald-700'>
                      Be the first to share your thoughts below
                    </p>
                  </div>
                )}
              </section>
            </main>

            <aside className='lg:col-span-4 space-y-8'>
              {relatedPosts.length > 0 && (
                <div className='bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6'>
                  <h3 className='text-lg font-serif font-bold text-zinc-950 border-b border-zinc-200 pb-3'>
                    Recommended Reads
                  </h3>
                  <div className='space-y-5'>
                    {relatedPosts.slice(0, 3).map((post: any) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className='group flex gap-3.5 items-center'
                      >
                        <div className='w-20 h-20 relative rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-200'>
                          <ArticleImage
                            src={post.image}
                            alt={post.title}
                            logoWidth={65}
                            logoHeight={25}
                            className='object-cover group-hover:scale-105 transition-transform duration-300'
                          />
                        </div>
                        <div className='space-y-1 overflow-hidden'>
                          <span className='text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block'>
                            {post.category?.title || 'Article'}
                          </span>
                          <h4 className='font-serif font-bold text-sm text-zinc-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug'>
                            {post.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className='p-6 bg-zinc-50 rounded-2xl border border-zinc-200 sticky top-28 shadow-sm space-y-6'>
                <div>
                  <h4 className='text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-3'>
                    Audio Reader
                  </h4>
                  <ReadAloud text={blog.long_desc} />
                </div>

                <div className='pt-6 border-t border-zinc-200'>
                  <h4 className='text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-3'>
                    Actions & Sharing
                  </h4>
                  <InteractionRail articleId={blog.id} />
                </div>
              </div>
            </aside>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <section className='bg-zinc-50 border-t border-zinc-200 py-20'>
            <div className='max-w-6xl mx-auto px-6'>
              <div className='flex items-end justify-between mb-12'>
                <div>
                  <span className='text-xs font-extrabold uppercase tracking-widest text-emerald-700 block mb-2'>
                    Extended Archive
                  </span>
                  <h2 className='text-3xl font-serif font-extrabold text-zinc-950'>
                    Further Articles
                  </h2>
                </div>
                <Link
                  href='/blog'
                  className='hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-emerald-700 transition-colors'
                >
                  View All <FiArrowRight size={14} />
                </Link>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {relatedPosts.slice(0, 3).map((post: any) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className='group bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-zinc-300 transition-all duration-300 flex flex-col'
                  >
                    <div className='aspect-video relative overflow-hidden bg-zinc-900'>
                      <ArticleImage
                        src={post.image}
                        alt={post.title}
                        logoWidth={110}
                        logoHeight={40}
                        className='object-cover group-hover:scale-105 transition-transform duration-500'
                      />
                    </div>
                    <div className='p-6 flex flex-col flex-grow justify-between space-y-4'>
                      <div>
                        <span className='text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-2'>
                          {post.category?.title || 'Article'}
                        </span>
                        <h3 className='text-lg font-serif font-bold text-zinc-950 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug'>
                          {post.title}
                        </h3>
                      </div>
                      <span className='inline-flex items-center text-xs font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors pt-3 border-t border-zinc-100'>
                        Read Article{' '}
                        <ChevronRight
                          size={14}
                          className='ml-1 group-hover:translate-x-1 transition-transform'
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  )
}
