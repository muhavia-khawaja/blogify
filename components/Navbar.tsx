import Link from 'next/link'
import React from 'react'
import { HiOutlineMenu, HiChevronDown } from 'react-icons/hi'
import { getAllCategories } from '@/utils/actions'

export default async function Navbar() {
  const categories = await getAllCategories()

  return (
    <nav className='bg-white/80 border-b border-[#E5E7EB] sticky top-0 z-[100] backdrop-blur-xl'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        <div className='flex justify-between items-center h-20'>
          <Link href='/' className='flex items-center gap-3 group shrink-0'>
            <div className='w-10 h-10 bg-[#111827] rounded-2xl flex items-center justify-center shadow-xl group-hover:bg-[#2563EB] transition-all duration-500'>
              <span className='text-white font-black italic text-xl'>B</span>
            </div>
            <span className='text-2xl font-black text-[#111827] tracking-tighter italic'>
              Blogify<span className='text-[#2563EB]'>.</span>
            </span>
          </Link>

          <div className='hidden md:flex gap-10 items-center'>
            <Link
              href='/'
              className='text-[11px] font-black uppercase tracking-[0.2em] text-[#111827] hover:text-[#2563EB] transition-colors'
            >
              Home
            </Link>

            <div className='group relative py-8'>
              <button className='flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#111827] group-hover:text-[#2563EB] transition-colors'>
                Categories
                <HiChevronDown
                  className='group-hover:rotate-180 transition-transform duration-500 text-[#2563EB]'
                  size={14}
                />
              </button>

              <div className='absolute top-full left-1/2 -translate-x-1/2 w-[600px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 pt-2'>
                <div className='bg-white shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] border border-[#E5E7EB] rounded-[2.5rem] overflow-hidden p-8 grid grid-cols-12 gap-8'>
                  <div className='col-span-7'>
                    <h3 className='text-[10px] font-black uppercase tracking-[0.3em] text-[#2563EB] mb-6'>
                      Explore Topics
                    </h3>
                    <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/blog?category=${cat.slug}`}
                          className='text-sm font-bold text-[#111827] hover:bg-[#F9FAFB] hover:text-[#2563EB] p-3 rounded-2xl transition-all'
                        >
                          {cat.title}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className='col-span-5 bg-[#F9FAFB] rounded-[2rem] p-8 flex flex-col justify-center text-center border border-[#E5E7EB]'>
                    <p className='text-xs font-black uppercase tracking-tight text-[#111827] mb-3'>
                      The Full Archive
                    </p>
                    <p className='text-[11px] text-[#6B7280] leading-relaxed mb-6 font-medium'>
                      Deep dives into code, design, and modern philosophy.
                    </p>
                    <Link
                      href='/blog'
                      className='bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-[#2563EB] transition-all'
                    >
                      View All Posts
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href='/about'
              className='text-[11px] font-black uppercase tracking-[0.2em] text-[#111827] hover:text-[#2563EB] transition-colors'
            >
              About
            </Link>
            <Link
              href='/contact'
              className='text-[11px] font-black uppercase tracking-[0.2em] text-[#111827] hover:text-[#2563EB] transition-colors'
            >
              Contact
            </Link>
          </div>

          <div className='hidden md:flex items-center gap-4'>
            <Link
              href='/subscribe'
              className='px-8 py-3.5 bg-[#2563EB] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-blue-200 hover:bg-[#111827] hover:shadow-none transition-all duration-300'
            >
              Subscribe
            </Link>
          </div>

          <div className='md:hidden'>
            <label
              htmlFor='my-drawer'
              className='p-2 text-[#111827] hover:text-[#2563EB] transition-colors cursor-pointer'
            >
              <HiOutlineMenu size={28} />
            </label>
          </div>
        </div>
      </div>

      <div className='drawer drawer-end z-[100]'>
        <input id='my-drawer' type='checkbox' className='drawer-toggle' />
        <div className='drawer-side'>
          <label htmlFor='my-drawer' className='drawer-overlay'></label>
          <div className='p-10 w-80 min-h-full bg-white flex flex-col'>
            <div className='flex justify-between items-center mb-16'>
              <span className='text-2xl font-black italic tracking-tighter text-[#111827]'>
                Blogify<span className='text-[#2563EB]'>.</span>
              </span>
              <label
                htmlFor='my-drawer'
                className='cursor-pointer p-2 hover:bg-[#F9FAFB] rounded-full'
              >
                ✕
              </label>
            </div>

            <nav className='flex flex-col gap-8'>
              <Link
                href='/'
                className='text-sm font-black uppercase tracking-widest text-[#111827]'
              >
                Home
              </Link>

              <div className='space-y-4'>
                <p className='text-[10px] font-black uppercase tracking-[0.3em] text-[#2563EB]'>
                  Categories
                </p>
                <div className='flex flex-col gap-3 pl-4 border-l-2 border-[#F9FAFB]'>
                  {categories.slice(0, 5).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/blog?category=${cat.slug}`}
                      className='text-sm font-bold text-[#6B7280] hover:text-[#111827]'
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href='/about'
                className='text-sm font-black uppercase tracking-widest text-[#111827]'
              >
                About
              </Link>
              <Link
                href='/contact'
                className='text-sm font-black uppercase tracking-widest text-[#111827]'
              >
                Contact
              </Link>
            </nav>

            <div className='mt-auto'>
              <Link
                href='/subscribe'
                className='block text-center bg-[#2563EB] text-white text-[10px] font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-blue-100'
              >
                Join the Newsletter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
