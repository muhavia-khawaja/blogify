import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Heart,
  MessageCircle,
  Sparkles,
} from 'lucide-react'

import { getLatestArticles } from '@/utils/actions'

export const revalidate = 0

export const metadata = {
  title: 'Latest Articles | Education With Hamza',
  description:
    'Discover the latest educational articles, study guides, tips, and insights from Education With Hamza.',
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

function getReadingTime(content?: string | null) {
  if (!content) return 1

  const words = content
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.ceil(words / 200))
}

function getInitials(name?: string | null) {
  if (!name) return 'EW'

  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default async function LatestPage() {
  const articles = await getLatestArticles()

  return (
    <div className='min-h-screen'>
      {/* Page header */}
      <section className='border-b border-gray-200 bg-white'>
        <div className='mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14'>
          <div className='flex items-center gap-2 text-sm font-medium text-[#3d348b]'>
            <Clock3 size={17} />
            <span>Latest</span>
          </div>

          <div className='mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <h1 className='text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl'>
                Latest articles
              </h1>

              <p className='mt-3 max-w-2xl text-[15px] leading-7 text-gray-500'>
                Fresh ideas, study tips, explanations, and educational resources
                from the Education With Hamza community.
              </p>
            </div>

            <Link
              href='/topics'
              className='inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-[#7678ed] hover:text-[#3d348b]'
            >
              Explore topics
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Feed */}
      <main className='mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10'>
        {articles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className='space-y-1'>
            {articles.map((article: any, index: number) => {
              const readingTime = getReadingTime(article.content)

              const authorName = article.user?.name || 'Education With Hamza'

              const image =
                article.image ||
                article.coverImage ||
                article.featuredImage ||
                null

              return (
                <article
                  key={article.id}
                  className='group relative border-b border-gray-200 py-7 first:pt-2'
                >
                  <div className='flex gap-5 sm:gap-7'>
                    {/* Main content */}
                    <div className='min-w-0 flex-1'>
                      {/* Creator */}
                      <Link
                        href={
                          article.user?.id ? `/profile/${article.user.id}` : '#'
                        }
                        className='mb-3 inline-flex items-center gap-2'
                      >
                        {article.user?.image ? (
                          <img
                            src={article.user.image}
                            alt={authorName}
                            className='h-7 w-7 rounded-full object-cover'
                          />
                        ) : (
                          <div className='flex h-7 w-7 items-center justify-center rounded-full bg-[#3d348b] text-[9px] font-bold text-white'>
                            {getInitials(authorName)}
                          </div>
                        )}

                        <span className='text-xs font-semibold text-gray-700 transition group-hover:text-[#3d348b]'>
                          {authorName}
                        </span>

                        <span className='text-xs text-gray-400'>·</span>

                        <span className='text-xs text-gray-400'>
                          {formatDate(article.createdAt)}
                        </span>
                      </Link>

                      {/* Article title */}
                      <Link href={`/articles/${article.slug}`}>
                        <h2 className='max-w-3xl text-xl font-bold leading-tight tracking-[-0.02em] text-gray-950 transition group-hover:text-[#3d348b] sm:text-2xl'>
                          {article.title}
                        </h2>
                      </Link>

                      {/* Description */}
                      {article.description && (
                        <Link href={`/articles/${article.slug}`}>
                          <p className='mt-2 line-clamp-2 max-w-2xl text-[14px] leading-6 text-gray-500 sm:text-[15px]'>
                            {article.description}
                          </p>
                        </Link>
                      )}

                      {/* Topics / category */}
                      <div className='mt-4 flex flex-wrap items-center gap-2'>
                        {article.category?.name && (
                          <Link
                            href={`/categories/${article.category.slug}`}
                            className='rounded-full bg-[#3d348b]/8 px-3 py-1 text-[11px] font-semibold text-[#3d348b] transition hover:bg-[#3d348b]/15'
                          >
                            {article.category.name}
                          </Link>
                        )}

                        {article.topics?.slice(0, 2).map((item: any) => (
                          <Link
                            key={item.id}
                            href={`/topics/${item.topic.slug}`}
                            className='rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-500 transition hover:bg-gray-200 hover:text-gray-700'
                          >
                            {item.topic.name}
                          </Link>
                        ))}

                        <span className='flex items-center gap-1 text-[11px] text-gray-400'>
                          <Clock3 size={13} />
                          {readingTime} min read
                        </span>
                      </div>

                      {/* Stats */}
                      <div className='mt-4 flex items-center gap-4 text-[11px] text-gray-400'>
                        <span className='flex items-center gap-1.5'>
                          <Heart size={14} />
                          {article._count?.likes || 0}
                        </span>

                        <span className='flex items-center gap-1.5'>
                          <MessageCircle size={14} />
                          {article._count?.reviews || 0}
                        </span>
                      </div>
                    </div>

                    {/* Article image */}
                    {image && (
                      <Link
                        href={`/articles/${article.slug}`}
                        className='relative hidden h-[120px] w-[180px] shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:block md:h-[135px] md:w-[210px]'
                      >
                        <img
                          src={image}
                          alt={article.title}
                          className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                        />

                        <div className='absolute inset-0 bg-black/0 transition group-hover:bg-black/5' />
                      </Link>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

/* Empty state */

function EmptyState() {
  return (
    <div className='flex min-h-[450px] flex-col items-center justify-center px-5 text-center'>
      <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3d348b]/10 text-[#3d348b]'>
        <BookOpen size={28} />
      </div>

      <h2 className='mt-5 text-xl font-bold text-gray-900'>No articles yet</h2>

      <p className='mt-2 max-w-md text-sm leading-6 text-gray-500'>
        New educational articles will appear here as soon as they are published.
      </p>

      <Link
        href='/topics'
        className='mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#342d78]'
      >
        Explore topics
        <ArrowRight size={16} />
      </Link>
    </div>
  )
}
