import React from 'react'
import Link from 'next/link'
import { FiTwitter, FiInstagram, FiLinkedin, FiGithub } from 'react-icons/fi'
import { getAllCategories } from '@/utils/actions'

export default async function Footer() {
  const categories = await getAllCategories()
  const displayCategories = categories?.slice(0, 4) || []

  return (
    <footer className='bg-[#111827] text-[#F9FAFB] border-t border-white/5'>
      <div className='max-w-7xl mx-auto px-6 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 mb-12'>
          <div className='space-y-6'>
            <Link href='/' className='inline-flex items-center gap-3'>
              <div className='w-10 h-10 bg-[#2563EB] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20'>
                <span className='text-white font-black italic text-xl'>B</span>
              </div>
              <span className='text-2xl font-black tracking-tighter italic'>
                Blogify<span className='text-[#2563EB]'>.</span>
              </span>
            </Link>
            <p className='text-sm text-[#6B7280] font-medium leading-relaxed max-w-xs'>
              Curating insights for the modern developer. Built for those who
              build the future.
            </p>
            <div className='flex gap-5'>
              {[FiTwitter, FiInstagram, FiLinkedin, FiGithub].map(
                (Icon, idx) => (
                  <a
                    key={idx}
                    href='#'
                    className='text-[#6B7280] hover:text-[#2563EB] transition-colors'
                  >
                    <Icon size={20} />
                  </a>
                ),
              )}
            </div>
          </div>

          <div>
            <h3 className='text-[10px] font-black uppercase tracking-[0.3em] text-[#2563EB] mb-6'>
              Navigation
            </h3>
            <ul className='space-y-4 font-bold text-sm'>
              {['Home', 'Blog', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className='text-[#6B7280] hover:text-white transition-all hover:pl-2'
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-[10px] font-black uppercase tracking-[0.3em] text-[#2563EB] mb-6'>
              Categories
            </h3>
            <ul className='space-y-4 font-bold text-sm'>
              {displayCategories.map((cat: any) => (
                <li key={cat.id}>
                  <Link
                    href={`/blog?category=${cat.slug || cat.id}`}
                    className='text-[#6B7280] hover:text-white transition-all hover:pl-2'
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-[10px] font-black uppercase tracking-widest text-[#4B5563]'>
            © 2026 Blogify. ARCHIVE 01-A
          </p>
          <p className='text-[10px] font-black uppercase tracking-widest text-[#4B5563] flex items-center gap-2'>
            Handcrafted with <span className='text-[#2563EB]'>/</span> Blogify
            Team
          </p>
        </div>
      </div>
    </footer>
  )
}
