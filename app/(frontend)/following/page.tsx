import Link from 'next/link'
import {
  Users,
  ArrowRight,
  Clock,
  Heart,
  Bookmark,
  MessageCircle,
  UserPlus,
} from 'lucide-react'

import { getFollowingFeed, getCurrentUser } from '@/utils/actions'

export const dynamic = 'force-dynamic'

export default async function FollowingPage() {
  const [articles, currentUser] = await Promise.all([
    getFollowingFeed(),
    getCurrentUser(),
  ])

  return (
    <div className='min-h-screen'>
      <section className='border-b border-gray-200 bg-white'>
        <div className='mx-auto max-w-[1100px] px-5 py-10 sm:px-8 lg:px-10'>
          <div className='flex items-start justify-between gap-6'>
            <div>
              <div className='mb-3 inline-flex items-center gap-2 rounded-full bg-[#7678ed]/10 px-3 py-1.5 text-[11px] font-semibold text-[#5d60c9]'>
                <Users size={13} />
                People you follow
              </div>

              <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                Following
              </h1>

              <p className='mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-[15px]'>
                Stories from writers and creators you follow. Nothing else gets
                mixed into this feed.
              </p>
            </div>

            <Link
              href='/topics'
              className='hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:border-[#3d348b]/30 hover:text-[#3d348b] sm:flex'
            >
              Find writers
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className='mt-8 flex items-center gap-6'>
            <Link
              href='/for-you'
              className='pb-3 text-sm font-medium text-gray-400 transition hover:text-gray-700'
            >
              For You
            </Link>

            <Link
              href='/following'
              className='relative pb-3 text-sm font-semibold text-[#3d348b]'
            >
              Following
              <span className='absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#3d348b]' />
            </Link>

            <Link
              href='/latest'
              className='pb-3 text-sm font-medium text-gray-400 transition hover:text-gray-700'
            >
              Latest
            </Link>
          </div>
        </div>
      </section>

      <main className='mx-auto max-w-[1100px] px-5 py-8 sm:px-8 lg:px-10'>
        {!currentUser ? (
          <LoginState />
        ) : articles.length === 0 ? (
          <EmptyFollowingState />
        ) : (
          <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_290px]'>
            <section>
              <div className='mb-5'>
                <h2 className='text-sm font-bold text-gray-900'>
                  Latest from people you follow
                </h2>

                <p className='mt-1 text-xs text-gray-400'>
                  New stories from your network
                </p>
              </div>

              <div className='space-y-4'>
                {articles.map((article: any) => (
                  <FollowingArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>

            <aside className='hidden lg:block'>
              <div className='sticky top-8 space-y-5'>
                <div className='rounded-2xl border border-gray-200 bg-white p-5'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#3d348b]/10 text-[#3d348b]'>
                    <Users size={18} />
                  </div>

                  <h3 className='mt-4 text-sm font-bold text-gray-900'>
                    Your following feed
                  </h3>

                  <p className='mt-2 text-xs leading-5 text-gray-500'>
                    This feed only contains stories published by people
                    you&apos;ve chosen to follow.
                  </p>

                  <Link
                    href='/topics'
                    className='mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#3d348b]'
                  >
                    Discover more writers
                    <ArrowRight size={13} />
                  </Link>
                </div>

                <div className='rounded-2xl border border-gray-200 bg-white p-5'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7b801]/15 text-[#a27700]'>
                    <UserPlus size={17} />
                  </div>

                  <h3 className='mt-4 text-sm font-bold text-gray-900'>
                    Know something worth sharing?
                  </h3>

                  <p className='mt-2 text-xs leading-5 text-gray-500'>
                    Share your knowledge with other students and learners.
                  </p>

                  <Link
                    href='/write'
                    className='mt-4 inline-flex items-center gap-2 rounded-lg bg-[#3d348b] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#342d78]'
                  >
                    Write an article
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

function FollowingArticleCard({ article }: { article: any }) {
  const author = article.user

  const authorName = author?.name || 'Education With Hamza'

  const initials = authorName
    .split(' ')
    .map((word: string) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const date = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <article className='group rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm sm:p-5'>
      <div className='flex gap-5'>
        <div className='min-w-0 flex-1'>
          <Link
            href={author?.id ? `/profile/${author.id}` : '#'}
            className='mb-3 inline-flex items-center gap-2'
          >
            {author?.image ? (
              <img
                src={author.image}
                alt={authorName}
                className='h-7 w-7 rounded-full object-cover'
              />
            ) : (
              <div className='flex h-7 w-7 items-center justify-center rounded-full bg-[#3d348b] text-[9px] font-bold text-white'>
                {initials}
              </div>
            )}

            <div className='flex items-center gap-1.5'>
              <span className='text-xs font-semibold text-gray-700 transition group-hover:text-[#3d348b]'>
                {authorName}
              </span>

              <span className='text-[10px] text-gray-300'>•</span>

              <span className='text-[10px] text-gray-400'>Following</span>
            </div>
          </Link>

          <Link href={`/articles/${article.slug}`}>
            <h2 className='line-clamp-2 text-base font-bold leading-6 text-gray-900 transition group-hover:text-[#3d348b] sm:text-[17px]'>
              {article.title}
            </h2>
          </Link>

          {article.short_desc && (
            <p className='mt-2 line-clamp-2 text-xs leading-5 text-gray-500 sm:text-[13px]'>
              {article.short_desc}
            </p>
          )}

          <div className='mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] text-gray-400'>
            {date && <span>{date}</span>}

            {article.readTime && (
              <>
                <span>·</span>

                <span className='inline-flex items-center gap-1'>
                  <Clock size={11} />

                  {article.readTime}
                </span>
              </>
            )}

            {article.category?.title && (
              <>
                <span>·</span>

                <span className='rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-500'>
                  {article.category.title}
                </span>
              </>
            )}
          </div>

          <div className='mt-4 flex items-center gap-4 text-gray-400'>
            <button
              type='button'
              className='inline-flex items-center gap-1.5 text-[11px] transition hover:text-[#f35b04]'
            >
              <Heart size={15} />

              <span>{article._count?.likes || 0}</span>
            </button>

            <button
              type='button'
              className='inline-flex items-center gap-1.5 text-[11px] transition hover:text-[#3d348b]'
            >
              <MessageCircle size={15} />

              <span>{article._count?.reviews || 0}</span>
            </button>

            <button
              type='button'
              aria-label='Save article'
              className='ml-auto transition hover:text-[#3d348b]'
            >
              <Bookmark size={16} />
            </button>
          </div>
        </div>

        {article.image && (
          <Link
            href={`/articles/${article.slug}`}
            className='hidden shrink-0 sm:block'
          >
            <img
              src={article.image}
              alt={article.title}
              className='h-[130px] w-[180px] rounded-xl object-cover transition duration-300 group-hover:scale-[1.02]'
            />
          </Link>
        )}
      </div>
    </article>
  )
}

function EmptyFollowingState() {
  return (
    <div className='mx-auto max-w-xl py-16 text-center sm:py-20'>
      <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3d348b]/10 text-[#3d348b]'>
        <Users size={27} />
      </div>

      <h2 className='mt-5 text-xl font-bold text-gray-900'>
        Your following feed is empty
      </h2>

      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500'>
        Follow writers whose knowledge you enjoy and their newest stories will
        appear here.
      </p>

      <div className='mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row'>
        <Link
          href='/topics'
          className='inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#342d78]'
        >
          Discover writers
          <ArrowRight size={14} />
        </Link>

        <Link
          href='/for-you'
          className='inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-xs font-semibold text-gray-600 transition hover:border-[#3d348b]/30 hover:text-[#3d348b]'
        >
          Explore For You
        </Link>
      </div>
    </div>
  )
}

function LoginState() {
  return (
    <div className='mx-auto max-w-xl py-16 text-center sm:py-20'>
      <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3d348b]/10 text-[#3d348b]'>
        <Users size={27} />
      </div>

      <h2 className='mt-5 text-xl font-bold text-gray-900'>
        Build your following feed
      </h2>

      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500'>
        Sign in to follow writers, discover their stories, and create your own
        personalized learning network.
      </p>

      <Link
        href='/login'
        className='mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#342d78]'
      >
        Sign in
        <ArrowRight size={14} />
      </Link>
    </div>
  )
}
