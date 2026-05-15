import React from 'react'
import Link from 'next/link'
import {
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiGithub,
  FiArrowUpRight,
} from 'react-icons/fi'
import { getAllCategories } from '@/utils/actions'
import { link } from 'fs'

export default async function Footer() {
  const categories = await getAllCategories()
  const displayCategories = categories?.slice(0, 4) || []
  const links = [
    { text: 'Home', link: '/' },
    { text: 'Archive', link: '/blog' },
    { text: 'Our Story', link: '/about' },
    { text: 'Contact', link: '/contact' },
  ]

  return (
    <footer className='bg-[#0A0A0A] text-[#F9F7F2] border-t border-white/5'>
      <div className='max-w-7xl mx-auto px-6 pt-24 pb-12'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24'>
          <div className='lg:col-span-5 space-y-8'>
            <Link href='/' className='inline-flex items-center gap-3'>
              <span className='text-3xl font-serif italic font-bold tracking-tighter'>
                Journal<span className='text-emerald-500 not-italic'>.</span>
              </span>
            </Link>
            <p className='text-lg text-gray-400 font-serif italic leading-relaxed max-w-sm'>
              Curating thoughts on design, architecture, and the digital
              lifestyle.
            </p>
          </div>

          <div className='lg:col-span-7 bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm'>
            <h3 className='text-xl font-serif font-bold mb-2'>
              Join the Journal
            </h3>
            <p className='text-sm text-gray-400 mb-6'>
              Get curated monthly insights directly to your inbox.
            </p>
            <form className='flex flex-col sm:flex-row gap-3'>
              <input
                type='email'
                placeholder='email@example.com'
                className='bg-transparent border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 flex-1 transition-all'
              />
              <button className='bg-[#F9F7F2] text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2'>
                Subscribe <FiArrowUpRight />
              </button>
            </form>
          </div>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-12 mb-24 border-t border-white/10 pt-16'>
          <div>
            <h3 className='text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-8'>
              Navigation
            </h3>
            <ul className='space-y-4 font-medium text-sm'>
              {links.map((link) => (
                <li key={link.text}>
                  <Link
                    href={link.link}
                    className='text-gray-400 hover:text-white transition-colors'
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-8'>
              Categories
            </h3>
            <ul className='space-y-4 font-medium text-sm'>
              {displayCategories.map((cat: any) => (
                <li key={cat.id}>
                  <Link
                    href={`/blog?category=${cat.slug}`}
                    className='text-gray-400 hover:text-white transition-colors'
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className='col-span-2 md:col-span-2'>
            <h3 className='text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-8'>
              The Philosophy
            </h3>
            <p className='text-sm text-gray-500 leading-loose'>
              We believe in quality over quantity. Every piece is meticulously
              crafted to provide long-term value to our readers. Our archive is
              a living document of digital evolution.
            </p>
          </div>
        </div>

        <div className='pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6'>
          <p className='text-[10px] font-black uppercase tracking-[0.4em] text-gray-600'>
            © 2026 JOURNAL. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  )
}
