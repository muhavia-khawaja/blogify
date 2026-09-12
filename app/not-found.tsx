import Link from 'next/link'
import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi'

export default function NotFound() {
  return (
    <main className='relative min-h-screen overflow-hidden bg-[#FCFBF9] text-[#171717]'>
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#3d348b]/5 blur-3xl' />
        <div className='absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-emerald-500/5 blur-3xl' />

        <div
          className='absolute inset-0 opacity-[0.035]'
          style={{
            backgroundImage:
              'linear-gradient(#171717 1px, transparent 1px), linear-gradient(90deg, #171717 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className='relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-12'>
        <header className='flex items-center justify-between'>
          <Link href='/' className='group flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#3d348b] text-sm font-black text-white shadow-lg shadow-[#3d348b]/15 transition-transform duration-300 group-hover:-rotate-3'>
              EW
            </div>

            <div className='hidden sm:block'>
              <p className='text-xs font-black uppercase tracking-[0.22em] text-gray-950'>
                Education With Hamza
              </p>

              <p className='mt-0.5 text-[9px] font-bold uppercase tracking-[0.25em] text-gray-400'>
                The Journal
              </p>
            </div>
          </Link>

          <div className='flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-2 backdrop-blur-sm'>
            <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />

            <span className='text-[9px] font-black uppercase tracking-[0.2em] text-gray-500'>
              Error 404
            </span>
          </div>
        </header>

        <div className='flex flex-1 items-center justify-center py-16 lg:py-10'>
          <div className='grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20'>
            <div className='relative'>
              <div className='mb-8 flex items-center gap-3'>
                <span className='h-px w-10 bg-[#3d348b]' />

                <span className='text-[9px] font-black uppercase tracking-[0.35em] text-[#3d348b]'>
                  Page not found
                </span>
              </div>

              <div className='relative select-none'>
                <span
                  className='absolute -left-3 -top-8 font-serif
                    text-[8rem] font-bold leading-none
                    text-[#3d348b]/[0.035]
                    sm:text-[12rem]
                    lg:text-[15rem]'
                >
                  404
                </span>

                <h1
                  className='relative font-serif text-[7rem]
                    font-bold leading-[0.78] tracking-[-0.08em]
                    text-[#171717]
                    sm:text-[10rem]
                    lg:text-[13rem]'
                >
                  404
                </h1>
              </div>

              <div className='mt-8 flex items-center gap-4'>
                <div className='h-1 w-20 rounded-full bg-[#3d348b]' />
                <div className='h-1 w-8 rounded-full bg-[#7678ed]' />
                <div className='h-1 w-3 rounded-full bg-emerald-500' />
              </div>

              <div
                className='absolute -bottom-8 right-0 hidden
                  w-52 rotate-3 rounded-2xl border
                  border-gray-200 bg-white p-5
                  shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                  sm:block lg:-right-4'
              >
                <div className='mb-4 flex items-center justify-between'>
                  <span className='text-[8px] font-black uppercase tracking-[0.2em] text-gray-400'>
                    Archive
                  </span>

                  <FiArrowUpRight className='h-4 w-4 text-[#3d348b]' />
                </div>

                <div className='space-y-2'>
                  <div className='h-2 w-3/4 rounded-full bg-gray-100' />
                  <div className='h-2 w-full rounded-full bg-gray-100' />
                  <div className='h-2 w-5/6 rounded-full bg-gray-100' />
                </div>

                <div className='mt-5 flex gap-2'>
                  <span className='h-5 w-12 rounded-full bg-[#3d348b]/10' />
                  <span className='h-5 w-8 rounded-full bg-emerald-50' />
                </div>
              </div>
            </div>

            <div className='max-w-xl lg:pb-4'>
              <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm'>
                <span className='h-1.5 w-1.5 rounded-full bg-[#f18701]' />

                <span className='text-[9px] font-black uppercase tracking-[0.25em] text-gray-500'>
                  Lost in the archive
                </span>
              </div>

              <h2
                className='font-serif text-4xl font-bold
                  leading-[1.08] tracking-tight text-[#171717]
                  sm:text-5xl lg:text-[4rem]'
              >
                This page took
                <span className='italic font-normal text-gray-400'>
                  {' '}
                  a wrong turn.
                </span>
              </h2>

              <p className='mt-6 max-w-md font-serif text-lg leading-8 text-gray-500'>
                The page you were looking for may have moved, been removed, or
                perhaps it was never part of the journal in the first place.
              </p>

              <div className='mt-9 flex flex-col gap-3 sm:flex-row'>
                <Link
                  href='/'
                  className='group inline-flex items-center
                    justify-center gap-3 rounded-xl
                    bg-[#3d348b] px-6 py-3.5
                    text-[10px] font-black uppercase
                    tracking-[0.2em] text-white
                    shadow-[0_10px_30px_rgba(61,52,139,0.2)]
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#302a70]
                    hover:shadow-[0_15px_35px_rgba(61,52,139,0.25)]
                    active:scale-[0.98]'
                >
                  <FiArrowLeft className='h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1' />
                  Return Home
                </Link>

                <Link
                  href='/latest'
                  className='group inline-flex items-center
                    justify-center gap-3 rounded-xl
                    border border-gray-200 bg-white
                    px-6 py-3.5 text-[10px]
                    font-black uppercase tracking-[0.2em]
                    text-gray-700
                    shadow-sm transition-all duration-300
                    hover:-translate-y-0.5
                    hover:border-gray-300
                    hover:shadow-md'
                >
                  Browse Articles
                  <FiArrowUpRight
                    className='h-4 w-4 transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5'
                  />
                </Link>
              </div>

              <div className='mt-10 border-t border-gray-200 pt-6'>
                <p className='mb-3 text-[9px] font-black uppercase tracking-[0.25em] text-gray-400'>
                  You might want to visit
                </p>

                <div className='flex flex-wrap gap-2'>
                  <Link
                    href='/latest'
                    className='rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 transition hover:border-[#7678ed]/40 hover:text-[#3d348b]'
                  >
                    Articles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className='flex flex-col gap-3 border-t border-gray-200 py-5 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-[9px] font-black uppercase tracking-[0.25em] text-gray-300'>
            Education With Hamza · The Journal
          </p>

          <p className='text-[9px] font-black uppercase tracking-[0.2em] text-gray-300'>
            Nothing to see here · 404
          </p>
        </footer>
      </div>
    </main>
  )
}
