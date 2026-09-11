import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import FollowButtonClient from '@/components/FollowButtonClient'

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Heart,
  MessageCircle,
  PenLine,
  Share2,
  Sparkles,
  UserPlus,
} from 'lucide-react'

import {
  getArticleBySlug,
  getRelatedPosts,
  getCurrentUser,
  isArticleLikedByUser,
  isFollowingUser,
} from '@/utils/actions'

import InteractionRail from '@/components/InteractionRail'
import ReadAloud from '@/components/ReadAloud'
import BlogInteraction from '@/components/BlogInteraction'
import ReadingProgress from '@/components/ReadingProgress'
import ViewAllReviewsButton from '@/components/ViewAllReviews'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import JsonLd from '@/components/JsonLd'

import { buildMetadata, getAbsoluteUrl, SITE_NAME } from '@/utils/seo'
import ReadingMode from '@/components/ReadingMode'

const FALLBACK_IMAGE = '/banner.jpg'

const LOGO_URL =
  'https://www.ewhamza.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo2.0d308b88.webp&w=1920&q=75'

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatFullDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || 'E'
}

function ArticleImage({
  src,
  alt,
  className = '',
  priority = false,
}: {
  src?: string | null
  alt: string
  className?: string
  priority?: boolean
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={className}
      />
    )
  }

  return (
    <div className='absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#211b59] via-[#3d348b] to-[#7678ed]'>
      <div className='absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl' />
      <div className='absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#f7b801]/20 blur-3xl' />

      <div className='relative flex h-full w-full items-center justify-center'>
        <Image
          src={LOGO_URL}
          alt='Education With Hamza'
          width={220}
          height={80}
          className='object-contain brightness-110 drop-shadow-xl'
          unoptimized
        />
      </div>
    </div>
  )
}

function AuthorAvatar({
  image,
  name,
  size = 'md',
}: {
  image?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: 'h-9 w-9',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  }

  if (image) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full bg-gray-100 ${sizes[size]}`}
      >
        <Image
          src={image}
          alt={name || 'Author'}
          fill
          className='object-cover'
        />
      </div>
    )
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#3d348b] font-bold text-white ${sizes[size]} ${textSizes[size]}`}
    >
      {getInitial(name)}
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const article = await getArticleBySlug(slug)

  if (!article) {
    return buildMetadata({
      title: 'Article not found',
      description: 'The requested article could not be found.',
      path: `/articles/${slug}`,
      type: 'website',
      noIndex: true,
    })
  }

  const description =
    article.short_desc ||
    article.long_desc ||
    `Read ${article.title} on Education With Hamza.`

  const image = article.image || FALLBACK_IMAGE

  return buildMetadata({
    title: article.title,
    description,
    path: `/articles/${article.slug}`,
    image,
    type: 'article',
    publishedTime: article.createdAt,
    modifiedTime: article.updatedAt,
    authors: article.user?.name ? [article.user.name] : [],
  })
}

export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [article, currentUser] = await Promise.all([
    getArticleBySlug(slug),
    getCurrentUser(),
  ])

  if (!article) {
    notFound()
  }

  const [relatedPosts, isLikedInitial, isFollowingInitial] = await Promise.all([
    getRelatedPosts(article.category?.id, article.id),
    isArticleLikedByUser(article.id),
    article.user?.id && currentUser?.id
      ? isFollowingUser(article.user.id)
      : false,
  ])

  const reviews = article.reviews || []

  const authorId = article.user?.id

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
            name: 'Articles',
            item: getAbsoluteUrl('/latest'),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: getAbsoluteUrl(`/articles/${article.slug}`),
          },
        ],
      },

      {
        '@type': 'BlogPosting',

        headline: article.title,

        description: article.short_desc || article.long_desc || article.title,

        image: article.image
          ? getAbsoluteUrl(article.image)
          : getAbsoluteUrl(FALLBACK_IMAGE),

        datePublished: article.createdAt?.toISOString(),

        dateModified:
          article.updatedAt?.toISOString() || article.createdAt?.toISOString(),

        author: {
          '@type': 'Person',
          name: article.user?.name || 'Education With Hamza Writer',
          ...(authorId
            ? {
                url: getAbsoluteUrl(`/profile/${authorId}`),
              }
            : {}),
        },

        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: getAbsoluteUrl('/'),
          logo: {
            '@type': 'ImageObject',
            url: getAbsoluteUrl('/images/logo.png'),
          },
        },

        mainEntityOfPage: getAbsoluteUrl(`/articles/${article.slug}`),

        url: getAbsoluteUrl(`/articles/${article.slug}`),
      },
    ],
  }

  return (
    <>
      <JsonLd data={articleJsonLd} />

      <ReadingProgress />

      <AnalyticsTracker articleId={article.id} userId={currentUser?.id} />

      <article className='min-h-screen bg-[#f8f9fc] text-gray-950'>
        <header className='border-b border-gray-200 bg-white'>
          <div className='mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14'>
            <Link
              href='/latest'
              className='mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-[#3d348b]'
            >
              <ArrowLeft className='h-4 w-4' />
              Back to articles
            </Link>

            <div className='mb-5 flex flex-wrap items-center gap-2'>
              {article.category?.title && (
                <span className='inline-flex items-center gap-1.5 rounded-full bg-[#3d348b]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#3d348b]'>
                  <Sparkles className='h-3.5 w-3.5' />
                  {article.category.title}
                </span>
              )}

              {article.featured && (
                <span className='inline-flex items-center gap-1.5 rounded-full bg-[#f7b801]/15 px-3 py-1.5 text-[11px] font-bold text-[#9a6800]'>
                  <Sparkles className='h-3.5 w-3.5' />
                  Featured
                </span>
              )}
            </div>

            <h1
              className='
        max-w-4xl
        text-3xl
        font-black
        leading-[1.1]
        tracking-tight
        text-gray-950
        sm:text-5xl
        lg:text-6xl
      '
            >
              {article.title}
            </h1>

            {article.short_desc && (
              <p
                className='
          mt-5
          max-w-3xl
          text-base
          leading-7
          text-gray-500
          sm:mt-6
          sm:text-lg
          sm:leading-8
        '
              >
                {article.short_desc}
              </p>
            )}

            <div className='mt-7 flex flex-col gap-5 sm:mt-8 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-3'>
                {authorId ? (
                  <Link href={`/profile/${authorId}`} className='shrink-0'>
                    <AuthorAvatar
                      image={article.user?.image}
                      name={article.user?.name}
                      size='md'
                    />
                  </Link>
                ) : (
                  <AuthorAvatar
                    image={article.user?.image}
                    name={article.user?.name}
                    size='md'
                  />
                )}

                <div className='min-w-0'>
                  {authorId ? (
                    <Link
                      href={`/profile/${authorId}`}
                      className='block truncate text-sm font-bold text-gray-950 transition-colors hover:text-[#3d348b]'
                    >
                      {article.user?.name || 'Education With Hamza'}
                    </Link>
                  ) : (
                    <p className='truncate text-sm font-bold text-gray-950'>
                      {article.user?.name || 'Education With Hamza'}
                    </p>
                  )}

                  <div className='mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400'>
                    <span>{formatDate(article.createdAt)}</span>
                    <span>•</span>

                    {article.readTime ? (
                      <span>{article.readTime} min read</span>
                    ) : (
                      <span>Article</span>
                    )}
                  </div>
                </div>
              </div>

              {authorId && currentUser?.id && currentUser.id !== authorId && (
                <FollowButton
                  authorId={authorId}
                  initialFollowing={isFollowingInitial}
                />
              )}
            </div>

            <div
              className='
        mt-7
        flex
        flex-wrap
        items-center
        gap-3
        border-t
        border-gray-100
        pt-6
      '
            >
              {reviews.length > 0 && (
                <a
                  href='#reviews'
                  className='
            inline-flex
            items-center
            gap-1.5
            rounded-lg
            border
            border-[#f7b801]/20
            bg-[#f7b801]/10
            px-2.5
            py-1.5
            transition-all
            hover:bg-[#f7b801]/20
            hover:shadow-sm
          '
                  aria-label='View reviews'
                >
                  <div className='flex text-xs leading-none text-[#f18701]'>
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>

                  <span className='text-xs font-bold text-gray-800'>
                    {(
                      reviews.reduce(
                        (total: number, review: any) => total + review.rating,
                        0,
                      ) / reviews.length
                    ).toFixed(1)}
                  </span>

                  <span className='text-[11px] text-gray-400'>
                    ({reviews.length})
                  </span>
                </a>
              )}

              {article.long_desc && (
                <ReadingMode
                  longDesc={article.long_desc}
                  title={article.title}
                />
              )}
            </div>
          </div>
        </header>

        <div className='mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12'>
          <div className='relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 shadow-xl shadow-gray-900/5 sm:rounded-3xl'>
            <ArticleImage
              src={article.image}
              alt={article.title}
              priority
              className='object-cover'
            />
          </div>
        </div>

        <div className='mx-auto max-w-6xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28'>
          <div className='grid grid-cols-1 gap-12 lg:grid-cols-12'>
            <main className='min-w-0 lg:col-span-8'>
              <div className='mb-10 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-6 text-sm text-gray-500'>
                <div className='flex items-center gap-2'>
                  <CalendarDays className='h-4 w-4 text-[#7678ed]' />

                  <span>Published {formatFullDate(article.createdAt)}</span>
                </div>

                {article.readTime && (
                  <div className='flex items-center gap-2'>
                    <Clock3 className='h-4 w-4 text-[#7678ed]' />

                    <span>{article.readTime} min read</span>
                  </div>
                )}
              </div>

              <div
                className='
                  prose
                  prose-lg
                  max-w-none
                  text-gray-800

                  prose-headings:font-black
                  prose-headings:tracking-tight
                  prose-headings:text-gray-950

                  prose-h1:text-4xl
                  prose-h2:mt-12
                  prose-h2:text-3xl
                  prose-h3:mt-10
                  prose-h3:text-2xl
                  prose-h4:text-xl

                  prose-p:leading-8
                  prose-p:text-gray-700

                  prose-a:font-semibold
                  prose-a:text-[#3d348b]
                  prose-a:no-underline
                  hover:prose-a:underline

                  prose-strong:text-gray-950

                  prose-blockquote:border-l-4
                  prose-blockquote:border-[#7678ed]
                  prose-blockquote:bg-[#3d348b]/5
                  prose-blockquote:px-6
                  prose-blockquote:py-3
                  prose-blockquote:rounded-r-xl
                  prose-blockquote:text-gray-700

                  prose-img:rounded-2xl
                  prose-img:border
                  prose-img:border-gray-200
                  prose-img:shadow-lg

                  prose-code:rounded
                  prose-code:bg-[#3d348b]/10
                  prose-code:px-1.5
                  prose-code:py-0.5
                  prose-code:text-[#3d348b]
                  prose-code:before:content-none
                  prose-code:after:content-none

                  prose-pre:rounded-2xl
                  prose-pre:bg-gray-950
                  prose-pre:border
                  prose-pre:border-gray-800

                  prose-li:marker:text-[#7678ed]
                '
                dangerouslySetInnerHTML={{
                  __html: article.long_desc,
                }}
              />

              {article.topics?.length > 0 && (
                <div className='mt-12 border-t border-gray-200 pt-8'>
                  <div className='flex flex-wrap gap-2'>
                    {article.topics.map(({ topic }) => (
                      <Link
                        key={topic.id}
                        href={`/topics/${topic.slug}`}
                        className='rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 transition hover:border-[#7678ed]/30 hover:bg-[#3d348b]/5 hover:text-[#3d348b]'
                      >
                        {topic.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className='mt-12 border-t border-gray-200 pt-8'>
                <BlogInteraction
                  articleId={article.id}
                  articleSlug={article.slug}
                />
              </div>

              {article.user && (
                <section className='mt-14 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8'>
                  <div className='flex flex-col gap-6 sm:flex-row sm:items-center'>
                    {authorId ? (
                      <Link href={`/profile/${authorId}`}>
                        <AuthorAvatar
                          image={article.user.image}
                          name={article.user.name}
                          size='lg'
                        />
                      </Link>
                    ) : (
                      <AuthorAvatar
                        image={article.user.image}
                        name={article.user.name}
                        size='lg'
                      />
                    )}

                    <div className='flex-1'>
                      <p className='text-xs font-bold uppercase tracking-widest text-[#7678ed]'>
                        Written by
                      </p>

                      {authorId ? (
                        <Link
                          href={`/profile/${authorId}`}
                          className='mt-1 block text-xl font-black text-gray-950 transition hover:text-[#3d348b]'
                        >
                          {article.user.name}
                        </Link>
                      ) : (
                        <h3 className='mt-1 text-xl font-black text-gray-950'>
                          {article.user.name}
                        </h3>
                      )}

                      <p className='mt-2 max-w-xl text-sm leading-6 text-gray-500'>
                        Explore more articles from this writer and follow them
                        to see their latest work in your feed.
                      </p>
                    </div>

                    {authorId &&
                      currentUser?.id &&
                      currentUser.id !== authorId && (
                        <FollowButton
                          authorId={authorId}
                          initialFollowing={isFollowingInitial}
                        />
                      )}
                  </div>
                </section>
              )}

              <section
                className='mt-16 border-t border-gray-200 pt-10'
                id='reviews'
              >
                <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
                  <div>
                    <div className='mb-2 flex items-center gap-2'>
                      <MessageCircle className='h-4 w-4 text-[#7678ed]' />

                      <span className='text-xs font-bold uppercase tracking-widest text-[#3d348b]'>
                        Community feedback
                      </span>
                    </div>

                    <h2 className='text-2xl font-black tracking-tight text-gray-950 sm:text-3xl'>
                      Reader Reviews
                    </h2>

                    <p className='mt-1 text-sm text-gray-500'>
                      {reviews.length}{' '}
                      {reviews.length === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>

                  {reviews.length > 0 && (
                    <div className='flex items-center gap-2 rounded-xl bg-[#f7b801]/10 px-4 py-2.5'>
                      <div className='flex text-[#f18701]'>
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>

                      <span className='text-sm font-bold text-gray-800'>
                        {(
                          reviews.reduce(
                            (total: number, review: any) =>
                              total + review.rating,
                            0,
                          ) / reviews.length
                        ).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {reviews.length > 0 ? (
                  <div className='mt-8 space-y-4'>
                    {reviews.slice(0, 3).map((review: any) => (
                      <div
                        key={review.id}
                        className='rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-[#7678ed]/30 hover:shadow-md'
                      >
                        <div className='flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center'>
                          <div className='flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#3d348b]/10 text-sm font-bold text-[#3d348b]'>
                              {getInitial(review.name)}
                            </div>

                            <div>
                              <div className='flex flex-wrap items-center gap-2'>
                                <h3 className='text-sm font-bold text-gray-950'>
                                  {review.name}
                                </h3>

                                <span className='inline-flex items-center gap-1 rounded-full bg-[#3d348b]/5 px-2 py-0.5 text-[10px] font-bold text-[#3d348b]'>
                                  <CheckCircle2 className='h-3 w-3' />
                                  Reader
                                </span>
                              </div>

                              <p className='mt-0.5 text-[11px] text-gray-400'>
                                {formatDate(review.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1.5'>
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={
                                  i < review.rating
                                    ? 'text-[#f18701]'
                                    : 'text-gray-200'
                                }
                              >
                                ★
                              </span>
                            ))}

                            <span className='ml-1 text-xs font-bold text-gray-700'>
                              {review.rating}.0
                            </span>
                          </div>
                        </div>

                        <p className='mt-5 border-l-2 border-[#7678ed] pl-4 text-sm leading-7 text-gray-600'>
                          &ldquo;{review.content}&rdquo;
                        </p>
                      </div>
                    ))}

                    {reviews.length > 3 && (
                      <div className='pt-2'>
                        <ViewAllReviewsButton reviews={reviews} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center'>
                    <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#3d348b]/10'>
                      <MessageCircle className='h-5 w-5 text-[#3d348b]' />
                    </div>

                    <h3 className='mt-4 font-bold text-gray-900'>
                      No reviews yet
                    </h3>

                    <p className='mt-2 text-sm text-gray-500'>
                      Be the first reader to share your thoughts.
                    </p>
                  </div>
                )}
              </section>
            </main>

            <aside className='lg:col-span-4'>
              <div className='space-y-6 lg:sticky lg:top-24'>
                <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#3d348b]/10'>
                      <Sparkles className='h-4 w-4 text-[#3d348b]' />
                    </div>

                    <div>
                      <h3 className='text-sm font-bold text-gray-950'>
                        Listen to this article
                      </h3>

                      <p className='mt-0.5 text-xs text-gray-400'>
                        Audio reader
                      </p>
                    </div>
                  </div>

                  <div className='mt-5'>
                    <ReadAloud text={article.long_desc} />
                  </div>
                </div>

                <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
                  <div className='mb-4 flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#7678ed]/10'>
                      <Share2 className='h-4 w-4 text-[#3d348b]' />
                    </div>

                    <div>
                      <h3 className='text-sm font-bold text-gray-950'>
                        Article actions
                      </h3>

                      <p className='mt-0.5 text-xs text-gray-400'>
                        Like and share
                      </p>
                    </div>
                  </div>

                  <InteractionRail articleId={article.id} />
                </div>

                {relatedPosts.length > 0 && (
                  <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
                    <div className='mb-5 flex items-center justify-between'>
                      <h3 className='text-base font-black text-gray-950'>
                        Recommended
                      </h3>

                      <BookOpen className='h-4 w-4 text-[#7678ed]' />
                    </div>

                    <div className='space-y-5'>
                      {relatedPosts.slice(0, 3).map((post: any) => (
                        <Link
                          key={post.id}
                          href={`/articles/${post.slug}`}
                          className='group flex gap-3.5'
                        >
                          <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100'>
                            <ArticleImage
                              src={post.image}
                              alt={post.title}
                              className='object-cover transition duration-300 group-hover:scale-105'
                            />
                          </div>

                          <div className='min-w-0'>
                            <span className='text-[10px] font-bold uppercase tracking-wider text-[#7678ed]'>
                              {post.category?.title || 'Article'}
                            </span>

                            <h4 className='mt-1 line-clamp-3 text-sm font-bold leading-5 text-gray-900 transition group-hover:text-[#3d348b]'>
                              {post.title}
                            </h4>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <section className='border-t border-gray-200 bg-white'>
            <div className='mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:px-10'>
              <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
                <div>
                  <p className='text-xs font-bold uppercase tracking-widest text-[#7678ed]'>
                    Keep reading
                  </p>

                  <h2 className='mt-2 text-3xl font-black tracking-tight text-gray-950'>
                    You might also like
                  </h2>
                </div>

                <Link
                  href='/latest'
                  className='inline-flex items-center gap-2 text-sm font-bold text-[#3d348b]'
                >
                  View all articles
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </div>

              <div className='mt-10 grid gap-5 md:grid-cols-3'>
                {relatedPosts.slice(0, 3).map((post: any) => (
                  <Link
                    key={post.id}
                    href={`/articles/${post.slug}`}
                    className='group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#7678ed]/30 hover:shadow-xl hover:shadow-[#3d348b]/5'
                  >
                    <div className='relative aspect-video overflow-hidden bg-gray-900'>
                      <ArticleImage
                        src={post.image}
                        alt={post.title}
                        className='object-cover transition duration-500 group-hover:scale-105'
                      />
                    </div>

                    <div className='p-6'>
                      <div className='flex items-center gap-2'>
                        <span className='rounded-full bg-[#3d348b]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#3d348b]'>
                          {post.category?.title || 'Article'}
                        </span>
                      </div>

                      <h3 className='mt-4 line-clamp-2 text-lg font-bold leading-snug text-gray-950 transition group-hover:text-[#3d348b]'>
                        {post.title}
                      </h3>

                      {post.short_desc && (
                        <p className='mt-2 line-clamp-2 text-sm leading-6 text-gray-500'>
                          {post.short_desc}
                        </p>
                      )}

                      <div className='mt-5 flex items-center justify-between border-t border-gray-100 pt-4'>
                        <div className='flex items-center gap-2'>
                          <AuthorAvatar
                            image={post.user?.image}
                            name={post.user?.name}
                            size='sm'
                          />

                          <span className='max-w-[120px] truncate text-xs font-semibold text-gray-600'>
                            {post.user?.name || 'Writer'}
                          </span>
                        </div>

                        <ChevronRight className='h-4 w-4 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#3d348b]' />
                      </div>
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

async function FollowButton({
  authorId,
  initialFollowing,
}: {
  authorId: string
  initialFollowing: boolean
}) {
  return (
    <FollowButtonClient
      authorId={authorId}
      initialFollowing={initialFollowing}
    />
  )
}
