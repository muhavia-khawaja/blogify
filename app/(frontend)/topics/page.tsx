import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Hash,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import { getAllTopics } from '@/utils/actions'

export const metadata = {
  title: 'Explore Topics | Education With Hamza',
  description:
    'Explore educational topics and discover articles, study guides, tips, and insights on Education With Hamza.',
}

export default async function TopicsPage() {
  const topics = await getAllTopics()

  return (
    <div className='min-h-screen'>
      <section className='border-b border-gray-200 bg-white'>
        <div className='mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16'>
          <div className='flex items-center gap-2 text-sm font-medium text-[#3d348b]'>
            <Sparkles size={17} />
            <span>Explore</span>
          </div>

          <h1 className='mt-3 max-w-3xl text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl'>
            Explore topics
          </h1>

          <p className='mt-4 max-w-2xl text-[15px] leading-7 text-gray-500 sm:text-base'>
            Find subjects you&apos;re interested in and discover articles,
            explanations, study tips, and ideas from the Education With Hamza
            community.
          </p>

          <div className='mt-8 flex flex-wrap items-center gap-3'>
            <div className='flex items-center gap-2 rounded-full bg-[#3d348b]/8 px-4 py-2 text-xs font-semibold text-[#3d348b]'>
              <Hash size={14} />
              {topics.length} topics
            </div>

            <div className='flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-medium text-gray-500'>
              <BookOpen size={14} />
              Learn something new
            </div>
          </div>
        </div>
      </section>

      <main className='mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14'>
        {topics.length === 0 ? (
          <EmptyTopics />
        ) : (
          <>
            <div className='mb-6 flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-bold text-gray-950'>All topics</h2>

                <p className='mt-1 text-sm text-gray-400'>Browse by subject</p>
              </div>

              <div className='hidden items-center gap-2 text-xs font-medium text-gray-400 sm:flex'>
                <TrendingUp size={14} />
                Start exploring
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {topics.map((topic: any) => (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.slug}`}
                  className='group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#7678ed]/40 hover:shadow-lg hover:shadow-[#3d348b]/5'
                >
                  <div className='absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#3d348b]/5 transition-transform duration-300 group-hover:scale-125' />

                  <div className='relative'>
                    <div className='flex items-start justify-between'>
                      <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-[#3d348b]/10 text-[#3d348b] transition group-hover:bg-[#3d348b] group-hover:text-white'>
                        <Hash size={21} />
                      </div>

                      <ChevronRight
                        size={18}
                        className='text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-[#3d348b]'
                      />
                    </div>

                    <h3 className='mt-5 text-lg font-bold text-gray-900 transition group-hover:text-[#3d348b]'>
                      {topic.name}
                    </h3>

                    <p className='mt-1 text-sm text-gray-400'>
                      Discover articles about {topic.name}
                    </p>

                    <div className='mt-5 flex items-center gap-2 text-xs font-semibold text-[#3d348b]'>
                      Explore topic
                      <ArrowRight
                        size={14}
                        className='transition-transform group-hover:translate-x-1'
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function EmptyTopics() {
  return (
    <div className='flex min-h-[400px] flex-col items-center justify-center text-center'>
      <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3d348b]/10 text-[#3d348b]'>
        <Hash size={28} />
      </div>

      <h2 className='mt-5 text-xl font-bold text-gray-900'>
        No topics available
      </h2>

      <p className='mt-2 max-w-md text-sm leading-6 text-gray-500'>
        Topics will appear here once they are created.
      </p>

      <Link
        href='/latest'
        className='mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#342d78]'
      >
        Browse latest
        <ArrowRight size={16} />
      </Link>
    </div>
  )
}
