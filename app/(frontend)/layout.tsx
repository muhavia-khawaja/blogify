import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

import React, { Suspense } from 'react'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={'bg-white min-h-screen'}>
      <Suspense fallback={<p className='loading-spinner'></p>}>
        <Navbar />
      </Suspense>
      <main>{children}</main>
      <Footer />
    </div>
  )
}
