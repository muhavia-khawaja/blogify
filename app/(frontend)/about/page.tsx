import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  BookOpen,
  FileText,
  Sparkles,
  GraduationCap,
  ArrowRight,
  Users,
  Youtube,
  CheckCircle2,
  Download,
} from 'lucide-react'
import { buildMetadata, getAbsoluteUrl } from '@/utils/seo'
import JsonLd from '@/components/JsonLd'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'About Us',
    description:
      'Learn about Education With Hamza — empowering Pakistani students with free, high-quality board exam notes, PDFs, and pairing schemes from 8th Class to Intermediate.',
    path: '/about',
    type: 'website',
  })
}

export default function AboutPage() {
  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Education With Hamza',
    url: getAbsoluteUrl('/about'),
    description:
      'Empowering the future of Pakistan through free, world-class board exam study materials.',
    foundingDate: '2022',
    logo: getAbsoluteUrl('/images/logo.png'),
  }

  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <section className='bg-[#FCFBF9] min-h-screen antialiased text-[#1A1A1A] pt-32 pb-28 border-b border-slate-200 relative overflow-hidden'>
        <div className='max-w-6xl mx-auto px-6 lg:px-8 relative z-10'>
          <div className='grid gap-16 lg:grid-cols-12 lg:items-start'>
            <div className='lg:col-span-7 space-y-10'>
              <div>
                <div className='flex items-center gap-3 mb-6'>
                  <span className='h-px w-8 bg-emerald-600'></span>
                  <span className='text-[10px] font-mono uppercase tracking-[0.4em] text-emerald-700 font-bold'>
                    Official Platform
                  </span>
                </div>

                <h1 className='text-4xl md:text-6xl font-serif font-bold leading-[1.15] tracking-tight mb-8 text-slate-900'>
                  Empowering The Future of{' '}
                  <span className='italic font-normal text-emerald-600'>
                    Pakistan.
                  </span>
                </h1>

                <p className='text-lg font-serif italic text-slate-600 leading-relaxed max-w-xl'>
                  <strong className='text-slate-900 not-italic font-mono font-medium'>
                    Education With Hamza
                  </strong>{' '}
                  is a modern digital ecosystem built to bridge the gap between
                  expensive coaching centers and deserving students—providing
                  access to world-class study materials completely free.
                </p>
              </div>

              <div className='space-y-6 pt-2'>
                <div className='flex items-start gap-5 group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all duration-300'>
                  <div className='w-11 h-11 shrink-0 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300'>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className='text-sm font-mono font-bold uppercase tracking-wider text-slate-900 mb-1.5'>
                      Free & Comprehensive Notes
                    </h3>
                    <p className='text-sm text-slate-600 leading-relaxed font-serif'>
                      Syllabus-aligned handwritten and structured notes covering
                      every chapter in detail for 8th Class through 2nd Year
                      Intermediate.
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-5 group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all duration-300'>
                  <div className='w-11 h-11 shrink-0 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300'>
                    <Download size={20} />
                  </div>
                  <div>
                    <h3 className='text-sm font-mono font-bold uppercase tracking-wider text-slate-900 mb-1.5'>
                      Updated Pairing Schemes & PDFs
                    </h3>
                    <p className='text-sm text-slate-600 leading-relaxed font-serif'>
                      High-quality, printable PDF guides and latest paper
                      pairing schemes strictly aligned with Pakistani Board
                      examination patterns.
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-5 group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all duration-300'>
                  <div className='w-11 h-11 shrink-0 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300'>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className='text-sm font-mono font-bold uppercase tracking-wider text-slate-900 mb-1.5'>
                      Concept Clarity & Exam Focus
                    </h3>
                    <p className='text-sm text-slate-600 leading-relaxed font-serif'>
                      Simple, accessible explanations designed to break down
                      complex scientific and mathematical concepts for top board
                      performance.
                    </p>
                  </div>
                </div>
              </div>

              <div className='pt-6 flex flex-col sm:flex-row gap-4'>
                <Link
                  href='https://www.ewhamza.com/notes-pdf'
                  className='inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-widest text-white hover:bg-emerald-600 transition-all duration-300 shadow-md'
                >
                  Start Learning Now <ArrowRight size={16} />
                </Link>
                <Link
                  href='/contact'
                  className='inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-widest text-slate-800 hover:bg-slate-50 transition-all shadow-sm'
                >
                  Contact Support
                </Link>
              </div>
            </div>

            <div className='lg:col-span-5 lg:sticky lg:top-32'>
              <div className='rounded-3xl p-1 bg-white border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden'>
                <div className='bg-slate-50/50 rounded-[22px] p-8 space-y-8 relative overflow-hidden'>
                  <div className='flex items-center justify-between border-b border-slate-200 pb-5'>
                    <div className='flex items-center gap-2 text-xs font-mono text-slate-500'>
                      <GraduationCap size={16} className='text-emerald-600' />
                      <span>Educational Impact</span>
                    </div>
                    <span className='inline-flex items-center gap-1.5 text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold'>
                      <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
                      Founded 2022
                    </span>
                  </div>

                  <div>
                    <h2 className='text-2xl font-serif font-bold text-slate-900 mb-2'>
                      At A Glance
                    </h2>
                    <p className='text-xs font-serif italic text-slate-600 leading-relaxed'>
                      Our metrics reflect our dedication to ensuring geography
                      or financial status never hinders student success.
                    </p>
                  </div>

                  <div className='grid grid-cols-2 gap-3 font-mono text-xs'>
                    <div className='p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm'>
                      <div className='flex items-center gap-2 text-emerald-600 mb-1'>
                        <Users size={16} />
                        <span className='text-[10px] text-slate-500 font-sans uppercase font-semibold'>
                          Students
                        </span>
                      </div>
                      <p className='text-xl font-bold text-slate-900'>50K+</p>
                      <p className='text-[10px] text-slate-500 font-sans'>
                        WhatsApp Groups
                      </p>
                    </div>

                    <div className='p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm'>
                      <div className='flex items-center gap-2 text-emerald-600 mb-1'>
                        <Youtube size={16} />
                        <span className='text-[10px] text-slate-500 font-sans uppercase font-semibold'>
                          Community
                        </span>
                      </div>
                      <p className='text-xl font-bold text-slate-900'>20K+</p>
                      <p className='text-[10px] text-slate-500 font-sans'>
                        Subscribers
                      </p>
                    </div>

                    <div className='p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm'>
                      <div className='flex items-center gap-2 text-emerald-600 mb-1'>
                        <FileText size={16} />
                        <span className='text-[10px] text-slate-500 font-sans uppercase font-semibold'>
                          Library
                        </span>
                      </div>
                      <p className='text-xl font-bold text-slate-900'>500+</p>
                      <p className='text-[10px] text-slate-500 font-sans'>
                        PDFs & Guides
                      </p>
                    </div>

                    <div className='p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm'>
                      <div className='flex items-center gap-2 text-emerald-600 mb-1'>
                        <CheckCircle2 size={16} />
                        <span className='text-[10px] text-slate-500 font-sans uppercase font-semibold'>
                          Syllabus
                        </span>
                      </div>
                      <p className='text-xl font-bold text-slate-900'>100%</p>
                      <p className='text-[10px] text-slate-500 font-sans'>
                        Board Aligned
                      </p>
                    </div>
                  </div>

                  <div className='pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500'>
                    <span>10K+ Monthly Active Users</span>
                    <span className='text-emerald-700 font-semibold'>
                      Free Access
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
