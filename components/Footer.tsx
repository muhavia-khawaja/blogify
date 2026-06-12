import React from 'react'
import Link from 'next/link'
import {
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiGithub,
} from 'react-icons/fi'
import { getAllCategories } from '@/utils/actions'

const NAV_LINKS = [
  { text: 'Home', href: '/' },
  { text: 'Archive', href: '/blog' },
  { text: 'Our Story', href: '/about' },
  { text: 'Contact', href: '/contact' },
]

const SOCIAL = [
  { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
]

export default async function Footer() {
  const categories = await getAllCategories()
  const displayCategories = categories?.slice(0, 5) || []

  return (
    <footer className='bg-[#0A0A0A] text-[#F9F7F2] border-t border-white/5'>
      <div className='max-w-7xl mx-auto px-6 pt-20 pb-10'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5'>
          <div className='lg:col-span-5 space-y-7'>
            <Link href='/' className='inline-block'>
              <span className='text-3xl font-serif italic font-bold tracking-tighter'>
                Journal<span className='text-emerald-500 not-italic'>.</span>
              </span>
            </Link>

            <p className='text-base font-serif italic text-gray-500 leading-relaxed max-w-xs'>
              Curating thoughts on design, architecture, and the digital
              lifestyle.
            </p>

            <div className='flex items-center gap-3'>
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  className='w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all'
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-10 py-16 border-b border-white/5'>
          <div>
            <h4 className='text-[9px] font-black uppercase tracking-[0.35em] text-emerald-500 mb-7'>
              Navigation
            </h4>
            <ul className='space-y-3.5'>
              {NAV_LINKS.map(({ text, href }) => (
                <li key={text}>
                  <Link
                    href={href}
                    className='text-sm font-serif text-gray-500 hover:text-white transition-colors'
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='text-[9px] font-black uppercase tracking-[0.35em] text-emerald-500 mb-7'>
              Categories
            </h4>
            <ul className='space-y-3.5'>
              {displayCategories.map((cat: any) => (
                <li key={cat.id}>
                  <Link
                    href={`/blog?category=${cat.slug}`}
                    className='text-sm font-serif text-gray-500 hover:text-white transition-colors'
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
              {displayCategories.length === 0 && (
                <li className='text-sm font-serif italic text-gray-700'>
                  No categories yet
                </li>
              )}
            </ul>
          </div>

          <div className='col-span-2'>
            <h4 className='text-[9px] font-black uppercase tracking-[0.35em] text-emerald-500 mb-7'>
              The Philosophy
            </h4>
            <p className='text-sm font-serif italic text-gray-600 leading-[1.9]'>
              We believe in quality over quantity. Every piece is meticulously
              crafted to provide long-term value. Our archive is a living
              document of digital evolution — built for the curious mind.
            </p>

            <div className='flex items-center gap-3 mt-7'>
              <span className='h-px w-8 bg-emerald-500/40' />
              <span className='text-[9px] font-black uppercase tracking-[0.3em] text-emerald-700'>
                Est. 2024
              </span>
            </div>
          </div>
        </div>

        <div className='pt-8 flex flex-col sm:flex-row justify-between items-center gap-4'>
          <p className='text-[9px] font-black uppercase tracking-[0.4em] text-gray-700'>
            © {new Date().getFullYear()} Journal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
