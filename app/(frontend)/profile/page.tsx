import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Heart,
  MessageCircle,
  Pencil,
  Users,
  UserPlus,
  Sparkles,
  FileText,
} from 'lucide-react'
import { getMyProfile } from '@/utils/actions'
import ActionToast from '@/components/ActionToast'

export default async function ProfilePage({
  searchParams,
}: {
  searchParams?: Promise<{ updated?: string }>
}) {
  const profile = await getMyProfile()
  const params = searchParams ? await searchParams : undefined

  if (!profile) {
    return (
      <div className='min-h-screen px-5 py-16 lg:px-10'>
        <div className='mx-auto max-w-3xl'>
          <div className='rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm'>
            <div className='mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3d348b]/10'>
              <Users className='h-8 w-8 text-[#3d348b]' />
            </div>

            <h1 className='text-2xl font-bold text-gray-900'>
              Login to view your profile
            </h1>

            <p className='mx-auto mt-3 max-w-md text-gray-500'>
              Create your learning profile, publish articles, follow creators
              and build your own reading space.
            </p>

            <div className='mt-7'>
              <Link
                href='/login'
                className='inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-6 py-3 font-semibold text-white transition hover:bg-[#30286f]'
              >
                Login
                <ArrowRight className='h-4 w-4' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const joinedDate = new Date(profile.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className='min-h-screen bg-[#f8f9fc]'>
      <ActionToast
        initialMessage={
          params?.updated === '1' ? 'Profile updated successfully.' : undefined
        }
      />
      <section className='border-b border-gray-200 bg-white'>
        <div className='mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14'>
          <div className='flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-5 sm:gap-7'>
              <div className='relative shrink-0'>
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    width={112}
                    height={112}
                    className='h-24 w-24 rounded-full object-cover ring-4 ring-[#3d348b]/10 sm:h-28 sm:w-28'
                  />
                ) : (
                  <div className='flex h-24 w-24 items-center justify-center rounded-full bg-[#3d348b] text-3xl font-bold text-white ring-4 ring-[#3d348b]/10 sm:h-28 sm:w-28'>
                    {profile.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <div className='flex items-center gap-2'>
                  <h1 className='text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl'>
                    {profile.name}
                  </h1>

                  <span className='hidden rounded-full bg-[#f7b801]/15 px-2.5 py-1 text-xs font-semibold text-[#a66f00] sm:inline-flex'>
                    Creator
                  </span>
                </div>

                <p className='mt-2 text-sm text-gray-500'>{profile.email}</p>

                <div className='mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500'>
                  <span className='flex items-center gap-1.5'>
                    <CalendarDays className='h-4 w-4' />
                    Joined {joinedDate}
                  </span>

                  <span className='flex items-center gap-1.5'>
                    <BookOpen className='h-4 w-4' />
                    {profile._count.articles} articles
                  </span>
                </div>
              </div>
            </div>

            <Link
              href='/profile/edit'
              className='inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-[#3d348b]/30 hover:bg-[#3d348b]/5 hover:text-[#3d348b]'
            >
              <Pencil className='h-4 w-4' />
              Edit profile
            </Link>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-5 pt-7 sm:px-8 lg:px-10'>
        <div className='grid grid-cols-2 overflow-hidden rounded-2xl border border-gray-200 bg-white sm:grid-cols-4'>
          <Stat
            icon={<FileText className='h-5 w-5' />}
            value={profile._count.articles}
            label='Articles'
          />

          <Stat
            icon={<Users className='h-5 w-5' />}
            value={profile._count.followers}
            label='Followers'
          />

          <Stat
            icon={<UserPlus className='h-5 w-5' />}
            value={profile._count.following}
            label='Following'
          />

          <Stat
            icon={<Heart className='h-5 w-5' />}
            value={profile._count.likes}
            label='Liked'
          />
        </div>
      </section>

      <main className='mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10'>
        <div className='grid gap-8 lg:grid-cols-[1fr_300px]'>
          <section>
            <div className='mb-6 flex items-end justify-between'>
              <div>
                <p className='text-sm font-semibold uppercase tracking-wider text-[#7678ed]'>
                  Your writing
                </p>

                <h2 className='mt-1 text-2xl font-bold text-gray-950'>
                  Published articles
                </h2>
              </div>

              <Link
                href='/write'
                className='hidden items-center gap-1.5 text-sm font-semibold text-[#3d348b] sm:flex'
              >
                Write article
                <ArrowRight className='h-4 w-4' />
              </Link>
            </div>

            {profile.articles.length === 0 ? (
              <div className='rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center'>
                <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3d348b]/10'>
                  <Sparkles className='h-7 w-7 text-[#3d348b]' />
                </div>

                <h3 className='mt-5 text-lg font-bold text-gray-900'>
                  Your first article starts here
                </h3>

                <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500'>
                  Share what you know, explain something useful, or publish your
                  learning journey with the Education With Hamza community.
                </p>

                <Link
                  href='/write'
                  className='mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#30286f]'
                >
                  Write your first article
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </div>
            ) : (
              <div className='space-y-4'>
                {profile.articles.map((article) => (
                  <article
                    key={article.id}
                    className='group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#7678ed]/30 hover:shadow-lg hover:shadow-[#3d348b]/5'
                  >
                    <Link
                      href={`/articles/${article.slug}`}
                      className='flex flex-col sm:flex-row'
                    >
                      {article.image ? (
                        <div className='relative h-48 w-full shrink-0 overflow-hidden bg-gray-100 sm:h-auto sm:w-52'>
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className='object-cover transition duration-500 group-hover:scale-105'
                          />
                        </div>
                      ) : (
                        <div className='flex h-32 w-full shrink-0 items-center justify-center bg-gradient-to-br from-[#3d348b] to-[#7678ed] sm:h-auto sm:w-52'>
                          <BookOpen className='h-10 w-10 text-white/80' />
                        </div>
                      )}

                      <div className='flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-6'>
                        <div>
                          <div className='mb-3 flex flex-wrap items-center gap-2'>
                            {article.category && (
                              <span className='rounded-full bg-[#3d348b]/10 px-2.5 py-1 text-xs font-semibold text-[#3d348b]'>
                                {article.category.title}
                              </span>
                            )}

                            {article.featured && (
                              <span className='rounded-full bg-[#f7b801]/15 px-2.5 py-1 text-xs font-semibold text-[#a66f00]'>
                                Featured
                              </span>
                            )}
                          </div>

                          <h3 className='line-clamp-2 text-xl font-bold leading-snug text-gray-950 transition group-hover:text-[#3d348b]'>
                            {article.title}
                          </h3>

                          {article.short_desc && (
                            <p className='mt-2 line-clamp-2 text-sm leading-6 text-gray-500'>
                              {article.short_desc}
                            </p>
                          )}
                        </div>

                        <div className='mt-5 flex flex-wrap items-center gap-4 text-xs text-gray-500'>
                          <span>
                            {new Date(article.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              },
                            )}
                          </span>

                          {article.readTime && (
                            <>
                              <span className='text-gray-300'>•</span>
                              <span>{article.readTime} min read</span>
                            </>
                          )}

                          <span className='text-gray-300'>•</span>

                          <span className='flex items-center gap-1'>
                            <Heart className='h-3.5 w-3.5' />
                            {article._count.likes}
                          </span>

                          <span className='flex items-center gap-1'>
                            <MessageCircle className='h-3.5 w-3.5' />
                            {article._count.reviews}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className='space-y-5'>
            <div className='rounded-2xl border border-gray-200 bg-white p-6'>
              <div className='flex items-center gap-2'>
                <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-[#3d348b]/10'>
                  <Sparkles className='h-5 w-5 text-[#3d348b]' />
                </div>

                <h3 className='font-bold text-gray-900'>Your learning space</h3>
              </div>

              <p className='mt-4 text-sm leading-6 text-gray-500'>
                Build your profile by writing useful articles, following
                interesting creators and exploring topics that matter to you.
              </p>

              <Link
                href='/topics'
                className='mt-5 flex items-center justify-between rounded-xl bg-[#f8f9fc] px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-[#3d348b]/10 hover:text-[#3d348b]'
              >
                Explore topics
                <ArrowRight className='h-4 w-4' />
              </Link>
            </div>

            <div className='rounded-2xl border border-gray-200 bg-white p-6'>
              <h3 className='font-bold text-gray-900'>Quick access</h3>

              <div className='mt-4 space-y-1'>
                <ProfileLink
                  href='/library/liked'
                  icon={<Heart className='h-4 w-4' />}
                  label='Liked articles'
                  count={profile._count.likes}
                />

                <ProfileLink
                  href='/following'
                  icon={<Users className='h-4 w-4' />}
                  label='Following'
                  count={profile._count.following}
                />

                <ProfileLink
                  href='/topics'
                  icon={<Sparkles className='h-4 w-4' />}
                  label='Topics'
                  count={profile._count.topicFollows}
                />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: number
  label: string
}) {
  return (
    <div className='border-b border-gray-100 p-5 text-center sm:border-b-0 sm:border-r last:border-r-0'>
      <div className='mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#3d348b]/10 text-[#3d348b]'>
        {icon}
      </div>

      <p className='mt-2 text-xl font-bold text-gray-950'>{value}</p>

      <p className='mt-0.5 text-xs font-medium text-gray-500'>{label}</p>
    </div>
  )
}

function ProfileLink({
  href,
  icon,
  label,
  count,
}: {
  href: string
  icon: React.ReactNode
  label: string
  count: number
}) {
  return (
    <Link
      href={href}
      className='flex items-center justify-between rounded-xl px-3 py-3 text-sm text-gray-600 transition hover:bg-[#f8f9fc] hover:text-[#3d348b]'
    >
      <span className='flex items-center gap-3'>
        {icon}
        {label}
      </span>

      <span className='text-xs font-semibold text-gray-400'>{count}</span>
    </Link>
  )
}
