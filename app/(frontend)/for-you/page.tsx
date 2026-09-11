import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  Clock,
  Heart,
  Bookmark,
  MessageCircle,
} from 'lucide-react'

import { getForYouFeed } from '@/utils/actions'

export const dynamic = 'force-dynamic'

export default async function ForYouPage() {
  const articles = await getForYouFeed()

  return (
    <div className='min-h-screen'>
      <section className='border-b border-gray-200 bg-white'>
        <div className='mx-auto max-w-[1100px] px-5 py-10 sm:px-8 lg:px-10'>
          <div className='flex items-start justify-between gap-6'>
            <div>
              <div className='mb-3 inline-flex items-center gap-2 rounded-full bg-[#3d348b]/10 px-3 py-1.5 text-[11px] font-semibold text-[#3d348b]'>
                <Sparkles size={13} />
                Personalized for you
              </div>

              <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                For You
              </h1>

              <p className='mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-[15px]'>
                Discover stories based on the people you follow, topics you
                enjoy, and what you&apos;re learning.
              </p>
            </div>

            <Link
              href='/topics'
              className='hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:border-[#3d348b]/30 hover:text-[#3d348b] sm:flex'
            >
              Explore topics
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className='mt-8 flex items-center gap-6'>
            <Link
              href='/for-you'
              className='relative pb-3 text-sm font-semibold text-[#3d348b]'
            >
              For You
              <span className='absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#3d348b]' />
            </Link>

            <Link
              href='/following'
              className='pb-3 text-sm font-medium text-gray-400 transition hover:text-gray-700'
            >
              Following
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
        {articles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_290px]'>
            <section>
              <div className='mb-5 flex items-center justify-between'>
                <div>
                  <h2 className='text-sm font-bold text-gray-900'>
                    Recommended for you
                  </h2>

                  <p className='mt-1 text-xs text-gray-400'>
                    Stories selected from your interests
                  </p>
                </div>
              </div>

              <div className='space-y-4'>
                {articles.map((article: any) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>

            <aside className='hidden lg:block'>
              <div className='sticky top-8 space-y-5'>
                <div className='rounded-2xl border border-gray-200 bg-white p-5'>
                  <div className='mb-4 flex items-center justify-between'>
                    <h3 className='text-sm font-bold text-gray-900'>
                      Your interests
                    </h3>

                    <Link
                      href='/topics'
                      className='text-[11px] font-semibold text-[#3d348b]'
                    >
                      Edit
                    </Link>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    <Link
                      href='/topics/mathematics'
                      className='rounded-full bg-[#3d348b]/10 px-3 py-1.5 text-[11px] font-medium text-[#3d348b]'
                    >
                      # Mathematics
                    </Link>

                    <Link
                      href='/topics/physics'
                      className='rounded-full bg-[#7678ed]/10 px-3 py-1.5 text-[11px] font-medium text-[#5b5dc7]'
                    >
                      # Physics
                    </Link>

                    <Link
                      href='/topics/computer-science'
                      className='rounded-full bg-[#f7b801]/15 px-3 py-1.5 text-[11px] font-medium text-[#9a7200]'
                    >
                      # Computer Science
                    </Link>
                  </div>
                </div>

                <div className='overflow-hidden rounded-2xl bg-[#3d348b] p-5 text-white'>
                  <div className='mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10'>
                    <Sparkles size={17} />
                  </div>

                  <h3 className='text-sm font-bold'>Make your feed smarter</h3>

                  <p className='mt-2 text-xs leading-5 text-white/70'>
                    Follow topics and writers you enjoy to get recommendations
                    that match your interests.
                  </p>

                  <Link
                    href='/topics'
                    className='mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white'
                  >
                    Discover topics
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

function ArticleCard({ article }: { article: any }) {
  const author = article.user

  const authorName = author?.name || 'Education With Hamza'

  const authorInitials = authorName
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
                {authorInitials}
              </div>
            )}

            <span className='text-xs font-semibold text-gray-700 transition group-hover:text-[#3d348b]'>
              {authorName}
            </span>
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
              className='ml-auto transition hover:text-[#3d348b]'
              aria-label='Save article'
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

function EmptyState() {
  return (
    <div className='mx-auto max-w-lg py-20 text-center'>
      <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3d348b]/10 text-[#3d348b]'>
        <Sparkles size={26} />
      </div>

      <h2 className='mt-5 text-xl font-bold text-gray-900'>
        Your feed is waiting
      </h2>

      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500'>
        Follow some topics or writers and we&apos;ll start building a
        personalized feed for you.
      </p>

      <Link
        href='/topics'
        className='mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#342d78]'
      >
        Explore topics
        <ArrowRight size={14} />
      </Link>
    </div>
  )
}
