import Footer from '@/components/Footer'
import Header from '@/components/ImageUpload'
import Navbar from '@/components/Navbar'

import React, { Suspense } from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '600', '700'],
})

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.variable} font-sans bg-white min-h-screen`}>
      <Suspense fallback={<p className='loading-spinner'></p>}>
        <Navbar />
      </Suspense>
      <main>{children}</main>
      <Footer />
    </div>
  )
}
