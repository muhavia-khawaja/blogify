import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className='min-h-screen bg-[#FCFBF9] antialiased text-[#1A1A1A] flex'>
      <div className='hidden lg:flex lg:w-1/2 bg-[#0F0F0F] flex-col justify-between p-14 relative overflow-hidden'>
        <div
          className='absolute inset-0 opacity-[0.04]'
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className='absolute -bottom-10 -right-8 text-[18rem] font-serif font-bold leading-none text-white/[0.04] select-none pointer-events-none'>
          404
        </div>

        <span className='text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 relative z-10'>
          The Journal
        </span>

        <div className='space-y-8 relative z-10'>
          <div className='h-px w-12 bg-emerald-500' />
          <p className='font-serif text-3xl font-bold text-white leading-snug max-w-xs'>
            Some pages exist only in the imagination.
          </p>
          <p className='text-[11px] font-black uppercase tracking-[0.3em] text-white/30'>
            Page Not Found
          </p>
        </div>

        <div />
      </div>

      <div className='flex-1 flex flex-col items-center justify-center px-6 relative'>
        <div className='flex items-center gap-3 mb-10'>
          <span className='h-px w-8 bg-emerald-400' />
          <span className='text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600'>
            Error · 404
          </span>
          <span className='h-px w-8 bg-emerald-400' />
        </div>

        <p className='lg:hidden text-[8rem] font-serif font-bold leading-none text-gray-100 select-none mb-2'>
          404
        </p>

        <h1 className='text-4xl md:text-5xl font-serif font-bold tracking-tight text-center mb-5 max-w-sm'>
          Page lost in the{' '}
          <span className='italic font-normal text-gray-400'>archive.</span>
        </h1>

        <p className='font-serif italic text-gray-400 text-lg text-center max-w-xs mb-12 leading-relaxed'>
          The page you are looking for has been moved, removed, or never existed
          in the first place.
        </p>

        <div className='flex flex-col sm:flex-row items-center gap-4'>
          <Link
            href='/'
            className='group relative flex items-center gap-3 rounded-2xl bg-[#0F0F0F] px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white overflow-hidden transition-all active:scale-[0.98]'
          >
            <span className='relative z-10'>Return to Archive</span>
            <div className='absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500' />
          </Link>

          <Link
            href='/blog'
            className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors py-5 px-6 border border-gray-100 rounded-2xl hover:border-gray-300'
          >
            Browse Articles
          </Link>
        </div>

        <p className='absolute bottom-8 text-[9px] font-black uppercase tracking-[0.3em] text-gray-200'>
          Journal System · Page not found
        </p>
      </div>
    </div>
  )
}
