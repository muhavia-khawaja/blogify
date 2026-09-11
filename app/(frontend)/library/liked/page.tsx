import Link from 'next/link'
import {
  ArrowLeft,
  Bookmark,
  Clock3,
  Heart,
  MessageCircle,
  BookOpen,
  ArrowRight,
} from 'lucide-react'
import { getLikedArticles } from '@/utils/actions'

export const metadata = {
  title: 'Liked Articles | Education With Hamza',
  description:
    'View the educational articles you have liked on Education With Hamza.',
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

export default async function LikedArticlesPage() {
  const articles = await getLikedArticles()

  return (
    <div className='min-h-screen'>
      <section className='border-b border-gray-200 bg-white'>
        <div className='mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14'>
          <Link
            href='/library'
            className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-[#3d348b]'
          >
            <ArrowLeft size={16} />
            Library
          </Link>

          <div className='flex items-center gap-2 text-sm font-medium text-[#f35b04]'>
            <Heart size={17} fill='currentColor' />
            <span>Liked articles</span>
          </div>

          <h1 className='mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl'>
            Articles you liked
          </h1>

          <p className='mt-3 max-w-2xl text-[15px] leading-7 text-gray-500'>
            A collection of articles you found useful, interesting, or worth
            coming back to.
          </p>

          {/* Tabs */}
          <div className='mt-7 flex items-center gap-6'>
            <Link
              href='/library'
              className='pb-3 text-sm font-medium text-gray-400 transition hover:text-gray-700'
            >
              Saved articles
            </Link>

            <div className='relative pb-3 text-sm font-semibold text-[#3d348b]'>
              Liked articles
              <span className='absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#3d348b]' />
            </div>
          </div>
        </div>
      </section>

      <main className='mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10'>
        {articles.length === 0 ? (
          <EmptyLikedState />
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
                          className='text-xs font-semibold text-gray-700 transition hover:text-[#3d348b]'
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
                          <Heart
                            size={14}
                            className='text-[#f35b04]'
                            fill='currentColor'
                          />
                          {article._count?.likes || 0}
                        </span>

                        <span className='flex items-center gap-1.5'>
                          <MessageCircle size={14} />
                          {article._count?.reviews || 0}
                        </span>

                        <span className='ml-auto flex items-center gap-1.5 font-medium text-[#f35b04]'>
                          <Heart size={14} fill='currentColor' />
                          Liked
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

function EmptyLikedState() {
  return (
    <div className='flex min-h-[450px] flex-col items-center justify-center px-5 text-center'>
      <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f35b04]/10 text-[#f35b04]'>
        <Heart size={28} />
      </div>

      <h2 className='mt-5 text-xl font-bold text-gray-900'>
        No liked articles yet
      </h2>

      <p className='mt-2 max-w-md text-sm leading-6 text-gray-500'>
        When you like an article, it will appear here so you can easily find it
        again.
      </p>

      <Link
        href='/latest'
        className='mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#342d78]'
      >
        <BookOpen size={16} />
        Browse articles
        <ArrowRight size={16} />
      </Link>
    </div>
  )
}
