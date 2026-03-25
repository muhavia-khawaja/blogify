import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us ',
  description:
    'Blogify provides free, high-quality educational resources for Pakistani students from 9th to 2nd year.',
}

export default function AboutPage() {
  return (
    <section className='bg-gradient-to-b from-white to-gray-50 min-h-screen py-20'>
      <div className='max-w-6xl mx-auto px-6 lg:px-8'>
        <div className='grid gap-16 lg:grid-cols-2 lg:items-center'>
          <div>
            <p className='text-sm font-black uppercase tracking-widest text-blue-600 mb-4'>
              About Blogify
            </p>
            <h1 className='text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6'>
              A modern space for thoughtful stories and practical insights.
            </h1>
            <p className='text-lg text-gray-600 leading-relaxed mb-8'>
              Blogify is built for curious developers, designers, and creators
              who want to stay ahead of the curve. We publish hand‑crafted
              articles on topics like web development, UX, tooling, and
              productivity.
            </p>
            <div className='space-y-4'>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black'>
                  1
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>
                    Curated content
                  </h3>
                  <p className='text-sm text-gray-600 leading-relaxed'>
                    Every article is reviewed and edited for clarity, relevance,
                    and actionable takeaways.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black'>
                  2
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>
                    Community first
                  </h3>
                  <p className='text-sm text-gray-600 leading-relaxed'>
                    Reader feedback shapes what we publish — share your insights
                    and help others learn.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black'>
                  3
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>
                    Always growing
                  </h3>
                  <p className='text-sm text-gray-600 leading-relaxed'>
                    We update existing guides and add fresh content every week
                    to keep you in the know.
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-12 flex flex-col sm:flex-row gap-4'>
              <Link
                href='/blog'
                className='inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-sm font-black text-white shadow-lg hover:bg-blue-700 transition-all'
              >
                Explore Articles
              </Link>
              <Link
                href='/subscribe'
                className='inline-flex items-center justify-center rounded-full border border-blue-600 px-8 py-3 text-sm font-black text-blue-600 hover:bg-blue-50 transition-all'
              >
                Subscribe
              </Link>
            </div>
          </div>

          <div className='relative rounded-[2.5rem] overflow-hidden shadow-2xl'>
            <div className='h-96 bg-gradient-to-br from-blue-600 to-purple-600'></div>
            <div className='absolute inset-0 flex items-center justify-center p-10'>
              <div className='bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md text-center'>
                <h2 className='text-2xl font-black text-white mb-4'>
                  Start building your idea today
                </h2>
                <p className='text-sm text-white/80'>
                  Join thousands of readers who build, ship, and grow on
                  Blogify.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
