import HomeSidebar from '@/components/HomeSidebar'
import React from 'react'
import type { Metadata } from 'next'
import ActionToast from '@/components/ActionToast'
import AdBanner from '@/components/AdBanner'

export const metadata: Metadata = {
  title: 'Education With Hamza',
  description:
    'Thoughtful articles, practical insights, and stories for curious learners.',
  robots: { index: true, follow: true },
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen bg-[#f8f9fc]'>
      <HomeSidebar />
      <ActionToast />

      <main className='min-h-screen lg:ml-[250px]'>
        <AdBanner
          adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT}
          className='mx-auto max-w-5xl px-5 pt-4 sm:px-8 lg:px-10'
        />
        {children}
      </main>
    </div>
  )
}
