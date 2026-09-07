'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PenBox,
  BookOpen,
  User,
  LogIn,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { getCurrentUser } from '@/utils/actions'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 w-full z-40 transition-all duration-500 px-6 py-4 ${
          isScrolled
            ? 'bg-[#FAF9F5]/90 backdrop-blur-xl border-b border-[#E8E3DA] py-3 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <a
              href='https://ewhamza.com'
              className='hidden sm:flex items-center gap-1.5 text-xs font-mono font-semibold tracking-wider text-[#58544D] hover:text-[#161513] transition-colors bg-black/5 hover:bg-black/10 px-3 py-1.5 rounded-full border border-black/5'
            >
              <ArrowLeft size={12} className='text-emerald-700' />
              ewhamza.com
            </a>
            <Link href='/'>
              <h1 className='text-xl md:text-2xl font-bold tracking-tight cursor-pointer group flex items-center gap-1.5 text-[#161513]'>
                <span className='font-mono font-normal text-[#8A8478]'>
                  ewhamza /
                </span>
                <span className='font-serif italic text-[#161513]'>
                  journal
                </span>
                <span className='text-emerald-600 group-hover:translate-x-0.5 transition-transform inline-block'>
                  .
                </span>
              </h1>
            </Link>
          </div>

          <div className='hidden md:flex items-center gap-8 text-sm font-medium'>
            <nav className='flex items-center gap-6 text-[#58544D]'>
              <Link
                href='/blog'
                className='hover:text-[#161513] transition-colors'
              >
                Archive
              </Link>
              <Link
                href='/about'
                className='hover:text-[#161513] transition-colors'
              >
                Our Story
              </Link>
            </nav>

            <div className='h-4 w-[1px] bg-[#E3DFD7]' />

            <div className='flex items-center gap-5'>
              <Link
                href='/write'
                className='flex items-center gap-2 text-[#58544D] hover:text-[#161513] transition-colors'
              >
                <PenBox size={18} className='text-emerald-700' />
                <span className='hidden lg:inline font-semibold'>Write</span>
              </Link>

              {user ? (
                <Link
                  href='/profile'
                  className='flex items-center gap-2 text-[#161513] font-medium transition-colors'
                >
                  <div className='w-8 h-8 rounded-full bg-emerald-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm ring-2 ring-emerald-950/10'>
                    {user.name ? user.name[0] : 'U'}
                  </div>
                  <span className='hidden lg:inline text-[#2C2B28] font-semibold'>
                    {user.name}
                  </span>
                </Link>
              ) : (
                <Link
                  href='/login'
                  className='flex items-center gap-2 text-[#58544D] hover:text-[#161513] transition-colors'
                >
                  <LogIn size={18} />
                  <span className='hidden lg:inline font-semibold'>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      <div className='md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[92vw]'>
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className='flex items-center gap-3 sm:gap-4 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-2xl border border-[#E3DFD7] shadow-[0_10px_30px_rgba(0,0,0,0.08)]'
        >
          <Link
            href='/blog'
            className='p-3 text-[#58544D] hover:text-emerald-800 hover:bg-black/5 rounded-full transition-all active:scale-95'
            title='Archive'
          >
            <BookOpen size={20} />
          </Link>

          <Link href='/write' className='relative group px-1 mx-0.5'>
            <div className='absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 blur-sm opacity-50 group-hover:opacity-80 transition duration-300' />
            <div className='relative p-3.5 bg-emerald-900 text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform'>
              <PenBox size={22} className='stroke-[2.5]' />
            </div>
          </Link>

          <Link
            href='/about'
            className='p-3 text-[#58544D] hover:text-emerald-800 hover:bg-black/5 rounded-full transition-all active:scale-95'
            title='Our Story'
          >
            <Sparkles size={20} />
          </Link>

          {user ? (
            <Link
              href='/profile'
              className='p-1 hover:bg-black/5 rounded-full transition-all active:scale-95 flex items-center justify-center'
              title='Profile'
            >
              <div className='w-9 h-9 rounded-full bg-emerald-900 text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-emerald-900/20'>
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            </Link>
          ) : (
            <Link
              href='/login'
              className='p-3 text-[#58544D] hover:text-emerald-800 hover:bg-black/5 rounded-full transition-all active:scale-95'
              title='Login'
            >
              <User size={20} />
            </Link>
          )}
        </motion.div>
      </div>
    </>
  )
}

export default Navbar
