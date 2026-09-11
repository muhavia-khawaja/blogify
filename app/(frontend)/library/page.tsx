import Link from 'next/link'
import {
  ArrowRight,
  Bookmark,
  Clock3,
  Heart,
  MessageCircle,
  BookOpen,
} from 'lucide-react'

import { getLibraryArticles } from '@/utils/actions'

export const metadata = {
  title: 'Library | Education With Hamza',
  description:
    'Your saved and liked educational articles on Education With Hamza.',
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

export default async function LibraryPage() {
  const articles = await getLibraryArticles()

  return (
    <div className='min-h-screen'>
      <section className='border-b border-gray-200 bg-white'>
        <div className='mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14'>
          <div className='flex items-center gap-2 text-sm font-medium text-[#3d348b]'>
            <Bookmark size={17} />
            <span>Your library</span>
          </div>

          <h1 className='mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl'>
            Library
          </h1>

          <p className='mt-3 max-w-2xl text-[15px] leading-7 text-gray-500'>
            Keep track of the articles you want to read, revisit, and learn
            from.
          </p>

          <div className='mt-7 flex items-center gap-6'>
            <div className='relative pb-3 text-sm font-semibold text-[#3d348b]'>
              Saved articles
              <span className='absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#3d348b]' />
            </div>

            <Link
              href='/library/liked'
              className='pb-3 text-sm font-medium text-gray-400 transition hover:text-gray-700'
            >
              Liked articles
            </Link>
          </div>
        </div>
      </section>

      <main className='mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10'>
        {articles.length === 0 ? (
          <EmptyLibrary />
        ) : (
          <div className='space-y-1'>
            {articles.map((article: any) => {
              const authorName = article.user?.name || 'Education With Hamza'

              const readingTime = getReadingTime(article.content)

              const image =
                article.image ||
                article.coverImage ||
                article.featuredImage ||
                null

              return (
                <article
                  key={article.id}
                  className='group border-b border-gray-200 py-7 first:pt-2'
                >
                  <div className='flex gap-5 sm:gap-7'>
                    <div className='min-w-0 flex-1'>
                      <div className='mb-3 flex items-center gap-2'>
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

                        <Link
                          href={
                            article.user?.id
                              ? `/profile/${article.user.id}`
                              : '/profile'
                          }
                          className='text-xs font-semibold text-gray-700 hover:text-[#3d348b]'
                        >
                          {authorName}
                        </Link>

                        <span className='text-xs text-gray-400'>·</span>

                        <span className='text-xs text-gray-400'>
                          {formatDate(article.createdAt)}
                        </span>
                      </div>

                      <Link href={`/articles/${article.slug}`}>
                        <h2 className='max-w-3xl text-xl font-bold leading-tight tracking-[-0.02em] text-gray-950 transition group-hover:text-[#3d348b] sm:text-2xl'>
                          {article.title}
                        </h2>
                      </Link>

                      {article.description && (
                        <Link href={`/articles/${article.slug}`}>
                          <p className='mt-2 line-clamp-2 max-w-2xl text-[14px] leading-6 text-gray-500 sm:text-[15px]'>
                            {article.description}
                          </p>
                        </Link>
                      )}

                      <div className='mt-4 flex flex-wrap items-center gap-2'>
                        {article.category?.name && (
                          <span className='rounded-full bg-[#3d348b]/8 px-3 py-1 text-[11px] font-semibold text-[#3d348b]'>
                            {article.category.name}
                          </span>
                        )}

                        {article.topics?.slice(0, 2).map((item: any) => (
                          <Link
                            key={item.id}
                            href={`/topics/${item.topic.slug}`}
                            className='rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-500 transition hover:bg-gray-200'
                          >
                            {item.topic.name}
                          </Link>
                        ))}

                        <span className='flex items-center gap-1 text-[11px] text-gray-400'>
                          <Clock3 size={13} />
                          {readingTime} min read
                        </span>
                      </div>

                      <div className='mt-4 flex items-center gap-4 text-[11px] text-gray-400'>
                        <span className='flex items-center gap-1.5'>
                          <Heart size={14} />
                          {article._count?.likes || 0}
                        </span>

                        <span className='flex items-center gap-1.5'>
                          <MessageCircle size={14} />
                          {article._count?.reviews || 0}
                        </span>

                        <span className='ml-auto flex items-center gap-1.5 font-medium text-[#3d348b]'>
                          <Bookmark size={14} fill='currentColor' />
                          Saved
                        </span>
                      </div>
                    </div>

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

function EmptyLibrary() {
  return (
    <div className='flex min-h-[450px] flex-col items-center justify-center px-5 text-center'>
      <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3d348b]/10 text-[#3d348b]'>
        <Bookmark size={28} />
      </div>

      <h2 className='mt-5 text-xl font-bold text-gray-900'>
        Your library is empty
      </h2>

      <p className='mt-2 max-w-md text-sm leading-6 text-gray-500'>
        Save articles you want to come back to and they’ll appear here.
      </p>

      <Link
        href='/latest'
        className='mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#342d78]'
      >
        Browse latest articles
        <ArrowRight size={16} />
      </Link>
    </div>
  )
}
