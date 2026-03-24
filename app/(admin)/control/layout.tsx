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
  PlusCircle,
  ShieldCheck,
  User,
  MessageCircle,
} from 'lucide-react'
import { logout } from '@/utils/actions'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

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

  if (isLoginPage) {
    return <div className='min-h-screen bg-white'>{children}</div>
  }

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      <aside className='hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 sticky top-0 h-screen shadow-sm'>
        <div className='p-8'>
          <Link
            href='/control'
            className='text-2xl font-black text-blue-600 flex items-center gap-2 tracking-tighter'
          >
            <ShieldCheck size={28} strokeWidth={3} />
            Blogify<span className='text-gray-900'>CMS</span>
          </Link>
        </div>

        <nav className='flex-1 px-6 space-y-2'>
          <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2'>
            Main Menu
          </p>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon
                size={20}
                strokeWidth={isActive(item.href) ? 2.5 : 2}
              />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className='p-6 border-t border-gray-100 bg-gray-50/50'>
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all group'
          >
            <LogOut
              size={20}
              className='group-hover:-translate-x-1 transition-transform'
            />
            Logout Session
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='p-6 flex justify-between items-center border-b border-gray-50'>
          <span className='font-black text-blue-600 text-xl tracking-tight'>
            GEOLOGY CMS
          </span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className='p-2 bg-gray-100 rounded-lg'
          >
            <X size={20} />
          </button>
        </div>
        <nav className='p-6 space-y-3'>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl text-base font-bold ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'text-gray-600 bg-gray-50'
              }`}
            >
              <item.icon size={22} /> {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 w-full px-5 py-4 text-base font-bold text-red-600 bg-red-50 rounded-xl mt-10'
          >
            <LogOut size={22} /> Logout
          </button>
        </nav>
      </aside>

      <div className='flex-1 flex flex-col min-w-0'>
        <header className='lg:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md bg-white/80'>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className='p-2 bg-gray-50 text-gray-600 rounded-xl border border-gray-100 shadow-sm'
          >
            <Menu size={24} />
          </button>
          <span className='font-black text-blue-600 text-lg tracking-tighter italic'>
            BLOG ADMIN
          </span>
          <div className='w-10'></div>
        </header>

        <main className='p-4 md:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500'>
          {children}
        </main>
      </div>
    </div>
  )
}
