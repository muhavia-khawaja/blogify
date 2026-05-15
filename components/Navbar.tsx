'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, PenBox, Bell, Menu, X, Sparkles, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { getCurrentUser } from '@/utils/actions'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

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
        const user = await getCurrentUser()
        setUser(user)
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
        className={`fixed top-0 w-full z-50 transition-all duration-500 px-6 py-4 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <Link href='/'>
            <h1 className='text-2xl md:text-3xl font-serif font-bold tracking-tight cursor-pointer group'>
              Journal
              <span className='text-emerald-500 group-hover:text-black transition-colors'>
                .
              </span>
            </h1>
          </Link>

          <div className='hidden md:flex items-center gap-8 text-sm font-medium'>
            <nav className='flex items-center gap-6 text-gray-500'>
              <Link href='/blog' className='hover:text-black transition-colors'>
                Archive
              </Link>

              <Link
                href='/about'
                className='hover:text-black transition-colors'
              >
                Our Story
              </Link>
            </nav>

            <div className='h-4 w-[1px] bg-gray-200'></div>

            <div className='flex items-center gap-5'>
              <Link
                href='/control/write'
                className='flex items-center gap-2 text-gray-600 hover:text-black transition-colors'
              >
                <PenBox size={18} />
                <span className='hidden lg:inline'>Write</span>
              </Link>

              {user ? (
                <Link
                  href='/profile'
                  className='flex items-center gap-2 text-gray-600 hover:text-black transition-colors'
                >
                  <Bell size={18} />
                  <span className='hidden lg:inline'>{user.name}</span>
                </Link>
              ) : (
                <Link
                  href='/login'
                  className='flex items-center gap-2 text-gray-600 hover:text-black transition-colors'
                >
                  <Bell size={18} />
                  <span className='hidden lg:inline'>Login</span>
                </Link>
              )}
            </div>
          </div>

          <div className='md:hidden flex items-center gap-4'>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className='p-2 bg-gray-50 rounded-xl text-black border border-gray-100'
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className='fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden'
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed right-0 top-0 bottom-0 w-[80%] z-[70] bg-white shadow-2xl p-8 flex flex-col md:hidden'
            >
              <div className='flex justify-between items-center mb-12'>
                <span className='font-serif font-bold text-xl'>Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                >
                  <X size={24} />
                </button>
              </div>

              <div className='flex flex-col gap-6'>
                <MobileLink
                  href='/blog'
                  icon={<BookOpen size={20} />}
                  label='The Archive'
                  onClick={() => setMobileMenuOpen(false)}
                />
                <MobileLink
                  href='/categories'
                  icon={<Sparkles size={20} />}
                  label='Trending Topics'
                  onClick={() => setMobileMenuOpen(false)}
                />
                <MobileLink
                  href='/control/articles'
                  icon={<PenBox size={20} />}
                  label='Write a Story'
                  onClick={() => setMobileMenuOpen(false)}
                />
              </div>

              <div className='mt-auto space-y-4'>
                <div className='p-4 bg-gray-50 rounded-2xl border border-gray-100'>
                  <p className='text-xs text-gray-500 font-medium leading-relaxed'>
                    Join 5,000+ readers getting weekly insights directly in
                    their inbox.
                  </p>
                </div>
                <button className='w-full bg-black text-white py-4 rounded-2xl font-bold active:scale-95 transition-transform'>
                  Get Unlimited Access
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

const MobileLink = ({
  href,
  icon,
  label,
  onClick,
}: {
  href: string
  icon: React.ReactNode
  label: string
  onClick: () => void
}) => (
  <Link
    href={href}
    onClick={onClick}
    className='flex items-center gap-4 text-2xl font-bold text-gray-900 hover:text-emerald-500 transition-colors py-2'
  >
    <span className='text-gray-300'>{icon}</span>
    {label}
  </Link>
)

export default Navbar
