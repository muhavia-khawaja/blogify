'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Tags,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Zap,
  MessageCircle,
  User,
  ChevronRight,
  Users,
  Settings,
  MoreHorizontal,
  PanelLeft,
  Lock,
  Image,
} from 'lucide-react'
import { logout } from '@/utils/actions'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const pathname = usePathname()

  const isLoginPage = pathname === '/login' || pathname === '/control/login'

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/control',
      icon: LayoutDashboard,
    },
    {
      name: 'Articles',
      href: '/control/articles',
      icon: FileText,
    },
    {
      name: 'Categories',
      href: '/control/categories',
      icon: Tags,
    },
    {
      name: 'Reviews',
      href: '/control/reviews',
      icon: MessageSquare,
    },
    {
      name: 'Contacts',
      href: '/control/contacts',
      icon: MessageCircle,
    },
    {
      name: 'Authors',
      href: '/control/author',
      icon: User,
    },
    {
      name: 'Settings',
      href: '/control/settings',
      icon: Settings,
    },
    {
      name: 'AI Write',
      href: '/control/ai-article',
      icon: Zap,
    },
    {
      name: 'AI Images',
      href: '/control/ai-images',
      icon: Image,
    },
    {
      name: 'Newsletter',
      href: '/control/newsletter',
      icon: MessageCircle,
    },
  ]

  const mobileDockItems: NavItem[] = [
    navItems[0],
    navItems[1],
    navItems[3],
    navItems[4],
  ]

  const mobileMoreItems: NavItem[] = [
    navItems[2],
    navItems[5],
    navItems[6],
    navItems[7],
    navItems[8],
    navItems[9],
  ]

  const isActive = (path: string) => {
    if (path === '/control') {
      return pathname === '/control'
    }

    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const closeMobileMenus = () => {
    setIsSidebarOpen(false)
    setIsMoreOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    setIsSidebarOpen(false)
    setIsMoreOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isSidebarOpen || isMoreOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen, isMoreOpen])

  if (isLoginPage) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#F9F8F6] via-[#F5F3F0] to-[#F1EEEB]'>
        {children}
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#FAFAF8] text-[#1A1A18]'>
      <aside className='fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-[#E8E4DC] bg-white xl:flex'>
        <div className='border-b border-[#E8E4DC] p-7'>
          <Link
            href='/control'
            className='group inline-flex items-center gap-3'
          >
            <div>
              <p className='text-[9px] font-black uppercase tracking-[0.3em] text-[#9B9890] flex items-center gap-1'>
                <Lock className='text-amber-600 ' size='9' />
                Admin
              </p>
            </div>
          </Link>
        </div>

        <nav className='flex-1 space-y-1.5 overflow-y-auto px-5 py-7'>
          <p className='mb-5 px-3 text-[9px] font-black uppercase tracking-[0.3em] text-[#9B9890]'>
            Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-200 ${
                  active
                    ? 'border border-amber-200/60 bg-gradient-to-r from-amber-50 to-amber-50/50 text-amber-700 shadow-sm'
                    : 'text-[#6B6860] hover:bg-[#F7F5F0] hover:text-[#1A1A18]'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.5 : 2}
                    className={
                      active
                        ? ''
                        : 'transition-transform group-hover:translate-x-0.5'
                    }
                  />

                  <span className='text-sm font-bold'>{item.name}</span>
                </div>

                {active && <ChevronRight size={17} className='opacity-60' />}
              </Link>
            )
          })}
        </nav>

        <div className='border-t border-[#E8E4DC] bg-[#FEFDFB] p-5'>
          <button
            type='button'
            onClick={handleLogout}
            className='group flex w-full items-center gap-3 rounded-xl border border-transparent px-4 py-3.5 text-sm font-bold text-red-600 transition-all duration-200 hover:border-red-200 hover:bg-red-50'
          >
            <LogOut
              size={19}
              className='transition-transform group-hover:-translate-x-0.5'
            />
            Logout
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm xl:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[80] flex w-[86%] max-w-[340px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out xl:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex items-center justify-between border-b border-[#E8E4DC] p-5'>
          <Link
            href='/control'
            onClick={closeMobileMenus}
            className='inline-flex items-center gap-2.5'
          >
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20'>
              <Zap size={21} strokeWidth={2.5} />
            </div>

            <div>
              <p className='text-[9px] font-black uppercase tracking-[0.2em] text-[#9B9890]'>
                Content Hub
              </p>

              <p className='font-serif text-sm font-bold text-[#1A1A18]'>
                Registry
              </p>
            </div>
          </Link>

          <button
            type='button'
            onClick={() => setIsSidebarOpen(false)}
            className='rounded-xl p-2.5 text-[#1A1A18] transition hover:bg-[#F7F5F0]'
            aria-label='Close navigation'
          >
            <X size={22} />
          </button>
        </div>

        {/* Mobile Sidebar Navigation */}
        <nav className='flex-1 space-y-1.5 overflow-y-auto p-5'>
          <p className='mb-4 px-3 text-[9px] font-black uppercase tracking-[0.3em] text-[#9B9890]'>
            Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenus}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${
                  active
                    ? 'border border-emerald-200/60 bg-emerald-50 text-emerald-700'
                    : 'text-[#6B6860] hover:bg-[#F7F5F0] hover:text-[#1A1A18]'
                }`}
              >
                <Icon size={20} />

                <span>{item.name}</span>

                {active && (
                  <ChevronRight size={17} className='ml-auto opacity-60' />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Sidebar Logout */}
        <div className='border-t border-[#E8E4DC] bg-[#FEFDFB] p-5'>
          <button
            type='button'
            onClick={handleLogout}
            className='flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm font-bold text-red-600 transition hover:bg-red-100'
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* =========================================================
          MOBILE MORE OVERLAY
      ========================================================= */}
      {isMoreOpen && (
        <div
          className='fixed inset-0 z-[65] bg-black/40 backdrop-blur-sm xl:hidden'
          onClick={() => setIsMoreOpen(false)}
        />
      )}

      {/* =========================================================
          MOBILE MORE BOTTOM SHEET
      ========================================================= */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[75] rounded-t-[28px] border-t border-[#E8E4DC] bg-white shadow-[0_-15px_50px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out xl:hidden ${
          isMoreOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle */}
        <div className='flex justify-center pt-3'>
          <div className='h-1.5 w-12 rounded-full bg-[#D8D4CC]' />
        </div>

        <div className='p-5 pb-7'>
          <div className='mb-5 flex items-center justify-between'>
            <div>
              <h2 className='text-base font-bold text-[#1A1A18]'>More</h2>

              <p className='mt-0.5 text-[11px] text-[#8C887B]'>
                Additional admin sections
              </p>
            </div>

            <button
              type='button'
              onClick={() => setIsMoreOpen(false)}
              className='rounded-xl p-2 text-[#6B6860] transition hover:bg-[#F7F5F0]'
            >
              <X size={19} />
            </button>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            {mobileMoreItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMoreOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl border p-4 transition ${
                    active
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-[#E8E4DC] bg-[#FAF8F5] text-[#6B6860] hover:bg-white'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      active ? 'bg-emerald-100' : 'bg-white'
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <span className='text-xs font-bold'>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile Logout */}
          <button
            type='button'
            onClick={handleLogout}
            className='mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 p-3.5 text-xs font-bold text-red-600 transition hover:bg-red-100'
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </div>

      <div className='min-h-screen xl:ml-72'>
        <header
          className={`sticky top-0 z-40 border-b transition-all duration-300 xl:hidden ${
            isScrolled
              ? 'border-[#E8E4DC] bg-white/95 shadow-sm backdrop-blur-xl'
              : 'border-[#E8E4DC] bg-white'
          }`}
        >
          <div className='flex h-[68px] items-center justify-between px-4'>
            {/* Menu */}
            <button
              type='button'
              onClick={() => setIsSidebarOpen(true)}
              className='flex h-11 w-11 items-center justify-center rounded-xl text-[#1A1A18] transition hover:bg-[#F7F5F0] active:scale-95'
              aria-label='Open navigation'
            >
              <Menu size={23} />
            </button>

            <div className='flex min-w-0 flex-1 items-center justify-center gap-2 px-3'>
              <span className='h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-500' />

              <span className='truncate text-xs font-black uppercase tracking-[0.18em] text-[#6B6860]'>
                {pathname === '/control'
                  ? 'Dashboard'
                  : navItems.find((item) => isActive(item.href))?.name ||
                    'Admin'}
              </span>
            </div>

            <button
              type='button'
              onClick={() => setIsMoreOpen(true)}
              className='flex h-11 w-11 items-center justify-center rounded-xl text-[#1A1A18] transition hover:bg-[#F7F5F0] active:scale-95'
              aria-label='More options'
            >
              <MoreHorizontal size={23} />
            </button>
          </div>
        </header>

        <main className='w-full'>
          <div className='mx-auto w-full max-w-[1500px] p-4 pb-28 sm:p-6 sm:pb-28 lg:p-8 lg:pb-10'>
            <div className='animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out'>
              {children}
            </div>
          </div>
        </main>
      </div>

      <nav className='fixed inset-x-3 bottom-3 z-[60] rounded-[24px] border border-[#E4E0D8] bg-white/95 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl xl:hidden'>
        <div className='grid grid-cols-5 gap-1'>
          {mobileDockItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 transition-all active:scale-95 ${
                  active
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-[#8C887B] hover:bg-[#F7F5F0] hover:text-[#1A1A18]'
                }`}
              >
                {active && (
                  <span className='absolute -top-1 h-1 w-5 rounded-full bg-emerald-500' />
                )}

                <Icon size={19} strokeWidth={active ? 2.5 : 2} />

                <span className='max-w-full truncate text-[9px] font-bold'>
                  {item.name}
                </span>
              </Link>
            )
          })}

          <button
            type='button'
            onClick={() => setIsMoreOpen(true)}
            className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 text-[#8C887B] transition-all hover:bg-[#F7F5F0] hover:text-[#1A1A18] active:scale-95 ${
              isMoreOpen ? 'bg-emerald-50 text-emerald-700' : ''
            }`}
          >
            <MoreHorizontal size={19} />

            <span className='text-[9px] font-bold'>More</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
