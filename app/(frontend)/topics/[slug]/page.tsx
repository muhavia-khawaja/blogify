import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Heart,
  MessageCircle,
  Hash,
  Users,
} from 'lucide-react'

import { getTopicBySlug, getTopicFeed, isFollowingTopic } from '@/utils/actions'
import FollowTopicButton from '@/components/FollowTopicButton'

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

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const topic = await getTopicBySlug(params.slug)

  if (!topic) {
    return {
      title: 'Topic Not Found | Education With Hamza',
    }
  }

  return {
    title: `${topic.name} | Education With Hamza`,
    description: `Explore ${topic.name} articles, educational resources, study tips, and insights on Education With Hamza.`,
  }
}

export default async function TopicPage({
  params,
}: {
  params: { slug: string }
}) {
  const topic = await getTopicBySlug(params.slug)

  if (!topic) {
    return <TopicNotFound />
  }

  const [articles, following] = await Promise.all([
    getTopicFeed(topic.id),
    isFollowingTopic(topic.id),
  ])

  const followersCount = topic._count?.followers ?? 0

  return (
    <div className='min-h-screen'>
      {/* Topic Header */}
      <section className='border-b border-gray-200 bg-white'>
        <div className='mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14'>
          {/* Breadcrumb */}
          <Link
            href='/topics'
            className='inline-flex items-center gap-2 text-xs font-medium text-gray-400 transition hover:text-[#3d348b]'
          >
            <Hash size={14} />
            All topics
            <ArrowRight size={13} />
          </Link>

          <div className='mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between'>
            <div className='flex items-start gap-4'>
              <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#3d348b] text-white shadow-md shadow-[#3d348b]/15 sm:h-16 sm:w-16'>
                <Hash size={28} />
              </div>

              <div>
                <p className='text-xs font-bold uppercase tracking-[0.15em] text-[#7678ed]'>
                  Topic
                </p>

                <h1 className='mt-1 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl'>
                  {topic.name}
                </h1>

                <div className='mt-2 flex items-center gap-2 text-sm text-gray-400'>
                  <Users size={15} />
                  <span>
                    {followersCount}{' '}
                    {followersCount === 1 ? 'follower' : 'followers'}
                  </span>
                </div>
              </div>
            </div>

            <FollowTopicButton
              topicId={topic.id}
              initialFollowing={following}
            />
          </div>
        </div>
      </section>

      {/* Feed */}
      <main className='mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10'>
        <div className='mb-7'>
          <h2 className='text-xl font-bold text-gray-950'>
            Latest in {topic.name}
          </h2>

          <p className='mt-1 text-sm text-gray-400'>
            Fresh articles and ideas from this topic.
          </p>
        </div>

        {articles.length === 0 ? (
          <EmptyTopic topicName={topic.name} />
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
                      {/* Author */}
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

                      {/* Title */}
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

                      {/* Metadata */}
                      <div className='mt-4 flex flex-wrap items-center gap-2'>
                        {article.category?.name && (
                          <span className='rounded-full bg-[#3d348b]/8 px-3 py-1 text-[11px] font-semibold text-[#3d348b]'>
                            {article.category.name}
                          </span>
                        )}

                        {article.topics
                          ?.filter((item: any) => item.topic?.id !== topic.id)
                          .slice(0, 2)
                          .map((item: any) => (
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

                    {/* Image */}
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

function EmptyTopic({ topicName }: { topicName: string }) {
  return (
    <div className='flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-5 text-center'>
      <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3d348b]/10 text-[#3d348b]'>
        <BookOpen size={25} />
      </div>

      <h3 className='mt-5 text-lg font-bold text-gray-900'>No articles yet</h3>

      <p className='mt-2 max-w-md text-sm leading-6 text-gray-500'>
        There aren&apos;t any published articles about {topicName} yet.
      </p>

      <Link
        href='/latest'
        className='mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#3d348b] hover:underline'
      >
        Browse latest articles
        <ArrowRight size={15} />
      </Link>
    </div>
  )
}

function TopicNotFound() {
  return (
    <div className='flex min-h-[70vh] flex-col items-center justify-center px-5 text-center'>
      <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400'>
        <Hash size={28} />
      </div>

      <h1 className='mt-5 text-2xl font-bold text-gray-900'>Topic not found</h1>

      <p className='mt-2 max-w-md text-sm leading-6 text-gray-500'>
        The topic you&apos;re looking for doesn&apos;t exist or may have been
        removed.
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
