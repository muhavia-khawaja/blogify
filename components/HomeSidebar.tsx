'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Sparkles,
  Users,
  Bookmark,
  Hash,
  Plus,
  PenLine,
  ChevronRight,
  GraduationCap,
  Search,
  MoreHorizontal,
} from 'lucide-react'

type HomeSidebarProps = {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

const topics = [
  {
    name: 'Mathematics',
    slug: 'mathematics',
  },
  {
    name: 'Physics',
    slug: 'physics',
  },
  {
    name: 'Chemistry',
    slug: 'chemistry',
  },
  {
    name: 'Biology',
    slug: 'biology',
  },
  {
    name: 'Computer Science',
    slug: 'computer-science',
  },
]

const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'For You',
    href: '/for-you',
    icon: Sparkles,
  },
  {
    name: 'Following',
    href: '/following',
    icon: Users,
  },
  {
    name: 'Library',
    href: '/library',
    icon: Bookmark,
  },
]

export default function HomeSidebar({ user }: HomeSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const displayName = user?.name || 'Your Profile'

  const initials = displayName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      <aside className='fixed left-0 top-0 z-40 hidden h-screen w-[250px] border-r border-gray-200 bg-white lg:flex'>
        <div className='flex h-full w-full flex-col px-4 py-6'>
          <Link
            href='/'
            className='mb-9 flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-gray-50'
          >
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#3d348b] text-white shadow-sm'>
              <GraduationCap size={22} strokeWidth={2.2} />
            </div>

            <div className='leading-tight'>
              <p className='text-[15px] font-bold tracking-tight text-gray-900'>
                Education
              </p>

              <p className='text-[13px] font-medium text-[#3d348b]'>
                With Hamza
              </p>
            </div>
          </Link>

          <nav className='space-y-1'>
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                    active
                      ? 'bg-[#3d348b]/10 text-[#3d348b]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {active && (
                    <span className='absolute left-0 h-6 w-[3px] rounded-r-full bg-[#3d348b]' />
                  )}

                  <Icon
                    size={19}
                    strokeWidth={active ? 2.2 : 1.8}
                    className={
                      active
                        ? 'text-[#3d348b]'
                        : 'text-gray-500 group-hover:text-gray-800'
                    }
                  />

                  <span>{item.name}</span>

                  {item.name === 'For You' && (
                    <span className='ml-auto rounded-full bg-[#f7b801]/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#b87900]'>
                      AI
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className='my-7 h-px bg-gray-100' />

          <div className='flex-1 overflow-y-auto'>
            <div className='mb-3 px-3'>
              <p className='text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400'>
                Explore
              </p>
            </div>

            <div className='space-y-0.5'>
              {topics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/topics/${topic.slug}`}
                  className='group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-gray-600 transition hover:bg-gray-50 hover:text-gray-900'
                >
                  <Hash
                    size={16}
                    strokeWidth={1.8}
                    className='text-gray-400 transition group-hover:text-[#7678ed]'
                  />

                  <span className='truncate'>{topic.name}</span>
                </Link>
              ))}
            </div>

            <Link
              href='/topics'
              className='mt-2 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#3d348b] transition hover:bg-[#3d348b]/5'
            >
              <Plus size={16} />

              <span>Explore topics</span>

              <ChevronRight size={14} className='ml-auto' />
            </Link>
          </div>

          <div className='pt-4'>
            <Link
              href='/write'
              className='group flex w-full items-center justify-center gap-2 rounded-xl bg-[#3d348b] px-4 py-3 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#342d78] hover:shadow-md'
            >
              <PenLine size={17} strokeWidth={2} />

              <span>Write an article</span>
            </Link>
          </div>

          <div className='mt-4 border-t border-gray-100 pt-4'>
            <Link
              href='/profile'
              className='group flex items-center gap-3 rounded-xl p-2 transition hover:bg-gray-50'
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={displayName}
                  className='h-9 w-9 rounded-full object-cover'
                />
              ) : (
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3d348b] text-[11px] font-bold text-white'>
                  {initials}
                </div>
              )}

              <div className='min-w-0 flex-1'>
                <p className='truncate text-[13px] font-semibold text-gray-800'>
                  {displayName}
                </p>

                <p className='truncate text-[11px] text-gray-400'>
                  View profile
                </p>
              </div>

              <ChevronRight
                size={16}
                className='text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gray-500'
              />
            </Link>
          </div>
        </div>
      </aside>

      <header className='sticky top-0 z-40 flex h-[60px] items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur lg:hidden'>
        <Link href='/' className='flex items-center gap-2.5'>
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-[#3d348b] text-white'>
            <GraduationCap size={20} />
          </div>

          <div className='leading-tight'>
            <p className='text-[13px] font-bold text-gray-900'>Education</p>

            <p className='text-[11px] font-medium text-[#3d348b]'>With Hamza</p>
          </div>
        </Link>

        <div className='flex items-center gap-1'>
          <Link
            href='/search'
            className='flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100'
          >
            <Search size={19} />
          </Link>

          <Link
            href='/write'
            className='flex h-9 w-9 items-center justify-center rounded-full bg-[#3d348b] text-white transition hover:bg-[#342d78]'
          >
            <PenLine size={17} />
          </Link>
        </div>
      </header>

      <nav className='fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden'>
        <div className='mx-auto flex h-[66px] max-w-md items-center justify-around'>
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex min-w-[60px] flex-col items-center justify-center gap-1 rounded-xl py-2 transition ${
                  active ? 'text-[#3d348b]' : 'text-gray-400'
                }`}
              >
                <div
                  className={`relative flex h-7 w-9 items-center justify-center rounded-xl transition ${
                    active ? 'bg-[#3d348b]/10' : ''
                  }`}
                >
                  <Icon size={19} strokeWidth={active ? 2.3 : 1.8} />

                  {item.name === 'For You' && (
                    <span className='absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-[#f7b801]' />
                  )}
                </div>

                <span
                  className={`text-[10px] font-medium ${
                    active ? 'text-[#3d348b]' : 'text-gray-400'
                  }`}
                >
                  {item.name === 'Library' ? 'Saved' : item.name}
                </span>
              </Link>
            )
          })}

          <Link
            href='/profile'
            className={`flex min-w-[60px] flex-col items-center justify-center gap-1 rounded-xl py-2 transition ${
              isActive('/profile') ? 'text-[#3d348b]' : 'text-gray-400'
            }`}
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={displayName}
                className='h-7 w-7 rounded-full object-cover'
              />
            ) : (
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold ${
                  isActive('/profile')
                    ? 'bg-[#3d348b] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {initials}
              </div>
            )}

            <span className='text-[10px] font-medium'>Profile</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
