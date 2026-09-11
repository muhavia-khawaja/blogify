import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  FileText,
  Heart,
  MessageCircle,
  PenLine,
  Users,
} from 'lucide-react'

import {
  getCurrentUser,
  getPublicProfile,
  isFollowingUser,
} from '@/utils/actions'

import FollowButtonClient from '@/components/FollowButtonClient'

import { buildMetadata, getAbsoluteUrl } from '@/utils/seo'

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatJoinedDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || 'E'
}

function formatReadTime(readTime: unknown) {
  if (!readTime) return null

  const value = String(readTime)

  if (
    value.toLowerCase().includes('min') ||
    value.toLowerCase().includes('read')
  ) {
    return value
  }

  return `${value} min read`
}

function AuthorAvatar({
  image,
  name,
  size = 'lg',
}: {
  image?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-28 w-28 sm:h-32 sm:w-32',
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-4xl sm:text-5xl',
  }

  if (image) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-xl ${sizes[size]}`}
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
      className={`flex shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#3d348b] to-[#7678ed] font-black text-white shadow-xl ${sizes[size]} ${textSizes[size]}`}
    >
      {getInitial(name)}
    </div>
  )
}

function ArticleImage({ src, alt }: { src?: string | null; alt: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className='object-cover transition duration-500 group-hover:scale-105'
      />
    )
  }

  return (
    <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#3d348b] to-[#7678ed]'>
      <BookOpen className='h-12 w-12 text-white/80' />
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  const profile = await getPublicProfile(id)

  if (!profile) {
    return buildMetadata({
      title: 'Writer not found',
      description: 'This writer profile could not be found.',
      path: `/profile/${id}`,
      type: 'website',
      noIndex: true,
    })
  }

  const articleCount = profile.articles.length

  return buildMetadata({
    title: `${profile.name} | Education With Hamza`,
    description:
      `${profile.name} has published ${articleCount} ` +
      `${articleCount === 1 ? 'article' : 'articles'} on Education With Hamza.`,
    path: `/profile/${profile.id}`,
  })
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [profile, currentUser] = await Promise.all([
    getPublicProfile(id),
    getCurrentUser(),
  ])

  if (!profile) {
    notFound()
  }

  const isOwnProfile = currentUser?.id === profile.id

  const isFollowing =
    currentUser?.id && !isOwnProfile ? await isFollowingUser(profile.id) : false

  const articles = profile.articles

  const totalLikes = articles.reduce(
    (total, article) => total + article._count.likes,
    0,
  )

  const totalReviews = articles.reduce(
    (total, article) => total + article._count.reviews,
    0,
  )

  const profileJsonLd = {
    '@context': 'https://schema.org',

    '@type': 'ProfilePage',

    mainEntity: {
      '@type': 'Person',

      name: profile.name,

      ...(profile.image
        ? {
            image: profile.image,
          }
        : {}),

      url: getAbsoluteUrl(`/profile/${profile.id}`),
    },

    url: getAbsoluteUrl(`/profile/${profile.id}`),
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profileJsonLd),
        }}
      />

      <main className='min-h-screen bg-[#f8f9fc]'>
        <section className='border-b border-gray-200 bg-white'>
          <div className='mx-auto max-w-6xl px-5 pb-10 pt-8 sm:px-8 lg:px-10'>
            {/* Back */}

            <Link
              href='/latest'
              className='mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#3d348b]'
            >
              <ArrowLeft className='h-4 w-4' />
              Back to articles
            </Link>

            {/* Profile */}

            <div className='flex flex-col gap-8 sm:flex-row sm:items-center'>
              <AuthorAvatar
                image={profile.image}
                name={profile.name}
                size='lg'
              />

              <div className='flex-1'>
                <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
                  <div>
                    <div className='flex flex-wrap items-center gap-2'>
                      <h1 className='text-3xl font-black tracking-tight text-gray-950 sm:text-4xl'>
                        {profile.name}
                      </h1>

                      <span className='inline-flex items-center gap-1 rounded-full bg-[#3d348b]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#3d348b]'>
                        <Check className='h-3 w-3' />
                        Writer
                      </span>
                    </div>

                    <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base'>
                      Sharing useful ideas, educational content, knowledge, and
                      stories with the Education With Hamza community.
                    </p>

                    <div className='mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-400'>
                      <span className='flex items-center gap-1.5'>
                        <CalendarDays className='h-3.5 w-3.5' />
                        Joined {formatJoinedDate(profile.createdAt)}
                      </span>

                      <span className='flex items-center gap-1.5'>
                        <FileText className='h-3.5 w-3.5' />
                        {profile._count.articles}{' '}
                        {profile._count.articles === 1 ? 'article' : 'articles'}
                      </span>
                    </div>
                  </div>

                  {/* ACTION */}

                  <div className='shrink-0'>
                    {isOwnProfile ? (
                      <Link
                        href='/profile'
                        className='inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-[#7678ed]/40 hover:text-[#3d348b]'
                      >
                        <PenLine className='h-4 w-4' />
                        Edit profile
                      </Link>
                    ) : currentUser?.id ? (
                      <FollowButtonClient
                        authorId={profile.id}
                        initialFollowing={isFollowing}
                      />
                    ) : (
                      <Link
                        href='/login'
                        className='inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#3d348b]/20 transition hover:bg-[#30286f]'
                      >
                        <Users className='h-4 w-4' />
                        Follow
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* STATS */}

            <div className='mt-10 grid grid-cols-2 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 sm:grid-cols-4'>
              <ProfileStat
                icon={<FileText className='h-4 w-4' />}
                label='Articles'
                value={profile._count.articles}
              />

              <ProfileStat
                icon={<Users className='h-4 w-4' />}
                label='Followers'
                value={profile._count.followers}
              />

              <ProfileStat
                icon={<Users className='h-4 w-4' />}
                label='Following'
                value={profile._count.following}
              />

              <ProfileStat
                icon={<Heart className='h-4 w-4' />}
                label='Likes received'
                value={totalLikes}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            CONTENT
        ==================================================== */}

        <section className='mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16'>
          <div className='grid grid-cols-1 gap-10 lg:grid-cols-12'>
            <div className='lg:col-span-8'>
              <div className='flex flex-col justify-between gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-end'>
                <div>
                  <p className='text-xs font-bold uppercase tracking-widest text-[#7678ed]'>
                    Writer&apos;s library
                  </p>

                  <h2 className='mt-2 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl'>
                    Articles by {profile.name}
                  </h2>
                </div>

                <span className='text-sm text-gray-400'>
                  {articles.length} published
                </span>
              </div>

              {articles.length > 0 ? (
                <div className='mt-7 space-y-5'>
                  {articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      className='group block overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-[#7678ed]/30 hover:shadow-xl hover:shadow-[#3d348b]/5'
                    >
                      <div className='flex flex-col sm:flex-row'>
                        {/* IMAGE */}

                        <div className='relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-gray-100 sm:aspect-auto sm:h-auto sm:w-52'>
                          <ArticleImage
                            src={article.image}
                            alt={article.title}
                          />
                        </div>

                        {/* CONTENT */}

                        <div className='min-w-0 flex-1 p-5 sm:p-6'>
                          {/* CATEGORY */}

                          <div className='flex flex-wrap items-center gap-2'>
                            {article.category?.title && (
                              <span className='rounded-full bg-[#3d348b]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#3d348b]'>
                                {article.category.title}
                              </span>
                            )}

                            {article.featured && (
                              <span className='rounded-full bg-[#f7b801]/15 px-2.5 py-1 text-[10px] font-bold text-[#9a6800]'>
                                Featured
                              </span>
                            )}
                          </div>

                          {/* TITLE */}

                          <h3 className='mt-3 line-clamp-2 text-xl font-black leading-snug tracking-tight text-gray-950 transition group-hover:text-[#3d348b]'>
                            {article.title}
                          </h3>

                          {/* DESCRIPTION */}

                          {article.short_desc && (
                            <p className='mt-2 line-clamp-2 text-sm leading-6 text-gray-500'>
                              {article.short_desc}
                            </p>
                          )}

                          {/* TOPICS */}

                          {article.topics.length > 0 && (
                            <div className='mt-4 flex flex-wrap gap-1.5'>
                              {article.topics.slice(0, 3).map(({ topic }) => (
                                <span
                                  key={topic.id}
                                  className='rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-semibold text-gray-500'
                                >
                                  {topic.name}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* META */}

                          <div className='mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4'>
                            <div className='flex flex-wrap items-center gap-3 text-xs text-gray-400'>
                              <span className='flex items-center gap-1.5'>
                                <CalendarDays className='h-3.5 w-3.5' />

                                {formatDate(article.createdAt)}
                              </span>

                              {article.readTime && (
                                <span className='flex items-center gap-1.5'>
                                  <Clock3 className='h-3.5 w-3.5' />

                                  {formatReadTime(article.readTime)}
                                </span>
                              )}
                            </div>

                            <div className='flex items-center gap-3 text-xs text-gray-400'>
                              <span className='flex items-center gap-1'>
                                <Heart className='h-3.5 w-3.5' />

                                {article._count.likes}
                              </span>

                              <span className='flex items-center gap-1'>
                                <MessageCircle className='h-3.5 w-3.5' />

                                {article._count.reviews}
                              </span>

                              <ArrowRight className='h-4 w-4 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#3d348b]' />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className='mt-7 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center'>
                  <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3d348b]/10'>
                    <PenLine className='h-6 w-6 text-[#3d348b]' />
                  </div>

                  <h3 className='mt-5 text-lg font-bold text-gray-950'>
                    No published articles yet
                  </h3>

                  <p className='mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500'>
                    This writer hasn&apos;t published an article yet.
                  </p>
                </div>
              )}
            </div>

            <aside className='lg:col-span-4'>
              <div className='space-y-5 lg:sticky lg:top-24'>
                <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#3d348b]/10'>
                      <BookOpen className='h-4 w-4 text-[#3d348b]' />
                    </div>

                    <div>
                      <h3 className='text-sm font-black text-gray-950'>
                        About this writer
                      </h3>

                      <p className='text-xs text-gray-400'>
                        Education With Hamza
                      </p>
                    </div>
                  </div>

                  <p className='mt-5 text-sm leading-7 text-gray-500'>
                    Follow {profile.name} to keep up with their latest articles
                    and see their work in your personalized feed.
                  </p>

                  {!isOwnProfile && (
                    <div className='mt-5'>
                      {currentUser?.id ? (
                        <FollowButtonClient
                          authorId={profile.id}
                          initialFollowing={isFollowing}
                        />
                      ) : (
                        <Link
                          href='/login'
                          className='flex w-full items-center justify-center gap-2 rounded-xl bg-[#3d348b] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#30286f]'
                        >
                          <Users className='h-4 w-4' />
                          Follow {profile.name}
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* PROFILE STATS */}

                <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
                  <h3 className='text-sm font-black text-gray-950'>
                    At a glance
                  </h3>

                  <div className='mt-5 space-y-4'>
                    <MiniStat
                      icon={<FileText className='h-4 w-4' />}
                      label='Published articles'
                      value={profile._count.articles}
                    />

                    <MiniStat
                      icon={<Users className='h-4 w-4' />}
                      label='Followers'
                      value={profile._count.followers}
                    />

                    <MiniStat
                      icon={<Heart className='h-4 w-4' />}
                      label='Likes received'
                      value={totalLikes}
                    />

                    <MiniStat
                      icon={<MessageCircle className='h-4 w-4' />}
                      label='Reader reviews'
                      value={totalReviews}
                    />
                  </div>
                </div>

                {/* WRITE CTA */}

                {isOwnProfile && (
                  <div className='overflow-hidden rounded-2xl bg-gradient-to-br from-[#3d348b] to-[#7678ed] p-6 text-white shadow-lg shadow-[#3d348b]/20'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-white/15'>
                      <PenLine className='h-5 w-5' />
                    </div>

                    <h3 className='mt-5 text-lg font-black'>
                      Share something useful
                    </h3>

                    <p className='mt-2 text-sm leading-6 text-white/75'>
                      Write your next article and share your knowledge with the
                      EWH community.
                    </p>

                    <Link
                      href='/write'
                      className='mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#3d348b] transition hover:bg-gray-100'
                    >
                      Write article
                      <ArrowRight className='h-4 w-4' />
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>

        {/* ===================================================
            BOTTOM CTA
        ==================================================== */}

        <section className='border-t border-gray-200 bg-white'>
          <div className='mx-auto max-w-6xl px-5 py-14 text-center sm:px-8 lg:px-10'>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3d348b]/10'>
              <BookOpen className='h-5 w-5 text-[#3d348b]' />
            </div>

            <h2 className='mt-5 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl'>
              Discover more on Education With Hamza
            </h2>

            <p className='mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500'>
              Explore educational articles, useful resources, topics, and ideas
              from writers in the EWH community.
            </p>

            <div className='mt-6 flex flex-wrap justify-center gap-3'>
              <Link
                href='/latest'
                className='inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#3d348b]/20 transition hover:bg-[#30286f]'
              >
                Explore articles
                <ArrowRight className='h-4 w-4' />
              </Link>

              <Link
                href='/topics'
                className='inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-[#7678ed]/40 hover:text-[#3d348b]'
              >
                Explore topics
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

/* =========================================================
   PROFILE STAT
========================================================= */

function ProfileStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className='border-b border-gray-200 px-5 py-5 sm:border-b-0 sm:border-r last:border-r-0'>
      <div className='flex items-center gap-2 text-gray-400'>
        {icon}

        <span className='text-xs font-semibold'>{label}</span>
      </div>

      <p className='mt-2 text-2xl font-black tracking-tight text-gray-950'>
        {value.toLocaleString()}
      </p>
    </div>
  )
}

/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-[#3d348b]/10 text-[#3d348b]'>
          {icon}
        </div>

        <span className='text-sm text-gray-500'>{label}</span>
      </div>

      <span className='text-sm font-black text-gray-950'>
        {value.toLocaleString()}
      </span>
    </div>
  )
}
