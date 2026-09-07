import React from 'react'
import Link from 'next/link'
import {
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiGithub,
  FiGlobe,
  FiExternalLink,
} from 'react-icons/fi'
import { getAllCategories } from '@/utils/actions'

const NAV_LINKS = [
  { text: 'Home', href: '/' },
  { text: 'Archive', href: '/blog' },
  { text: 'Our Story', href: '/about' },
  { text: 'Contact', href: '/contact' },
]

const ECOSYSTEM_LINKS = [
  { text: 'ewhamza.com', href: 'https://ewhamza.com' },
  { text: 'Academy', href: 'https://academy.ewhamza.com' },
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
    <footer className='bg-[#0A0A0A] text-[#F9F7F2] border-t border-white/10 pb-28 md:pb-0 relative z-30'>
      <div className='max-w-7xl mx-auto px-6 pt-20 pb-12'>
        
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10'>
          <div className='lg:col-span-7 space-y-6'>
            <Link href='/' className='inline-block group'>
              <span className='text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-1.5 text-white'>
                <span className='font-mono text-neutral-500 font-normal'>ewhamza /</span>
                <span className='font-serif italic text-white'>journal</span>
                <span className='text-emerald-500 not-italic group-hover:translate-x-0.5 transition-transform inline-block'>
                  .
                </span>
              </span>
            </Link>

            <p className='text-sm md:text-base font-serif italic text-neutral-400 leading-relaxed max-w-md'>
              Curating insights on web architecture, full-stack systems, and continuous learning.
            </p>

            <div className='flex items-center gap-3 pt-2'>
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  className='w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all'
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        
        <div className='grid grid-cols-2 md:grid-cols-4 gap-10 py-16 border-b border-white/10'>
          
          <div>
            <h4 className='text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-emerald-400 mb-6'>
              Navigation
            </h4>
            <ul className='space-y-3'>
              {NAV_LINKS.map(({ text, href }) => (
                <li key={text}>
                  <Link
                    href={href}
                    className='text-sm font-serif text-neutral-400 hover:text-white transition-colors'
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h4 className='text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-emerald-400 mb-6'>
              Topics
            </h4>
            <ul className='space-y-3'>
              {displayCategories.map((cat: any) => (
                <li key={cat.id || cat.slug}>
                  <Link
                    href={`/blog?category=${cat.slug}`}
                    className='text-sm font-serif text-neutral-400 hover:text-white transition-colors'
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
              {displayCategories.length === 0 && (
                <li className='text-sm font-serif italic text-neutral-600'>
                  No categories yet
                </li>
              )}
            </ul>
          </div>

          
          <div>
            <h4 className='text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-emerald-400 mb-6'>
              Ecosystem
            </h4>
            <ul className='space-y-3'>
              {ECOSYSTEM_LINKS.map(({ text, href }) => (
                <li key={text}>
                  <a
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-sm font-serif text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5'
                  >
                    {text}
                    <FiExternalLink size={12} className='text-neutral-500' />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h4 className='text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-emerald-400 mb-6'>
              Philosophy
            </h4>
            <p className='text-xs font-serif italic text-neutral-400 leading-relaxed'>
              Living documentation on software, design patterns, and engineering notes.
            </p>

            <div className='flex items-center gap-2.5 mt-6'>
              <span className='h-px w-5 bg-emerald-500/50' />
              <span className='text-[10px] font-mono text-emerald-400/90 tracking-wider uppercase'>
                ewhamza.com
              </span>
            </div>
          </div>
        </div>

        
        <div className='pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-neutral-500 text-xs font-mono'>
          <p>
            © {new Date().getFullYear()} ewhamza.com. All rights reserved.
          </p>
          <a
            href='https://ewhamza.com'
            className='hover:text-emerald-400 transition-colors flex items-center gap-1.5'
          >
            <FiGlobe size={13} />
            <span>Main Network</span>
          </a>
        </div>
      </div>
    </footer>
  )
}