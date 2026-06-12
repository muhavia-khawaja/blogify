'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
} from 'lucide-react'
import { logout } from '@/utils/actions'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const isLoginPage = pathname === '/login' || pathname === '/control/login'

  const navItems = [
    { name: 'Dashboard', href: '/control', icon: LayoutDashboard },
    { name: 'Articles', href: '/control/articles', icon: FileText },
    { name: 'Categories', href: '/control/categories', icon: Tags },
    { name: 'Reviews', href: '/control/reviews', icon: MessageSquare },
    { name: 'Contacts', href: '/control/contact', icon: MessageCircle },
    { name: 'Authors', href: '/control/author', icon: User },
  ]

  const isActive = (path: string) => {
    if (path === '/control') return pathname === '/control'
    return pathname.startsWith(path)
  }

  const handleLogout = async () => {
    await logout()
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isLoginPage) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#F9F8F6] via-[#F5F3F0] to-[#F1EEEB]'>
        {children}
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#FAFAF8]'>
      
      <aside className='hidden lg:flex flex-col fixed inset-y-0 left-0 w-80 bg-white border-r border-[#E8E4DC] z-50'>
        
        <div className='p-8 border-b border-[#E8E4DC]'>
          <Link
            href='/control'
            className='inline-flex items-center gap-2.5 group'
          >
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300'>
              <Zap size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p className='text-[10px] font-black uppercase tracking-[0.3em] text-[#9B9890]'>
                Content Hub
              </p>
              <p className='text-sm font-serif font-bold text-[#1A1A18]'>
                Registry
              </p>
            </div>
          </Link>
        </div>

        
        <nav className='flex-1 px-6 py-8 space-y-1.5 overflow-y-auto'>
          <p className='text-[9px] font-black uppercase tracking-[0.3em] text-[#9B9890] px-3 mb-5'>
            Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-emerald-50 to-emerald-50/50 text-emerald-700 shadow-sm border border-emerald-200/50'
                    : 'text-[#6B6860] hover:bg-[#F7F5F0] hover:text-[#1A1A18]'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 2}
                    className={
                      active
                        ? ''
                        : 'group-hover:translate-x-0.5 transition-transform'
                    }
                  />
                  <span className='font-bold text-sm'>{item.name}</span>
                </div>
                {active && <ChevronRight size={18} className='opacity-60' />}
              </Link>
            )
          })}
        </nav>

        
        <div className='p-6 border-t border-[#E8E4DC] bg-[#FEFDFB]'>
          <button
            onClick={handleLogout}
            className='group flex items-center gap-3 w-full px-4 py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200'
          >
            <LogOut
              size={20}
              className='group-hover:-translate-x-0.5 transition-transform'
            />
            Logout
          </button>
        </div>
      </aside>

      
      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-in fade-in duration-300'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-all duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        <div className='p-6 border-b border-[#E8E4DC] flex items-center justify-between'>
          <Link href='/control' className='inline-flex items-center gap-2.5'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg'>
              <Zap size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p className='text-[9px] font-black uppercase tracking-[0.2em] text-[#9B9890]'>
                Content Hub
              </p>
              <p className='text-sm font-serif font-bold text-[#1A1A18]'>
                Registry
              </p>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className='p-2 hover:bg-[#F7F5F0] rounded-lg transition-colors'
          >
            <X size={24} className='text-[#1A1A18]' />
          </button>
        </div>

        {/* Mobile Nav */}
        <nav className='p-6 space-y-1.5'>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-bold text-sm ${
                  active
                    ? 'bg-gradient-to-r from-emerald-50 to-emerald-50/50 text-emerald-700 border border-emerald-200/50'
                    : 'text-[#6B6860] hover:bg-[#F7F5F0]'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            )
          })}

          <button
            onClick={handleLogout}
            className='flex items-center gap-3 w-full px-4 py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200 mt-8'
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className='lg:ml-80 flex flex-col min-h-screen'>
        {/* Mobile Header */}
        <header
          className={`lg:hidden sticky top-0 z-40 transition-all duration-300 ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-[#E8E4DC]'
              : 'bg-white border-b border-[#E8E4DC]'
          }`}
        >
          <div className='px-4 py-4 flex items-center justify-between'>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className='p-2.5 hover:bg-[#F7F5F0] rounded-lg transition-colors'
            >
              <Menu size={24} className='text-[#1A1A18]' />
            </button>

            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
              <p className='text-xs font-black uppercase tracking-[0.2em] text-[#9B9890]'>
                Admin
              </p>
            </div>

            <div className='w-10' />
          </div>
        </header>

        
        <main className='flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full'>
          <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out'>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
